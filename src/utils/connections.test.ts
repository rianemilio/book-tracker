import { describe, expect, it } from "vitest";
import { isConnected } from "./connections";

const conns = [{ id: "c1", fromId: 1, toId: 2, reason: "x" }];

describe("isConnected", () => {
  it("finds a connection in either direction", () => {
    expect(isConnected(conns, 1, 2)).toBe(true);
    expect(isConnected(conns, 2, 1)).toBe(true);
  });

  it("returns false for unrelated items", () => {
    expect(isConnected(conns, 1, 3)).toBe(false);
  });
});
