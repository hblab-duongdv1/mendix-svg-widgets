import type { SimLink, SimNode } from "./types";

export interface ForceTickParams {
    width: number;
    height: number;
    linkDistance: number;
    /** Negative values repel (same convention as d3.forceManyBody). */
    repulsionStrength: number;
    alpha: number;
}

/**
 * One integration step: pairwise repulsion, link springs, weak center gravity.
 * Call once per animation frame with decaying `alpha` (like d3-force).
 */
export function accumulateForces(
    nodes: SimNode[],
    links: SimLink[],
    { width, height, linkDistance, repulsionStrength, alpha }: ForceTickParams
): void {
    const cx = width * 0.5;
    const cy = height * 0.5;
    const n = nodes.length;
    const k = Math.sqrt((width * height) / Math.max(n, 1));

    for (let i = 0; i < n; i++) {
        const ni = nodes[i]!;
        for (let j = i + 1; j < n; j++) {
            const nj = nodes[j]!;
            const dx = ni.x - nj.x;
            const dy = ni.y - nj.y;
            const distSq = dx * dx + dy * dy + 0.01;
            const dist = Math.sqrt(distSq);
            const force = ((repulsionStrength * k * k) / distSq) * alpha;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;
            ni.vx += fx;
            ni.vy += fy;
            nj.vx -= fx;
            nj.vy -= fy;
        }
    }

    for (const link of links) {
        const s = link.source;
        const t = link.target;
        const dx = t.x - s.x;
        const dy = t.y - s.y;
        const dist = Math.sqrt(dx * dx + dy * dy) + 0.01;
        const w = Math.sqrt(Math.max(link.value, 0.01));
        const ideal = linkDistance * (0.5 + w * 0.15);
        const diff = (dist - ideal) / dist;
        const stiffness = 0.09 * alpha * (1 + w * 0.05);
        const fx = dx * diff * stiffness;
        const fy = dy * diff * stiffness;
        s.vx += fx;
        s.vy += fy;
        t.vx -= fx;
        t.vy -= fy;
    }

    const g = 0.025 * alpha;
    for (const node of nodes) {
        node.vx += (cx - node.x) * g;
        node.vy += (cy - node.y) * g;
    }
}

export function integrateNodes(nodes: SimNode[], velocityDecay: number, width: number, height: number): void {
    const pad = 8;
    for (const node of nodes) {
        if (node.fx != null) {
            node.x = node.fx;
            node.vx = 0;
        } else {
            node.vx *= velocityDecay;
            node.x += node.vx;
        }
        if (node.fy != null) {
            node.y = node.fy;
            node.vy = 0;
        } else {
            node.vy *= velocityDecay;
            node.y += node.vy;
        }
        node.x = Math.min(width - pad, Math.max(pad, node.x));
        node.y = Math.min(height - pad, Math.max(pad, node.y));
    }
}

export function randomizeInitialPositions(nodes: SimNode[], width: number, height: number): void {
    const cx = width * 0.5;
    const cy = height * 0.5;
    const spread = Math.min(width, height) * 0.25;
    for (const node of nodes) {
        node.x = cx + (Math.random() - 0.5) * spread;
        node.y = cy + (Math.random() - 0.5) * spread;
        node.vx = 0;
        node.vy = 0;
        node.fx = null;
        node.fy = null;
    }
}
