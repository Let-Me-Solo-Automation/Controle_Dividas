import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
import path from "node:path";
import http from "node:http";
let server: http.Server, base: string;
test.beforeAll(async () => {
  const root = path.resolve("output/Marks-Figma");
  server = http.createServer(async (req, res) => {
    try {
      const file = path.resolve(
        root,
        "." + (req.url === "/" ? "/index.html" : req.url!),
      );
      if (!file.startsWith(root + path.sep)) throw Error();
      res.setHeader(
        "Content-Type",
        file.endsWith(".js")
          ? "text/javascript"
          : file.endsWith(".css")
            ? "text/css"
            : "text/html",
      );
      res.end(await readFile(file));
    } catch {
      res.writeHead(404);
      res.end();
    }
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  base = `http://127.0.0.1:${(server.address() as any).port}`;
});
test.afterAll(async () => {
  server.closeAllConnections();
  await new Promise<void>((resolve) => server.close(() => resolve()));
});
async function go(page: any, name: string) {
  await page.getByRole("button", { name: "Abrir menu", exact: true }).click();
  await page
    .locator(".menu-list")
    .getByRole("button", { name, exact: true })
    .click();
}
test("mobile platform configuration, incentive and payout preserve accounting; search and charts expose values", async ({
  page,
}) => {
  test.setTimeout(60000);
  await page.setViewportSize({ width: 390, height: 844 });
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(base);
  await page
    .getByRole("button", { name: "Abrir busca contextual", exact: true })
    .click();
  await page
    .getByRole("textbox", { name: "Buscar no extrato…", exact: true })
    .fill("Entre");
  await expect(page.locator(".context-search-results")).toContainText(
    "Entrega",
  );
  await page
    .getByRole("button", { name: "Minimizar busca contextual", exact: true })
    .click();
  await expect(
    page.getByRole("textbox", { name: "Buscar no extrato…", exact: true }),
  ).toHaveCount(0);
  const chart = page.locator(".income-period-chart");
  await chart.getByRole("button", { name: "Por data", exact: true }).click();
  await chart.locator('svg [role="button"]').first().click();
  await expect(chart.locator(".chart-value-tooltip")).toBeVisible();
  await chart.getByRole("button", { name: "Por semana", exact: true }).click();
  await chart.locator(".chart-data summary").click();
  await expect(chart.locator(".chart-data tbody tr").first()).toContainText(
    /\d{2}\/\d{2} a \d{2}\/\d{2}/,
  );
  await go(page, "Entregas");
  await page.screenshot({path:"output/refinement-deliveries-mobile.png"});
  await page.locator(".platform-open").first().click();
  const platform = await page.locator(".delivery-refined h2").innerText();
  const settings = page.locator(".platform-settings-form");
  await settings
    .locator("select[name=accountId]")
    .selectOption({ label: "Bradesco" });
  await settings.locator("select[name=mode]").selectOption("weekly");
  await settings.locator("input[name=monthlyGoal]").fill("2000");
  await page
    .getByRole("button", { name: "Salvar plataforma", exact: true })
    .click();
  await expect(page.locator(".delivery-refined")).toContainText("por semana");
  await expect(
    page.getByRole("button", { name: "Salvo", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Voltar uma tela", exact: true })
    .click();
  await expect(page.locator(".platform-open").first()).toBeVisible();
  await page.getByRole("button", { name: "Entrega", exact: true }).click();
  const dialog = page.getByRole("dialog", {
    name: "Nova entrega",
    exact: true,
  });
  await dialog
    .getByRole("textbox", { name: "Nome do estabelecimento", exact: true })
    .fill("Teste incentivo");
  await dialog
    .getByRole("textbox", { name: "Valor da entrega (R$)", exact: true })
    .fill("10");
  await dialog
    .getByRole("button", { name: "Incentivo na entrega", exact: true })
    .click();
  await dialog
    .getByRole("textbox", { name: "Valor do incentivo (R$)", exact: true })
    .fill("2,50");
  await dialog
    .getByRole("textbox", { name: "Distância (km, opcional)", exact: true })
    .fill("2");
  await dialog
    .getByRole("button", { name: "Data da entrega", exact: true })
    .click();
  await dialog
    .getByRole("dialog", { name: "Escolher data no calendário", exact: true })
    .getByRole("button", {
      name: "quinta-feira, 12 de novembro de 2026",
      exact: true,
    })
    .click();
  await dialog.getByRole("button", { name: "Salvar", exact: true }).click();
  await expect(dialog).toHaveCount(0);
  let data = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("marks-figma-review-v1")!),
  );
  const saved = data.deliveries.find(
    (row: any) => row.title === "Teste incentivo",
  );
  expect(saved.amount).toBe(1250);
  expect(saved.cost).toBe(0);
  expect(saved.date).toBe("2026-11-12");
  expect(saved.receiptStatus).toBe("pending");
  expect(data.entries.some((entry: any) => entry.deliveryId === saved.id)).toBe(
    false,
  );
  await page.locator(".platform-open").first().click();
  await page
    .getByRole("button", {
      name: "Confirmar recebimento do repasse",
      exact: true,
    })
    .click();
  await page.locator(".payout-confirm-form input[name=amount]").fill("12,50");
  await page
    .getByRole("button", { name: "Recebi este valor", exact: true })
    .click();
  await expect(page.locator(".payout-confirm-form")).toHaveCount(0);
  data = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("marks-figma-review-v1")!),
  );
  expect(
    data.entries.filter((entry: any) => entry.deliveryPayoutId).at(-1).amount,
  ).toBe(1250);
  await go(page, "Agenda");
  for (const mode of ["Dia", "Semana", "Mês"]) {
    await page
      .locator(".finance-calendar-view")
      .getByRole("button", { name: mode, exact: true })
      .click();
    const heading = await page
        .locator(".finance-calendar-navigation h3")
        .boundingBox(),
      filter = await page.locator(".finance-calendar-view").boundingBox();
    expect(heading!.y + heading!.height).toBeLessThanOrEqual(filter!.y + 1);
  }
  const back = await page
      .getByRole("button", { name: "Voltar uma tela", exact: true })
      .boundingBox(),
    brand = await page.locator(".brand").boundingBox();
  expect(back!.x + back!.width).toBeLessThanOrEqual(brand!.x);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: "output/refinement-agenda-mobile.png",
    fullPage: true,
  });
  expect(errors).toEqual([]);
});
test("goal badge arrows are part of the select target and completed status is green", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base);
  await go(page, "Metas");
  const widget = page.getByRole("group", {
    name: "Metas e aportes",
    exact: true,
  });
  if (
    await widget
      .getByRole("button", { name: "Expandir Metas e aportes", exact: true })
      .count()
  )
    await widget
      .getByRole("button", { name: "Expandir Metas e aportes", exact: true })
      .click();
  const priority = widget.locator(".semantic-select").first();
  await priority.scrollIntoViewIfNeeded();
  await priority.locator("select").hover();
  const box = await priority.boundingBox();
  expect(
    await page.evaluate(
      ({ x, y }) => document.elementFromPoint(x, y)?.tagName,
      { x: box!.x + box!.width - 10, y: box!.y + box!.height / 2 },
    ),
  ).toBe("SELECT");
  await priority.locator("select").selectOption("Alta");
  await expect(priority).toHaveClass(/tone-high/);
  const status = widget.locator(".semantic-select").nth(1);
  await status.locator("select").selectOption("Concluída");
  await expect(status).toHaveClass(/tone-complete/);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: "output/refinement-goals-mobile.png",
    fullPage: true,
  });
});
