import { SvgLineChartPreviewProps } from "../typings/SvgLineChartProps";

export type Platform = "web" | "desktop";

export type Properties = PropertyGroup[];

type PropertyGroup = {
    caption: string;
    propertyGroups?: PropertyGroup[];
    properties?: Property[];
};

type Property = {
    key: string;
    caption: string;
    description?: string;
    objectHeaders?: string[];
    objects?: ObjectProperties[];
    properties?: Properties[];
};

type ObjectProperties = {
    properties: PropertyGroup[];
    captions?: string[];
};

export type Problem = {
    property?: string;
    severity?: "error" | "warning" | "deprecation";
    message: string;
    studioMessage?: string;
    url?: string;
    studioUrl?: string;
};

export function getProperties(_values: SvgLineChartPreviewProps, defaultProperties: Properties): Properties {
    return defaultProperties;
}
