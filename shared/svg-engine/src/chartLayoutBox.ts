import { CHART_LAYOUT_DEFAULTS } from "./constants";

export interface ChartDimensionProps {
    widthUnit: string;
    widthValue: number;
    heightUnit: string;
    heightValue: number;
}

export interface MinimalListValue {
    status?: string;
    items?: readonly unknown[] | null;
}

/** True when a list datasource is configured and has loaded at least one row. */
export function hasChartListData(chartData: MinimalListValue | undefined | null): boolean {
    if (!chartData) {
        return false;
    }
    if (chartData.status !== "available") {
        return false;
    }
    return (chartData.items?.length ?? 0) > 0;
}

function clampChartSpan(n: number, fallback: number): number {
    if (!Number.isFinite(n) || n <= 0) {
        return fallback;
    }
    return Math.min(Math.max(Math.round(n), 8), 8000);
}

/**
 * Maps Mendix-style dimension props (Area chart–like) to pixel width/height for the SVG surface.
 * `parentWidth` / `parentHeight` should come from the widget container (e.g. parent element client rect).
 */
export function computeChartPixelBox(
    parentWidth: number,
    parentHeight: number,
    dims: ChartDimensionProps
): { width: number; height: number } {
    const pw = Math.max(parentWidth, 1);
    const ph = Math.max(parentHeight, 1);

    const widthRaw =
        dims.widthUnit === "percentOfParent" ? (dims.widthValue / 100) * pw : Number(dims.widthValue);
    const width = clampChartSpan(widthRaw, CHART_LAYOUT_DEFAULTS.width);

    let heightRaw: number;
    if (dims.heightUnit === "percentOfWidth") {
        heightRaw = (dims.heightValue / 100) * width;
    } else if (dims.heightUnit === "percentOfParent") {
        heightRaw = ph > 1 ? (dims.heightValue / 100) * ph : (dims.heightValue / 100) * width;
    } else {
        heightRaw = Number(dims.heightValue);
    }
    const height = clampChartSpan(heightRaw, CHART_LAYOUT_DEFAULTS.height);

    return { width, height };
}
