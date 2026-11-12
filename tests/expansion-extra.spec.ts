import { test, expect, type Page } from "@playwright/test";
import { pathToFileURL } from "node:url";
const url = pathToFileURL(process.cwd() + "/dist/Marks-Simulador.html").href;
const app = (p: Page) =>
  p.frameLocator('iframe[title="Marks — aplicativo interativo"]');
async function open(p: Page) {
  await p.goto(url);
  await expect(app(p).locator(".hero-amount")).toContainText("9.411,70");
  await p.locator(".sim-phone").scrollIntoViewIfNeeded();
}
async function navigate(p: Page, name: string) {
  const f = app(p);
  await f
    .getByRole("button", { name: "Expandir navegação", exact: true })
    .click();
  await f
    .getByRole("navigation", { name: "Navegação principal", exact: true })
    .getByRole("button", { name, exact: true })
    .click();
  await expect(f.locator(".screen-heading h1")).toHaveText(
    name === "Início" ? "Visão geral" : name,
  );
}

test("home uses actual KPI slides, a working filter, expandable goals and persistent pinned sections", async ({
  page,
}) => {
  await open(page);
  const f = app(page);
  const overview = f.getByRole("region", {
    name: "Seus indicadores financeiros",
    exact: true,
  });
  await expect(overview.getByText("Entradas", { exact: true })).toBeVisible();
  await overview
    .getByRole("button", { name: "Próximo slide", exact: true })
    .click();
  await expect(overview.getByText("A receber", { exact: true })).toBeVisible();
  await overview
    .getByRole("button", { name: "Filtrar indicadores", exact: true })
    .click();
  await overview
    .getByRole("button", {
      name: "Saldo real, sem somar metas futuras",
      exact: true,
    })
    .click();
  await expect(
    overview.getByText("Patrimônio em contas", { exact: true }),
  ).toBeVisible();
  await expect(
    overview.locator(".dashboard-overview-kpis dd").first(),
  ).toContainText("9.411,70");
  const widget = f.getByRole("group", {
    name: "Metas em movimento",
    exact: true,
  });
  await expect(widget.getByRole("button", { name: "Recolher Metas em movimento", exact: true })).toBeVisible();
  await expect(
    widget.locator("button").filter({ hasText: /R\$/ }).first(),
  ).toBeVisible();
  const sections = f.locator(".module-sections");
  const filters = sections.locator(".production-filter-kind > div > button");
  await expect(filters).toHaveCount(3);
  const tabWidths = await filters.evaluateAll((nodes) => nodes.map((node) => node.getBoundingClientRect().width));
  expect(Math.max(...tabWidths) - Math.min(...tabWidths)).toBeLessThan(1);
  const pin = sections.getByRole("button", {
    name: "Fixar Venda do videogame",
    exact: true,
  });
  await pin.scrollIntoViewIfNeeded();
  await pin.click();
  await expect(
    sections.getByRole("button", {
      name: "Desafixar Venda do videogame",
      exact: true,
    }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.reload();
  await expect(
    app(page).locator(".module-sections").getByRole("button", {
      name: "Desafixar Venda do videogame",
      exact: true,
    }),
  ).toHaveAttribute("aria-pressed", "true");
});

test("delivery route is offered only with both addresses and trash pulses red before confirmation", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await open(page);
  const f = app(page);
  const seed = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("nexo-simulator-v1")!),
  );
  seed.deliveries[0].pickup = "Praça da Sé, São Paulo";
  seed.deliveries[0].destination = "Avenida Paulista, 1000, São Paulo";
  seed.deliveries[1].pickup = "Apenas coleta";
  seed.deliveries[1].destination = "";
  await page.evaluate(
    (s) => localStorage.setItem("nexo-simulator-v1", JSON.stringify(s)),
    seed,
  );
  await page.reload();
  await navigate(page, "Entregas");
  await f
    .locator(".delivery-row")
    .filter({ hasText: seed.deliveries[1].title })
    .first()
    .click();
  await expect(
    f
      .getByRole("dialog")
      .getByRole("button", { name: "Ver trajeto", exact: true }),
  ).toHaveCount(0);
  await f
    .getByRole("dialog")
    .getByRole("button", { name: "Fechar", exact: true })
    .click();
  await f
    .locator(".delivery-row")
    .filter({ hasText: seed.deliveries[0].title })
    .first()
    .click();
  await f
    .getByRole("dialog")
    .getByRole("button", { name: "Ver trajeto", exact: true })
    .click();
  const route = f.getByRole("link", {
    name: "Abrir trajeto no Google Maps",
    exact: true,
  });
  await expect(route).toBeVisible();
  const href = new URL((await route.getAttribute("href"))!);
  expect(href.searchParams.get("origin")).toBe(seed.deliveries[0].pickup);
  expect(href.searchParams.get("destination")).toBe(
    seed.deliveries[0].destination,
  );
  expect(
    await f
      .locator(".delivery-route-map")
      .evaluate((el) => el.scrollWidth <= document.documentElement.clientWidth),
  ).toBe(true);
  await f
    .getByRole("dialog")
    .getByRole("button", { name: "Fechar", exact: true })
    .click();
  await f.getByRole("button", { name: "Abrir menu", exact: true }).click();
  await f
    .locator(".menu-list")
    .getByRole("button", { name: "Contas e reserva", exact: true })
    .click();
  const trash = f
    .locator(".reserve-bank-card")
    .filter({ hasText: "Bradesco" })
    .getByRole("button", { name: /Excluir/ });
  await trash.scrollIntoViewIfNeeded();
  await trash.evaluate((el) => {
    const w = window as any;
    w.__dangerFrames = [];
    let count = 0;
    const sample = () => {
      w.__dangerFrames.push({
        state: el.getAttribute("data-state"),
        background: getComputedStyle(el).backgroundColor,
        dialog: !!document.querySelector('[role="dialog"]'),
      });
      if (count++ < 100) requestAnimationFrame(sample);
    };
    requestAnimationFrame(sample);
  });
  await trash.click();
  await expect(f.getByRole("dialog")).toBeVisible();
  const dangerFrames = await f.locator("html").evaluate(
    () => (window as any).__dangerFrames,
  );
  expect(
    dangerFrames.some(
      (frame: any) =>
        frame.state === "armed" &&
        frame.background === "rgba(175, 28, 52, 0.94)" &&
        !frame.dialog,
    ),
  ).toBe(true);
  await f
    .getByRole("dialog")
    .getByRole("button", { name: "Fechar", exact: true })
    .click();
  expect(
    await page.evaluate(
      () =>
        JSON.parse(localStorage.getItem("nexo-simulator-v1")!).accounts.length,
    ),
  ).toBe(seed.accounts.length);
});
