import { ReactElement, useRef } from "react";

import { parseInlineStyle } from "@mendix/pluggable-widgets-tools";

import { SvgForceGraphChartPreviewProps } from "../typings/SvgForceGraphChartProps";
import { useForceGraphShowcase, type SvgForceGraphChartRuntimeProps } from "./useForceGraphShowcase";
import "./ui/SvgForceGraphChart.css";

function SvgForceGraphDesignSurface(props: SvgForceGraphChartPreviewProps): ReactElement {
    const rootRef = useRef<HTMLDivElement>(null);
    const parsed = parseInlineStyle(props.style);

    const widthUnit = props.widthUnit ?? "pixels";
    const widthValue = props.widthValue ?? 400;
    const heightUnit = props.heightUnit ?? "pixels";
    const heightValue = props.heightValue ?? 240;

    const containerProps = {
        name: "SvgForceGraphChartPreview",
        class: props.class ?? "",
        chartTitle: props.chartTitle ?? "",
        graphJsonExpression: props.graphJsonExpression,
        graphDataUrl: props.graphDataUrl ?? "",
        loadDemoWhenEmpty: props.loadDemoWhenEmpty ?? true,
        forceUseGroupColors: props.forceUseGroupColors ?? true,
        forceNodeColor: props.forceNodeColor ?? "#5c5ce6",
        forceNodeCount: props.forceNodeCount ?? 40,
        forceNodeSize: props.forceNodeSize ?? 5,
        forceLinkDistance: props.forceLinkDistance ?? 22,
        forceRepulsion: props.forceRepulsion ?? -180,
        widthUnit,
        widthValue,
        heightUnit,
        heightValue
    } as SvgForceGraphChartRuntimeProps;

    useForceGraphShowcase(rootRef, containerProps);

    return (
        <div
            ref={rootRef}
            className={`charts-scaffold-widget charts-scaffold-forcegraph ${props.className}`.trim()}
            style={{
                boxSizing: "border-box",
                ...parsed
            }}
        />
    );
}

export function preview(props: SvgForceGraphChartPreviewProps): ReactElement {
    return <SvgForceGraphDesignSurface {...props} />;
}

export function getPreviewCss(): string {
    return require("./ui/SvgForceGraphChart.css");
}
