import { createRoot } from "react-dom/client";
// The simulator owns persistence. On-device builds can use native storage instead.
if (window.parent !== window && (window.parent as any).NexoSim) {
  (window as any).NexoDeployment = (window.parent as any).NexoDeployment;
  const bridge = (window.parent as any).NexoSim;
  Object.defineProperty(window, "localStorage", {
    configurable: true,
    value: {
      getItem: bridge.getItem,
      setItem: bridge.setItem,
      removeItem: bridge.removeItem,
      clear: () => bridge.removeItem("nexo-v1"),
    },
  });
}
// Install the storage bridge before importing the core (it reads saved data at startup).
import("./legacy/NexoApp").then(({ default: App }) =>
  createRoot(document.getElementById("root")!).render(<App />),
);
