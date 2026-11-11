import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  testMatch: "firebase-e2e.spec.ts",
  timeout: 90000,
  expect: { timeout: 10000 },
  workers: 1,
  use: { headless: true, viewport: { width: 1440, height: 1100 } },
  webServer: {
    command: "python -m http.server 4180 --bind 127.0.0.1 --directory dist",
    url: "http://127.0.0.1:4180",
    reuseExistingServer: !process.env.CI,
  },
  reporter: "list",
});
