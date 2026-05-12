import { ReactElement, useLayoutEffect, useRef } from "react";

import { SvgChartSurface } from "@mendix-svg/svg-engine";

import { SvgLineChartContainerProps } from "../typings/SvgLineChartProps";
import { toSurfaceOptions } from "./adapters/toSurfaceOptions";
import "./ui/SvgLineChart.css";

export function SvgLineChart(props: SvgLineChartContainerProps): ReactElement {
    const { chartTitle, chartWidth, chartHeight, class: className, style, tabIndex } = props;
    const rootRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const el = rootRef.current;
        if (!el) {
            return undefined;
        }
        const surface = new SvgChartSurface(toSurfaceOptions("line", { chartTitle, chartWidth, chartHeight }));
        surface.mount(el);
        return () => {
            surface.destroy();
        };
    }, [chartTitle, chartWidth, chartHeight]);

    return (
        <div
            ref={rootRef}
            className={`charts-scaffold-widget charts-scaffold-line ${className}`}
            style={style}
            tabIndex={tabIndex}
        />
    );
}
