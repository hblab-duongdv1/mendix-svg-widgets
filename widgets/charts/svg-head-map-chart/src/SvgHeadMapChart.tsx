import { ReactElement, useRef } from "react";

import { SvgHeadMapChartContainerProps } from "../typings/SvgHeadMapChartProps";
import { useScaffoldSurfaceLayout } from "./useScaffoldSurfaceLayout";
import "./ui/SvgHeadMapChart.css";

export function SvgHeadMapChart(props: SvgHeadMapChartContainerProps): ReactElement {
    const { chartTitle, widthUnit, widthValue, heightUnit, heightValue, class: className, style, tabIndex } = props;
    const rootRef = useRef<HTMLDivElement>(null);

    useScaffoldSurfaceLayout(rootRef, "heatmap", {
        chartTitle,
        widthUnit,
        widthValue,
        heightUnit,
        heightValue
    });

    return (
        <div
            ref={rootRef}
            className={`charts-scaffold-widget charts-scaffold-heatmap ${className}`}
            style={{
                boxSizing: "border-box",
                ...style
            }}
            tabIndex={tabIndex}
        />
    );
}
