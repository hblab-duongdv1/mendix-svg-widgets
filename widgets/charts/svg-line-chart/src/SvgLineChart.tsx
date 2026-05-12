import { ReactElement, useRef } from "react";

import { SvgLineChartContainerProps } from "../typings/SvgLineChartProps";
import { useScaffoldSurfaceLayout } from "./useScaffoldSurfaceLayout";
import "./ui/SvgLineChart.css";

export function SvgLineChart(props: SvgLineChartContainerProps): ReactElement {
    const { chartTitle, widthUnit, widthValue, heightUnit, heightValue, class: className, style, tabIndex } = props;
    const rootRef = useRef<HTMLDivElement>(null);

    useScaffoldSurfaceLayout(rootRef, "line", {
        chartTitle,
        widthUnit,
        widthValue,
        heightUnit,
        heightValue
    });

    return (
        <div
            ref={rootRef}
            className={`charts-scaffold-widget charts-scaffold-line ${className}`}
            style={{
                boxSizing: "border-box",
                ...style
            }}
            tabIndex={tabIndex}
        />
    );
}
