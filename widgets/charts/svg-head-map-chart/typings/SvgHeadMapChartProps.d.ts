/**
 * This file was generated from SvgHeadMapChart.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { CSSProperties } from "react";
import { ListValue, ListAttributeValue } from "mendix";
import { Big } from "big.js";

export type WidthUnitEnum = "percentOfParent" | "pixels";

export type HeightUnitEnum = "percentOfWidth" | "pixels" | "percentOfParent";

export interface SvgHeadMapChartContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    chartTitle: string;
    chartData?: ListValue;
    seriesCategoryAttribute?: ListAttributeValue<string | Big>;
    seriesValueAttribute?: ListAttributeValue<Big>;
    widthUnit: WidthUnitEnum;
    widthValue: number;
    heightUnit: HeightUnitEnum;
    heightValue: number;
}

export interface SvgHeadMapChartPreviewProps {
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
    chartData: {} | { caption: string } | { type: string } | null;
    seriesCategoryAttribute: string;
    seriesValueAttribute: string;
    widthUnit: WidthUnitEnum;
    widthValue: number | null;
    heightUnit: HeightUnitEnum;
    heightValue: number | null;
}
