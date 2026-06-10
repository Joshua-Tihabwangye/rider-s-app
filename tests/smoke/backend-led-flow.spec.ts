import { expect, test, type Page } from "@playwright/test";

const BACKEND_BASE_URL = (process.env.SMOKE_BACKEND_BASE_URL || "http://127.0.0.1:3000/api/v1").replace(/\/+$/, "");
const PASSWORD = "SmokePass123!";

type AuthResult = {
  accessToken: string;
  refreshToken: string;
  user: { id: string; email: string; roles: string[] };
};

type TripRecord = {
  id: string;
  status: string;
  type: string;
  otpCode?: string;
};

type DeliveryRecord = {
  id: string;
  status: string;
  routeId?: string;
};

async function request<T = unknown>(
  path: string,
  options: {
    method?: string;
    token?: string;
    appId?: string;
    body?: unknown;
  } = {},
): Promise<T> {
  const response = await fetch(`${BACKEND_BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      ...(options.appId ? { "X-App-Id": options.appId } : {}),
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  const raw = await response.text();
  const parsed = raw ? JSON.parse(raw) : null;
  const data = parsed && typeof parsed === "object" && "data" in parsed ? (parsed as { data: T }).data : (parsed as T);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${options.method ?? "GET"} ${path}: ${raw}`);
  }

  return data;
}

function uniqueEmail(prefix: string): string {
  return `${prefix}.${Date.now()}.${Math.floor(Math.random() * 10000)}@example.com`;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function registerUser(appId: "rider" | "driver", emailPrefix: string, roles: Array<"rider" | "driver">): Promise<{
  email: string;
  accessToken: string;
}> {
  const email = uniqueEmail(emailPrefix);
  const auth = await request<AuthResult>("/auth/register", {
    method: "POST",
    appId,
    body: {
      email,
      password: PASSWORD,
      phone: "+256700000000",
      fullName: emailPrefix,
      roles,
      riderProfile:
        appId === "rider"
          ? {
              fullName: emailPrefix,
              phone: "+256700000000",
              city: "Kampala",
              country: "Uganda",
              preferredCurrency: "UGX",
            }
          : undefined,
    },
  });

  return {
    email,
    accessToken: auth.accessToken,
  };
}

async function signInRider(page: Page, email: string): Promise<void> {
  await page.goto("/auth/sign-in", { waitUntil: "networkidle" });
  await page.locator("#signin-email").fill(email);
  await page.locator("#signin-password").fill(PASSWORD);
  await page.getByRole("button", { name: /^sign in$/i }).click();
  await page.waitForURL(/\/home$/, { timeout: 30_000 });
  await expect(page.getByText("EVzone services").first()).toBeVisible({ timeout: 30_000 });
}

async function requestRideThroughUi(page: Page): Promise<void> {
  await page.goto("/rides/enter", { waitUntil: "networkidle" });
  await expect(page.getByRole("button", { name: /book now/i })).toBeVisible();
  await page.getByRole("button", { name: /book now/i }).click();

  const form = page.locator(".ride-enter-details-form");
  await expect(form.getByRole("textbox").nth(0)).toBeVisible({ timeout: 20_000 });
  await form.getByRole("textbox").nth(0).fill("Kampala Road");
  const destinationInput = page.getByPlaceholder("Enter drop-off location");
  await destinationInput.fill("Arena");
  await expect(page.getByRole("option", { name: /Arena, Kampala, Central Region, Uganda/i })).toBeVisible({ timeout: 20_000 });
  await page.getByRole("option", { name: /Arena, Kampala, Central Region, Uganda/i }).click();
  await expect(destinationInput).toHaveValue(/Arena, Kampala, Central Region, Uganda/i);
  await page.getByRole("button", { name: /continue to options/i }).click();
  await page.waitForURL(/\/rides\/searching$/, { timeout: 30_000 });
  await expect(page.getByText(/searching for driver/i).first()).toBeVisible({ timeout: 30_000 });
}

async function waitForTrip(token: string, expectedType: string): Promise<TripRecord> {
  const startedAt = Date.now();
  while (Date.now() - startedAt < 45_000) {
    const active = await request<TripRecord | null>("/riders/me/trips/active", {
      token,
      appId: "rider",
    });
    if (active?.type === expectedType) {
      return active;
    }
    await delay(1500);
  }

  throw new Error(`Timed out waiting for active ${expectedType} trip`);
}

test.describe("backend-led smoke flow", () => {
  test("ride, delivery, and shared workflows update the rider UI", async ({ page }) => {
    const rider = await registerUser("rider", "smoke.rider", ["rider"]);
    const driver = await registerUser("driver", "smoke.driver", ["driver"]);

    await signInRider(page, rider.email);
    await requestRideThroughUi(page);

    const ride = await waitForTrip(rider.accessToken, "ride");
    expect(ride.id).toBeTruthy();

    const rideJobs = await request<Array<{ id: string; type: string; status: string }>>("/drivers/me/jobs", {
      token: driver.accessToken,
      appId: "driver",
    });
    expect(rideJobs.length).toBeGreaterThan(0);
    const rideJobId = rideJobs[0].id;

    await request(`/drivers/me/jobs/${rideJobId}/accept`, {
      method: "POST",
      token: driver.accessToken,
      appId: "driver",
    });
    await page.waitForURL(/\/rides\/driver-on-way$/, { timeout: 30_000 });

    await request(`/drivers/me/trips/${ride.id}/arrive`, {
      method: "POST",
      token: driver.accessToken,
      appId: "driver",
    });
    await page.waitForURL(/\/rides\/driver-arrived$/, { timeout: 30_000 });
    if (ride.otpCode) {
      await request(`/drivers/me/trips/${ride.id}/verify-rider`, {
        method: "POST",
        token: driver.accessToken,
        appId: "driver",
        body: { otp: ride.otpCode },
      });
    }
    await request(`/drivers/me/trips/${ride.id}/start`, {
      method: "POST",
      token: driver.accessToken,
      appId: "driver",
    });
    await page.waitForURL(/\/rides\/trip$/, { timeout: 30_000 });
    await request(`/drivers/me/trips/${ride.id}/complete`, {
      method: "POST",
      token: driver.accessToken,
      appId: "driver",
    });

    await page.waitForURL(/\/rides\/trip\/completed$/, { timeout: 30_000 });
    await expect(page.getByText("Trip Completed").first()).toBeVisible({ timeout: 30_000 });
    await expect(page.getByText("Final summary").first()).toBeVisible();

    const delivery = await request<DeliveryRecord>("/riders/me/deliveries", {
      method: "POST",
      token: rider.accessToken,
      appId: "rider",
      body: {
        pickupAddress: "Nakasero",
        dropoffAddress: "Ntinda",
        pickupLat: 0.3136,
        pickupLng: 32.5811,
        dropoffLat: 0.3572,
        dropoffLng: 32.6148,
        itemDescription: "Smoke parcel",
      },
    });
    expect(delivery.id).toBeTruthy();

    const deliveryOrders = await request<Array<{ id: string; status: string; routeId?: string }>>("/drivers/me/delivery/orders", {
      token: driver.accessToken,
      appId: "driver",
    });
    expect(deliveryOrders.some((order) => order.id === delivery.id)).toBe(true);

    const deliveryRouteId = deliveryOrders.find((order) => order.id === delivery.id)?.routeId ?? delivery.routeId ?? "";
    expect(deliveryRouteId).toBeTruthy();

    await request(`/drivers/me/delivery/orders/${delivery.id}/accept`, {
      method: "POST",
      token: driver.accessToken,
      appId: "driver",
    });
    await request(`/drivers/me/delivery/routes/${deliveryRouteId}/pickup-confirm`, {
      method: "POST",
      token: driver.accessToken,
      appId: "driver",
    });
    await request(`/drivers/me/delivery/routes/${deliveryRouteId}/qr-verify`, {
      method: "POST",
      token: driver.accessToken,
      appId: "driver",
      body: { qrValue: "QR-OK-1234" },
    });
    await request(`/drivers/me/delivery/routes/${deliveryRouteId}/start`, {
      method: "POST",
      token: driver.accessToken,
      appId: "driver",
    });
    const deliveryRoute = await request<{ stops: Array<{ id: string }> }>(`/drivers/me/delivery/routes/${deliveryRouteId}`, {
      token: driver.accessToken,
      appId: "driver",
    });
    for (const stop of deliveryRoute.stops) {
      await request(`/drivers/me/delivery/routes/${deliveryRouteId}/stops/${stop.id}/complete`, {
        method: "POST",
        token: driver.accessToken,
        appId: "driver",
      });
    }
    await request(`/drivers/me/delivery/routes/${deliveryRouteId}/dropoff-complete`, {
      method: "POST",
      token: driver.accessToken,
      appId: "driver",
    });

    await page.goto(`/deliveries/tracking/${delivery.id}`, { waitUntil: "networkidle" });
    await expect(page.getByText("Status timeline").first()).toBeVisible({ timeout: 30_000 });
    await expect(page.getByText("Delivered").first()).toBeVisible({ timeout: 30_000 });

    const sharedRide = await request<{ trip: TripRecord }>(
      "/riders/me/trips/request",
      {
        method: "POST",
        token: rider.accessToken,
        appId: "rider",
        body: {
          type: "shared",
          pickupLabel: "Acacia Mall",
          pickupAddress: "Acacia Mall",
          pickupLat: 0.332,
          pickupLng: 32.579,
          dropoffLabel: "Bugolobi",
          dropoffAddress: "Bugolobi",
          dropoffLat: 0.3405,
          dropoffLng: 32.6121,
          routeSummary: "Acacia Mall → Bugolobi",
        },
      },
    );
    expect(sharedRide.trip.id).toBeTruthy();
    expect(sharedRide.trip.type).toBe("shared");

    const sharedJobs = await request<Array<{ id: string; type: string; status: string }>>("/drivers/me/jobs", {
      token: driver.accessToken,
      appId: "driver",
    });
    const sharedJob = sharedJobs.find((job) => job.type === "shared") ?? sharedJobs[0];
    if (!sharedJob) {
      throw new Error("No shared job was returned for the smoke flow");
    }

    await request(`/drivers/me/jobs/${sharedJob.id}/accept`, {
      method: "POST",
      token: driver.accessToken,
      appId: "driver",
    });
    await request(`/drivers/me/trips/${sharedRide.trip.id}/arrive`, {
      method: "POST",
      token: driver.accessToken,
      appId: "driver",
    });
    await request(`/drivers/me/trips/${sharedRide.trip.id}/start`, {
      method: "POST",
      token: driver.accessToken,
      appId: "driver",
    });
    await request(`/drivers/me/trips/${sharedRide.trip.id}/complete`, {
      method: "POST",
      token: driver.accessToken,
      appId: "driver",
    });

    await page.goto("/rides/trip/completed", { waitUntil: "networkidle" });
    await expect(page.getByText("Trip Completed").first()).toBeVisible({ timeout: 30_000 });
    await expect(page.getByText("Final summary").first()).toBeVisible();
  });
});
