#!/usr/bin/env node

import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const riderRoot = fileURLToPath(new URL("..", import.meta.url));
const backendRoot = path.resolve(riderRoot, "../backend");

const backendPort = Number(process.env.SMOKE_BACKEND_PORT || 3000);
const riderPort = Number(process.env.SMOKE_RIDER_PORT || 4178);
const riderBaseUrl = `http://127.0.0.1:${riderPort}`;
const backendBaseUrl = `http://127.0.0.1:${backendPort}/api/v1`;

function spawnProcess(command, args, options = {}) {
  const child = spawn(command, args, {
    cwd: options.cwd,
    env: options.env,
    stdio: ["ignore", "inherit", "inherit"],
    shell: false,
  });

  child.on("exit", (code, signal) => {
    if (signal) {
      process.exitCode = 1;
      console.error(`[smoke] ${command} ${args.join(" ")} exited via ${signal}`);
    } else if (code && code !== 0) {
      process.exitCode = code;
      console.error(`[smoke] ${command} ${args.join(" ")} exited with ${code}`);
    }
  });

  return child;
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function waitFor(url, label, timeoutMs = 240_000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok || response.status === 404) {
        return;
      }
    } catch {
      // Keep polling until the target is ready.
    }
    await delay(1000);
  }

  throw new Error(`Timed out waiting for ${label} at ${url}`);
}

async function main() {
  const build = spawnProcess("npm", ["run", "build"], {
    cwd: riderRoot,
    env: {
      ...process.env,
      VITE_BACKEND_BASE_URL: backendBaseUrl,
      VITE_BACKEND_ENABLED: "true",
      VITE_USE_BACKEND: "true",
      VITE_FRONTEND_ONLY_MODE: "false",
      VITE_ALLOW_DEV_AUTH_FALLBACK: "false",
    },
  });

  await new Promise((resolve, reject) => {
    build.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`Rider build failed with exit code ${code ?? "unknown"}`));
    });
  });

  const backend = spawnProcess("npm", ["run", "start:dev"], {
    cwd: backendRoot,
    env: {
      ...process.env,
      PORT: String(backendPort),
      KAFKA_DISABLED: "true",
      CORS_ORIGINS: riderBaseUrl,
      SOCKET_CORS_ORIGINS: riderBaseUrl,
    },
  });

  const rider = spawnProcess("npm", ["run", "preview", "--", "--host", "127.0.0.1", "--port", String(riderPort)], {
    cwd: riderRoot,
    env: {
      ...process.env,
      VITE_BACKEND_BASE_URL: backendBaseUrl,
      VITE_BACKEND_ENABLED: "true",
      VITE_USE_BACKEND: "true",
      VITE_FRONTEND_ONLY_MODE: "false",
      VITE_ALLOW_DEV_AUTH_FALLBACK: "false",
    },
  });

  const shutdown = () => {
    backend.kill("SIGTERM");
    rider.kill("SIGTERM");
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
  process.on("exit", shutdown);

  await waitFor(`${backendBaseUrl}/health`, "backend health");
  await waitFor(`${riderBaseUrl}/home`, "rider preview");

  // Keep the webServer process alive for Playwright.
  await new Promise(() => {});
}

main().catch((error) => {
  console.error("[smoke] failed", error instanceof Error ? error.message : error);
  process.exit(1);
});
