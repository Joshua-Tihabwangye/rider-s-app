import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

function read(filePath) {
  return fs.readFileSync(path.join(ROOT, filePath), "utf8");
}

function exists(filePath) {
  return fs.existsSync(path.join(ROOT, filePath));
}

const requiredScreens = [
  "src/screens/DeliveryDashboard.tsx",
  "src/screens/DeliveryNew.tsx",
  "src/screens/DeliveryTracking.tsx",
  "src/screens/DeliveryNotifications.tsx",
  "src/screens/DeliveryRating.tsx",
  "src/screens/DeliverySettlement.tsx"
];

const forbiddenLegacyScreens = [
  "src/screens/DeliveryCancel.tsx",
  "src/screens/DeliveryDelivered.tsx",
  "src/screens/DeliveryDetails.tsx",
  "src/screens/DeliveryDriver.tsx",
  "src/screens/DeliveryEnRoute.tsx",
  "src/screens/DeliveryInvitations.tsx",
  "src/screens/DeliveryInvitationsV2.tsx",
  "src/screens/DeliveryLiveTracking.tsx",
  "src/screens/DeliveryPickupConfirmed.tsx",
  "src/screens/DeliveryReceived.tsx",
  "src/screens/DeliveryReceivedUnified.tsx",
  "src/screens/DeliveryReceivedV2.tsx",
  "src/screens/DeliveryReceivedV3.tsx",
  "src/screens/DeliveryTimeline.tsx",
  "src/screens/DeliveryTrackingIncoming.tsx",
  "src/screens/DeliveryTrackingReceived.tsx",
  "src/screens/DeliveringDashboard.tsx",
  "src/screens/DeliveringV2.tsx"
];

const requiredRouteSnippets = [
  'import DeliveryNew from "../screens/DeliveryNew";',
  'import DeliveryTracking from "../screens/DeliveryTracking";',
  'import DeliverySettlement from "../screens/DeliverySettlement";',
  'import DeliveryDashboard from "../screens/DeliveryDashboard";',
  '<Route index element={<DeliveryDashboard />} />',
  '<Route path="notifications" element={<DeliveryNotifications />} />',
  '<Route path="new" element={<DeliveryNew />} />',
  '<Route path="tracking/:orderId" element={<DeliveryTracking />} />',
  '<Route path="rating/:orderId" element={<DeliveryRating />} />',
  '<Route path="settlement/:orderId" element={<DeliverySettlement />} />'
];

const forbiddenRouteTokens = [
  "DeliveryCreate",
  "DeliveryTrackingRealtime",
  "DeliveryPaymentSettlement",
  "DeliveriesDashboard",
  "/deliveries/received",
  "/deliveries/details",
  "/deliveries/driver",
  "/deliveries/incoming",
  "/deliveries/v2",
  "/deliveries/v3"
];

const checks = [];

function addCheck(name, pass, details = "") {
  checks.push({ name, pass, details });
}

for (const file of requiredScreens) {
  addCheck(`Required screen exists: ${file}`, exists(file));
}

for (const file of forbiddenLegacyScreens) {
  addCheck(`Legacy screen removed: ${file}`, !exists(file));
}

const routeSource = read("src/routes/index.tsx");
for (const snippet of requiredRouteSnippets) {
  addCheck(`Route wiring contains: ${snippet}`, routeSource.includes(snippet));
}
for (const token of forbiddenRouteTokens) {
  addCheck(`Route wiring excludes legacy token: ${token}`, !routeSource.includes(token));
}

const deliveryScreenFiles = fs
  .readdirSync(path.join(ROOT, "src/screens"))
  .filter((name) => /^(Delivery|Delivering)/.test(name))
  .sort();

const expectedDeliveryScreens = [
  "DeliveryDashboard.tsx",
  "DeliveryNew.tsx",
  "DeliveryNotifications.tsx",
  "DeliveryRating.tsx",
  "DeliverySettlement.tsx",
  "DeliveryTracking.tsx"
].sort();

addCheck(
  "Only standardized delivery screens remain",
  JSON.stringify(deliveryScreenFiles) === JSON.stringify(expectedDeliveryScreens),
  `found=${deliveryScreenFiles.join(", ")}`
);

const failed = checks.filter((item) => !item.pass);
for (const check of checks) {
  const prefix = check.pass ? "PASS" : "FAIL";
  console.log(`${prefix}: ${check.name}${check.details ? ` (${check.details})` : ""}`);
}

if (failed.length > 0) {
  console.error(`\nDelivery static gate failed (${failed.length} checks).`);
  process.exit(1);
}

console.log(`\nDelivery static gate passed (${checks.length} checks).`);
