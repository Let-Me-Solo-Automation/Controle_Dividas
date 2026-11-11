import { test, expect, type Page } from "@playwright/test";
import { pathToFileURL } from "node:url";
const url = pathToFileURL(process.cwd() + "/dist/Marks-Simulador.html").href;
const app = (page: Page) =>
  page.frameLocator('iframe[title="Marks — aplicativo interativo"]');
async function open(page: Page) {
  await page.goto(url);
  await expect(app(page).locator(".hero-amount")).toContainText("9.411,70");
  await page.locator(".sim-phone").scrollIntoViewIfNeeded();
}
async function navigate(page: Page, name: string) {
  const f = app(page);
  await f
    .getByRole("button", { name: "Expandir navegação", exact: true })
    .click();
  await f
    .getByRole("navigation", { name: "Navegação principal", exact: true })
    .getByRole("button", { name, exact: true })
    .click();
  await expect(
    f.getByRole("navigation", { name: "Navegação principal", exact: true }),
  ).toHaveCount(0);
  await expect(f.locator(".screen-heading h1")).toHaveText(
    name === "Seções"
      ? "Minhas seções"
      : name === "Metas"
        ? "Meus objetivos"
        : name,
  );
}
async function menu(page: Page, name: string) {
  const f = app(page);
  await f.getByRole("button", { name: "Abrir menu", exact: true }).click();
  await f
    .locator(".menu-list")
    .getByRole("button", { name, exact: true })
    .click();
}
async function saved(page: Page) {
  return page.evaluate(() =>
    JSON.parse(localStorage.getItem("nexo-simulator-v1")!),
  );
}

test("section pinning uses real sections, filters them, and persists without altering money", async ({
  page,
}) => {
  await open(page);
  const f = app(page),
    before = await saved(page);
  await navigate(page, "Seções");
  await f
    .getByRole("button", { name: "Fixar Venda do videogame", exact: true })
    .click();
  await expect(
    f.getByRole("button", {
      name: "Desafixar Venda do videogame",
      exact: true,
    }),
  ).toBeVisible();
  await f
    .locator(".production-sections")
    .getByRole("button", { name: "Fixadas", exact: true })
    .click();
  await expect(
    f.getByText("Venda do videogame", { exact: true }),
  ).toBeVisible();
  await expect(f.getByText("Empréstimo pessoal", { exact: true })).toHaveCount(
    0,
  );
  const after = await saved(page);
  expect(
    after.sections.find((s: any) => s.title === "Venda do videogame").pinned,
  ).toBe(true);
  expect(after.entries).toEqual(before.entries);
  await page.reload();
  await navigate(page, "Seções");
  await expect(
    app(page).getByRole("button", {
      name: "Desafixar Venda do videogame",
      exact: true,
    }),
  ).toBeVisible();
});

test("animated type and account pickers filter the actual ledger on a phone", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await open(page);
  const f = app(page),
    before = await saved(page);
  await menu(page, "Lançamentos");
  await f
    .getByRole("button", { name: "Filtrar movimentos", exact: true })
    .click();
  await f.getByRole("button", { name: "Despesas", exact: true }).click();
  await expect(
    f.getByRole("button", { name: "Filtrar movimentos", exact: true }),
  ).toBeVisible();
  const expectedTitles = before.entries
    .filter((e: any) => e.type === "expense")
    .map((e: any) => e.title);
  const titles = await f.locator(".transaction strong").allTextContents();
  expect(titles.length).toBeGreaterThan(0);
  expect(titles.every((t) => expectedTitles.includes(t))).toBe(true);
  await f
    .getByRole("button", { name: "Filtrar por conta", exact: true })
    .click();
  await f
    .getByRole("button", { name: "Selecionar Bradesco", exact: true })
    .click();
  await expect(
    f.getByRole("menu", { name: "Filtrar por conta", exact: true }),
  ).toHaveCount(0);
  const accountTitles = before.entries
    .filter((e: any) => e.type === "expense" && e.accountId === "bradesco")
    .map((e: any) => e.title);
  const filtered = await f.locator(".transaction strong").allTextContents();
  expect(filtered.every((t) => accountTitles.includes(t))).toBe(true);
  expect(
    await f
      .locator("html")
      .evaluate((el) => el.scrollWidth > el.clientWidth + 1),
  ).toBe(false);
  expect((await saved(page)).entries).toEqual(before.entries);
});

test("goal task disclosure opens a real contribution planner; slider syncs cents and only submit records money", async ({
  page,
}) => {
  await open(page);
  const f = app(page),
    before = await saved(page);
  const goal = before.goals.find(
    (g: any) =>
      g.contributions.reduce((s: number, c: any) => s + c.amount, 0) < g.target,
  );
  await navigate(page, "Metas");
  await f
    .getByRole("button", { name: "Expandir Metas e aportes", exact: true })
    .click();
  await f
    .locator(".production-goals")
    .getByRole("button")
    .filter({ hasText: goal.title })
    .click();
  const dialog = f.getByRole("dialog", {
    name: "Organizar aporte",
    exact: true,
  });
  await expect(dialog).toBeVisible();
  await dialog
    .getByLabel("Conta bancária", { exact: true })
    .selectOption("bradesco");
  await dialog.getByLabel("Valor (R$)", { exact: true }).fill("12,34");
  const slider = dialog.getByRole("slider", {
    name: "Planejar aporte",
    exact: true,
  });
  await expect(slider).toHaveValue("1234");
  await slider.focus();
  await slider.press("ArrowRight");
  await expect(dialog.getByLabel("Valor (R$)", { exact: true })).toHaveValue(
    "12,35",
  );
  expect((await saved(page)).goals).toEqual(before.goals);
  await dialog.locator('button[type="submit"]').click();
  await expect(dialog).toHaveCount(0);
  const after = await saved(page),
    updated = after.goals.find((g: any) => g.id === goal.id);
  expect(updated.contributions).toHaveLength(goal.contributions.length + 1);
  expect(updated.contributions.at(-1).amount).toBe(1235);
  expect(updated.contributions.at(-1).accountId).toBe("bradesco");
  expect(after.accounts).toEqual(before.accounts);
  expect(after.entries).toEqual(before.entries);
});
