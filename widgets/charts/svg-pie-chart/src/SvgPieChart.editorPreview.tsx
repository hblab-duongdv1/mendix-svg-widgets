import { ReactElement } from "react";

import { parseInlineStyle } from "@mendix/pluggable-widgets-tools";

import { SvgPieChartPreviewProps } from "../typings/SvgPieChartProps";

export function preview(props: SvgPieChartPreviewProps): ReactElement {
    const style = parseInlineStyle(props.style);
    return (
        <div
            className={props.className}
            style={{
                ...style,
                border: "1px dashed #ff6b35",
                padding: 8,
                minHeight: Math.min(props.chartHeight ?? 120, 200),
                maxWidth: props.chartWidth ?? 400
            }}
        >
            <strong>SVG Pie Chart</strong>
            <div>{props.chartTitle || "(no title)"}</div>
        </div>
    );
}

export function getPreviewCss(): string {
    return require("./ui/SvgPieChart.css");
}
