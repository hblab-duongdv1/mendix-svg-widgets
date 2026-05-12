import { SvgChartSurface } from "@mendix-svg/svg-engine";

function mount(rootId: string, options: { kind: "line" | "bar" | "pie"; title: string }): void {
    const el = document.getElementById(rootId);
    if (!el) {
        throw new Error(`Missing #${rootId}`);
    }
    const surface = new SvgChartSurface({
        width: 360,
        height: 220,
        kind: options.kind,
        title: options.title
    });
    surface.mount(el);
}

mount("line-root", { kind: "line", title: "E2E Line" });
mount("bar-root", { kind: "bar", title: "E2E Bar" });
mount("pie-root", { kind: "pie", title: "E2E Pie" });
