import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";

const ROOT = process.cwd();
const SCREENS_DIR = path.join(ROOT, "src", "screens");
const BASELINE_PATH = path.join(ROOT, "scripts", "design-style-baseline.json");
const SHOULD_UPDATE_BASELINE = process.argv.includes("--update-baseline");

const HEX_COLOR_PATTERN = /#[0-9A-Fa-f]{3,8}\b/g;
const BORDER_RADIUS_PATTERN = /\bborderRadius\s*:\s*([^,}\n]+)/;

function walkScreens(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolutePath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkScreens(absolutePath));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith(".tsx")) {
      files.push(absolutePath);
    }
  }

  return files;
}

function normalizeLine(line) {
  return line.replace(/\s+/g, " ").trim();
}

function createKey(file, rule, lineText) {
  const fingerprint = createHash("sha1").update(`${rule}|${normalizeLine(lineText)}`).digest("hex").slice(0, 14);
  return `${rule}:${file}:${fingerprint}`;
}

function isAllowedRadius(value) {
  const normalized = value.trim();

  if (!normalized) {
    return true;
  }

  if (
    normalized.includes("uiTokens.radius") ||
    normalized.includes("theme.shape.borderRadius") ||
    normalized.includes("radiusScale") ||
    normalized.includes("var(--evz-radius")
  ) {
    return true;
  }

  // Allow perfect circles and radius inheritance patterns.
  if (
    normalized === "\"50%\"" ||
    normalized === "'50%'" ||
    normalized === "50%" ||
    normalized === "inherit" ||
    normalized === "\"inherit\"" ||
    normalized === "'inherit'"
  ) {
    return true;
  }

  return false;
}

function collectViolations() {
  const violations = [];
  const files = walkScreens(SCREENS_DIR);

  for (const absolutePath of files) {
    const relativePath = path.relative(ROOT, absolutePath).replace(/\\/g, "/");
    const content = fs.readFileSync(absolutePath, "utf8");
    const lines = content.split(/\r?\n/);

    lines.forEach((line, index) => {
      const lineNumber = index + 1;

      if (line.trimStart().startsWith("//")) {
        return;
      }

      const hexMatches = line.match(HEX_COLOR_PATTERN) ?? [];
      for (const match of hexMatches) {
        violations.push({
          key: createKey(relativePath, "hex-color", line),
          rule: "hex-color",
          file: relativePath,
          line: lineNumber,
          value: match,
          text: normalizeLine(line)
        });
      }

      const radiusMatch = line.match(BORDER_RADIUS_PATTERN);
      if (radiusMatch?.[1]) {
        const radiusValue = radiusMatch[1].trim();
        if (!isAllowedRadius(radiusValue)) {
          violations.push({
            key: createKey(relativePath, "hardcoded-radius", line),
            rule: "hardcoded-radius",
            file: relativePath,
            line: lineNumber,
            value: radiusValue,
            text: normalizeLine(line)
          });
        }
      }
    });
  }

  return violations.sort((a, b) => {
    if (a.file !== b.file) return a.file.localeCompare(b.file);
    if (a.line !== b.line) return a.line - b.line;
    return a.rule.localeCompare(b.rule);
  });
}

function loadBaseline() {
  if (!fs.existsSync(BASELINE_PATH)) {
    return { allowList: [] };
  }

  const parsed = JSON.parse(fs.readFileSync(BASELINE_PATH, "utf8"));
  if (!Array.isArray(parsed.allowList)) {
    throw new Error(`Invalid baseline format in ${BASELINE_PATH}`);
  }

  return parsed;
}

function writeBaseline(violations) {
  const allowList = [...new Set(violations.map((v) => v.key))].sort();
  const next = {
    version: 1,
    generatedAt: new Date().toISOString(),
    scope: "src/screens/**/*.tsx",
    rules: ["hex-color", "hardcoded-radius"],
    allowList
  };

  fs.writeFileSync(BASELINE_PATH, `${JSON.stringify(next, null, 2)}\n`, "utf8");
  console.log(`Updated ${path.relative(ROOT, BASELINE_PATH)} with ${allowList.length} baseline entries.`);
}

const violations = collectViolations();

if (SHOULD_UPDATE_BASELINE) {
  writeBaseline(violations);
  process.exit(0);
}

const baseline = loadBaseline();
const baselineSet = new Set(baseline.allowList);
const newViolations = violations.filter((violation) => !baselineSet.has(violation.key));

if (newViolations.length > 0) {
  console.error("Screen style lint failed: new hardcoded hex/radius detected.\n");
  for (const violation of newViolations) {
    console.error(`- ${violation.file}:${violation.line} [${violation.rule}] ${violation.value}`);
  }
  console.error("\nIf intentional, update baseline with: npm run design:lint:screens:update");
  process.exit(1);
}

console.log(
  `Screen style lint passed. Checked ${violations.length} tracked violations against baseline (${baselineSet.size} entries).`
);
