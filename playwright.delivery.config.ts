import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/delivery",
  timeout: 90_000,
  fullyParallel: false,
  workers: 1,
  reporter: [["list"], ["html", { outputFolder: "playwright-report/delivery", open: "never" }]],
  use: {
    ...devices["Pixel 7"],
    viewport: { width: 393, height: 852 },
    baseURL: "http://127.0.0.1:4179",
    trace: "retain-on-failure"
  },
  webServer: {
    command: "npm run build && npm run preview -- --host 127.0.0.1 --port 4179",
    url: "http://127.0.0.1:4179/deliveries",
    reuseExistingServer: false,
    timeout: 240_000
  },
  projects: [
    {
      name: "chromium"
    }
  ]
});
