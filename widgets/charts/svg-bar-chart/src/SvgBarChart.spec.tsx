import { describe, expect, it } from "@jest/globals";
import { render, waitFor } from "@testing-library/react";
import type { SvgBarChartContainerProps } from "../typings/SvgBarChartProps";
import { SvgBarChart } from "./SvgBarChart";

const baseProps: SvgBarChartContainerProps = {
    name: "SvgBarChart1",
    class: "",
    chartTitle: "Bar volume",
    widthUnit: "pixels",
    widthValue: 300,
    heightUnit: "pixels",
    heightValue: 180
};

describe("SvgBarChart", () => {
    it("renders scaffold root with bar classes", () => {
        const { container } = render(<SvgBarChart {...baseProps} />);
        const root = container.querySelector(".charts-scaffold-bar");
        expect(root).not.toBeNull();
        expect(root?.classList.contains("charts-scaffold-widget")).toBe(true);
    });

    it("mounts svg-engine surface with the chart title", async () => {
        const { container } = render(<SvgBarChart {...baseProps} />);
        await waitFor(() => {
            expect(container.querySelector("svg")).not.toBeNull();
        });
        expect(container.textContent).toContain("Bar volume");
    });
});
