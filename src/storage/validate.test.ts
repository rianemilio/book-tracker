import { describe, expect, it } from "vitest";
import {
  INIT_CONNS,
  INIT_ITEMS,
  INIT_MOMENTS,
  INIT_SESSIONS,
} from "../data/seed";
import {
  arrayOf,
  isConnection,
  isMediaItem,
  isMoment,
  isSession,
} from "./validate";

describe("storage validators", () => {
  it("accept the seed data", () => {
    expect(INIT_ITEMS.every(isMediaItem)).toBe(true);
    expect(INIT_MOMENTS.every(isMoment)).toBe(true);
    expect(INIT_SESSIONS.every(isSession)).toBe(true);
    expect(INIT_CONNS.every(isConnection)).toBe(true);
  });

  it("reject items with a wrong type or a non-positive total", () => {
    expect(isMediaItem({ ...INIT_ITEMS[0], type: "podcast" })).toBe(false);
    expect(isMediaItem({ ...INIT_ITEMS[0], total: 0 })).toBe(false);
    expect(isMediaItem({ ...INIT_ITEMS[0], progress: "12" })).toBe(false);
  });

  it("accept optional fields only when they are strings", () => {
    expect(isSession({ ...INIT_SESSIONS[0], note: undefined })).toBe(true);
    expect(isSession({ ...INIT_SESSIONS[0], createdAt: 123 })).toBe(false);
  });
});

describe("arrayOf", () => {
  it("drops invalid entries and keeps the valid ones", () => {
    const clean = arrayOf(isConnection)([INIT_CONNS[0], { id: 1 }, null]);
    expect(clean).toEqual([INIT_CONNS[0]]);
  });

  it("throws when the value is not an array", () => {
    expect(() => arrayOf(isConnection)({})).toThrow();
  });
});
