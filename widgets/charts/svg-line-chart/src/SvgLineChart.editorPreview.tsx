import { ReactElement } from "react";

import { parseInlineStyle } from "@mendix/pluggable-widgets-tools";

import { SvgLineChartPreviewProps } from "../typings/SvgLineChartProps";

export function preview(props: SvgLineChartPreviewProps): ReactElement {
    const style = parseInlineStyle(props.style);
    return (
        <div
            className={props.className}
            style={{
                ...style,
                border: "1px dashed #246bff",
                padding: 8,
                minHeight: Math.min(props.chartHeight ?? 120, 200),
                maxWidth: props.chartWidth ?? 400
            }}
        >
            <strong>SVG Line Chart</strong>
            <div>{props.chartTitle || "(no title)"}</div>
        </div>
    );
}

export function getPreviewCss(): string {
    return require("./ui/SvgLineChart.css");
}
