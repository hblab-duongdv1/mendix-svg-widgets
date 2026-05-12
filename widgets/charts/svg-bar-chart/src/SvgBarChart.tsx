import { ReactElement, useLayoutEffect, useRef } from "react";

import { SvgChartSurface } from "@mendix-svg/svg-engine";

import { SvgBarChartContainerProps } from "../typings/SvgBarChartProps";
import { toSurfaceOptions } from "./adapters/toSurfaceOptions";
import "./ui/SvgBarChart.css";

export function SvgBarChart(props: SvgBarChartContainerProps): ReactElement {
    const { chartTitle, chartWidth, chartHeight, class: className, style, tabIndex } = props;
    const rootRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const el = rootRef.current;
        if (!el) {
            return undefined;
        }
        const surface = new SvgChartSurface(toSurfaceOptions("bar", { chartTitle, chartWidth, chartHeight }));
        surface.mount(el);
        return () => {
            surface.destroy();
        };
    }, [chartTitle, chartWidth, chartHeight]);

    return (
        <div
            ref={rootRef}
            className={`charts-scaffold-widget charts-scaffold-bar ${className}`}
            style={style}
            tabIndex={tabIndex}
        />
    );
}
