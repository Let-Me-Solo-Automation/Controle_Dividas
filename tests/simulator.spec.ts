import { readFile } from "node:fs/promises";
import { test, expect, type Page } from "@playwright/test";
import { pathToFileURL } from "node:url";
const url = pathToFileURL(process.cwd() + "/dist/Nexo-Simulador_1.html").href;
const app = (page: Page) =>
  page.frameLocator('iframe[title="Marks — aplicativo interativo"]');
async function open(page: Page) {
  await page.goto(url);
  await expect(
    app(page).getByRole("heading", { name: "Visão geral", exact: true }),
  ).toBeVisible();
}
async function menu(page: Page, name: string) {
  const f = app(page);
  await f.getByRole("button", { name: "Abrir menu", exact: true }).click();
  await f
    .locator(".menu-list")
    .getByRole("button", { name, exact: true })
    .click();
}
async function expandNavigation(page: Page) {
  await page.locator(".sim-phone").scrollIntoViewIfNeeded();
  const f = app(page);
  const expand = f.getByRole("button", {
    name: "Expandir navegação",
    exact: true,
  });
  if (
    !(await f
      .getByRole("navigation", { name: "Navegação principal", exact: true })
      .count())
  )
    await expand.click();
  await expect(
    f.getByRole("navigation", { name: "Navegação principal", exact: true }),
  ).toBeVisible();
}
async function navigate(page: Page, name: string) {
  await expandNavigation(page);
  await app(page)
    .getByRole("navigation")
    .getByRole("button", { name, exact: true })
    .click();
  await expect(
    app(page).getByRole("navigation", {
      name: "Navegação principal",
      exact: true,
    }),
  ).toHaveCount(0);
  const headings: Record<string, string> = {
    Início: "Visão geral",
    Seções: "Minhas seções",
    Entregas: "Entregas",
    Metas: "Meus objetivos",
  };
  await expect(app(page).locator(".screen-heading h1")).toHaveText(
    headings[name],
  );
}
async function create(page: Page, name: string) {
  const f = app(page);
  await expandNavigation(page);
  await f.getByRole("button", { name: "Adicionar novo registro" }).click();
  await f
    .getByRole("dialog")
    .getByRole("button", { name, exact: true })
    .click();
}

test("standalone offline loads original financial data and all main screens", async ({
  page,
}) => {
  const errors: string[] = [];
  const remote: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("request", (r) => {
    if (r.url().startsWith("http")) remote.push(r.url());
  });
  await open(page);
  const f = app(page);
  await expect(f.locator(".hero-amount")).toContainText("9.411,70");
  for (const name of ["Seções", "Entregas", "Metas", "Início"]) {
    await navigate(page, name);
    await expect(f.locator(".screen-heading h1")).toBeVisible();
  }
  for (const name of [
    "Contas e reserva",
    "Lançamentos",
    "Recorrências",
    "Agenda",
    "Personalização",
    "Ajuda e privacidade",
  ]) {
    await menu(page, name);
    await expect(f.locator(".screen-heading h1")).toBeVisible();
  }
  expect(errors).toEqual([]);
  expect(remote).toEqual([]);
});

test("creating income updates balance in cents and survives reload", async ({
  page,
}) => {
  await open(page);
  const f = app(page);
  await create(page, "Lançamento");
  await f.getByLabel("Tipo", { exact: true }).selectOption("income");
  await f.getByLabel("Título", { exact: true }).fill("Receita de validação");
  await f.getByLabel("Valor (R$)", { exact: true }).fill("100,25");
  await f
    .getByLabel("Conta bancária", { exact: true })
    .selectOption("bradesco");
  await f.getByRole("button", { name: "Salvar", exact: true }).click();
  await expect(f.getByRole("dialog")).toHaveCount(0);
  await expect(f.locator(".hero-amount")).toContainText("9.511,95");
  await page.reload();
  await expect(app(page).locator(".hero-amount")).toContainText("9.511,95");
  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("nexo-simulator-v1")!),
  );
  expect(
    saved.entries.find((x: any) => x.title === "Receita de validação").amount,
  ).toBe(10025);
});

test("a completed expense accepts a private receipt afterward and can remove it", async ({ page }) => {
  await open(page);
  const f = app(page);
  await create(page, "Lançamento");
  await f.getByLabel("Tipo", { exact: true }).selectOption("expense");
  await f.getByLabel("Título", { exact: true }).fill("Pagamento com comprovante");
  await f.getByLabel("Valor (R$)", { exact: true }).fill("18,40");
  await f.getByLabel("Conta bancária", { exact: true }).selectOption("bradesco");
  await f.getByRole("button", { name: "Salvar", exact: true }).click();
  await expect(f.getByRole("dialog")).toHaveCount(0);
  await menu(page, "Lançamentos");
  const payment = f.getByRole("button", { name: /Pagamento com comprovante/ });
  await expect(payment.locator(".money")).toHaveClass(/negative-text/);
  await payment.click();
  const detail = f.getByRole("dialog");
  await detail.getByRole("button", { name: "Anexar comprovante", exact: true }).click();
  const png = await f.locator("body").evaluate(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 4; canvas.height = 4;
    const context = canvas.getContext("2d")!;
    context.fillStyle = "#4b9"; context.fillRect(0, 0, 4, 4);
    return canvas.toDataURL("image/png").split(",")[1];
  });
  await f.locator("#image-file").setInputFiles({
    name: "comprovante.png",
    mimeType: "image/png",
    buffer: Buffer.from(png, "base64"),
  });
  await expect(detail.getByAltText("Comprovante deste lançamento")).toBeVisible();
  let saved = await page.evaluate(() => JSON.parse(localStorage.getItem("nexo-simulator-v1")!));
  expect(saved.entries.find((entry: any) => entry.title === "Pagamento com comprovante").image).toMatch(/^data:image\/jpeg;base64,/);
  await detail.getByRole("button", { name: "Remover", exact: true }).click();
  await expect(detail.getByAltText("Comprovante deste lançamento")).toHaveCount(0);
  saved = await page.evaluate(() => JSON.parse(localStorage.getItem("nexo-simulator-v1")!));
  expect(saved.entries.find((entry: any) => entry.title === "Pagamento com comprovante").image).toBe("");
});

test("delivery creates revenue and cost once and updates the balance", async ({
  page,
}) => {
  await open(page);
  const f = app(page);
  await create(page, "Entrega");
  await f
    .getByLabel("Plataforma", { exact: true })
    .selectOption({ label: "iFood" });
  await f
    .getByLabel("Nome do estabelecimento", { exact: true })
    .fill("Entrega de validação");
  await f.getByLabel("Valor recebido (R$)", { exact: true }).fill("25,50");
  await f.getByLabel("Distância percorrida (km)", { exact: true }).fill("4,5");
  await f.getByLabel("Custo desta entrega (R$)", { exact: true }).fill("3,25");
  await f
    .getByLabel("Conta bancária", { exact: true })
    .selectOption("bradesco");
  await f.getByRole("button", { name: "Salvar", exact: true }).click();
  await expect(f.getByRole("dialog")).toHaveCount(0);
  await expect(f.locator(".hero-amount")).toContainText("9.433,95");
  const data = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("nexo-simulator-v1")!),
  );
  expect(data.deliveries).toHaveLength(9);
  expect(data.deliveries.at(-1).amount).toBe(2550);
  expect(data.deliveries.at(-1).cost).toBe(325);
});

test("search works by keyboard and all themes render without runtime errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await open(page);
  const f = app(page);
  await f.getByRole("button", { name: "Buscar no Marks", exact: true }).click();
  await f.getByRole("combobox").fill("Contas e reserva");
  await f.getByRole("combobox").press("Enter");
  await expect(
    f.getByRole("heading", { name: "Contas e reserva", exact: true }),
  ).toBeVisible();
  const options = await page
    .locator("#theme-select option")
    .evaluateAll((opts) => opts.map((o) => (o as HTMLOptionElement).value));
  expect(options).toHaveLength(5);
  for (const id of options) {
    await page.locator("#theme-select").selectOption(id);
    await expect(f.locator("html")).toHaveAttribute(
      "data-theme",
      id === "apple-system" ? /^apple-(light|dark)$/ : id,
    );
    await expect(
      f.getByRole("heading", { name: "Contas e reserva", exact: true }),
    ).toBeVisible();
  }
  expect(errors).toEqual([]);
});

test("all 19 unique supplied components render in the lab", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await open(page);
  const f = app(page);
  await menu(page, "Personalização");
  await f.getByRole("button", { name: "Explorar interações" }).click();
  const lab = f.getByRole("dialog", { name: "Referência das interações" });
  await expect(lab.locator(".gallery-example")).toHaveCount(6);
  await lab.getByRole("button", { name: "Próximo slide" }).click();
  await expect(lab.locator(".gallery-slide")).toContainText(
    "Um lugar para cada acordo.",
  );
  await lab.getByRole("button", { name: "Controles", exact: true }).click();
  await expect(lab.locator(".gallery-example")).toHaveCount(6);
  await lab.getByRole("button", { name: "Criar novo", exact: true }).click();
  await expect(
    lab.getByRole("button", { name: "Recorrência", exact: true }),
  ).toBeVisible();
  await lab.getByRole("button", { name: "Cartões", exact: true }).click();
  await expect(lab.locator(".gallery-example")).toHaveCount(7);
  await lab
    .locator(".gallery-caption")
    .getByRole("heading", { name: "ViewOnMap", exact: true })
    .scrollIntoViewIfNeeded();
  await page.screenshot({ path: "test-results/gallery-cards.png" });
  expect(errors).toEqual([]);
});

test("mobile layouts, empty state and reset confirmation", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await open(page);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390);
  await page.getByRole("button", { name: "Configurar prévia" }).click();
  await page.getByRole("button", { name: "Começar com o app vazio" }).click();
  await page.getByRole("button", { name: "Cancelar", exact: true }).click();
  await expect(app(page).locator(".hero-amount")).toContainText("9.411,70");
  await page.getByRole("button", { name: "Começar com o app vazio" }).click();
  await page.getByRole("button", { name: "Confirmar", exact: true }).click();
  await expect(app(page).locator(".hero-amount")).toContainText("0,00");
  await create(page, "Conta");
  await app(page)
    .getByLabel("Nome do banco ou carteira")
    .fill("Minha carteira");
  await app(page).getByLabel("Saldo inicial real (R$)").fill("75,00");
  await app(page).getByRole("button", { name: "Salvar", exact: true }).click();
  await expect(app(page).locator(".hero-amount")).toContainText("75,00");
  await page.screenshot({ path: "test-results/mobile.png", fullPage: true });
});

test("reduced motion keeps values readable and modal focus contained", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await open(page);
  const f = app(page);
  await expect(f.locator(".hero-amount")).toContainText("9.411,70");
  await create(page, "Meta");
  const dialog = f.getByRole("dialog", { name: "Novo objetivo" });
  await expect(dialog).toBeVisible();
  await f.getByRole("button", { name: "Fechar", exact: true }).focus();
  await page.keyboard.press("Shift+Tab");
  const active = await dialog.locator(":focus").count();
  expect(active).toBe(1);
  await page.keyboard.press("Escape");
  await expect(f.getByRole("dialog")).toHaveCount(0);
});

test("partial payment carries the difference and remains usable on a small laptop", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await open(page);
  const f = app(page);
  await navigate(page, "Seções");
  await f.getByText("Venda do videogame", { exact: true }).click();
  await f
    .getByRole("button", { name: "Registrar pagamento", exact: true })
    .click();
  await f.getByLabel("Quanto foi pago (R$)", { exact: true }).fill("50,00");
  await f
    .getByLabel("Conta bancária", { exact: true })
    .selectOption("bradesco");
  await f
    .getByRole("dialog")
    .getByRole("button", { name: "Registrar pagamento", exact: true })
    .click();
  await expect(f.getByRole("dialog")).toHaveCount(0);
  await expect(f.locator("body")).toContainText("70,00");
  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("nexo-simulator-v1")!),
  );
  const section = saved.sections.find(
    (s: any) => s.title === "Venda do videogame",
  );
  expect(section.payments).toHaveLength(2);
  expect(section.payments.at(-1).amount).toBe(5000);
  await navigate(page, "Início");
  await expect(f.locator(".hero-amount")).toContainText("9.461,70");
});

test("navigation stays minimal, expands to icons and disappears on auxiliary screens", async ({
  page,
}) => {
  await open(page);
  const f = app(page);
  await expect(f.getByRole("navigation")).toHaveCount(0);
  const toggle = f.getByRole("button", {
    name: "Expandir navegação",
    exact: true,
  });
  await expect(toggle).toBeVisible();
  await toggle.click();
  await expect(f.getByRole("navigation")).toBeVisible();
  await expect(f.getByRole("navigation").getByRole("button")).toHaveCount(5);
  await expect(f.getByRole("navigation")).toHaveText("");
  await f.getByRole("button", { name: "Recolher navegação" }).press("Escape");
  await expect(f.getByRole("navigation")).toHaveCount(0);
  await navigate(page, "Entregas");
  await expect(
    f.getByRole("button", { name: "Expandir navegação" }),
  ).toBeVisible();
  await expect(f.getByRole("navigation")).toHaveCount(0);
  for (const name of [
    "Agenda",
    "Personalização",
    "Contas e reserva",
    "Ajuda e privacidade",
  ]) {
    await menu(page, name);
    await expect(f.locator(".app > .nexo-mini-dock")).toHaveCount(0);
  }
});

test("calendar icon toggles back to the exact section detail and scroll position", async ({
  page,
}) => {
  await open(page);
  const f = app(page);
  await navigate(page, "Seções");
  await f.getByText("Venda do videogame", { exact: true }).click();
  await f.locator("body").evaluate(() => window.scrollTo(0, 250));
  const scroll = await f.locator("body").evaluate(() => window.scrollY);
  await f
    .locator(".app-header")
    .getByRole("button", { name: "Agenda", exact: true })
    .click();
  await expect(
    f.getByRole("heading", { name: "Minha agenda", exact: true }),
  ).toBeVisible();
  await expect(f.locator(".app > .nexo-mini-dock")).toHaveCount(0);
  await f
    .locator(".app-header")
    .getByRole("button", { name: "Agenda", exact: true })
    .click();
  await expect(
    f.getByText("Venda do videogame", { exact: true }),
  ).toBeVisible();
  await expect(
    f.getByRole("button", { name: "Registrar pagamento", exact: true }),
  ).toBeVisible();
  await expect
    .poll(() => f.locator("body").evaluate(() => window.scrollY))
    .toBeCloseTo(scroll, 0);
  await menu(page, "Personalização");
  await f
    .locator(".app-header")
    .getByRole("button", { name: "Agenda", exact: true })
    .click();
  await f
    .locator(".app-header")
    .getByRole("button", { name: "Agenda", exact: true })
    .click();
  await expect(
    f.getByRole("heading", { name: "Seu jeito de usar", exact: true }),
  ).toBeVisible();
});

test("search typing has no green rectangle around the input", async ({
  page,
}) => {
  await open(page);
  const f = app(page);
  await f.getByRole("button", { name: "Buscar no Marks", exact: true }).click();
  const input = f.getByRole("combobox");
  await input.fill("meta");
  await expect(f.locator(".nexo-mini-dock")).toBeHidden();
  const style = await input.evaluate((el) => ({
    outline: getComputedStyle(el).outlineStyle,
    shadow: getComputedStyle(el).boxShadow,
    border: getComputedStyle(el).borderWidth,
  }));
  expect(style).toEqual({ outline: "none", shadow: "none", border: "0px" });
  await expect(
    f.getByRole("option", { name: "Metas", exact: true }),
  ).toBeVisible();
});

test("screen entry and scrolling reveal content from blur to a clear final state", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await open(page);
  const f = app(page);
  await f.locator("html").evaluate(() => {
    const state = window as any;
    state.__entryBlur = [];
    const capture = () => {
      const screen = document.querySelector(".screen");
      if (
        screen &&
        document.querySelector(".screen-heading h1")?.textContent ===
          "Minhas seções"
      )
        state.__entryBlur.push(
          parseFloat(
            getComputedStyle(screen).filter.match(/blur\(([^)]+)px\)/)?.[1] ??
              "0",
          ),
        );
      if (state.__entryBlur.length < 80) requestAnimationFrame(capture);
    };
    requestAnimationFrame(capture);
  });
  await navigate(page, "Seções");
  const screen = f.locator(".screen");
  const measured = await f
    .locator("html")
    .evaluate(() => (window as any).__entryBlur as number[]);
  expect(Math.max(...measured)).toBeGreaterThan(1);
  await expect(screen).toHaveCSS("filter", "blur(0px)");
  await navigate(page, "Início");
  await expect(f.locator(".screen")).toHaveCSS("filter", "blur(0px)");
  const lastCard = f.locator(".dashboard-stack .card").last();
  await lastCard.scrollIntoViewIfNeeded();
  await expect(lastCard).toHaveCSS("filter", "blur(0px)");
  await expect(lastCard).toHaveCSS("opacity", "1");
});

test("blur reveal respects reduced motion and the app animation preference", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await open(page);
  const f = app(page);
  await expect(f.locator(".screen")).toHaveCSS("filter", "blur(0px)");
  await navigate(page, "Metas");
  await expect(f.locator(".screen")).toHaveCSS("filter", "blur(0px)");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.evaluate(() => {
    const key = "nexo-simulator-v1";
    const data = JSON.parse(localStorage.getItem(key)!);
    data.settings.motion = false;
    localStorage.setItem(key, JSON.stringify(data));
  });
  await page.reload();
  await expect(app(page).locator("html")).toHaveAttribute("data-motion", "off");
  await navigate(page, "Seções");
  await expect(app(page).locator(".screen")).toHaveCSS("filter", "blur(0px)");
});

test("Firebase tutorial contains the exact rules once and the six setup steps", async ({
  page,
}) => {
  await page.goto(
    pathToFileURL(process.cwd() + "/dist/tutorial-firebase.html").href,
  );
  await expect(page).toHaveTitle("Marks — Tutorial do Firebase");
  for (const id of ["projeto", "acesso", "banco", "regras", "app", "dominio"])
    await expect(page.locator("section#" + id)).toHaveCount(1);
  const rules = await readFile("firebase/firestore.rules", "utf8");
  expect(await page.locator("#rules-code").textContent()).toBe(rules);
  await expect(
    page.getByRole("button", { name: "Copiar regras", exact: true }),
  ).toHaveCount(1);
});
