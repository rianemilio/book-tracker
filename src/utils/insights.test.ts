import { describe, expect, it } from "vitest";
import { INIT_ITEMS } from "../data/seed";
import type { Session } from "../types";
import { mostCommon, sessionInsights } from "./insights";

const session = (over: Partial<Session>): Session => ({
  id: 1,
  itemId: 1,
  mood: "calmo",
  sym: "○",
  ctx: "no metrô",
  ...over,
});

describe("mostCommon", () => {
  it("returns null for an empty list", () => {
    expect(mostCommon([])).toBeNull();
  });

  it("counts the most frequent value and keeps the first on a tie", () => {
    expect(mostCommon(["a", "b", "b", "a", "c"])).toEqual({
      value: "a",
      count: 2,
    });
  });
});

describe("sessionInsights", () => {
  const now = new Date("2026-10-10T12:00:00Z");

  it("summarizes moods, places and the most read work", () => {
    const sessions = [
      session({ id: 1, itemId: 2, mood: "inspirado" }),
      session({ id: 2, itemId: 2, ctx: "de manhã" }),
      session({ id: 3, itemId: 1, mood: "inspirado" }),
    ];
    const result = sessionInsights(sessions, INIT_ITEMS, now);
    expect(result.total).toBe(3);
    expect(result.mood).toEqual({ value: "inspirado", count: 2 });
    expect(result.ctx).toEqual({ value: "no metrô", count: 2 });
    expect(result.item?.value.id).toBe(2);
    expect(result.item?.count).toBe(2);
  });

  it("counts only dated sessions from the last 30 days", () => {
    const sessions = [
      session({ id: 1, createdAt: "2026-10-01T10:00:00Z" }),
      session({ id: 2, createdAt: "2026-08-01T10:00:00Z" }),
      session({ id: 3 }),
    ];
    expect(sessionInsights(sessions, INIT_ITEMS, now).lastMonth).toBe(1);
  });

  it("handles no sessions", () => {
    expect(sessionInsights([], INIT_ITEMS, now)).toEqual({
      total: 0,
      lastMonth: 0,
      mood: null,
      ctx: null,
      item: null,
    });
  });
});
