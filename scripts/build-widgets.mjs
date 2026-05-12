#!/usr/bin/env node
/**
 * Runs `npm run build -w <name>` only for workspaces whose package.json "version"
 * differs from the last successful build recorded in .build-widget-versions.json.
 *
 * - No state file (e.g. fresh clone): builds every workspace that defines a "build" script.
 * - Use FORCE_BUILD_ALL=1, npm run build -- --all, or npm run build:all to build everything.
 */

import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { spawnSync } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const statePath = join(root, ".build-widget-versions.json");

const WORKSPACE_ROOTS = ["shared", "widgets/charts"];

function readPackageJson(dir) {
    const path = join(dir, "package.json");
    if (!existsSync(path)) {
        return null;
    }
    try {
        return JSON.parse(readFileSync(path, "utf8"));
    } catch {
        return null;
    }
}

function listBuildableWorkspaces() {
    const out = [];
    for (const rel of WORKSPACE_ROOTS) {
        const base = join(root, rel);
        if (!existsSync(base)) {
            continue;
        }
        for (const name of readdirSync(base)) {
            const dir = join(base, name);
            if (!statSync(dir).isDirectory()) {
                continue;
            }
            const pkg = readPackageJson(dir);
            if (!pkg?.name || !pkg.version || typeof pkg.scripts?.build !== "string") {
                continue;
            }
            out.push({ name: pkg.name, version: pkg.version, dir });
        }
    }
    return out.sort((a, b) => {
        if (a.name === "@mendix-svg/svg-engine") {
            return -1;
        }
        if (b.name === "@mendix-svg/svg-engine") {
            return 1;
        }
        return a.name.localeCompare(b.name);
    });
}

function loadState() {
    if (!existsSync(statePath)) {
        return {};
    }
    try {
        return JSON.parse(readFileSync(statePath, "utf8"));
    } catch {
        return {};
    }
}

function saveState(versionsByName) {
    writeFileSync(statePath, `${JSON.stringify(versionsByName, null, 2)}\n`);
}

function runBuild(workspaceName) {
    const r = spawnSync("npm", ["run", "build", "-w", workspaceName], {
        cwd: root,
        stdio: "inherit",
        shell: process.platform === "win32"
    });
    if (r.status !== 0) {
        process.exit(r.status ?? 1);
    }
}

const forceAll =
    process.env.FORCE_BUILD_ALL === "1" || process.env.FORCE_BUILD_ALL === "true" || process.argv.includes("--all");

const packages = listBuildableWorkspaces();
if (packages.length === 0) {
    console.error("build: no workspaces with a build script found.");
    process.exit(1);
}

const previous = loadState();
const toBuild = forceAll ? packages.slice() : packages.filter(p => previous[p.name] !== p.version);

if (toBuild.length === 0) {
    console.log(
        "build: skipped — no package.json version changes under shared/* or widgets/charts/* (use FORCE_BUILD_ALL=1 or npm run build:all to build everything)."
    );
    process.exit(0);
}

console.log(
    `build: ${forceAll ? "forced — " : ""}building ${toBuild.length} workspace(s): ${toBuild
        .map(p => `${p.name}@${p.version}`)
        .join(", ")}`
);

for (const p of toBuild) {
    runBuild(p.name);
}

const next = {};
for (const p of packages) {
    next[p.name] = p.version;
}
saveState(next);
console.log(`build: wrote ${statePath}`);
