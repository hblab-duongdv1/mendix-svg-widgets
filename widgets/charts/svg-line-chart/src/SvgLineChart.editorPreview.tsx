import { ReactElement, useRef } from "react";

import { parseInlineStyle } from "@mendix/pluggable-widgets-tools";

import { SvgLineChartPreviewProps } from "../typings/SvgLineChartProps";
import { useScaffoldSurfaceLayout } from "./useScaffoldSurfaceLayout";
import "./ui/SvgLineChart.css";

function SvgLineDesignSurface(props: SvgLineChartPreviewProps): ReactElement {
    const rootRef = useRef<HTMLDivElement>(null);
    const parsed = parseInlineStyle(props.style);

    const widthUnit = props.widthUnit ?? "pixels";
    const widthValue = props.widthValue ?? 400;
    const heightUnit = props.heightUnit ?? "pixels";
    const heightValue = props.heightValue ?? 240;

    useScaffoldSurfaceLayout(rootRef, "line", {
        chartTitle: props.chartTitle ?? "",
        widthUnit,
        widthValue,
        heightUnit,
        heightValue
    });

    return (
        <div
            ref={rootRef}
            className={`charts-scaffold-widget charts-scaffold-line ${props.className}`.trim()}
            style={{
                boxSizing: "border-box",
                ...parsed
            }}
        />
    );
}

export function preview(props: SvgLineChartPreviewProps): ReactElement {
    return <SvgLineDesignSurface {...props} />;
}

export function getPreviewCss(): string {
    return require("./ui/SvgLineChart.css");
}
