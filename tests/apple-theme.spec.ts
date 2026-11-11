import { test, expect, type Page } from "@playwright/test";
import { pathToFileURL } from "node:url";
const url = pathToFileURL(process.cwd() + "/dist/Marks-Simulador.html").href;
const app = (page: Page) =>
  page.frameLocator('iframe[title="Marks — aplicativo interativo"]');
function contrast(a: string, b: string) {
  const luminance = (value: string) => {
    const raw = value.trim().replace("#", "");
    const hex =
      raw.length === 3
        ? raw
            .split("")
            .map((c) => c + c)
            .join("")
        : raw;
    const c = [0, 2, 4]
      .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
      .map((n) => (n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4));
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };
  const x = luminance(a),
    y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
test("Apple System follows the OS while preserving the current screen, iframe and financial records", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto(url);
  const f = app(page);
  await expect(f.locator(".hero-amount")).toContainText("9.411,70");
  const initial = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("nexo-simulator-v1")!),
  );
  await f.locator("html").evaluate(() => {
    (window as any).__themeContinuity = "same-session";
  });
  await f
    .getByRole("button", { name: "Expandir navegação", exact: true })
    .click();
  await f
    .getByRole("navigation")
    .getByRole("button", { name: "Seções", exact: true })
    .click();
  await f.getByText("Venda do videogame", { exact: true }).click();
  await page.locator("#theme-select").selectOption("apple-system");
  await expect(f.locator("html")).toHaveAttribute("data-theme", "apple-light");
  await expect(f.locator("html")).toHaveAttribute(
    "data-theme-choice",
    "apple-system",
  );
  await expect(f.locator(".detail-title")).toHaveText("Venda do videogame");
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(f.locator("html")).toHaveAttribute("data-theme", "apple-dark");
  await expect(f.locator("html")).toHaveAttribute("data-dark", "true");
  expect(
    await f.locator("html").evaluate(() => (window as any).__themeContinuity),
  ).toBe("same-session");
  const after = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("nexo-simulator-v1")!),
  );
  expect(after.settings.theme).toBe("apple-system");
  for (const key of ["sections", "entries", "accounts", "deliveries", "goals"])
    expect(after[key]).toEqual(initial[key]);
  await page.reload();
  await expect(app(page).locator("html")).toHaveAttribute(
    "data-theme",
    "apple-dark",
  );
  await expect(page.locator("#theme-select")).toHaveValue("apple-system");
});
test("Apple manual appearance persists independently of OS and semantic text colors meet AA", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto(url);
  const f = app(page);
  for (const id of ["apple-light", "apple-dark"]) {
    await page.locator("#theme-select").selectOption(id);
    await expect(f.locator("html")).toHaveAttribute("data-theme", id);
    const tokens = await f.locator("html").evaluate((el) => {
      const css = getComputedStyle(el);
      return Object.fromEntries(
        [
          "--text",
          "--muted",
          "--surface",
          "--bg",
          "--accent",
          "--accent-text",
        ].map((k) => [k, css.getPropertyValue(k).trim()]),
      );
    });
    for (const bg of ["--surface", "--bg"]) {
      expect(contrast(tokens["--text"], tokens[bg])).toBeGreaterThanOrEqual(
        4.5,
      );
      expect(contrast(tokens["--muted"], tokens[bg])).toBeGreaterThanOrEqual(
        4.5,
      );
    }
    expect(
      contrast(tokens["--accent"], tokens["--accent-text"]),
    ).toBeGreaterThanOrEqual(4.5);
  }
  await page.locator("#theme-select").selectOption("apple-light");
  await page.reload();
  await expect(app(page).locator("html")).toHaveAttribute("data-dark", "false");
  await page.emulateMedia({ colorScheme: "light" });
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(app(page).locator("html")).toHaveAttribute(
    "data-theme",
    "apple-light",
  );
  await page.setViewportSize({ width: 390, height: 844 });
  const overflow = await app(page)
    .locator("html")
    .evaluate((el) => el.scrollWidth > el.clientWidth + 1);
  expect(overflow).toBe(false);
});

test("Apple materials become opaque with reduced transparency and increased contrast", async ({
  page,
  context,
}) => {
  await page.goto(url);
  await page.locator("#theme-select").selectOption("apple-light");
  const f = app(page);
  await expect(f.locator("html")).toHaveAttribute("data-theme", "apple-light");
  await expect(f.locator(".app-header")).not.toHaveCSS(
    "backdrop-filter",
    "none",
  );
  const session = await context.newCDPSession(page);
  await session.send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-transparency", value: "reduce" }],
  });
  expect(
    await f
      .locator("html")
      .evaluate(
        () => matchMedia("(prefers-reduced-transparency: reduce)").matches,
      ),
  ).toBe(true);
  await expect(f.locator(".app-header")).toHaveCSS("backdrop-filter", "none");
  await expect(f.locator(".nexo-glass-plus")).toHaveCSS(
    "backdrop-filter",
    "none",
  );
  await session.send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-contrast", value: "more" }],
  });
  await expect(f.locator(".app-header")).toHaveCSS("backdrop-filter", "none");
  const colors = await f.locator("html").evaluate((el) => {
    const css = getComputedStyle(el);
    return ["--text", "--muted"].map((k) => css.getPropertyValue(k).trim());
  });
  expect(colors[0]).toBe(colors[1]);
  await session.send("Emulation.setEmulatedMedia", {
    features: [{ name: "forced-colors", value: "active" }],
  });
  await expect(f.locator(".app-header")).toHaveCSS("backdrop-filter", "none");
});
