import { createProjectArchive } from "./package.mjs";
import { build } from "esbuild";
import { readFile, writeFile, mkdir, copyFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
await mkdir("src/generated", { recursive: true });
await mkdir("dist", { recursive: true });
execFileSync(
  process.execPath,
  [
    "node_modules/@tailwindcss/cli/dist/index.mjs",
    "-i",
    "src/styles.css",
    "-o",
    "src/generated/tailwind.css",
    "--minify",
  ],
  { stdio: "inherit" },
);
execFileSync(
  process.execPath,
  [
    "node_modules/@tailwindcss/cli/dist/index.mjs",
    "-i",
    "src/simulator.css",
    "-o",
    "src/generated/simulator.css",
    "--minify",
  ],
  { stdio: "inherit" },
);
const app = await build({
  entryPoints: ["src/app-entry.tsx"],
  bundle: true,
  write: false,
  format: "iife",
  target: ["safari16", "chrome110"],
  jsx: "automatic",
  minify: true,
  define: { "process.env.NODE_ENV": '"production"' },
  legalComments: "eof",
  loader: { ".png": "dataurl" },
});
const [base, fonts, css] = await Promise.all(
  [
    "src/legacy/base.css",
    "src/legacy/fonts.css",
    "src/generated/tailwind.css",
  ].map((p) => readFile(p, "utf8")),
);
const escapeScript = (s) => s.replace(/<\/script/gi, "<\\/script");
const appHTML = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#f4f5f2"><title>Marks — prévia</title><style>${fonts}\n@layer theme,base,legacy,components,utilities;\n@layer legacy{${base}}\n${css}</style></head><body><div id="root"></div><script>${escapeScript(app.outputFiles[0].text)}</script></body></html>`;
await writeFile("src/generated/app.html", appHTML);
if (!process.argv.includes("--app-only")) {
  const outer = await build({
    entryPoints: ["src/simulator-entry.tsx"],
    bundle: true,
    write: false,
    outdir: "dist",
    format: "iife",
    target: ["safari16", "chrome110"],
    jsx: "automatic",
    minify: true,
    loader: { ".html": "text", ".png": "dataurl" },
    plugins: [
      {
        name: "raw-html",
        setup(b) {
          b.onResolve({ filter: /\?raw$/ }, (args) => ({
            path: new URL(
              args.path.replace("?raw", ""),
              `file://${args.resolveDir}/`,
            ).pathname,
            namespace: "raw",
          }));
          b.onLoad({ filter: /.*/, namespace: "raw" }, async (args) => ({
            contents: await readFile(args.path, "utf8"),
            loader: "text",
          }));
        },
      },
    ],
    define: { "process.env.NODE_ENV": '"production"' },
    legalComments: "eof",
  });
  const js = outer.outputFiles.find((f) => f.path.endsWith(".js")).text;
  const outerCSS = outer.outputFiles.find((f) => f.path.endsWith(".css")).text;
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#f8f9f6"><title>Marks — Design Studio</title><style>${fonts}\n${outerCSS}</style></head><body><div id="simulator-root"></div><script>${escapeScript(js)}</script></body></html>`;
  await writeFile("dist/Nexo-Simulador_1.html", html);
  console.log(
    "Standalone offline: dist/Nexo-Simulador_1.html (" +
      (html.length / 1024 / 1024).toFixed(2) +
      " MB)",
  );
}

// GitHub Pages serves the simulator and read-only links from a static artifact.
if (!process.argv.includes("--app-only")) {
  const viewer = await build({
    entryPoints: ["src/sharing/viewer.tsx"],
    bundle: true,
    write: false,
    outdir: "dist",
    format: "iife",
    target: ["safari16", "chrome110"],
    jsx: "automatic",
    minify: true,
    define: { "process.env.NODE_ENV": '"production"' },
    legalComments: "eof",
    loader: { ".png": "dataurl" },
  });
  const viewerJS = viewer.outputFiles.find((f) => f.path.endsWith(".js")).text;
  const viewerCSS = viewer.outputFiles.find((f) =>
    f.path.endsWith(".css"),
  ).text;
  await writeFile(
    "dist/compartilhar.html",
    `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="referrer" content="no-referrer"><meta name="robots" content="noindex,nofollow"><title>Marks — acompanhamento</title><style>${fonts}\n${viewerCSS}</style></head><body><div id="viewer-root"></div><script>${escapeScript(viewerJS)}</script></body></html>`,
  );
  await copyFile("dist/Nexo-Simulador_1.html", "dist/index.html");
  await copyFile("dist/Nexo-Simulador_1.html", "dist/Marks-Simulador.html");
  await copyFile("src/assets/marks-icon.png", "dist/marks-icon.png");
  await copyFile("public/firebase-config.json", "dist/firebase-config.json");
  await writeFile("dist/.nojekyll", "");
  const tutorialTemplate = await readFile(
    "public/tutorial-firebase.html",
    "utf8",
  );
  const rules = await readFile("firebase/firestore.rules", "utf8");
  const escapedRules = rules
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  await writeFile(
    "dist/tutorial-firebase.html",
    tutorialTemplate.replace("__FIRESTORE_RULES__", escapedRules),
  );
  await createProjectArchive();
}
