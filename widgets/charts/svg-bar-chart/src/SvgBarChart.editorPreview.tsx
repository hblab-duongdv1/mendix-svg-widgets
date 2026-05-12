import { ReactElement, useRef } from "react";

import { parseInlineStyle } from "@mendix/pluggable-widgets-tools";

import { SvgBarChartPreviewProps } from "../typings/SvgBarChartProps";
import { useScaffoldSurfaceLayout } from "./useScaffoldSurfaceLayout";
import "./ui/SvgBarChart.css";

function SvgBarDesignSurface(props: SvgBarChartPreviewProps): ReactElement {
    const rootRef = useRef<HTMLDivElement>(null);
    const parsed = parseInlineStyle(props.style);

    const widthUnit = props.widthUnit ?? "pixels";
    const widthValue = props.widthValue ?? 400;
    const heightUnit = props.heightUnit ?? "pixels";
    const heightValue = props.heightValue ?? 240;

    useScaffoldSurfaceLayout(rootRef, "bar", {
        chartTitle: props.chartTitle ?? "",
        widthUnit,
        widthValue,
        heightUnit,
        heightValue
    });

    return (
        <div
            ref={rootRef}
            className={`charts-scaffold-widget charts-scaffold-bar ${props.className}`.trim()}
            style={{
                boxSizing: "border-box",
                ...parsed
            }}
        />
    );
}

export function preview(props: SvgBarChartPreviewProps): ReactElement {
    return <SvgBarDesignSurface {...props} />;
}

export function getPreviewCss(): string {
    return require("./ui/SvgBarChart.css");
}
