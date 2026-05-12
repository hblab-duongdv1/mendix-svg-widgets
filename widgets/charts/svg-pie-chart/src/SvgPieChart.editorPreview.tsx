import { ReactElement, useRef } from "react";

import { parseInlineStyle } from "@mendix/pluggable-widgets-tools";

import { SvgPieChartPreviewProps } from "../typings/SvgPieChartProps";
import { useScaffoldSurfaceLayout } from "./useScaffoldSurfaceLayout";
import "./ui/SvgPieChart.css";

function SvgPieDesignSurface(props: SvgPieChartPreviewProps): ReactElement {
    const rootRef = useRef<HTMLDivElement>(null);
    const parsed = parseInlineStyle(props.style);

    const widthUnit = props.widthUnit ?? "pixels";
    const widthValue = props.widthValue ?? 400;
    const heightUnit = props.heightUnit ?? "pixels";
    const heightValue = props.heightValue ?? 240;

    useScaffoldSurfaceLayout(rootRef, "pie", {
        chartTitle: props.chartTitle ?? "",
        widthUnit,
        widthValue,
        heightUnit,
        heightValue
    });

    return (
        <div
            ref={rootRef}
            className={`charts-scaffold-widget charts-scaffold-pie ${props.className}`.trim()}
            style={{
                boxSizing: "border-box",
                ...parsed
            }}
        />
    );
}

export function preview(props: SvgPieChartPreviewProps): ReactElement {
    return <SvgPieDesignSurface {...props} />;
}

export function getPreviewCss(): string {
    return require("./ui/SvgPieChart.css");
}
