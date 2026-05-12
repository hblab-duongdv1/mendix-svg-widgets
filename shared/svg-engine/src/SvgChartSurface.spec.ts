import { afterEach, beforeEach, describe, expect, it } from "@jest/globals";

import { CHART_LAYOUT_DEFAULTS, SvgChartSurface, computeChartPixelBox, hasChartListData, resolveChartDimensions } from "./index";

describe("resolveChartDimensions", () => {
    it("uses layout defaults when width or height are missing or invalid", () => {
        expect(resolveChartDimensions(undefined, undefined)).toEqual(CHART_LAYOUT_DEFAULTS);
        expect(resolveChartDimensions(null, null)).toEqual(CHART_LAYOUT_DEFAULTS);
        expect(resolveChartDimensions(0, -10)).toEqual(CHART_LAYOUT_DEFAULTS);
        expect(resolveChartDimensions(Number.NaN, 100)).toEqual({ width: CHART_LAYOUT_DEFAULTS.width, height: 100 });
    });

    it("accepts positive size strings (e.g. serialized widget props)", () => {
        expect(resolveChartDimensions("400", "240")).toEqual({ width: 400, height: 240 });
    });

    it("preserves positive finite dimensions", () => {
        expect(resolveChartDimensions(320, 180)).toEqual({ width: 320, height: 180 });
    });
});

describe("computeChartPixelBox", () => {
    it("maps pixels width and height", () => {
        expect(
            computeChartPixelBox(800, 600, {
                widthUnit: "pixels",
                widthValue: 200,
                heightUnit: "pixels",
                heightValue: 120
            })
        ).toEqual({ width: 200, height: 120 });
    });

    it("maps percentage of parent width and percentage of width height", () => {
        expect(
            computeChartPixelBox(400, 500, {
                widthUnit: "percentOfParent",
                widthValue: 50,
                heightUnit: "percentOfWidth",
                heightValue: 75
            })
        ).toEqual({ width: 200, height: 150 });
    });
});

describe("hasChartListData", () => {
    it("is false when list is missing, not available, or empty", () => {
        expect(hasChartListData(undefined)).toBe(false);
        expect(hasChartListData(null)).toBe(false);
        expect(hasChartListData({ status: "loading", items: [] })).toBe(false);
        expect(hasChartListData({ status: "available", items: [] })).toBe(false);
    });

    it("is true when status is available and there are items", () => {
        expect(hasChartListData({ status: "available", items: [{}] })).toBe(true);
    });
});

describe("SvgChartSurface", () => {
    let container: HTMLDivElement;

    beforeEach(() => {
        container = document.createElement("div");
        document.body.appendChild(container);
    });

    afterEach(() => {
        container.remove();
    });

    it("mount inserts svg and renders the title", () => {
        const surface = new SvgChartSurface({
            width: 200,
            height: 120,
            kind: "line",
            title: "Hello"
        });
        surface.mount(container);
        expect(container.querySelector("svg")).not.toBeNull();
        expect(container.textContent).toContain("Hello");
    });

    it("destroy removes svg from the container", () => {
        const surface = new SvgChartSurface({
            width: 100,
            height: 80,
            kind: "bar"
        });
        surface.mount(container);
        expect(container.querySelector("svg")).not.toBeNull();
        surface.destroy();
        expect(container.querySelector("svg")).toBeNull();
    });

    it("renders pie placeholder geometry", () => {
        const surface = new SvgChartSurface({
            width: 120,
            height: 100,
            kind: "pie",
            title: "Pie"
        });
        surface.mount(container);
        expect(container.querySelector("path")).not.toBeNull();
        expect(container.textContent).toContain("Pie");
    });

    it("renders heatmap placeholder grid", () => {
        const surface = new SvgChartSurface({
            width: 160,
            height: 100,
            kind: "heatmap",
            title: "Heat"
        });
        surface.mount(container);
        expect(container.querySelectorAll("rect").length).toBeGreaterThan(20);
        expect(container.textContent).toContain("Heat");
    });

    it("renders force graph placeholder nodes and edges", () => {
        const surface = new SvgChartSurface({
            width: 200,
            height: 120,
            kind: "forceGraph",
            title: "Graph"
        });
        surface.mount(container);
        expect(container.querySelectorAll("circle").length).toBeGreaterThanOrEqual(5);
        expect(container.textContent).toContain("Graph");
    });
});
