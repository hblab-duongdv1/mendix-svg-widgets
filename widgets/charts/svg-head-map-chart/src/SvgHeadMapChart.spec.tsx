import { describe, expect, it } from "@jest/globals";
import { render, waitFor } from "@testing-library/react";
import type { SvgHeadMapChartContainerProps } from "../typings/SvgHeadMapChartProps";
import { SvgHeadMapChart } from "./SvgHeadMapChart";

const baseProps: SvgHeadMapChartContainerProps = {
    name: "SvgHeadMapChart1",
    class: "",
    chartTitle: "Heat demo",
    widthUnit: "pixels",
    widthValue: 280,
    heightUnit: "pixels",
    heightValue: 200
};

describe("SvgHeadMapChart", () => {
    it("renders scaffold root with heatmap classes", () => {
        const { container } = render(<SvgHeadMapChart {...baseProps} />);
        const root = container.querySelector(".charts-scaffold-heatmap");
        expect(root).not.toBeNull();
        expect(root?.classList.contains("charts-scaffold-widget")).toBe(true);
    });

    it("mounts svg-engine surface with the chart title", async () => {
        const { container } = render(<SvgHeadMapChart {...baseProps} />);
        await waitFor(() => {
            expect(container.querySelector("svg")).not.toBeNull();
        });
        expect(container.textContent).toContain("Heat demo");
    });
});
