import { describe, expect, it } from "@jest/globals";

import { toSurfaceOptions } from "./toSurfaceOptions";

describe("toSurfaceOptions", () => {
    it("maps chart props to SvgChartSurface options", () => {
        expect(
            toSurfaceOptions("line", {
                chartTitle: "Revenue",
                chartWidth: 400,
                chartHeight: 240
            })
        ).toEqual({
            kind: "line",
            title: "Revenue",
            width: 400,
            height: 240
        });
    });
});
