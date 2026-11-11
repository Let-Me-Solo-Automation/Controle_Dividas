import { watch } from "node:fs";
import { spawn, execFileSync } from "node:child_process";
const compile = () =>
  execFileSync(process.execPath, ["scripts/build.mjs", "--app-only"], {
    stdio: "inherit",
  });
compile();
const vite = spawn(
  process.execPath,
  [
    "node_modules/vite/bin/vite.js",
    "--host",
    "127.0.0.1",
    "--open",
    "/Marks-Simulador.html",
  ],
  { stdio: "inherit" },
);
let timer;
const watcher = watch("src", { recursive: true }, (event, name) => {
  if (!name || name.startsWith("generated/")) return;
  clearTimeout(timer);
  timer = setTimeout(() => {
    try {
      compile();
    } catch {
      console.error("Corrija o erro e salve novamente.");
    }
  }, 250);
});
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () => {
    watcher.close();
    vite.kill(signal);
    process.exit(0);
  });
