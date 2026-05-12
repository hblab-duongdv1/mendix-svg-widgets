import { SVG, Svg } from "@svgdotjs/svg.js";

export type ChartKind = "line" | "bar" | "pie";

export interface SvgChartSurfaceOptions {
    width: number;
    height: number;
    kind: ChartKind;
    title?: string;
}

/**
 * Minimal SVG.js drawing surface. No React / Mendix imports.
 * Chart-specific rendering will move into chart-engine later.
 */
export class SvgChartSurface {
    private svg: Svg | null = null;

    constructor(private readonly options: SvgChartSurfaceOptions) {}

    mount(container: HTMLElement): void {
        this.destroy();
        const { width, height, kind, title } = this.options;
        const svg = SVG().addTo(container).size(width, height);
        this.svg = svg;

        svg.rect(width, height).fill("#f7f8fa").stroke({ width: 1, color: "#d0d4dc" });

        const heading = title?.trim() || `${kind} chart`;
        svg.text(heading)
            .move(12, 10)
            .font({ size: 14, weight: "600", family: "Helvetica, Arial, sans-serif" })
            .fill("#1a1a1a");

        this.drawPlaceholder(svg, width, height, kind);
    }

    private drawPlaceholder(svg: Svg, width: number, height: number, kind: ChartKind): void {
        const pad = 24;
        const w = Math.max(width - pad * 2, 10);
        const h = Math.max(height - pad * 2 - 28, 10);
        const x0 = pad;
        const y0 = pad + 28;

        if (kind === "line") {
            const g = svg.group();
            g.polyline([
                x0,
                y0 + h,
                x0 + w * 0.25,
                y0 + h * 0.65,
                x0 + w * 0.5,
                y0 + h * 0.4,
                x0 + w * 0.75,
                y0 + h * 0.55,
                x0 + w,
                y0 + h * 0.2
            ])
                .fill("none")
                .stroke({ width: 2, color: "#246bff", linejoin: "round", linecap: "round" });
            return;
        }

        if (kind === "bar") {
            const bars = 5;
            const gap = 6;
            const bw = (w - gap * (bars - 1)) / bars;
            for (let i = 0; i < bars; i++) {
                const bh = h * (0.35 + (i % 3) * 0.2);
                svg.rect(bw, bh)
                    .move(x0 + i * (bw + gap), y0 + h - bh)
                    .fill("#2bb673")
                    .radius(2);
            }
            return;
        }

        const r = Math.min(w, h) * 0.35;
        const cx = x0 + w / 2;
        const cy = y0 + h / 2;
        svg.circle(r * 2)
            .center(cx, cy)
            .fill("#ffb020")
            .opacity(0.35);
        svg.path(this.arcPath(cx, cy, r, 0, 220)).fill("#ff6b35");
        svg.circle(6).center(cx, cy).fill("#ffffff").stroke({ width: 1, color: "#c94b16" });
    }

    private arcPath(cx: number, cy: number, r: number, startAngle: number, endAngle: number): string {
        const rad = (deg: number) => (deg * Math.PI) / 180;
        const x1 = cx + r * Math.cos(rad(startAngle));
        const y1 = cy + r * Math.sin(rad(startAngle));
        const x2 = cx + r * Math.cos(rad(endAngle));
        const y2 = cy + r * Math.sin(rad(endAngle));
        const large = endAngle - startAngle > 180 ? 1 : 0;
        return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
    }

    destroy(): void {
        if (this.svg) {
            this.svg.remove();
            this.svg = null;
        }
    }
}
