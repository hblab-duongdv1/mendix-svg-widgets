import { ReactElement } from "react";

import { parseInlineStyle } from "@mendix/pluggable-widgets-tools";

import { SvgBarChartPreviewProps } from "../typings/SvgBarChartProps";

export function preview(props: SvgBarChartPreviewProps): ReactElement {
    const style = parseInlineStyle(props.style);
    return (
        <div
            className={props.className}
            style={{
                ...style,
                border: "1px dashed #2bb673",
                padding: 8,
                minHeight: Math.min(props.chartHeight ?? 120, 200),
                maxWidth: props.chartWidth ?? 400
            }}
        >
            <strong>SVG Bar Chart</strong>
            <div>{props.chartTitle || "(no title)"}</div>
        </div>
    );
}

export function getPreviewCss(): string {
    return require("./ui/SvgBarChart.css");
}
