import { describe, expect, it } from "@jest/globals";

import { buildSimGraph, clampForceNodeCount, parseGraphJson } from "./parseGraphPayload";

const sample = `{
  "nodes": [
    { "id": "a", "group": 1 },
    { "id": "b", "group": 2 },
    { "id": "c", "group": 1 },
    { "id": "d", "group": 3 },
    { "id": "e", "group": 2 },
    { "id": "f", "group": 1 },
    { "id": "g", "group": 2 },
    { "id": "h", "group": 3 },
    { "id": "i", "group": 1 },
    { "id": "j", "group": 2 },
    { "id": "k", "group": 1 },
    { "id": "l", "group": 2 }
  ],
  "links": [
    { "source": "a", "target": "b", "value": 4 },
    { "source": "b", "target": "c", "value": 1 },
    { "source": "x", "target": "y", "value": 1 }
  ]
}`;

describe("parseGraphJson", () => {
    it("parses nodes and links with string endpoints", () => {
        const p = parseGraphJson(sample);
        expect(p).not.toBeNull();
        expect(p!.nodes).toHaveLength(12);
        expect(p!.links).toHaveLength(2);
        expect(p!.links[0]!.source).toBe("a");
    });

    it("returns null for invalid json", () => {
        expect(parseGraphJson("")).toBeNull();
        expect(parseGraphJson("{")).toBeNull();
    });
});

describe("clampForceNodeCount", () => {
    it("clamps between 10 and length when graph is large enough", () => {
        const p = parseGraphJson(sample)!;
        expect(clampForceNodeCount(3, p)).toBe(10);
        expect(clampForceNodeCount(50, p)).toBe(12);
        expect(clampForceNodeCount(11, p)).toBe(11);
    });
});

describe("buildSimGraph", () => {
    it("keeps only links whose endpoints exist in the node slice", () => {
        const p = parseGraphJson(sample)!;
        const { nodes, links } = buildSimGraph(p, 4);
        expect(nodes).toHaveLength(4);
        expect(links.length).toBeGreaterThan(0);
        for (const l of links) {
            expect(nodes.some(n => n.id === l.source.id)).toBe(true);
            expect(nodes.some(n => n.id === l.target.id)).toBe(true);
        }
    });
});
