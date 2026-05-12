import { describe, expect, it } from "@jest/globals";
import { render, waitFor } from "@testing-library/react";
import { ValueStatus } from "mendix";

import type { SvgForceGraphChartContainerProps } from "../typings/SvgForceGraphChartProps";
import { SvgForceGraphChart } from "./SvgForceGraphChart";

const tinyGraph = JSON.stringify({
    nodes: [
        { id: "a", group: 1 },
        { id: "b", group: 2 },
        { id: "c", group: 1 },
        { id: "d", group: 2 },
        { id: "e", group: 1 },
        { id: "f", group: 2 },
        { id: "g", group: 1 },
        { id: "h", group: 2 },
        { id: "i", group: 1 },
        { id: "j", group: 2 },
        { id: "k", group: 1 },
        { id: "l", group: 2 }
    ],
    links: [
        { source: "a", target: "b", value: 2 },
        { source: "b", target: "c", value: 1 }
    ]
});

const baseProps: SvgForceGraphChartContainerProps = {
    name: "SvgForceGraphChart1",
    class: "",
    chartTitle: "Graph demo",
    graphDataUrl: "",
    loadDemoWhenEmpty: false,
    graphJsonExpression: { status: ValueStatus.Available, value: tinyGraph },
    forceUseGroupColors: true,
    forceNodeColor: "#5c5ce6",
    forceNodeCount: 12,
    forceNodeSize: 5,
    forceLinkDistance: 22,
    forceRepulsion: -180,
    widthUnit: "pixels",
    widthValue: 320,
    heightUnit: "pixels",
    heightValue: 220
};

describe("SvgForceGraphChart", () => {
    it("renders root with force graph classes", () => {
        const { container } = render(<SvgForceGraphChart {...baseProps} />);
        const root = container.querySelector(".charts-scaffold-forcegraph");
        expect(root).not.toBeNull();
        expect(root?.classList.contains("charts-scaffold-widget")).toBe(true);
    });

    it("mounts svg with nodes when JSON expression is available", async () => {
        const { container } = render(<SvgForceGraphChart {...baseProps} />);
        await waitFor(() => {
            expect(container.querySelectorAll("circle").length).toBeGreaterThanOrEqual(10);
        });
    });
});
