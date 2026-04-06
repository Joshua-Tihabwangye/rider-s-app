import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

const CORE_TAB_SCREENS = [
  "src/screens/Home.tsx",
  "src/screens/RidesDashboard.tsx",
  "src/screens/DeliveriesDashboard.tsx",
  "src/screens/Wallet.tsx",
  "src/screens/MoreMenu.tsx"
];

const TOKEN_STRICT_FILES = [
  "src/screens/Home.tsx",
  "src/screens/DeliveriesDashboard.tsx",
  "src/screens/MoreMenu.tsx",
  "src/components/deliveries/DeliveryCard.tsx"
];

const CARD_PRIMITIVE_STRICT_SCREENS = [
  "src/screens/Home.tsx",
  "src/screens/DeliveriesDashboard.tsx",
  "src/screens/MoreMenu.tsx"
];

const violations = [];

function readFile(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), "utf8");
}

function addViolation(file, message) {
  violations.push({ file, message });
}

function checkScreenScaffold() {
  for (const file of CORE_TAB_SCREENS) {
    const content = readFile(file);
    if (!content.includes("<ScreenScaffold")) {
      addViolation(file, "Core tab screen must render inside ScreenScaffold.");
    }
  }
}

function checkShellWidthContract() {
  const file = "src/components/MobileShell.tsx";
  const content = readFile(file);

  if (!content.includes('md: "768px"') || !content.includes('lg: "1024px"')) {
    addViolation(file, "Mobile shell width band must stay at md:768px and lg:1024px.");
  }

  if (!content.includes("maxWidth: CONTENT_MAX_WIDTH")) {
    addViolation(file, "Mobile shell content must be constrained by CONTENT_MAX_WIDTH.");
  }
}

function checkSingleScrollOwnerContract() {
  const fixedStickyPattern = /position:\s*["'](?:fixed|sticky)["']/g;
  const overflowYAutoPattern = /overflowY:\s*["']auto["']/g;
  const overflowAutoPattern = /overflow:\s*["'](?:auto|scroll)["']/g;

  for (const file of CORE_TAB_SCREENS) {
    const content = readFile(file);
    if (fixedStickyPattern.test(content)) {
      addViolation(file, "Do not use local fixed/sticky blocks on core tab screens.");
    }
    if (overflowYAutoPattern.test(content) || overflowAutoPattern.test(content)) {
      addViolation(file, "Do not add per-screen vertical scroll owners on core tab screens.");
    }
  }
}

function checkTokenColorUsage() {
  const colorLiteralPattern = /#[0-9A-Fa-f]{3,8}\b|rgba?\s*\(/g;

  for (const file of TOKEN_STRICT_FILES) {
    const content = readFile(file);
    if (colorLiteralPattern.test(content)) {
      addViolation(file, "Hardcoded color literals are not allowed here. Use uiTokens.");
    }
  }
}

function checkSpacingScaleUsage() {
  const spacingPattern =
    /\b(?:m|mt|mb|ml|mr|mx|my|p|pt|pb|pl|pr|px|py|gap|rowGap|columnGap):\s*([0-9]*\.?[0-9]+)/g;

  for (const file of TOKEN_STRICT_FILES) {
    const content = readFile(file);
    for (const match of content.matchAll(spacingPattern)) {
      const rawValue = match[1];
      const value = rawValue ? Number(rawValue) : 0;
      if (Number.isFinite(value) && value >= 1) {
        addViolation(
          file,
          `Direct spacing literal "${rawValue}" detected. Use uiTokens.spacing.* for layout spacing.`
        );
      }
    }
  }
}

function checkPrimitiveAdoption() {
  const primitiveImportPattern = /components\/primitives\//;

  for (const file of CORE_TAB_SCREENS) {
    const content = readFile(file);
    if (!primitiveImportPattern.test(content)) {
      addViolation(file, "Core tab screen must use shared primitives from src/components/primitives.");
    }
  }

  for (const file of CARD_PRIMITIVE_STRICT_SCREENS) {
    const content = readFile(file);
    if (/<Card[\s>]/.test(content)) {
      addViolation(file, "Use AppCard/InfoCard primitives instead of raw MUI Card for common cards.");
    }
  }
}

checkScreenScaffold();
checkShellWidthContract();
checkSingleScrollOwnerContract();
checkTokenColorUsage();
checkSpacingScaleUsage();
checkPrimitiveAdoption();

if (violations.length > 0) {
  console.error("Design guardrails failed:\n");
  for (const violation of violations) {
    console.error(`- ${violation.file}: ${violation.message}`);
  }
  process.exit(1);
}

console.log("Design guardrails passed.");
