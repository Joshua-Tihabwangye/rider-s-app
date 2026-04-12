import { expect, test, type Page } from "@playwright/test";

const DELIVERY_CORE_ROUTES = [
  { path: "/deliveries", readyText: "Delivery command" },
  { path: "/deliveries/new", readyText: "New delivery" },
  { path: "/deliveries/tracking/DLV-2026-04-10-101", readyText: "Tracking" },
  { path: "/deliveries/notifications", readyText: "Notification center" },
  { path: "/deliveries/rating/DLV-2026-04-10-101", readyText: "How was your delivery?" },
  { path: "/deliveries/settlement/DLV-2026-04-10-101", readyText: "Settlement DLV-2026-04-10-101" }
] as const;

const DEVICE_CASES = [
  { label: "320", width: 320, height: 740 },
  { label: "375", width: 375, height: 812 },
  { label: "768", width: 768, height: 1024 },
  { label: "desktop", width: 1440, height: 900 }
] as const;

const RENDER_LOOP_PATTERNS = [/maximum update depth exceeded/i, /too many re-renders/i, /infinite loop/i];

function monitorRuntime(page: Page): { assertClean: () => void } {
  const issues: string[] = [];

  page.on("console", (message) => {
    const text = message.text();
    if (message.type() === "error" || RENDER_LOOP_PATTERNS.some((pattern) => pattern.test(text))) {
      issues.push(`[console:${message.type()}] ${text}`);
    }
  });

  page.on("pageerror", (error) => {
    issues.push(`[pageerror] ${error.message}`);
  });

  return {
    assertClean: () => {
      expect(issues, `Runtime issues found:\n${issues.join("\n")}`).toEqual([]);
    }
  };
}

async function expectNoHorizontalOverflow(page: Page): Promise<void> {
  const metrics = await page.evaluate(() => ({
    viewport: window.innerWidth,
    doc: document.documentElement.scrollWidth,
    body: document.body.scrollWidth
  }));

  expect(metrics.doc).toBeLessThanOrEqual(metrics.viewport + 2);
  expect(metrics.body).toBeLessThanOrEqual(metrics.viewport + 2);
}

test.describe("Delivery Sign-off • Device checks", () => {
  for (const device of DEVICE_CASES) {
    test(`core delivery routes are responsive at ${device.label}px`, async ({ page }) => {
      const runtime = monitorRuntime(page);
      await page.setViewportSize({ width: device.width, height: device.height });

      for (const route of DELIVERY_CORE_ROUTES) {
        await page.goto(route.path, { waitUntil: "networkidle" });
        await expect(page.getByText(route.readyText).first()).toBeVisible({ timeout: 20_000 });
        await expectNoHorizontalOverflow(page);
      }

      await page.goto("/deliveries/new", { waitUntil: "networkidle" });
      for (const stepLabel of [
        "Pickup & dropoff",
        "Parcel",
        "Recipient",
        "Order mode",
        "Timing",
        "Payment preview",
        "Confirm"
      ]) {
        await expect(page.getByText(stepLabel).first()).toBeVisible();
      }

      runtime.assertClean();
    });
  }
});

test.describe("Delivery Sign-off • Functional checks", () => {
  test("all delivery buttons are wired and complete expected flows", async ({ page }) => {
    const runtime = monitorRuntime(page);

    await page.goto("/deliveries", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Create new delivery" }).click();
    await expect(page).toHaveURL(/\/deliveries\/new$/);

    await page.getByLabel("Pickup location").fill("Plot 14, Nakasero Rd, Kampala");
    await page.getByLabel("Dropoff location").fill("12, JJ Apartments, New Street, Kampala");
    await page.getByRole("button", { name: "Continue" }).click();

    await page.getByLabel("Parcel description").fill("Quality gate parcel");
    await page.getByLabel("Declared value (UGX)").fill("120000");
    await page.getByRole("button", { name: "Continue" }).click();

    await page.getByLabel("Recipient name").fill("Quality Gate Receiver");
    await page.getByLabel("Recipient phone").fill("+256700111222");
    await page.getByLabel("Recipient address").fill("Kololo, Kampala");
    await page.getByRole("button", { name: "Continue" }).click();

    await page.getByRole("button", { name: "Business" }).click();
    await page.getByLabel("Cost center").fill("OPS-01");
    await page.getByLabel("Business note").fill("Functional gate check");
    await page.getByRole("button", { name: "Continue" }).click();

    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("button", { name: "Confirm delivery" }).click();

    await expect(page).toHaveURL(/\/deliveries\/tracking\//);
    const currentUrl = page.url();
    const orderMatch = currentUrl.match(/\/deliveries\/tracking\/([^/?#]+)/);
    expect(orderMatch).not.toBeNull();
    const orderId = orderMatch?.[1] ?? "";

    const callButton = page.getByLabel("Call courier now");
    await expect(callButton).toBeVisible();
    expect(await callButton.getAttribute("href")).toMatch(/^tel:/);

    await page.getByLabel("Open courier chat").click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByLabel("Close chat").click();

    await page.getByLabel("Report delivery issue").first().click();
    const issueDialog = page.getByRole("dialog", { name: "Report delivery issue" });
    await expect(issueDialog).toBeVisible();
    await issueDialog.getByLabel("Details").fill("Testing issue button wiring");
    await issueDialog.getByRole("button", { name: "Submit" }).click();
    await expect(issueDialog).not.toBeVisible();

    await page.getByLabel("View proof of delivery").click();
    await expect(page).toHaveURL(new RegExp(`/deliveries/tracking/${orderId}\\?tab=proof`));

    await page.getByLabel("View receipt section").click();
    await expect(page).toHaveURL(new RegExp(`/deliveries/tracking/${orderId}\\?tab=receipt`));

    await page.getByLabel("Open status timeline").click();
    await expect(page).toHaveURL(new RegExp(`/deliveries/tracking/${orderId}`));

    await page.getByLabel("Open live map").click();
    await expect(page).toHaveURL(new RegExp(`/deliveries/tracking/${orderId}`));

    await page.getByLabel("Rate this delivery").click();
    await expect(page).toHaveURL(new RegExp(`/deliveries/rating/${orderId}`));
    await page.getByRole("radio", { name: /5 Stars/i }).click();
    await page.getByRole("button", { name: "Submit rating" }).click();
    await expect(page).toHaveURL(new RegExp(`/deliveries/tracking/${orderId}`));

    await page.goto("/deliveries/tracking/DLV-2026-04-10-102", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Edit schedule" }).click();
    const scheduleDialog = page.getByRole("dialog", { name: "Edit scheduled delivery" });
    await expect(scheduleDialog).toBeVisible();
    await scheduleDialog.getByRole("button", { name: "Close" }).click();

    await page.getByRole("button", { name: "Cancel" }).last().click();
    const cancelDialog = page.getByRole("dialog", { name: "Cancel delivery" });
    await expect(cancelDialog).toBeVisible();
    await cancelDialog.getByRole("button", { name: "Keep order" }).click();

    await page.goto("/deliveries", { waitUntil: "networkidle" });
    await page.getByLabel("Open delivery notifications").click();
    await expect(page).toHaveURL(/\/deliveries\/notifications$/);

    await page.goto("/deliveries", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "View all" }).click();
    await expect(page).toHaveURL(/\/history\/all$/);

    runtime.assertClean();
  });
});

test.describe("Delivery Sign-off • Visual and consistency checks", () => {
  test("tracking maps are consistent and no render loops appear", async ({ page }) => {
    const runtime = monitorRuntime(page);
    const heights: number[] = [];

    for (const id of ["DLV-2026-04-10-101", "DLV-2026-04-10-102", "DLV-2026-04-09-088"]) {
      await page.goto(`/deliveries/tracking/${id}`, { waitUntil: "networkidle" });
      const mapShell = page.locator('[data-map-shell="true"]').first();
      await expect(mapShell).toBeVisible();
      await expect(page.getByRole("button", { name: "Back" }).first()).toBeVisible();
      await expect(page.getByText(/^ETA /).first()).toBeVisible();
      for (const tab of ["Overview", "Courier", "Proof", "Receipt", "Support"]) {
        await expect(page.getByRole("tab", { name: tab })).toBeVisible();
      }

      const height = await mapShell.evaluate((node) => Math.round(node.getBoundingClientRect().height));
      heights.push(height);
    }

    const minHeight = Math.min(...heights);
    const maxHeight = Math.max(...heights);
    expect(maxHeight - minHeight).toBeLessThanOrEqual(2);

    runtime.assertClean();
  });

  test("core state coverage is available", async ({ page }) => {
    const runtime = monitorRuntime(page);

    await page.goto("/deliveries/tracking/DOES-NOT-EXIST", { waitUntil: "networkidle" });
    await expect(page.getByText("Order unavailable")).toBeVisible();

    await page.goto("/deliveries/tracking/DLV-2026-04-09-088", { waitUntil: "networkidle" });
    await expect(page.getByText("Delivered").first()).toBeVisible();
    await expect(page.getByText("Closed").first()).toBeVisible();

    await page.goto("/deliveries/tracking/DLV-2026-04-10-102?tab=proof", { waitUntil: "networkidle" });
    await expect(page.getByText("Proof is pending.", { exact: false })).toBeVisible();

    await page.goto("/deliveries/tracking/DLV-2026-04-10-102?tab=receipt", { waitUntil: "networkidle" });
    await expect(page.getByText("Receipt is pending", { exact: false })).toBeVisible();

    runtime.assertClean();
  });
});
