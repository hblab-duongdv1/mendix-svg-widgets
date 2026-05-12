import { ReactElement, useLayoutEffect, useRef } from "react";

import { SvgChartSurface } from "@mendix-svg/svg-engine";

import { SvgPieChartContainerProps } from "../typings/SvgPieChartProps";
import { toSurfaceOptions } from "./adapters/toSurfaceOptions";
import "./ui/SvgPieChart.css";

export function SvgPieChart(props: SvgPieChartContainerProps): ReactElement {
    const { chartTitle, chartWidth, chartHeight, class: className, style, tabIndex } = props;
    const rootRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const el = rootRef.current;
        if (!el) {
            return undefined;
        }
        const surface = new SvgChartSurface(toSurfaceOptions("pie", { chartTitle, chartWidth, chartHeight }));
        surface.mount(el);
        return () => {
            surface.destroy();
        };
    }, [chartTitle, chartWidth, chartHeight]);

    return (
        <div
            ref={rootRef}
            className={`charts-scaffold-widget charts-scaffold-pie ${className}`}
            style={style}
            tabIndex={tabIndex}
        />
    );
}
