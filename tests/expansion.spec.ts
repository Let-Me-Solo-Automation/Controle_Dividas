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
async function menu(p: Page, name: string) {
  const f = app(p);
  await f.getByRole("button", { name: "Abrir menu", exact: true }).click();
  await f
    .locator(".menu-list")
    .getByRole("button", { name, exact: true })
    .click();
}
async function navigate(p: Page, name: string) {
  const f = app(p);
  await p.locator(".sim-phone").scrollIntoViewIfNeeded();
  await f
    .getByRole("button", { name: "Expandir navegação", exact: true })
    .click();
  await f
    .getByRole("navigation", { name: "Navegação principal", exact: true })
    .getByRole("button", { name, exact: true })
    .click();
  await expect(f.locator(".screen-heading h1")).toHaveText(
    name === "Seções"
      ? "Minhas seções"
      : name === "Metas"
        ? "Meus objetivos"
        : name === "Início"
          ? "Visão geral"
          : name,
  );
}
async function saved(p: Page) {
  return p.evaluate(() =>
    JSON.parse(localStorage.getItem("nexo-simulator-v1")!),
  );
}

test("income and outgoing summary uses animated signed comparison bars", async ({ page }) => {
  await open(page);
  await menu(page, "Lançamentos");
  const f = app(page);
  const chart = f.locator(".finance-comparison");
  await expect(chart).toBeVisible();
  await expect(chart).toContainText("Entradas");
  await expect(chart).toContainText("Saídas");
  await expect(chart).toContainText("+");
  await expect(chart).toContainText(/[-−]/);
  await expect(chart.locator(".finance-comparison-fill")).toHaveCount(2);
});

test("frosted glass plus resets after selecting and the icon morph completes before the palette changes", async ({
  page,
}) => {
  await open(page);
  const f = app(page);
  await page.locator("#theme-select").selectOption("apple-light");
  const plus = f.getByRole("button", {
    name: "Expandir navegação",
    exact: true,
  });
  const before = await plus.evaluate((e) => ({
    background: getComputedStyle(e).backgroundColor,
    color: getComputedStyle(e).color,
    border: getComputedStyle(e).borderTopWidth,
  }));
  expect(before.background).not.toBe(before.color);
  expect(before.border).toBe("1px");
  await plus.click();
  const active = f.getByRole("button", {
    name: "Recolher navegação",
    exact: true,
  });
  await expect(active).toHaveAttribute("data-active", "true");
  await expect(active).toHaveCSS("backdrop-filter", /blur\(.+\)/);
  await expect(active).not.toHaveCSS("background-color", "rgba(6, 103, 68, 0.94)");
  await f
    .getByRole("navigation", { name: "Navegação principal" })
    .getByRole("button", { name: "Metas", exact: true })
    .click();
  await expect(f.locator(".screen-heading h1")).toHaveText("Meus objetivos");
  await expect(
    f.getByRole("button", { name: "Expandir navegação", exact: true }),
  ).toHaveAttribute("data-active", "false");
  await page.evaluate(() => {
    const w = window as any;
    w.__morph = [];
    let count = 0;
    const sample = () => {
      const c = document.querySelector(".sim-appearance-options mask circle");
      w.__morph.push({
        cx: Number(c?.getAttribute("cx")),
        dark: document.documentElement.dataset.dark,
      });
      if (count++ < 80) requestAnimationFrame(sample);
    };
    requestAnimationFrame(sample);
  });
  await page
    .locator(".sim-appearance-options")
    .getByRole("button", { name: "Ativar tema escuro", exact: true })
    .click();
  await expect(f.locator("html")).toHaveAttribute("data-theme", "apple-dark");
  const frames = await page.evaluate(
    () => (window as any).__morph as { cx: number; dark: string }[],
  );
  const between = frames.filter((x) => x.cx > 17 && x.cx < 25);
  expect(between.length).toBeGreaterThan(0);
  expect(between.every((x) => x.dark === "false")).toBe(true);
});

test("reserve ledger supports noted deposits and withdrawals, targets never inflate actual wealth", async ({
  page,
}) => {
  await open(page);
  const f = app(page),
    before = await saved(page);
  await menu(page, "Contas e reserva");
  const wealth = await f
    .locator(".reserve-summary section")
    .first()
    .locator("strong")
    .innerText();
  async function move(direction: string, amount: string, note: string) {
    await f
      .getByRole("button", { name: "Aporte ou resgate", exact: true })
      .click();
    const form = f.locator(".reserve-composer");
    await form.getByLabel("Banco", { exact: true }).selectOption("bradesco");
    await form
      .getByLabel("Movimentação", { exact: true })
      .selectOption(direction);
    await form.getByLabel("Valor (R$)", { exact: true }).fill(amount);
    await form.getByLabel(/^Nota curta/).fill(note);
    await form
      .getByRole("button", { name: "Registrar movimentação", exact: true })
      .click();
    await expect(form).toHaveCount(0);
  }
  await move("deposit", "100,25", "Reserva do trabalho");
  await move("withdrawal", "50,00", "Emergência");
  const after = await saved(page);
  expect(after.accounts).toEqual(before.accounts);
  expect(after.entries).toEqual(before.entries);
  expect(
    after.reserve
      .filter((r: any) => r.accountId === "bradesco")
      .reduce((v: number, r: any) => v + r.amount, 0),
  ).toBe(5025);
  expect(after.reserveTransactions.slice(-2).map((r: any) => r.note)).toEqual([
    "Reserva do trabalho",
    "Emergência",
  ]);
  const card = f
    .locator(".reserve-bank-card")
    .filter({ has: f.getByRole("heading", { name: "Bradesco", exact: true }) });
  await card.getByText("Editar planejamento", { exact: true }).click();
  await card.getByLabel("Objetivo (R$)", { exact: true }).fill("10000,00");
  await card
    .getByLabel("Aporte mensal planejado (R$)", { exact: true })
    .fill("100,00");
  await card.getByRole("button", { name: "Salvar plano", exact: true }).click();
  const data = await saved(page);
  expect(
    data.reservePlans.find((r: any) => r.accountId === "bradesco"),
  ).toMatchObject({ target: 1000000, monthly: 10000 });
  await expect(
    f.locator(".reserve-summary section").first().locator("strong"),
  ).toHaveText(wealth);
  await page.reload();
  await menu(page, "Contas e reserva");
  await expect(app(page).locator(".reserve-ledger")).toContainText(
    "Emergência",
  );
  const reloadedCard = app(page)
    .locator(".reserve-bank-card")
    .filter({
      has: app(page).getByRole("heading", { name: "Bradesco", exact: true }),
    });
  await reloadedCard.getByText("Editar planejamento", { exact: true }).click();
  await expect(
    reloadedCard.getByLabel("Objetivo (R$)", { exact: true }),
  ).toHaveValue("10000,00");
  await expect(
    reloadedCard.getByLabel("Aporte mensal planejado (R$)", { exact: true }),
  ).toHaveValue("100,00");
  await reloadedCard
    .getByRole("button", { name: "Salvar plano", exact: true })
    .click();
  expect((await saved(page)).reservePlans).toEqual(data.reservePlans);
});

test("bank registration stores description and icon with an actual initial balance", async ({
  page,
}) => {
  await open(page);
  const f = app(page),
    before = await saved(page);
  await menu(page, "Contas e reserva");
  await f
    .getByRole("button", { name: "Cadastrar banco", exact: true })
    .first()
    .click();
  const dialog = f.getByRole("dialog");
  await dialog
    .getByLabel("Nome do banco ou carteira", { exact: true })
    .fill("Banco Viagem");
  await dialog.getByLabel(/^Descrição/).fill("Minhas viagens");
  await dialog
    .getByLabel("Saldo inicial real (R$)", { exact: true })
    .fill("500,00");
  await dialog.getByLabel("Ícone", { exact: true }).selectOption("wallet");
  await dialog.getByRole("button", { name: "Salvar", exact: true }).click();
  await expect(dialog).toHaveCount(0);
  const after = await saved(page);
  expect(
    after.accounts.find((b: any) => b.title === "Banco Viagem"),
  ).toMatchObject({
    initial: 50000,
    description: "Minhas viagens",
    icon: "wallet",
  });
  expect(after.entries).toEqual(before.entries);
  await expect(
    f.locator(".reserve-bank-card").filter({ hasText: "Banco Viagem" }),
  ).toContainText("Minhas viagens");
});

test("calendar switches between month and week and shows real installment dates", async ({
  page,
}) => {
  await open(page);
  const f = app(page);
  await f
    .locator(".app-header")
    .getByRole("button", { name: "Agenda", exact: true })
    .click();
  const cal = f.getByRole("region", { name: "Agenda financeira", exact: true });
  await expect(cal.locator(".finance-calendar-row")).toHaveCount(6);
  await cal.getByRole("button", { name: "Semana", exact: true }).click();
  await expect(cal.locator(".finance-calendar-row")).toHaveCount(1);
  await cal.getByRole("button", { name: "Mês", exact: true }).click();
  await expect(cal.locator(".finance-calendar-row")).toHaveCount(6);
  await cal.getByRole("button", { name: "Ano", exact: true }).click();
  await expect(cal.locator(".finance-calendar-mini-month")).toHaveCount(12);
  await cal.getByRole("button", { name: "dezembro", exact: true }).click();
  await expect(cal.locator(".finance-calendar-row")).toHaveCount(6);
  await cal.getByRole("button", { name: "Dia", exact: true }).click();
  await expect(cal.locator(".finance-calendar-row")).toHaveCount(1);
  await cal.getByRole("button", { name: "Mês", exact: true }).click();
  await cal.getByLabel("Ir para a data", { exact: true }).fill("2026-12-10");
  await expect(cal).toContainText("Venda do videogame");
  await cal.getByText("Filtrar datas da agenda", { exact: true }).click();
  await cal
    .getByRole("button", { name: "Ativar Filtrar por intervalo", exact: true })
    .click();
  await cal
    .getByLabel("Data inicial da janela", { exact: true })
    .fill("2026-12-10");
  await cal
    .getByLabel("Data final da janela", { exact: true })
    .fill("2026-12-10");
  await cal
    .getByRole("button", { name: "Próximos prazos", exact: true })
    .click();
  await expect(cal.locator(".finance-calendar-details")).toContainText(
    "Venda do videogame",
  );
  await cal
    .getByLabel("Data final da janela", { exact: true })
    .fill("2026-12-09");
  await expect(cal.getByRole("alert")).toContainText("data final");
  await expect(cal.locator(".finance-calendar-event")).toHaveCount(0);
  await cal
    .getByLabel("Data final da janela", { exact: true })
    .fill("2026-12-10");
  await cal
    .getByRole("button", { name: "Ativar Filtrar por intervalo", exact: true })
    .click();
  await expect(cal.getByRole("alert")).toHaveCount(0);
  await cal.getByRole("button", { name: "Hoje", exact: true }).click();
  await expect(cal.getByLabel("Ir para a data", { exact: true })).toHaveValue(
    await page.evaluate(() => {
      const d = new Date();
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    }),
  );
});

test("calendar distinguishes national holidays and does not label optional holidays", async ({ page }) => {
  await open(page);
  const f = app(page);
  await f.locator(".app-header").getByRole("button", { name: "Agenda", exact: true }).click();
  const cal = f.getByRole("region", { name: "Agenda financeira", exact: true });
  await cal.getByLabel("Ir para a data", { exact: true }).fill("2026-10-12");
  await expect(cal.locator('[data-date="2026-10-12"].is-national-holiday')).toHaveCount(1);
  await cal.getByLabel("Ir para a data", { exact: true }).fill("2026-06-04");
  await expect(cal.locator('[data-date="2026-06-04"].is-national-holiday')).toHaveCount(0);
});

test("customization has replayable examples, saves visual presets and changes real chart/nav styles", async ({
  page,
}) => {
  await open(page);
  const f = app(page),
    before = await saved(page);
  await menu(page, "Personalização");
  const studio = f.locator(".personalization-studio");
  await expect(
    studio.getByRole("heading", {
      name: "Sua combinação em movimento",
      exact: true,
    }),
  ).toBeVisible();
  await f.locator("html").evaluate(() => {
    (window as any).__previewNode = document.querySelector(
      ".personal-live-preview .personal-chart",
    );
  });
  await studio
    .getByRole("button", { name: "Repetir prévia", exact: true })
    .click();
  expect(
    await f
      .locator("html")
      .evaluate(
        () =>
          (window as any).__previewNode !==
          document.querySelector(".personal-live-preview .personal-chart"),
      ),
  ).toBe(true);
  await studio.getByRole("button", { name: "Barras", exact: true }).click();
  await studio
    .locator(".personal-animation-grid button")
    .filter({ hasText: "Em sequência" })
    .click();
  await studio
    .locator(".personal-nav-grid button")
    .filter({ hasText: "Ilha" })
    .click();
  await studio
    .getByLabel("Nome da combinação", { exact: true })
    .fill("Meu modo");
  await studio
    .getByRole("button", { name: "Salvar combinação", exact: true })
    .click();
  await f.getByRole("button", { name: "Salvar", exact: true }).click();
  await expect(f.locator(".settings-sticky").getByRole("button",{name:"Salvo",exact:true})).toBeVisible();
  let data = await saved(page);
  expect(data.settings).toMatchObject({
    chart: "bars",
    chartAnimation: "stagger",
    nav: "island",
  });
  expect(data.settings.customPresets).toHaveLength(1);
  expect(data.settings.customPresets[0].settings).not.toHaveProperty(
    "accounts",
  );
  expect(data.entries).toEqual(before.entries);
  await f
    .locator(".app-header")
    .getByRole("button", { name: "Marks início", exact: true })
    .click();
  await expect(f.locator(".nexo-mini-dock")).toHaveClass(/nav-variant-island/);
  await f.locator(".chart-bars").scrollIntoViewIfNeeded();
  await expect(f.locator(".chart-bars")).toBeVisible();
  await menu(page, "Personalização");
  await app(page)
    .getByRole("button", { name: "Restaurar padrão", exact: true })
    .click();
  await app(page).getByRole("button", { name: "Salvar", exact: true }).click();
  await expect(app(page).locator(".settings-sticky").getByRole("button",{name:"Salvo",exact:true})).toBeVisible();
  data = await saved(page);
  expect(data.settings.nav).toBe("capsule");
  expect(data.settings.chart).toBe("auto");
  expect(data.settings.customPresets).toHaveLength(1);
});

test("goal progress replays from zero to deposited money and editing the target never changes the deposits", async ({
  page,
}) => {
  await open(page);
  let seed = await saved(page);
  seed.goals[0].target = 100000;
  seed.goals[0].contributions[0].amount = 2000;
  await page.evaluate(
    (value) => localStorage.setItem("nexo-simulator-v1", JSON.stringify(value)),
    seed,
  );
  await page.reload();
  const f = app(page);
  await f.locator("html").evaluate(() => {
    const w = window as any;
    w.__goalAmounts = [];
    let n = 0;
    const sample = () => {
      const text = document.querySelector(
        ".goal-item .money [aria-hidden]",
      )?.textContent;
      if (text) w.__goalAmounts.push(text);
      if (n++ < 180) requestAnimationFrame(sample);
    };
    requestAnimationFrame(sample);
  });
  await navigate(page, "Metas");
  const row = f.locator(".goal-item").first();
  await row.scrollIntoViewIfNeeded();
  await expect(row.locator(".money")).toContainText("20,00");
  const values = await f
    .locator("html")
    .evaluate(() => (window as any).__goalAmounts as string[]);
  expect(
    values.some((v) => {
      const number = Number(v.replace(/[^\d,]/g, "").replace(",", "."));
      return number > 0 && number < 20;
    }),
  ).toBe(true);
  await row.click();
  await f.getByText("Ajustar valor da meta", { exact: true }).click();
  await f.getByLabel("Valor da meta (R$)", { exact: true }).fill("1500,00");
  await f
    .getByRole("button", { name: "Salvar valor da meta", exact: true })
    .click();
  const data = await saved(page);
  expect(data.goals[0].target).toBe(150000);
  expect(data.goals[0].contributions).toEqual(seed.goals[0].contributions);
  expect(data.entries).toEqual(seed.entries);
  expect(data.accounts).toEqual(seed.accounts);
});
