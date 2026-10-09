import { describe, expect, it } from "vitest";
import { INIT_ITEMS } from "../data/seed";
import { layoutMap, nodeLabel } from "./mapLayout";

const manyItems = Array.from({ length: 20 }, (_, i) => ({
  ...INIT_ITEMS[0],
  id: i + 1,
}));

describe("layoutMap", () => {
  it("places one node per item, the first one straight above the center", () => {
    const { nodes, cx, cy } = layoutMap(INIT_ITEMS, false);
    expect(nodes).toHaveLength(INIT_ITEMS.length);
    expect(nodes[0].x).toBe(Math.round(cx));
    expect(nodes[0].y).toBeLessThan(cy);
  });

  it("keeps the 580x296 minimum frame on wide screens", () => {
    expect(layoutMap(INIT_ITEMS, false)).toMatchObject({
      width: 580,
      height: 296,
    });
  });

  it("drops the minimum frame in compact mode", () => {
    const { width } = layoutMap(INIT_ITEMS, true);
    expect(width).toBeLessThan(580);
  });

  it("grows the drawing to fit many items", () => {
    const { width, height } = layoutMap(manyItems, false);
    expect(width).toBeGreaterThan(580);
    expect(height).toBeGreaterThan(296);
  });
});

describe("nodeLabel", () => {
  it("keeps short titles and truncates long ones", () => {
    expect(nodeLabel("Rashomon")).toBe("Rashomon");
    expect(nodeLabel("O Senhor dos Anéis")).toBe("O Senhor d…");
  });
});
