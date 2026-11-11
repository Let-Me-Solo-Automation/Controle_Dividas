// Runs on the owner's Mac. OAuth credentials stay in the official Firebase CLI store.
import { execFileSync } from "node:child_process";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import { randomBytes } from "node:crypto";
import { fileURLToPath } from "node:url";
import path from "node:path";
const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.chdir(root);
const cli = path.join(root, "node_modules/firebase-tools/lib/bin/firebase.js");
function firebase(args, json = false) {
  const output = execFileSync(
    process.execPath,
    [cli, ...args, ...(json ? ["--json"] : [])],
    {
      cwd: root,
      encoding: "utf8",
      stdio: json ? ["inherit", "pipe", "inherit"] : "inherit",
    },
  );
  if (json) {
    const parsed = JSON.parse(output);
    if (parsed.status !== "success")
      throw Error(parsed.error || "A operação Firebase não foi concluída.");
    return parsed.result;
  }
}
console.log(
  "\nMarks · configurar Firebase no plano gratuito Spark\nNão vincularemos cartão, faturamento, Cloud Functions ou Storage.\n",
);
firebase(["login", "--reauth"]);
let state;
try {
  state = JSON.parse(await readFile(".nexo-setup.json", "utf8"));
} catch {
  state = { projectId: "marks-simulador-" + randomBytes(4).toString("hex") };
  await writeFile(".nexo-setup.json", JSON.stringify(state, null, 2));
}
const projectId = state.projectId;
if (!state.created) {
  firebase(
    [
      "projects:create",
      projectId,
      "--display-name",
      "Marks Simulador",
      "--non-interactive",
    ],
    true,
  );
  state.created = true;
  await writeFile(".nexo-setup.json", JSON.stringify(state, null, 2));
}
const { configstore } = require("firebase-tools/lib/configstore");
const auth = require("firebase-tools/lib/auth");
const refresh = configstore.get("tokens")?.refresh_token;
if (!refresh)
  throw Error(
    "A sessão Google não foi localizada. Execute o configurador novamente.",
  );
const credentials = await auth.getAccessToken(refresh, [
  "https://www.googleapis.com/auth/cloud-platform",
  "https://www.googleapis.com/auth/firebase",
]);
async function request(url, method = "GET", body) {
  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${credentials.access_token}`,
      "Content-Type": "application/json",
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok)
    throw Error(
      `${data.error?.message || "Falha na configuração"} (${response.status})`,
    );
  return data;
}
async function operation(url) {
  for (let i = 0; i < 90; i++) {
    const result = await request(url);
    if (result.error) throw Error(result.error.message);
    if (result.done) return result.response;
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }
  throw Error(
    "A operação ainda está sendo provisionada. Execute o configurador novamente em alguns minutos.",
  );
}
async function enable(service) {
  const result = await request(
    `https://serviceusage.googleapis.com/v1/projects/${projectId}/services/${service}:enable`,
    "POST",
    {},
  );
  if (result.name && !result.done)
    await operation(`https://serviceusage.googleapis.com/v1/${result.name}`);
}
for (const service of [
  "cloudbilling.googleapis.com",
  "firestore.googleapis.com",
  "identitytoolkit.googleapis.com",
])
  await enable(service);
const billing = await request(
  `https://cloudbilling.googleapis.com/v1/projects/${projectId}/billingInfo`,
);
if (billing.billingEnabled)
  throw Error(
    "Este projeto tem faturamento habilitado. O configurador gratuito não continuará. Nenhuma conta de faturamento foi criada ou vinculada por este script.",
  );
console.log("Plano sem faturamento confirmado.");
const databases = await request(
  `https://firestore.googleapis.com/v1/projects/${projectId}/databases`,
);
if (!(databases.databases ?? []).some((d) => d.name.endsWith("/(default)")))
  firebase([
    "firestore:databases:create",
    "(default)",
    "--project",
    projectId,
    "--location",
    "southamerica-east1",
    "--edition",
    "standard",
    "--point-in-time-recovery",
    "DISABLED",
    "--non-interactive",
  ]);
const firebaseBase = `https://firebase.googleapis.com/v1beta1/projects/${projectId}`;
const apps = await request(firebaseBase + "/webApps");
let app = apps.apps?.find((a) => ["Marks Web","Nexo Web"].includes(a.displayName));
if (!app) {
  const creation = await request(firebaseBase + "/webApps", "POST", {
    displayName: "Marks Web",
  });
  app = creation.done
    ? creation.response
    : await operation(
        "https://firebase.googleapis.com/v1beta1/" + creation.name,
      );
}
const config = await request(
  firebaseBase + "/webApps/" + app.appId + "/config",
);
const authUrl = `https://identitytoolkit.googleapis.com/admin/v2/projects/${projectId}/config`;
const current = await request(authUrl);
const domains = [
  ...new Set([
    ...(current.authorizedDomains ?? []),
    "localhost",
    "127.0.0.1",
    "let-me-solo-automation.github.io",
  ]),
];
await request(
  authUrl +
    "?updateMask=signIn.email.enabled,signIn.email.passwordRequired,authorizedDomains",
  "PATCH",
  {
    signIn: { email: { enabled: true, passwordRequired: true } },
    authorizedDomains: domains,
  },
);
firebase([
  "deploy",
  "--only",
  "firestore:rules",
  "--project",
  projectId,
  "--non-interactive",
]);
const publicConfig = {
  configured: true,
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  projectId: config.projectId,
  appId: config.appId,
  ...(config.messagingSenderId
    ? { messagingSenderId: config.messagingSenderId }
    : {}),
};
await writeFile(
  "public/firebase-config.json",
  JSON.stringify(publicConfig, null, 2) + "\n",
);
await mkdir("output", { recursive: true });
await writeFile(
  "output/firebase-config-publico.json",
  JSON.stringify(publicConfig, null, 2) + "\n",
);
state.complete = true;
await writeFile(".nexo-setup.json", JSON.stringify(state, null, 2));
execFileSync(process.execPath, ["scripts/build.mjs"], { stdio: "inherit" });
console.log(
  "\nFirebase configurado sem faturamento.\nEnvie apenas o conteúdo de output/firebase-config-publico.json nesta conversa para publicar a conexão no GitHub Pages.\nEsse arquivo contém a configuração pública do app; não contém senha nem credencial administrativa. Não envie arquivos de login do Firebase CLI.\n",
);
console.log(JSON.stringify(publicConfig, null, 2));
