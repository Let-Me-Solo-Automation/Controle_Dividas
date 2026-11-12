import { initializeApp, type FirebaseOptions } from "firebase/app";
import {
  getAuth,
  connectAuthEmulator,
  browserLocalPersistence,
  setPersistence,
  signInAnonymously,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  type Auth,
  type User,
} from "firebase/auth";
import {
  getFirestore,
  connectFirestoreEmulator,
  doc,
  setDoc,
  updateDoc,
  deleteField,
  serverTimestamp,
  onSnapshot,
  type Firestore,
} from "firebase/firestore";
import {
  projectSection,
  type SourceData,
  type FirebaseGrant,
  type SharedSection,
} from "./model";

type PublicConfig = FirebaseOptions & {
  configured?: boolean;
  emulators?: boolean;
};
let client: Promise<{ auth: Auth; db: Firestore; base: URL }> | undefined;
function baseUrl() {
  const deployment = (window as any).NexoDeployment;
  const base = new URL(deployment?.baseUrl ?? window.location.href);
  if (!["https:", "http:"].includes(base.protocol))
    throw Error(
      "Para compartilhar, abra a versão online do Marks. Seus registros locais continuam disponíveis offline.",
    );
  return new URL("./", base);
}
export function connectFirebase() {
  return (client ??= (async () => {
    const base = baseUrl();
    const response = await fetch(new URL("firebase-config.json", base), {
      cache: "no-store",
    });
    if (!response.ok)
      throw Error("A configuração do Firebase ainda não foi publicada.");
    const config = (await response.json()) as PublicConfig;
    if (
      config.configured === false ||
      !config.projectId ||
      !config.apiKey ||
      !config.appId
    )
      throw Error(
        "O Firebase ainda precisa ser ativado pelo proprietário do projeto.",
      );
    const app = initializeApp(config, "nexo-sharing");
    const auth = getAuth(app);
    const db = getFirestore(app);
    if (config.emulators) {
      if (
        !["127.0.0.1", "localhost"].includes(base.hostname) ||
        !String(config.projectId).startsWith("demo-")
      )
        throw Error("Configuração de teste recusada fora do ambiente local.");
      connectAuthEmulator(auth, "http://127.0.0.1:9099", {
        disableWarnings: true,
      });
      connectFirestoreEmulator(db, "127.0.0.1", 8080);
    }
    await setPersistence(auth, browserLocalPersistence);
    await auth.authStateReady();
    return { auth, db, base };
  })().catch((e) => {
    client = undefined;
    throw e;
  }));
}
export type OwnerIdentity = Pick<User, "uid" | "email" | "isAnonymous">;
export const anonymousSetupUrl =
  "https://console.firebase.google.com/project/marks-79823/authentication/providers";
export async function observeOwnerStatus(
  onChange: (owner: OwnerIdentity | null) => void,
) {
  const { auth } = await connectFirebase();
  // Observing a viewer or opening the sharing dialog never creates an account.
  return onAuthStateChanged(auth, onChange);
}
let ownerSignIn: Promise<User> | undefined;
async function ensureOwner(auth: Auth): Promise<User> {
  if (auth.currentUser) return auth.currentUser;
  // Concurrent publications must all use the same persisted owner identity.
  return (ownerSignIn ??= signInAnonymously(auth)
    .then(({ user }) => user)
    .catch((error) => {
      throw Error(userError(error));
    })
    .finally(() => {
      ownerSignIn = undefined;
    }));
}
export async function login(email: string, password: string) {
  const { auth } = await connectFirebase();
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}
export async function logout() {
  const { auth } = await connectFirebase();
  await signOut(auth);
}
export async function resetPassword(email: string) {
  const { auth } = await connectFirebase();
  await sendPasswordResetEmail(auth, email);
}
export async function publishSection(
  data: SourceData,
  id: string,
): Promise<FirebaseGrant> {
  const { auth, db, base } = await connectFirebase();
  const previous = data.sharing.grants[id];
  if (previous && previous.provider !== "firebase")
    throw Error(
      "Revogue o link antigo antes de publicar esta seção no Firebase.",
    );
  const token =
    previous?.id ??
    Array.from(crypto.getRandomValues(new Uint8Array(24)), (b) =>
      b.toString(16).padStart(2, "0"),
    ).join("");
  if (!/^[a-f0-9]{48}$/.test(token))
    throw Error("Identificador de compartilhamento inválido.");
  const owner = await ensureOwner(auth);
  await setDoc(doc(db, "shares", token), {
    ownerUid: owner.uid,
    section: projectSection(data, id),
    updatedAt: serverTimestamp(),
    expiresAt: null,
    revoked: false,
  }).catch((error) => {
    throw Error(userError(error));
  });
  const url = new URL("compartilhar.html", base);
  url.hash = "s=" + token;
  return {
    provider: "firebase",
    id: token,
    url: url.href,
    readKey: "",
    writeKey: "",
    syncedAt: new Date().toISOString(),
    error: "",
    persistent: true,
  };
}
export async function revokeShare(grant: FirebaseGrant) {
  const { db, auth } = await connectFirebase();
  await ensureOwner(auth);
  // Keep a small tombstone so a stale tab or restored backup cannot recreate
  // this URL. The rules permanently block republishing a revoked token.
  await updateDoc(doc(db, "shares", grant.id), {
    revoked: true,
    section: deleteField(),
    expiresAt: null,
    updatedAt: serverTimestamp(),
  }).catch((error) => {
    throw Error(userError(error));
  });
}
export async function watchShare(
  token: string,
  onData: (section: SharedSection, expiresAt: number | null) => void,
  onError: (e: Error) => void,
) {
  if (!/^[a-f0-9]{48}$/.test(token))
    throw Error("Link de acompanhamento inválido.");
  const { db } = await connectFirebase();
  return onSnapshot(
    doc(db, "shares", token),
    { includeMetadataChanges: true },
    (snapshot) => {
      if (snapshot.metadata.fromCache) {
        onError(
          Error("Conecte-se à internet para confirmar o acesso a este link."),
        );
        return;
      }
      if (!snapshot.exists()) {
        onError(Error("Este link foi revogado ou não existe."));
        return;
      }
      const value = snapshot.data();
      if (value.revoked === true || !value.section) {
        onError(
          Error(
            "Este link foi revogado. Solicite um novo link ao proprietário.",
          ),
        );
        return;
      }
      // Old links keep their deadline until the owner updates the publication.
      // New and updated links explicitly store null to mean no expiry.
      const expires =
        value.expiresAt === null ? null : (value.expiresAt?.toMillis?.() ?? 0);
      if (expires !== null && expires <= Date.now()) {
        onError(
          Error("Este link expirou. Solicite um novo link ao proprietário."),
        );
        return;
      }
      onData(value.section, expires);
    },
    () => onError(Error("O link está indisponível, expirou ou foi revogado.")),
  );
}
export function userError(error: unknown) {
  const code = (error as any)?.code;
  if (
    [
      "auth/invalid-credential",
      "auth/wrong-password",
      "auth/user-not-found",
    ].includes(code)
  )
    return "E-mail ou senha incorretos.";
  if (code === "auth/invalid-email") return "Informe um e-mail válido.";
  if (code === "permission-denied")
    return "Acesso recusado. Use o navegador que publicou este link ou entre na conta anterior. Limpar os dados do navegador pode remover o acesso para revogar.";
  if (code === "resource-exhausted")
    return "O limite gratuito foi atingido. Tente novamente quando a cota for renovada.";
  if (
    code === "auth/configuration-not-found" ||
    code === "auth/operation-not-allowed" ||
    code === "auth/admin-restricted-operation"
  )
    return `O administrador precisa ativar Authentication → Método de login → Anônimo → Ativar → Salvar no projeto marks-79823: ${anonymousSetupUrl}. Depois, tente criar o link novamente.`;
  return error instanceof Error
    ? error.message
    : "Não foi possível concluir a operação.";
}
