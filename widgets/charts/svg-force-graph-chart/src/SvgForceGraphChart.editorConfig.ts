import { SvgForceGraphChartPreviewProps } from "../typings/SvgForceGraphChartProps";

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

export function getProperties(_values: SvgForceGraphChartPreviewProps, defaultProperties: Properties): Properties {
    return defaultProperties;
}
