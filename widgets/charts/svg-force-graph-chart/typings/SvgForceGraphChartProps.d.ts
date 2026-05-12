/**
 * This file was generated from SvgForceGraphChart.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { CSSProperties } from "react";
import { DynamicValue } from "mendix";

export type WidthUnitEnum = "percentOfParent" | "pixels";

export type HeightUnitEnum = "percentOfWidth" | "pixels" | "percentOfParent";

export interface SvgForceGraphChartContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    chartTitle: string;
    graphJsonExpression?: DynamicValue<string>;
    graphDataUrl: string;
    loadDemoWhenEmpty: boolean;
    forceUseGroupColors: boolean;
    forceNodeColor: string;
    forceNodeCount: number;
    forceNodeSize: number;
    forceLinkDistance: number;
    forceRepulsion: number;
    widthUnit: WidthUnitEnum;
    widthValue: number;
    heightUnit: HeightUnitEnum;
    heightValue: number;
}

export interface SvgForceGraphChartPreviewProps {
    /**
     * @deprecated Deprecated since version 9.18.0. Please use class property instead.
     */
    className: string;
    class: string;
    style: string;
    styleObject?: CSSProperties;
    readOnly: boolean;
    renderMode: "design" | "xray" | "structure";
    translate: (text: string) => string;
    chartTitle: string;
    graphJsonExpression: string;
    graphDataUrl: string;
    loadDemoWhenEmpty: boolean;
    forceUseGroupColors: boolean;
    forceNodeColor: string;
    forceNodeCount: number | null;
    forceNodeSize: number | null;
    forceLinkDistance: number | null;
    forceRepulsion: number | null;
    widthUnit: WidthUnitEnum;
    widthValue: number | null;
    heightUnit: HeightUnitEnum;
    heightValue: number | null;
}
