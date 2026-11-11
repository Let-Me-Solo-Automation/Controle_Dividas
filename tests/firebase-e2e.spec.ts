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
  const f = page.frameLocator('iframe[title="Marks — aplicativo interativo"]');
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
    .getByRole("button", { name: "Criar link sem vencimento", exact: true })
    .click();
  const input = f.getByLabel("Link de acompanhamento");
  await expect(input).toHaveValue(/compartilhar.html#s=[a-f0-9]{48}$/);
  const link = await input.inputValue();
  await expect(
    f.getByText("Ativo · sem vencimento", { exact: true }),
  ).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await f.getByRole("button", { name: "Visualizar link", exact: true }).click();
  const preview = f.frameLocator(
    'iframe[title="Prévia do link compartilhado"]',
  );
  await expect(
    preview.getByRole("heading", { name: "Venda do videogame", exact: true }),
  ).toBeVisible();
  expect(
    await f
      .locator("html")
      .evaluate((el) => el.scrollWidth > el.clientWidth + 1),
  ).toBe(false);
  await f.getByRole("button", { name: "Ocultar prévia", exact: true }).click();
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.reload();
  await f.getByRole("button", { name: "Expandir navegação" }).click();
  await f
    .getByRole("navigation")
    .getByRole("button", { name: "Seções", exact: true })
    .click();
  await f.getByText("Venda do videogame", { exact: true }).click();
  await f
    .getByRole("button", { name: "Compartilhar seção", exact: true })
    .click();
  await expect(
    f.getByRole("button", { name: "Atualizar publicação", exact: true }),
  ).toBeVisible();
  const recipient = await browser.newContext();
  await configure(recipient);
  const viewer = await recipient.newPage();
  await viewer.goto(link);
  await expect(
    viewer.getByRole("heading", { name: "Venda do videogame", exact: true }),
  ).toBeVisible();
  await expect(viewer.locator(".viewer-summary")).toContainText("920,00");
  await expect(viewer.locator("body")).not.toContainText("Bradesco");
  await recipient.setOffline(true);
  await expect(viewer.locator(".viewer-summary")).toHaveCount(0);
  await expect(viewer.getByRole("status")).toContainText(
    "Conecte-se à internet",
  );
  await recipient.setOffline(false);
  await expect(viewer.locator(".viewer-summary")).toContainText("920,00");
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
  await expect(f.getByLabel("Link de acompanhamento")).toHaveCount(0);
  await expect(
    f.locator('iframe[title="Prévia do link compartilhado"]'),
  ).toHaveCount(0);
  await f
    .getByRole("button", { name: "Criar link sem vencimento", exact: true })
    .click();
  await expect(f.getByLabel("Link de acompanhamento")).toHaveValue(
    /compartilhar.html#s=[a-f0-9]{48}$/,
  );
  const newLink = await f.getByLabel("Link de acompanhamento").inputValue();
  expect(newLink).not.toBe(link);
  await viewer
    .getByRole("button", { name: "Tentar novamente", exact: true })
    .click();
  await expect(
    viewer.getByRole("heading", { name: "Acompanhamento indisponível" }),
  ).toBeVisible();
  const nextViewer = await recipient.newPage();
  await nextViewer.goto(newLink);
  await expect(nextViewer.locator(".viewer-summary")).toContainText("870,00");
  await expect(nextViewer.locator(".viewer-note")).toContainText(
    "até o proprietário revogar",
  );
  await f.getByRole("button", { name: "Revogar acesso", exact: true }).click();
  await expect(
    nextViewer.getByRole("heading", { name: "Acompanhamento indisponível" }),
  ).toBeVisible();
  await recipient.close();
});
