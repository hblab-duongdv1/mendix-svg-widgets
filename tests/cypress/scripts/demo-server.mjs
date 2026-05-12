#!/usr/bin/env node
/**
 * Builds the chart demo bundle and serves cypress/test-app.
 * From repo root: node cypress/scripts/demo-server.mjs
 * Port: CYPRESS_DEMO_PORT or 8765 (http://127.0.0.1)
 */
import * as esbuild from "esbuild";
import { createReadStream, existsSync, mkdirSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "../..");
const appDir = join(root, "cypress/test-app");
const distDir = join(appDir, "dist");
const bundlePath = join(distDir, "bundle.js");
const port = Number(process.env.CYPRESS_DEMO_PORT || 8765);
const host = "127.0.0.1";

async function buildBundle() {
    mkdirSync(distDir, { recursive: true });
    await esbuild.build({
        absWorkingDir: root,
        entryPoints: [join(appDir, "entry.ts")],
        bundle: true,
        outfile: bundlePath,
        format: "iife",
        platform: "browser",
        target: ["es2019"],
        logLevel: "silent"
    });
}

function contentType(filePath) {
    switch (extname(filePath)) {
        case ".html":
            return "text/html; charset=utf-8";
        case ".js":
            return "text/javascript; charset=utf-8";
        default:
            return "application/octet-stream";
    }
}

function safeFilePath(pathname) {
    const relative = pathname.replace(/^\//, "") || "index.html";
    if (relative.includes("..") || relative.includes("\\")) {
        return null;
    }
    return join(appDir, relative);
}

async function handleRequest(req, res) {
    const url = new URL(req.url || "/", `http://${host}`);
    let pathname = url.pathname === "/" ? "/index.html" : url.pathname;
    const filePath = safeFilePath(pathname);
    if (!filePath || !filePath.startsWith(appDir)) {
        res.writeHead(403).end();
        return;
    }
    if (pathname === "/index.html" || extname(pathname) === ".html") {
        if (!existsSync(filePath)) {
            res.writeHead(404).end("Not found");
            return;
        }
        const body = await readFile(filePath);
        res.writeHead(200, { "Content-Type": contentType(filePath) });
        res.end(body);
        return;
    }
    if (pathname === "/dist/bundle.js") {
        if (!existsSync(bundlePath)) {
            res.writeHead(503).end("Run build first (bundle missing)");
            return;
        }
        res.writeHead(200, { "Content-Type": "text/javascript; charset=utf-8" });
        createReadStream(bundlePath).pipe(res);
        return;
    }
    res.writeHead(404).end("Not found");
}

async function main() {
    await buildBundle();
    const server = createServer((req, res) => {
        handleRequest(req, res).catch(err => {
            console.error(err);
            if (!res.headersSent) {
                res.writeHead(500).end("Server error");
            }
        });
    });
    await new Promise((resolve, reject) => {
        server.listen(port, host, resolve);
        server.on("error", reject);
    });
    const url = `http://${host}:${port}`;
    console.log(`Chart demo server listening at ${url}`);
    return server;
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
