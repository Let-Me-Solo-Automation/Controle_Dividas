import { readdir, readFile, writeFile, mkdir, access } from "node:fs/promises";
import path from "node:path";
import { zipSync } from "fflate";
const roots = [
  "src",
  "android",
  "docs",
  "scripts",
  "tests",
  "firebase",
  "public",
  "original",
  ".github",
];
const files = [
  "package.json",
  "package-lock.json",
  "tsconfig.json",
  "vite.config.ts",
  "playwright.config.ts",
  "playwright.firebase.config.ts",
  "firebase.json",
  ".gitignore",
  "Marks-Simulador.html",
  "Nexo-Simulador_1.html",
  "Iniciar.command",
  "Instalar-na-Mesa.command",
  "Configurar-Firebase.command",
  "README.md",
  "PROJETO-MARKS.md",
  "Visualizador.html",
  "FIREBASE-GRATUITO.md",
  "TUTORIAL-FIREBASE.md",
  "CONFIGURAR-ONLINE.md",
  "GOOGLE-DRIVE.md",
  "VALIDACAO.md",
  "APPLE-LIQUID-GLASS.md",
  "COMPONENTES-EM-USO.md",
  "UI-UX.md",
];
export async function createProjectArchive(root = process.cwd()) {
  const contents = {};
  async function add(rel) {
    const bytes = new Uint8Array(await readFile(path.join(root, rel)));
    contents["Marks/" + rel] = [
      bytes,
      {
        level: 6,
        os: 3,
        attrs:
          ((rel.endsWith(".command") || rel.endsWith(".sh")
            ? 0o100755
            : 0o100644) <<
            16) >>>
          0,
      },
    ];
  }
  async function walk(rel) {
    for (const item of await readdir(path.join(root, rel), {
      withFileTypes: true,
    })) {
      if (
        ["generated", "node_modules", ".git", ".runtime", "build", ".gradle", ".signing"].includes(item.name) ||
        item.name.endsWith(".log") || /\.(jks|keystore)$/.test(item.name)
      )
        continue;
      const name = rel + "/" + item.name;
      if (item.isDirectory()) await walk(name);
      else if (item.isFile()) await add(name);
    }
  }
  for (const rel of roots) await walk(rel);
  for (const rel of files) await add(rel);
  try {await access(path.join(root,"Marks-Android.apk"));await add("Marks-Android.apk");}catch(error){if(error.code!=="ENOENT")throw error;}
  for (const rel of [
    "dist/Marks-Simulador.html",
    "dist/Marks-Metas-Demo.html",
    "dist/Marks-Teste-Visual.html",
    "dist/Marks-Vazio-Demo.html",
    "dist/compartilhar.html",
    "dist/tutorial-firebase.html",
    "dist/firebase-config.json",
    "dist/marks-icon.png",
  ])
    await add(rel);
  await mkdir(path.join(root, "dist/downloads"), { recursive: true });
  const output = path.join(root, "dist/downloads/Marks-projeto.zip");
  await writeFile(output, zipSync(contents));
  console.log("Download público: downloads/Marks-projeto.zip");
  return output;
}
