import icon from "./assets/marks-icon.png";
export const brandImage = icon;
export const projectDownloadUrl =
  "https://let-me-solo-automation.github.io/Controle_Dividas/downloads/Marks-projeto.zip";
export const htmlDownloadUrl =
  "https://let-me-solo-automation.github.io/Controle_Dividas/Marks-Simulador.html";
export function installBrandIcon() {
  let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.append(link);
  }
  link.type = "image/png";
  link.href = icon;
  let touch = document.querySelector<HTMLLinkElement>(
    'link[rel="apple-touch-icon"]',
  );
  if (!touch) {
    touch = document.createElement("link");
    touch.rel = "apple-touch-icon";
    document.head.append(touch);
  }
  touch.href = icon;
}
