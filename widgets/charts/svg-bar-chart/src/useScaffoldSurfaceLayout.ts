import { type RefObject, useLayoutEffect, useRef } from "react";

import { SvgChartSurface, computeChartPixelBox, type ChartKind } from "@mendix-svg/svg-engine";

import { toSurfaceOptions } from "./adapters/toSurfaceOptions";

export interface ScaffoldSurfaceInputs {
    chartTitle: string;
    widthUnit: string;
    widthValue: number;
    heightUnit: string;
    heightValue: number;
}

export function useScaffoldSurfaceLayout(
    rootRef: RefObject<HTMLDivElement | null>,
    kind: ChartKind,
    props: ScaffoldSurfaceInputs
): void {
    const surfaceRef = useRef<SvgChartSurface | null>(null);

    useLayoutEffect(() => {
        const el = rootRef.current;
        if (!el) {
            return undefined;
        }

        const paint = (): void => {
            const parent = el.parentElement;
            const rect = (parent ?? el).getBoundingClientRect();
            const { width, height } = computeChartPixelBox(rect.width, rect.height, {
                widthUnit: props.widthUnit,
                widthValue: props.widthValue,
                heightUnit: props.heightUnit,
                heightValue: props.heightValue
            });

            el.style.width = `${width}px`;
            el.style.height = `${height}px`;

            surfaceRef.current?.destroy();
            surfaceRef.current = new SvgChartSurface(
                toSurfaceOptions(kind, {
                    chartTitle: props.chartTitle,
                    chartWidth: width,
                    chartHeight: height
                })
            );
            surfaceRef.current.mount(el);
        };

        paint();

        const target = el.parentElement ?? el;
        const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(paint) : null;
        ro?.observe(target);
        window.addEventListener("resize", paint);

        return () => {
            ro?.disconnect();
            window.removeEventListener("resize", paint);
            surfaceRef.current?.destroy();
            surfaceRef.current = null;
        };
    }, [kind, props.chartTitle, props.heightUnit, props.heightValue, props.widthUnit, props.widthValue, rootRef]);
}
