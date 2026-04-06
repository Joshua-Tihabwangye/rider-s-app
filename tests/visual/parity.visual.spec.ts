import { expect, test, type Page } from "@playwright/test";

type ThemeMode = "light" | "dark";

interface RouteCase {
  id: string;
  path: string;
  readySelector: string;
}

const VISUAL_ROUTES: RouteCase[] = [
  { id: "home", path: "/home", readySelector: 'text="EVzone services"' },
  { id: "more", path: "/more", readySelector: 'text="Account & history"' },
  { id: "settings", path: "/settings", readySelector: 'text="Security controls"' },
  { id: "rides-enter", path: "/rides/enter", readySelector: 'input[placeholder="Where to?"]' },
  { id: "rides-enter-map", path: "/rides/enter/map", readySelector: 'text="Pick Your Destination"' },
  { id: "trip-active", path: "/rides/trip", readySelector: 'text="Trip Info"' },
  { id: "trip-details", path: "/rides/trip/details", readySelector: 'text="Trip Info"' },
  { id: "trip-route", path: "/rides/trip/route", readySelector: 'text="Trip Info"' },
  { id: "trip-searching", path: "/rides/searching", readySelector: "text=Searching" },
  { id: "trip-driver-on-way", path: "/rides/driver-on-way", readySelector: 'text="Tim Smith"' }
];

interface MapSmokeRoute {
  id: string;
  path: string;
  readySelector: string;
  expected?: {
    type: "fixed" | "ratio";
    value: number;
    tolerance: number;
  };
}

const MAP_SMOKE_ROUTES: MapSmokeRoute[] = [
  {
    id: "rides-enter-map-preview",
    path: "/rides/enter",
    readySelector: 'input[placeholder="Where to?"]',
    expected: { type: "fixed", value: 176, tolerance: 36 }
  },
  {
    id: "trip-active-map",
    path: "/rides/trip",
    readySelector: 'text="Trip Info"',
    expected: { type: "ratio", value: 0.5, tolerance: 0.08 }
  },
  {
    id: "trip-details-map",
    path: "/rides/trip/details",
    readySelector: 'text="Trip Info"',
    expected: { type: "ratio", value: 0.5, tolerance: 0.08 }
  },
  {
    id: "trip-route-map",
    path: "/rides/trip/route",
    readySelector: 'text="Trip Info"',
    expected: { type: "ratio", value: 0.5, tolerance: 0.08 }
  },
  {
    id: "trip-searching-map",
    path: "/rides/searching",
    readySelector: "text=Searching",
    expected: { type: "ratio", value: 0.4, tolerance: 0.08 }
  },
  {
    id: "trip-driver-on-way-map",
    path: "/rides/driver-on-way",
    readySelector: 'text="Tim Smith"',
    expected: { type: "ratio", value: 0.45, tolerance: 0.08 }
  },
  {
    id: "rides-enter-map-full",
    path: "/rides/enter/map",
    readySelector: 'text="Pick Your Destination"'
  }
];

const THEMES: ThemeMode[] = ["light", "dark"];

async function gotoWithTheme(page: Page, path: string, mode: ThemeMode): Promise<void> {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];

  page.removeAllListeners("console");
  page.removeAllListeners("pageerror");
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(msg.text());
    }
  });
  page.on("pageerror", (error) => {
    pageErrors.push(error.message);
  });

  await page.addInitScript((theme: ThemeMode) => {
    window.localStorage.setItem("themeMode", theme);
  }, mode);

  await page.goto(path, { waitUntil: "networkidle" });
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        caret-color: transparent !important;
      }
    `
  });

  await page.waitForTimeout(400);

  const rootChildren = await page.evaluate(() => document.getElementById("root")?.childElementCount ?? 0);
  if (rootChildren === 0) {
    throw new Error(
      `App did not mount for ${path}. pageErrors=${JSON.stringify(pageErrors)} consoleErrors=${JSON.stringify(consoleErrors)}`
    );
  }
}

test.describe("Visual parity snapshots", () => {
  for (const mode of THEMES) {
    for (const route of VISUAL_ROUTES) {
      test(`${route.id} (${mode})`, async ({ page }) => {
        await gotoWithTheme(page, route.path, mode);
        await expect(page.locator(route.readySelector).first()).toBeVisible({ timeout: 20_000 });
        await expect(page).toHaveScreenshot(`${route.id}-${mode}.png`, {
          fullPage: true,
          maxDiffPixelRatio: 0.02
        });
      });
    }
  }
});

test.describe("Map behavior smoke checks", () => {
  for (const route of MAP_SMOKE_ROUTES) {
    test(`${route.id} controls + sizing`, async ({ page }) => {
      await gotoWithTheme(page, route.path, "light");
      await expect(page.locator(route.readySelector).first()).toBeVisible({ timeout: 20_000 });

      const zoomIn = page.getByLabel("Map Zoom In").first();
      const zoomOut = page.getByLabel("Map Zoom Out").first();
      const layer = page.getByLabel("Map Layer").first();
      const bearing = page.getByLabel("Map Bearing").first();
      const recenter = page.getByLabel("Map Recenter").first();

      await expect(zoomIn).toBeVisible();
      await expect(zoomOut).toBeVisible();
      await expect(layer).toBeVisible();
      await expect(bearing).toBeVisible();
      await expect(recenter).toBeVisible();

      await zoomIn.click({ force: true });
      await zoomOut.click({ force: true });
      await layer.click({ force: true });
      await bearing.click({ force: true });
      await recenter.click({ force: true });

      const mapMetrics = await page.evaluate(() => {
        const zoom = document.querySelector('button[aria-label="Map Zoom In"]') as HTMLElement | null;
        if (!zoom) {
          return null;
        }

        let current: HTMLElement | null = zoom;
        while (current) {
          const style = window.getComputedStyle(current);
          const rect = current.getBoundingClientRect();
          const likelyMapRoot =
            style.position === "relative" &&
            (style.overflow === "hidden" || style.overflowX === "hidden" || style.overflowY === "hidden") &&
            rect.width >= window.innerWidth * 0.8 &&
            rect.height >= 120;

          if (likelyMapRoot) {
            return { height: rect.height, viewportHeight: window.innerHeight };
          }

          current = current.parentElement;
        }

        return null;
      });

      expect(mapMetrics).not.toBeNull();

      if (route.expected) {
        const mapHeight = mapMetrics?.height ?? 0;
        const viewportHeight = mapMetrics?.viewportHeight ?? 0;

        if (route.expected.type === "fixed") {
          const min = route.expected.value - route.expected.tolerance;
          const max = route.expected.value + route.expected.tolerance;
          expect(mapHeight).toBeGreaterThanOrEqual(min);
          expect(mapHeight).toBeLessThanOrEqual(max);
        } else {
          const ratio = viewportHeight > 0 ? mapHeight / viewportHeight : 0;
          const min = route.expected.value - route.expected.tolerance;
          const max = route.expected.value + route.expected.tolerance;
          expect(ratio).toBeGreaterThanOrEqual(min);
          expect(ratio).toBeLessThanOrEqual(max);
        }
      }
    });
  }
});
