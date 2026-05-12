import { type ChartKind, type SvgChartSurfaceOptions, resolveChartDimensions } from "@mendix-svg/svg-engine";

export interface ChartLayoutProps {
    chartTitle?: string;
    chartWidth?: unknown;
    chartHeight?: unknown;
}

export function toSurfaceOptions(kind: ChartKind, props: ChartLayoutProps): SvgChartSurfaceOptions {
    const { width, height } = resolveChartDimensions(props.chartWidth, props.chartHeight);
    return {
        kind,
        title: props.chartTitle ?? "",
        width,
        height
    };
}
