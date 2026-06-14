import { expect, test, type Page } from "@playwright/test";

const AUTH_USER = {
  id: "usr_refresh_001",
  fullName: "Refresh Rider",
  email: "refresh.rider@example.com",
  phone: "+256 700 000 111",
  avatarUrl: null,
  provider: "email",
  role: "rider",
  initials: "RR"
};

const APP_DATA = {
  ride: {
    request: {
      origin: {
        label: "Bugolobi",
        address: "Bugolobi, Kampala",
        coordinates: { lat: 0.338, lng: 32.58 }
      },
      destination: {
        label: "Nakasero",
        address: "Nakasero Rd, Kampala",
        coordinates: { lat: 0.3476, lng: 32.5825 }
      },
      stops: [],
      routeMode: "single_stop",
      routePoints: [
        {
          label: "Bugolobi",
          address: "Bugolobi, Kampala",
          coordinates: { lat: 0.338, lng: 32.58 }
        },
        {
          label: "Nakasero",
          address: "Nakasero Rd, Kampala",
          coordinates: { lat: 0.3476, lng: 32.5825 }
        }
      ],
      passengers: 1,
      schedule: "now",
      scheduleTime: "",
      tripType: "One Way",
      tripMode: "one_way",
      returnToOrigin: false,
      maxStops: 6,
      roundTripConfig: {
        returnDateTime: null,
        sameDay: true,
        returnPattern: "direct"
      },
      rideType: "Personal",
      serviceLevel: "car-mini",
      serviceClass: "standard",
      riderType: "personal",
      riderContact: null,
      bookedFor: { source: "self" }
    },
    savedPlaces: [],
    options: [],
    sharing: {
      shareUrl: "",
      splitFareEnabled: false,
      invitePhone: "",
      passengers: []
    }
  },
  sharedLocationState: {
    pickupCoords: { lat: 0.338, lng: 32.58 },
    destinationCoords: { lat: 0.3476, lng: 32.5825 },
    routePolyline: [
      { lat: 0.338, lng: 32.58 },
      { lat: 0.3435, lng: 32.5813 },
      { lat: 0.3476, lng: 32.5825 }
    ],
    routeAlternativePolylines: [],
    routeDistanceKm: 4.2,
    routeDurationMin: 12,
    riderLocation: { lat: 0.338, lng: 32.58 },
    driverLocation: null,
    deliveryPickupCoords: null,
    deliveryDropoffCoords: null
  }
};

async function seedRiderSession(page: Page): Promise<void> {
  await page.addInitScript(
    ({ user, appData }) => {
      localStorage.setItem("evzone_backend_flag_rider", JSON.stringify({ enabled: false, updatedAt: Date.now() }));
      localStorage.setItem("evzone_auth_user", JSON.stringify(user));
      localStorage.setItem("evzone_auth_token", "dev_access_token_001");
      localStorage.setItem("evzone_auth_refresh_token", "dev_refresh_token_001");
      localStorage.setItem("evzone_app_data_v1", JSON.stringify(appData));
    },
    {
      user: AUTH_USER,
      appData: APP_DATA
    }
  );
}

test.describe("rider refresh behavior", () => {
  test("protected ride routes hydrate silently", async ({ page }) => {
    await seedRiderSession(page);

    await page.goto("/rides/enter", { waitUntil: "networkidle" });
    await expect(page.getByText(/Checking your session|Verifying your rider access/i)).toHaveCount(0);
    await expect(page.getByText("Book a ride")).toBeVisible();
    await expect(page.getByRole("button", { name: "Book Now" })).toBeVisible();

    await page.reload({ waitUntil: "networkidle" });
    await expect(page.getByText(/Checking your session|Verifying your rider access/i)).toHaveCount(0);
    await expect(page.getByText("Book a ride")).toBeVisible();
    await expect(page).not.toHaveURL(/\/auth\/sign-in/);
  });

  test("ride entry details survive a refresh", async ({ page }) => {
    await seedRiderSession(page);

    await page.goto("/rides/enter", { waitUntil: "networkidle" });
    await page.getByText("Airport", { exact: true }).click();
    await page.waitForURL(/\/rides\/enter\/details$/, { timeout: 30_000 });
    await expect(page.locator(".ride-enter-details-form")).toBeVisible();
    const pickupInput = page.locator(".ride-enter-details-form input").nth(0);
    const destinationInput = page.locator(".ride-enter-details-form input").nth(1);
    await expect(pickupInput).toHaveValue("Current location");
    await expect(destinationInput).toHaveValue("Entebbe International Airport, Uganda");
    await expect(page.getByText("Continue to options")).toBeVisible();

    await page.reload({ waitUntil: "networkidle" });
    await expect(page.locator(".ride-enter-details-form input").nth(0)).toHaveValue("Current location");
    await expect(page.locator(".ride-enter-details-form input").nth(1)).toHaveValue("Entebbe International Airport, Uganda");
    await expect(page.getByText("Continue to options")).toBeVisible();
    await expect(page.getByText(/Checking your session|Verifying your rider access/i)).toHaveCount(0);
  });

  test("destination entry restores the last selected location after revisit", async ({ page }) => {
    await seedRiderSession(page);

    await page.goto("/rides/enter", { waitUntil: "networkidle" });
    const destinationInput = page.getByPlaceholder("Where to?");
    await destinationInput.fill("Arena");
    await expect(page.getByRole("option", { name: /Arena, Kampala, Central Region, Uganda/i })).toBeVisible({ timeout: 20_000 });
    await page.getByRole("option", { name: /Arena, Kampala, Central Region, Uganda/i }).click();
    await page.waitForURL(/\/rides\/options$/, { timeout: 30_000 });

    await page.goto("/rides/enter", { waitUntil: "networkidle" });
    await expect(page.getByText("Where to today?")).toBeVisible();
    await expect(page.getByPlaceholder("Where to?")).toHaveValue(/Arena, Kampala, Central Region, Uganda/i);
    await expect(page.getByText(/Checking your session|Verifying your rider access/i)).toHaveCount(0);
  });

  test("ride details render without an auth loading gate", async ({ page }) => {
    await seedRiderSession(page);

    await page.goto("/rides/details", { waitUntil: "networkidle" });
    await expect(page.getByText(/Checking your session|Verifying your rider access/i)).toHaveCount(0);
    await expect(page.getByText("Review your EV ride")).toBeVisible();
    await expect(page.getByText("From", { exact: true })).toBeVisible();
    await expect(page.getByText("To", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Confirm EV ride" })).toBeVisible();
  });
});
