import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/smoke",
  timeout: 120_000,
  fullyParallel: false,
  workers: 1,
  outputDir: "/tmp/playwright-rider-smoke",
  reporter: [["list"]],
  use: {
    ...devices["Pixel 7"],
    viewport: { width: 393, height: 852 },
    baseURL: "http://127.0.0.1:4178",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "SMOKE_SKIP_BACKEND=1 node scripts/serve-smoke.mjs",
    url: "http://127.0.0.1:4178/home",
    reuseExistingServer: false,
    timeout: 300_000,
  },
  projects: [
    {
      name: "chromium",
    },
  ],
});
