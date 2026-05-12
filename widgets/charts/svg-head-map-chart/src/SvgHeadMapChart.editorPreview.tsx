import { ReactElement, useRef } from "react";

import { parseInlineStyle } from "@mendix/pluggable-widgets-tools";

import { SvgHeadMapChartPreviewProps } from "../typings/SvgHeadMapChartProps";
import { useScaffoldSurfaceLayout } from "./useScaffoldSurfaceLayout";
import "./ui/SvgHeadMapChart.css";

function SvgHeadMapDesignSurface(props: SvgHeadMapChartPreviewProps): ReactElement {
    const rootRef = useRef<HTMLDivElement>(null);
    const parsed = parseInlineStyle(props.style);

    const widthUnit = props.widthUnit ?? "pixels";
    const widthValue = props.widthValue ?? 400;
    const heightUnit = props.heightUnit ?? "pixels";
    const heightValue = props.heightValue ?? 240;

    useScaffoldSurfaceLayout(rootRef, "heatmap", {
        chartTitle: props.chartTitle ?? "",
        widthUnit,
        widthValue,
        heightUnit,
        heightValue
    });

    return (
        <div
            ref={rootRef}
            className={`charts-scaffold-widget charts-scaffold-heatmap ${props.className}`.trim()}
            style={{
                boxSizing: "border-box",
                ...parsed
            }}
        />
    );
}

export function preview(props: SvgHeadMapChartPreviewProps): ReactElement {
    return <SvgHeadMapDesignSurface {...props} />;
}

export function getPreviewCss(): string {
    return require("./ui/SvgHeadMapChart.css");
}
