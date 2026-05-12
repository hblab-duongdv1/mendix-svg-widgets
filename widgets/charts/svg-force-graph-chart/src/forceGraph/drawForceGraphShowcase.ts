import { type Line, type Circle, Svg } from "@svgdotjs/svg.js";

import {
    DEFAULT_MISERABLES_DATA_URL,
    FORCE_GRAPH_CLEANUP_KEY,
    GROUP_COLORS,
    LINK_ACTIVE_COLOR,
    LINK_BASE_COLOR,
    LINK_DIM_OPACITY,
    NODE_BASE_STROKE,
    NODE_DIM_OPACITY
} from "./constants";
import { buildSimGraph, clampForceNodeCount, parseGraphJson } from "./parseGraphPayload";
import { accumulateForces, integrateNodes, randomizeInitialPositions } from "./runForceTick";
import type { SimLink, SimNode } from "./types";

export interface ForceGraphShowcaseModuleProps {
    width: number;
    height: number;
    chartTitle: string;
    forceUseGroupColors: boolean;
    forceNodeColor: string;
    forceNodeCount: number;
    forceNodeSize: number;
    forceLinkDistance: number;
    forceRepulsion: number;
}

export interface DrawForceGraphShowcaseOptions {
    props: ForceGraphShowcaseModuleProps;
    /** Parsed when non-empty; takes precedence over network fetch. */
    graphJsonText?: string;
    /** When set (non-empty), fetches JSON from this URL if graphJsonText is empty. */
    graphDataUrl?: string;
    /** When true and no JSON / URL, loads {@link DEFAULT_MISERABLES_DATA_URL}. */
    loadDemoWhenEmpty: boolean;
}

function nodeFill(node: SimNode, useGroup: boolean, staticColor: string): string {
    if (!useGroup) {
        return staticColor;
    }
    const idx = Math.abs(node.group) % GROUP_COLORS.length;
    return GROUP_COLORS[idx] ?? staticColor;
}

function clientToSvgPoint(svgRoot: SVGSVGElement, clientX: number, clientY: number): { x: number; y: number } {
    const pt = svgRoot.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svgRoot.getScreenCTM();
    if (!ctm) {
        return { x: clientX, y: clientY };
    }
    const p = pt.matrixTransform(ctm.inverse());
    return { x: p.x, y: p.y };
}

async function resolvePayload(options: DrawForceGraphShowcaseOptions): Promise<string | null> {
    const fromExpr = options.graphJsonText?.trim();
    if (fromExpr) {
        return fromExpr;
    }
    const url = options.graphDataUrl?.trim();
    if (url) {
        const res = await fetch(url, { credentials: "omit" });
        if (!res.ok) {
            return null;
        }
        return res.text();
    }
    if (options.loadDemoWhenEmpty) {
        const res = await fetch(DEFAULT_MISERABLES_DATA_URL, { credentials: "omit" });
        if (!res.ok) {
            return null;
        }
        return res.text();
    }
    return null;
}

/**
 * Renders an interactive force-directed graph on an existing SVG.js root.
 * Registers a cleanup function on the DOM node under {@link FORCE_GRAPH_CLEANUP_KEY}.
 */
export function drawForceGraphShowcase(draw: Svg, options: DrawForceGraphShowcaseOptions): void {
    type NodeWithCleanup = SVGSVGElement & { [FORCE_GRAPH_CLEANUP_KEY]?: () => void };
    const dom = draw.node as unknown as NodeWithCleanup;
    dom[FORCE_GRAPH_CLEANUP_KEY]?.();
    delete dom[FORCE_GRAPH_CLEANUP_KEY];

    let disposed = false;
    let rafId = 0;
    const svgEl = draw.node as SVGSVGElement;

    const cleanup = (): void => {
        if (disposed) {
            return;
        }
        disposed = true;
        cancelAnimationFrame(rafId);
        window.removeEventListener("pointermove", onWindowPointerMove);
        window.removeEventListener("pointerup", onWindowPointerUp);
        delete dom[FORCE_GRAPH_CLEANUP_KEY];
    };
    dom[FORCE_GRAPH_CLEANUP_KEY] = cleanup;

    const { width, height } = options.props;
    draw.clear();
    draw.viewbox(0, 0, width, height);
    draw.rect(width, height).fill("#f7f8fa").stroke({ width: 1, color: "#d0d4dc" });

    const title = options.props.chartTitle.trim() || "Force graph";
    draw.text(title)
        .move(12, 8)
        .font({ size: 14, weight: "600", family: "Helvetica, Arial, sans-serif" })
        .fill("#1a1a1a");

    const chartTop = 28;
    const innerH = Math.max(10, height - chartTop);
    const innerW = width;

    const root = draw.group().translate(0, chartTop);

    let dragNode: SimNode | null = null;
    let dragMoved = false;
    let selectedId: string | null = null;
    let alpha = 1;
    const alphaTarget = 0;
    const alphaDecay = 0.028;
    const velocityDecay = 0.58;

    const linkLines: Array<{ el: Line; s: SimNode; t: SimNode; value: number }> = [];
    const nodeCircles = new Map<string, Circle>();

    let nodes: SimNode[] = [];
    let links: SimLink[] = [];
    let adjacency = new Map<string, Set<string>>();

    function rebuildAdjacency(): void {
        adjacency = new Map();
        for (const n of nodes) {
            adjacency.set(n.id, new Set());
        }
        for (const l of links) {
            adjacency.get(l.source.id)?.add(l.target.id);
            adjacency.get(l.target.id)?.add(l.source.id);
        }
    }

    function applySelectionVisual(): void {
        const neighbor = selectedId ? adjacency.get(selectedId) : null;
        for (const [id, c] of nodeCircles) {
            if (!selectedId) {
                c.opacity(1);
                c.stroke({ color: NODE_BASE_STROKE, width: 1 });
                continue;
            }
            const on = id === selectedId || neighbor?.has(id);
            c.opacity(on ? 1 : NODE_DIM_OPACITY);
            c.stroke({
                color: id === selectedId ? LINK_ACTIVE_COLOR : NODE_BASE_STROKE,
                width: id === selectedId ? 2 : 1
            });
        }
        const hub = new Set<string>();
        if (selectedId) {
            hub.add(selectedId);
            neighbor?.forEach(id => hub.add(id));
        }
        for (const row of linkLines) {
            const on = !selectedId || hub.has(row.s.id) || hub.has(row.t.id);
            const baseW = Math.max(0.6, Math.sqrt(row.value));
            const incidentSelected = selectedId && (row.s.id === selectedId || row.t.id === selectedId);
            row.el.stroke({
                width: on ? baseW + (incidentSelected ? 0.45 : 0.15) : baseW,
                color: incidentSelected ? LINK_ACTIVE_COLOR : LINK_BASE_COLOR
            });
            row.el.opacity(on ? 1 : LINK_DIM_OPACITY);
        }
    }

    function onWindowPointerMove(ev: PointerEvent): void {
        if (!dragNode) {
            return;
        }
        dragMoved = true;
        const p = clientToSvgPoint(svgEl, ev.clientX, ev.clientY);
        dragNode.fx = Math.min(innerW - 8, Math.max(8, p.x));
        dragNode.fy = Math.min(innerH - 8, Math.max(8, p.y - chartTop));
        alpha = Math.max(alpha, 0.35);
    }

    function onWindowPointerUp(): void {
        if (dragNode) {
            dragNode.fx = null;
            dragNode.fy = null;
            dragNode = null;
        }
        window.removeEventListener("pointermove", onWindowPointerMove);
        window.removeEventListener("pointerup", onWindowPointerUp);
    }

    function attachDrag(node: SimNode, circle: Circle): void {
        circle.on("pointerdown", (e: Event) => {
            const pe = e as PointerEvent;
            pe.preventDefault();
            dragMoved = false;
            dragNode = node;
            node.fx = node.x;
            node.fy = node.y;
            alpha = Math.max(alpha, 0.5);
            window.addEventListener("pointermove", onWindowPointerMove);
            window.addEventListener("pointerup", onWindowPointerUp);
        });
        circle.on("click", (e: Event) => {
            const ev = e as MouseEvent;
            if (dragMoved) {
                return;
            }
            ev.stopPropagation();
            selectedId = selectedId === node.id ? null : node.id;
            applySelectionVisual();
        });
    }

    function mountGraph(payloadText: string): void {
        const payload = parseGraphJson(payloadText);
        if (!payload) {
            root.text("Invalid or empty graph JSON.")
                .move(12, innerH * 0.4)
                .font({ size: 12, family: "Helvetica, Arial, sans-serif" })
                .fill("#c0392b");
            return;
        }

        const count = clampForceNodeCount(options.props.forceNodeCount, payload);
        const built = buildSimGraph(payload, count);
        nodes = built.nodes;
        links = built.links;
        randomizeInitialPositions(nodes, innerW, innerH);
        rebuildAdjacency();

        const linkGroup = root.group();
        const nodeGroup = root.group();

        for (const l of links) {
            const line = linkGroup.line(0, 0, 0, 0).stroke({ color: LINK_BASE_COLOR, linecap: "round" });
            linkLines.push({ el: line, s: l.source, t: l.target, value: l.value });
        }

        const r = Math.max(2, options.props.forceNodeSize);
        for (const n of nodes) {
            const fill = nodeFill(n, options.props.forceUseGroupColors, options.props.forceNodeColor);
            const circle = nodeGroup
                .circle(r * 2)
                .center(n.x, n.y)
                .fill(fill)
                .stroke({ width: 1, color: NODE_BASE_STROKE });
            circle.attr("style", "cursor: grab; touch-action: none;");
            nodeCircles.set(n.id, circle);
            attachDrag(n, circle);
        }

        applySelectionVisual();

        const tick = (): void => {
            if (disposed) {
                return;
            }
            alpha += (alphaTarget - alpha) * alphaDecay;
            if (alpha < 0.001) {
                alpha = 0;
            }
            accumulateForces(nodes, links, {
                width: innerW,
                height: innerH,
                linkDistance: options.props.forceLinkDistance,
                repulsionStrength: options.props.forceRepulsion,
                alpha: Math.max(0.08, alpha)
            });
            integrateNodes(nodes, velocityDecay, innerW, innerH);

            for (const row of linkLines) {
                row.el.plot(row.s.x, row.s.y, row.t.x, row.t.y);
            }
            for (const n of nodes) {
                const c = nodeCircles.get(n.id);
                c?.center(n.x, n.y);
            }

            rafId = requestAnimationFrame(tick);
        };
        rafId = requestAnimationFrame(tick);
    }

    const load = async (): Promise<void> => {
        const text = await resolvePayload(options);
        if (disposed) {
            return;
        }
        if (!text) {
            root.text("Provide Graph JSON, a data URL, or enable demo data when empty.")
                .move(12, innerH * 0.35)
                .font({ size: 12, family: "Helvetica, Arial, sans-serif" })
                .fill("#555");
            return;
        }
        if (disposed) {
            return;
        }
        mountGraph(text);
    };
    load().catch(() => undefined);
}

export function destroyForceGraphShowcase(draw: Svg): void {
    type NodeWithCleanup = SVGSVGElement & { [FORCE_GRAPH_CLEANUP_KEY]?: () => void };
    const dom = draw.node as unknown as NodeWithCleanup;
    dom[FORCE_GRAPH_CLEANUP_KEY]?.();
}
