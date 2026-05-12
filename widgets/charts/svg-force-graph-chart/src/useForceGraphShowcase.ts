import { SVG, type Svg } from "@svgdotjs/svg.js";
import { type RefObject, useLayoutEffect, useRef } from "react";

import { computeChartPixelBox } from "@mendix-svg/svg-engine";
import { ValueStatus, type DynamicValue } from "mendix";

import type { SvgForceGraphChartContainerProps } from "../typings/SvgForceGraphChartProps";
import {
    destroyForceGraphShowcase,
    drawForceGraphShowcase,
    type ForceGraphShowcaseModuleProps
} from "./forceGraph/drawForceGraphShowcase";

/** Widen expression prop so Studio design preview can pass a plain string. */
export type SvgForceGraphChartRuntimeProps = Omit<SvgForceGraphChartContainerProps, "graphJsonExpression"> & {
    graphJsonExpression?: DynamicValue<string> | string;
};

function readGraphJsonExpression(expr: DynamicValue<string> | string | undefined): string | undefined {
    if (typeof expr === "string") {
        const t = expr.trim();
        return t || undefined;
    }
    if (!expr || expr.status !== ValueStatus.Available) {
        return undefined;
    }
    const v = expr.value;
    return typeof v === "string" ? v : undefined;
}

export function useForceGraphShowcase(
    rootRef: RefObject<HTMLDivElement | null>,
    props: SvgForceGraphChartRuntimeProps
): void {
    const svgRef = useRef<Svg | null>(null);

    const graphJsonSignature = (() => {
        const e = props.graphJsonExpression;
        if (typeof e === "string") {
            return e;
        }
        if (e?.status === ValueStatus.Available && e.value !== undefined) {
            return e.value;
        }
        return "";
    })();

    useLayoutEffect(() => {
        const el = rootRef.current;
        if (!el) {
            return undefined;
        }

        const paint = (): void => {
            const parent = el.parentElement ?? el;
            const rect = parent.getBoundingClientRect();
            const { width, height } = computeChartPixelBox(rect.width, rect.height, {
                widthUnit: props.widthUnit,
                widthValue: props.widthValue,
                heightUnit: props.heightUnit,
                heightValue: props.heightValue
            });

            el.style.width = `${width}px`;
            el.style.height = `${height}px`;

            if (svgRef.current) {
                destroyForceGraphShowcase(svgRef.current);
                svgRef.current.remove();
                svgRef.current = null;
            }

            const draw = SVG().addTo(el).size(width, height);
            svgRef.current = draw;

            const moduleProps: ForceGraphShowcaseModuleProps = {
                width,
                height,
                chartTitle: props.chartTitle,
                forceUseGroupColors: props.forceUseGroupColors,
                forceNodeColor: props.forceNodeColor,
                forceNodeCount: props.forceNodeCount,
                forceNodeSize: props.forceNodeSize,
                forceLinkDistance: props.forceLinkDistance,
                forceRepulsion: props.forceRepulsion
            };

            const jsonFromExpression = readGraphJsonExpression(props.graphJsonExpression);

            drawForceGraphShowcase(draw, {
                props: moduleProps,
                graphJsonText: jsonFromExpression,
                graphDataUrl: props.graphDataUrl,
                loadDemoWhenEmpty: props.loadDemoWhenEmpty
            });
        };

        paint();

        const target = el.parentElement ?? el;
        const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(paint) : null;
        ro?.observe(target);
        window.addEventListener("resize", paint);

        return () => {
            ro?.disconnect();
            window.removeEventListener("resize", paint);
            if (svgRef.current) {
                destroyForceGraphShowcase(svgRef.current);
                svgRef.current.remove();
                svgRef.current = null;
            }
        };
    }, [
        props.chartTitle,
        props.forceLinkDistance,
        props.forceNodeColor,
        props.forceNodeCount,
        props.forceNodeSize,
        props.forceRepulsion,
        props.forceUseGroupColors,
        props.graphDataUrl,
        props.graphJsonExpression,
        graphJsonSignature,
        props.heightUnit,
        props.heightValue,
        props.loadDemoWhenEmpty,
        props.widthUnit,
        props.widthValue,
        rootRef
    ]);
}
