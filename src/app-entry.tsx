import { createRoot } from "react-dom/client";
// Route only the legacy app's key through the simulator. Firebase Auth keeps
// its own browser storage so the publishing account survives a reload.
if (window.parent !== window && (window.parent as any).NexoSim) {
  (window as any).NexoDeployment = (window.parent as any).NexoDeployment;
  const bridge = (window.parent as any).NexoSim;
  let browserStorage: Storage | undefined;
  try {
    browserStorage = window.localStorage;
  } catch {}
  Object.defineProperty(window, "localStorage", {
    configurable: true,
    value: {
      getItem: (key: string) =>
        key === "nexo-v1"
          ? bridge.getItem(key)
          : (browserStorage?.getItem(key) ?? null),
      setItem: (key: string, value: string) => {
        if (key === "nexo-v1") bridge.setItem(key, value);
        else if (browserStorage) browserStorage.setItem(key, value);
        else throw Error("O navegador bloqueou o armazenamento do acesso.");
      },
      removeItem: (key: string) =>
        key === "nexo-v1"
          ? bridge.removeItem(key)
          : browserStorage?.removeItem(key),
      clear: () => bridge.removeItem("nexo-v1"),
    },
  });
}
import("./legacy/NexoApp").then(({ default: App }) =>
  createRoot(document.getElementById("root")!).render(<App />),
);
