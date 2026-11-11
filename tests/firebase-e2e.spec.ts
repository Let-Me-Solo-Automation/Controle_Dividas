import { test, expect, type BrowserContext } from "@playwright/test";
const config = {
  configured: true,
  emulators: true,
  projectId: "demo-nexo-simulador",
  apiKey: "fake-api-key",
  appId: "1:123:web:demo",
  authDomain: "demo-nexo-simulador.firebaseapp.com",
};
async function configure(context: BrowserContext) {
  await context.route("**/firebase-config.json", (r) =>
    r.fulfill({ json: config }),
  );
}
test("owner publishes one section, recipient sees payment updates, and revocation blocks access", async ({
  page,
  context,
  browser,
}) => {
  await configure(context);
  await page.goto("http://127.0.0.1:4180/");
  const f = page.frameLocator('iframe[title="Nexo — aplicativo interativo"]');
  await f.getByRole("button", { name: "Expandir navegação" }).click();
  await f
    .getByRole("navigation")
    .getByRole("button", { name: "Seções", exact: true })
    .click();
  await f.getByText("Venda do videogame", { exact: true }).click();
  await f
    .getByRole("button", { name: "Compartilhar seção", exact: true })
    .click();
  await f
    .getByRole("button", { name: "Criar meu acesso gratuito", exact: true })
    .click();
  await f
    .getByLabel("E-mail de compartilhamento")
    .fill(`owner-${Date.now()}@example.com`);
  await f.getByLabel("Senha de compartilhamento").fill("test-password-123");
  await f.getByRole("button", { name: "Criar acesso", exact: true }).click();
  await f
    .getByRole("button", { name: "Criar link por 30 dias", exact: true })
    .click();
  const input = f.getByLabel("Link de acompanhamento");
  await expect(input).toHaveValue(/compartilhar.html#s=[a-f0-9]{48}$/);
  const link = await input.inputValue();
  const recipient = await browser.newContext();
  await configure(recipient);
  const viewer = await recipient.newPage();
  await viewer.goto(link);
  await expect(
    viewer.getByRole("heading", { name: "Venda do videogame", exact: true }),
  ).toBeVisible();
  await expect(viewer.locator(".viewer-summary")).toContainText("920,00");
  await expect(viewer.locator("body")).not.toContainText("Bradesco");
  await f.getByRole("button", { name: "Fechar", exact: true }).click();
  await f
    .getByRole("button", { name: "Registrar pagamento", exact: true })
    .click();
  await f.getByLabel("Quanto foi pago (R$)").fill("50,00");
  await f
    .getByLabel("Conta bancária", { exact: true })
    .selectOption("bradesco");
  await f
    .getByRole("dialog")
    .getByRole("button", { name: "Registrar pagamento", exact: true })
    .click();
  await expect(viewer.locator(".viewer-summary")).toContainText("870,00");
  await f
    .getByRole("button", { name: "Compartilhar seção", exact: true })
    .click();
  await f.getByRole("button", { name: "Revogar acesso", exact: true }).click();
  await expect(
    viewer.getByRole("heading", { name: "Acompanhamento indisponível" }),
  ).toBeVisible();
  await expect(viewer.locator(".viewer-summary")).toHaveCount(0);
  await recipient.close();
});
