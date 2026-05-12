import type { ChartKind, SvgChartSurfaceOptions } from "@mendix-svg/svg-engine";

export interface ChartLayoutProps {
    chartTitle: string;
    chartWidth: number;
    chartHeight: number;
}

export function toSurfaceOptions(kind: ChartKind, props: ChartLayoutProps): SvgChartSurfaceOptions {
    return {
        kind,
        title: props.chartTitle,
        width: props.chartWidth,
        height: props.chartHeight
    };
}
