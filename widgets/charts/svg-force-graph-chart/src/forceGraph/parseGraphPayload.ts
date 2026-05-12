import type { MiserablesLink, MiserablesNode, MiserablesPayload, SimLink, SimNode } from "./types";

function asString(v: unknown): string | undefined {
    if (typeof v === "string") {
        return v;
    }
    if (typeof v === "number" && Number.isFinite(v)) {
        return String(v);
    }
    return undefined;
}

function asNumber(v: unknown, fallback = 0): number {
    if (typeof v === "number" && Number.isFinite(v)) {
        return v;
    }
    if (typeof v === "string") {
        const n = Number(v);
        return Number.isFinite(n) ? n : fallback;
    }
    return fallback;
}

export function parseGraphJson(jsonText: string): MiserablesPayload | null {
    const trimmed = jsonText.trim();
    if (!trimmed) {
        return null;
    }
    try {
        const raw = JSON.parse(trimmed) as unknown;
        if (!raw || typeof raw !== "object") {
            return null;
        }
        const o = raw as { nodes?: unknown; links?: unknown };
        if (!Array.isArray(o.nodes) || !Array.isArray(o.links)) {
            return null;
        }
        const nodes: MiserablesNode[] = [];
        for (const item of o.nodes) {
            if (!item || typeof item !== "object") {
                continue;
            }
            const n = item as { id?: unknown; group?: unknown };
            const id = asString(n.id);
            if (!id) {
                continue;
            }
            nodes.push({ id, group: Math.round(asNumber(n.group, 0)) });
        }
        const nodeIds = new Set(nodes.map(n => n.id));
        const links: MiserablesLink[] = [];
        for (const item of o.links) {
            if (!item || typeof item !== "object") {
                continue;
            }
            const l = item as { source?: unknown; target?: unknown; value?: unknown };
            const source = asString(l.source);
            const target = asString(l.target);
            if (!source || !target || !nodeIds.has(source) || !nodeIds.has(target)) {
                continue;
            }
            links.push({
                source,
                target,
                value: Math.max(0, asNumber(l.value, 1))
            });
        }
        if (nodes.length === 0) {
            return null;
        }
        return { nodes, links };
    } catch {
        return null;
    }
}

/**
 * Clamp requested node count to [10, payload.nodes.length] per showcase reference
 * (when fewer than 10 nodes exist, the upper bound is the graph size).
 */
export function clampForceNodeCount(requested: number, payload: MiserablesPayload): number {
    const len = payload.nodes.length;
    if (len === 0) {
        return 0;
    }
    const lo = Math.min(10, len);
    const hi = len;
    const r = Number.isFinite(requested) ? Math.round(requested) : hi;
    return Math.min(hi, Math.max(lo, r));
}

export function buildSimGraph(payload: MiserablesPayload, nodeCount: number): { nodes: SimNode[]; links: SimLink[] } {
    const take = Math.min(nodeCount, payload.nodes.length);
    const picked = payload.nodes.slice(0, take);
    const idToSim = new Map<string, SimNode>();

    const nodes: SimNode[] = picked.map(n => {
        const sn: SimNode = {
            id: n.id,
            group: n.group,
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            fx: null,
            fy: null
        };
        idToSim.set(n.id, sn);
        return sn;
    });

    const links: SimLink[] = [];
    for (const l of payload.links) {
        const s = idToSim.get(l.source);
        const t = idToSim.get(l.target);
        if (s && t) {
            links.push({ source: s, target: t, value: l.value });
        }
    }

    return { nodes, links };
}
