import { afterEach, beforeEach, describe, expect, it } from "@jest/globals";

import { SvgChartSurface } from "./index";

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
});
