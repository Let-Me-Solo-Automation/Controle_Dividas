import { test, expect, type Page } from "@playwright/test";
import { pathToFileURL } from "node:url";
const url = pathToFileURL(process.cwd() + "/dist/Marks-Simulador.html").href;
const app = (page: Page) =>
  page.frameLocator('iframe[title="Marks — aplicativo interativo"]');
async function open(page: Page) {
  await page.goto(url);
  await expect(
    app(page).getByRole("heading", { name: "Visão geral", exact: true }),
  ).toBeVisible();
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
}

test("floating navigation moves the selection, contracts, then opens the selected screen", async ({
  page,
}) => {
  await open(page);
  const f = app(page);
  await f
    .getByRole("button", { name: "Expandir navegação", exact: true })
    .click();
  const nav = f.getByRole("navigation", {
    name: "Navegação principal",
    exact: true,
  });
  await expect(nav).toHaveCSS("opacity", "1");
  await f.locator("html").evaluate(() => {
    const state = window as any;
    state.__dockSamples = [];
    const capture = () => {
      const dock = document.querySelector(".nexo-mini-dock"),
        nav = dock?.querySelector("nav"),
        pill = nav?.querySelector(".nexo-moving-selection");
      const heading = document.querySelector(".screen-heading h1")?.textContent;
      state.__dockSamples.push({
        phase: dock?.getAttribute("data-phase"),
        nav: !!nav,
        x:
          pill && nav
            ? pill.getBoundingClientRect().left -
              nav.getBoundingClientRect().left
            : null,
        opacity: nav ? Number(getComputedStyle(nav).opacity) : 0,
        heading,
      });
      if (
        !(heading === "Minhas seções" && !nav) &&
        state.__dockSamples.length < 300
      )
        requestAnimationFrame(capture);
    };
    requestAnimationFrame(capture);
  });
  await nav.getByRole("button", { name: "Seções", exact: true }).click();
  await expect(
    f.getByRole("heading", { name: "Minhas seções", exact: true }),
  ).toBeVisible();
  await expect(nav).toHaveCount(0);
  const samples = await f.locator("html").evaluate(
    () =>
      (window as any).__dockSamples as {
        phase: string;
        nav: boolean;
        x: number | null;
        opacity: number;
        heading: string;
      }[],
  );
  const moving = samples
    .filter((s) => s.phase === "selecting" && s.x !== null)
    .map((s) => s.x!);
  expect(Math.max(...moving) - Math.min(...moving)).toBeGreaterThan(12);
  expect(
    samples.some(
      (s) => s.phase === "closing" && s.opacity > 0 && s.opacity < 1,
    ),
  ).toBe(true);
  expect(
    samples.filter((s) => s.nav).every((s) => s.heading !== "Minhas seções"),
  ).toBe(true);
  await f
    .getByRole("button", { name: "Expandir navegação", exact: true })
    .click();
  await nav.getByRole("button", { name: "Metas", exact: true }).click();
  await f.locator("body").press("Escape");
  await expect(nav).toHaveCount(0);
  await navigate(page, "Entregas");
  await expect(
    f.getByRole("heading", { name: "Entregas", exact: true }),
  ).toBeVisible();
});

test("one theme button morphs the icon and persists the selected appearance in Studio and app", async ({
  page,
}) => {
  await open(page);
  const f = app(page);
  await page.locator("#theme-select").selectOption("apple-light");
  await expect(page.locator(".sim-appearance-options button")).toHaveCount(1);
  const before = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("nexo-simulator-v1")!),
  );
  await page.evaluate(() => {
    const state = window as any;
    state.__morphValues = [];
    const capture = () => {
      const circle = document.querySelector(
        ".sim-appearance-options mask circle",
      );
      const value = Number(circle?.getAttribute("cx"));
      state.__morphValues.push(value);
      if (state.__morphValues.length < 80) requestAnimationFrame(capture);
    };
    requestAnimationFrame(capture);
  });
  await page
    .locator(".sim-appearance-options")
    .getByRole("button", { name: "Ativar tema escuro", exact: true })
    .click();
  await expect(f.locator("html")).toHaveAttribute("data-theme", "apple-dark");
  await expect(
    page.locator(".sim-appearance-options mask circle"),
  ).toHaveAttribute("cx", "16.5");
  expect(
    await page.evaluate(() =>
      (window as any).__morphValues.some((v: number) => v > 16.7 && v < 25.7),
    ),
  ).toBe(true);
  await f.getByRole("button", { name: "Abrir menu", exact: true }).click();
  await expect(f.locator(".profile-menu .theme-morph-toggle")).toHaveCount(1);
  await f
    .getByRole("button", { name: "Ativar tema claro", exact: true })
    .click();
  await expect(f.locator("html")).toHaveAttribute("data-theme", "apple-light");
  await expect(f.locator(".profile-menu")).toBeVisible();
  await expect(
    f.locator(".profile-menu .theme-morph-toggle mask circle"),
  ).toHaveAttribute("cx", "26");
  await page.reload();
  await expect(app(page).locator("html")).toHaveAttribute(
    "data-theme",
    "apple-light",
  );
  const after = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("nexo-simulator-v1")!),
  );
  expect(after.entries).toEqual(before.entries);
  expect(after.sections).toEqual(before.sections);
});

test("delivery KPIs have gutters and dashboard section rows have complete outlines without exposed swipe actions", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await open(page);
  const f = app(page);
  await navigate(page, "Entregas");
  const layout = await f.locator(".kpi-grid").evaluate((el) => {
    const cards = Array.from(el.querySelectorAll(".kpi"));
    const a = cards[0].getBoundingClientRect(),
      b = cards[1].getBoundingClientRect();
    return {
      gap: b.left - a.right,
      overflow:
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth + 1,
    };
  });
  expect(layout.gap).toBeGreaterThanOrEqual(10);
  expect(layout.overflow).toBe(false);
  await navigate(page, "Início");
  const rows = f.locator(".swipe-card");
  await expect(rows.first()).toBeVisible();
  const borders = await rows.first().evaluate((el) => {
    const css = getComputedStyle(el),
      actions = el.querySelector(".swipe-actions")!;
    return {
      borders: [
        css.borderTopWidth,
        css.borderRightWidth,
        css.borderBottomWidth,
        css.borderLeftWidth,
      ],
      actions: getComputedStyle(actions).visibility,
    };
  });
  expect(borders.borders).toEqual(["1px", "1px", "1px", "1px"]);
  expect(borders.actions).toBe("hidden");
  await rows
    .first()
    .getByRole("button", { name: "Mostrar ações", exact: true })
    .click();
  await expect(
    rows.first().getByRole("button", { name: /Excluir/ }),
  ).toBeVisible();
});
