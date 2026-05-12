#!/usr/bin/env node
/**
 * Starts the chart demo server, waits until it responds, runs Cypress, then stops the server.
 * From repo root: node cypress/scripts/run-e2e.mjs
 */
import { spawn } from "node:child_process";
import http from "node:http";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "../..");
const port = Number(process.env.CYPRESS_DEMO_PORT || 8765);
const baseUrl = `http://127.0.0.1:${port}/`;

function waitForHttp(url, timeoutMs = 20000) {
    const deadline = Date.now() + timeoutMs;
    return new Promise((resolve, reject) => {
        function tryOnce() {
            http.get(url, res => {
                res.resume();
                resolve();
            }).on("error", () => {
                if (Date.now() > deadline) {
                    reject(new Error(`Timed out waiting for ${url}`));
                } else {
                    setTimeout(tryOnce, 250);
                }
            });
        }
        tryOnce();
    });
}

const demo = spawn(process.execPath, [join(root, "cypress/scripts/demo-server.mjs")], {
    cwd: root,
    stdio: "inherit",
    env: { ...process.env, CYPRESS_DEMO_PORT: String(port) }
});

let cypressExit = 1;

try {
    await waitForHttp(baseUrl);
    await new Promise((resolve, reject) => {
        const cy = spawn("npx", ["cypress", "run"], {
            cwd: root,
            stdio: "inherit",
            env: { ...process.env, CYPRESS_DEMO_PORT: String(port) }
        });
        cy.on("error", reject);
        cy.on("close", code => {
            cypressExit = code ?? 1;
            resolve();
        });
    });
} finally {
    demo.kill("SIGTERM");
    await new Promise(r => setTimeout(r, 500));
    if (!demo.killed) {
        demo.kill("SIGKILL");
    }
}

process.exit(cypressExit);
