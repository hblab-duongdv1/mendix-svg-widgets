import { ReactElement, useRef } from "react";

import { SvgForceGraphChartContainerProps } from "../typings/SvgForceGraphChartProps";
import { useForceGraphShowcase } from "./useForceGraphShowcase";
import "./ui/SvgForceGraphChart.css";

export function SvgForceGraphChart(props: SvgForceGraphChartContainerProps): ReactElement {
    const { class: className, style, tabIndex } = props;
    const rootRef = useRef<HTMLDivElement>(null);

    useForceGraphShowcase(rootRef, props);

    return (
        <div
            ref={rootRef}
            className={`charts-scaffold-widget charts-scaffold-forcegraph ${className}`}
            style={{
                boxSizing: "border-box",
                ...style
            }}
            tabIndex={tabIndex}
        />
    );
}
