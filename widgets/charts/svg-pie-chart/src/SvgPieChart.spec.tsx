import { describe, expect, it } from "@jest/globals";
import { render, waitFor } from "@testing-library/react";
import type { SvgPieChartContainerProps } from "../typings/SvgPieChartProps";
import { SvgPieChart } from "./SvgPieChart";

const baseProps: SvgPieChartContainerProps = {
    name: "SvgPieChart1",
    class: "",
    chartTitle: "Pie share",
    widthUnit: "pixels",
    widthValue: 260,
    heightUnit: "pixels",
    heightValue: 200
};

describe("SvgPieChart", () => {
    it("renders scaffold root with pie classes", () => {
        const { container } = render(<SvgPieChart {...baseProps} />);
        const root = container.querySelector(".charts-scaffold-pie");
        expect(root).not.toBeNull();
        expect(root?.classList.contains("charts-scaffold-widget")).toBe(true);
    });

    it("mounts svg-engine surface with the chart title", async () => {
        const { container } = render(<SvgPieChart {...baseProps} />);
        await waitFor(() => {
            expect(container.querySelector("svg")).not.toBeNull();
        });
        expect(container.textContent).toContain("Pie share");
    });
});
