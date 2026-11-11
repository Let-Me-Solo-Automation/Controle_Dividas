import { initializeApp, type FirebaseOptions } from "firebase/app";
import {
  getAuth,
  connectAuthEmulator,
  browserLocalPersistence,
  setPersistence,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  type Auth,
} from "firebase/auth";
import {
  getFirestore,
  connectFirestoreEmulator,
  doc,
  setDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
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
export async function ownerStatus() {
  const { auth } = await connectFirebase();
  return auth.currentUser?.email ?? null;
}
export async function login(email: string, password: string, register = false) {
  const { auth } = await connectFirebase();
  const result = await (register
    ? createUserWithEmailAndPassword(auth, email, password)
    : signInWithEmailAndPassword(auth, email, password));
  return result.user.email;
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
  if (!auth.currentUser)
    throw Error("Entre na sua conta de compartilhamento antes de publicar.");
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
  await setDoc(doc(db, "shares", token), {
    ownerUid: auth.currentUser.uid,
    section: projectSection(data, id),
    updatedAt: serverTimestamp(),
    expiresAt: Timestamp.fromMillis(Date.now() + 30 * 86400000),
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
  };
}
export async function revokeShare(grant: FirebaseGrant) {
  const { db, auth } = await connectFirebase();
  if (!auth.currentUser)
    throw Error("Entre na conta que publicou a seção para revogar o acesso.");
  await deleteDoc(doc(db, "shares", grant.id));
}
export async function watchShare(
  token: string,
  onData: (section: SharedSection, expiresAt: number) => void,
  onError: (e: Error) => void,
) {
  if (!/^[a-f0-9]{48}$/.test(token))
    throw Error("Link de acompanhamento inválido.");
  const { db } = await connectFirebase();
  return onSnapshot(
    doc(db, "shares", token),
    (snapshot) => {
      if (!snapshot.exists()) {
        onError(Error("Este link foi revogado ou não existe."));
        return;
      }
      const value = snapshot.data();
      const expires = value.expiresAt?.toMillis?.() ?? 0;
      if (expires <= Date.now()) {
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
  if (code === "auth/email-already-in-use")
    return "Este e-mail já tem uma conta. Use Entrar.";
  if (code === "auth/weak-password")
    return "Use uma senha com pelo menos 8 caracteres.";
  if (code === "auth/invalid-email") return "Informe um e-mail válido.";
  if (code === "permission-denied")
    return "Acesso recusado. Entre na conta que publicou esta seção.";
  if (code === "resource-exhausted")
    return "O limite gratuito foi atingido. Tente novamente quando a cota for renovada.";
  if (code === "auth/operation-not-allowed")
    return "O proprietário ainda precisa ativar o acesso por e-mail no Firebase.";
  return error instanceof Error
    ? error.message
    : "Não foi possível concluir a operação.";
}
