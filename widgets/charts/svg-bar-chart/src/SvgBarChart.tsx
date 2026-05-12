import { ReactElement, useRef } from "react";

import { SvgBarChartContainerProps } from "../typings/SvgBarChartProps";
import { useScaffoldSurfaceLayout } from "./useScaffoldSurfaceLayout";
import "./ui/SvgBarChart.css";

export function SvgBarChart(props: SvgBarChartContainerProps): ReactElement {
    const { chartTitle, widthUnit, widthValue, heightUnit, heightValue, class: className, style, tabIndex } = props;
    const rootRef = useRef<HTMLDivElement>(null);

    useScaffoldSurfaceLayout(rootRef, "bar", {
        chartTitle,
        widthUnit,
        widthValue,
        heightUnit,
        heightValue
    });

    return (
        <div
            ref={rootRef}
            className={`charts-scaffold-widget charts-scaffold-bar ${className}`}
            style={{
                boxSizing: "border-box",
                ...style
            }}
            tabIndex={tabIndex}
        />
    );
}
