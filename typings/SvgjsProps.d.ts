/**
 * This file was generated from Svgjs.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { CSSProperties } from "react";
import { ActionValue, EditableValue } from "mendix";
import { Big } from "big.js";

export type BootstrapStyleEnum = "default" | "primary" | "success" | "info" | "inverse" | "warning" | "danger";

export type SvgjsTypeEnum = "badge" | "label" | "forceGraph";

export interface SvgjsContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    valueAttribute?: EditableValue<string | Big>;
    svgjsValue: string;
    bootstrapStyle: BootstrapStyleEnum;
    svgjsType: SvgjsTypeEnum;
    forceGraphJson: string;
    forceGraphDataAttribute?: EditableValue<string>;
    forceGraphHeight: number;
    onClickAction?: ActionValue;
}

export interface SvgjsPreviewProps {
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
    valueAttribute: string;
    svgjsValue: string;
    bootstrapStyle: BootstrapStyleEnum;
    svgjsType: SvgjsTypeEnum;
    forceGraphJson: string;
    forceGraphDataAttribute: string;
    forceGraphHeight: number | null;
    onClickAction: {} | null;
}
