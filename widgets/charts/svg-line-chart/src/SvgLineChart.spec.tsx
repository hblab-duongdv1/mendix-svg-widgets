import { describe, expect, it } from "@jest/globals";
import { render, waitFor } from "@testing-library/react";
import type { SvgLineChartContainerProps } from "../typings/SvgLineChartProps";
import { SvgLineChart } from "./SvgLineChart";

const baseProps: SvgLineChartContainerProps = {
    name: "SvgLineChart1",
    class: "",
    chartTitle: "Line sales",
    chartWidth: 280,
    chartHeight: 160
};

describe("SvgLineChart", () => {
    it("renders scaffold root with line classes", () => {
        const { container } = render(<SvgLineChart {...baseProps} />);
        const root = container.querySelector(".charts-scaffold-line");
        expect(root).not.toBeNull();
        expect(root?.classList.contains("charts-scaffold-widget")).toBe(true);
    });

    it("mounts svg-engine surface with the chart title", async () => {
        const { container } = render(<SvgLineChart {...baseProps} />);
        await waitFor(() => {
            expect(container.querySelector("svg")).not.toBeNull();
        });
        expect(container.textContent).toContain("Line sales");
    });
});
