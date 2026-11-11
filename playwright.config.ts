import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  testIgnore: ["firebase-e2e.spec.ts"],
  timeout: 45000,
  expect: { timeout: 7000 },
  use: { headless: true, viewport: { width: 1440, height: 1100 } },
  reporter: "list",
  workers: 2,
});
