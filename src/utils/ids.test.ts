import { describe, expect, it } from "vitest";
import { nextId, randomId } from "./ids";

describe("nextId", () => {
  it("starts at 1 for an empty list", () => {
    expect(nextId([])).toBe(1);
  });

  it("continues after the highest id, regardless of order", () => {
    expect(nextId([{ id: 5 }, { id: 1_700_000_000_000 }, { id: 9 }])).toBe(
      1_700_000_000_001,
    );
  });
});

describe("randomId", () => {
  it("prefixes the id and does not repeat across quick calls", () => {
    const ids = new Set(Array.from({ length: 100 }, () => randomId("c")));
    expect(ids.size).toBe(100);
    for (const id of ids) expect(id).toMatch(/^c-/);
  });
});
