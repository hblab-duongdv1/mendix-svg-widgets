import { ReactElement, useRef } from "react";

import { SvgPieChartContainerProps } from "../typings/SvgPieChartProps";
import { useScaffoldSurfaceLayout } from "./useScaffoldSurfaceLayout";
import "./ui/SvgPieChart.css";

export function SvgPieChart(props: SvgPieChartContainerProps): ReactElement {
    const { chartTitle, widthUnit, widthValue, heightUnit, heightValue, class: className, style, tabIndex } = props;
    const rootRef = useRef<HTMLDivElement>(null);

    useScaffoldSurfaceLayout(rootRef, "pie", {
        chartTitle,
        widthUnit,
        widthValue,
        heightUnit,
        heightValue
    });

    return (
        <div
            ref={rootRef}
            className={`charts-scaffold-widget charts-scaffold-pie ${className}`}
            style={{
                boxSizing: "border-box",
                ...style
            }}
            tabIndex={tabIndex}
        />
    );
}
