import { describe, expect, it } from "vitest";
import { NO_FILTER, matchesFilter } from "./filters";

const moment = { itemId: 1, mood: "calmo", tag: "reli 3×" };

describe("matchesFilter", () => {
  it("matches everything without filters", () => {
    expect(matchesFilter(moment, NO_FILTER)).toBe(true);
  });

  it("requires every active filter to match", () => {
    expect(matchesFilter(moment, { ...NO_FILTER, itemId: 1 })).toBe(true);
    expect(matchesFilter(moment, { ...NO_FILTER, itemId: 2 })).toBe(false);
    expect(
      matchesFilter(moment, { itemId: 1, mood: "calmo", tag: "perturbador" }),
    ).toBe(false);
  });

  it("works for records without tags, like sessions", () => {
    const session = { itemId: 1, mood: "calmo" };
    expect(matchesFilter(session, { ...NO_FILTER, mood: "calmo" })).toBe(true);
  });
});
