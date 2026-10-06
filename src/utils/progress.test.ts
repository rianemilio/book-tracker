import { describe, expect, it } from "vitest";
import type { MediaItem } from "../types";
import { progressPercent, withProgress } from "./progress";

const item: MediaItem = {
  id: 1,
  title: "Berserk",
  creator: "Kentaro Miura",
  type: "manga",
  status: "reading",
  progress: 300,
  total: 364,
  unit: "cap.",
};

describe("withProgress", () => {
  it("updates progress and keeps reading below the total", () => {
    expect(withProgress(item, 310)).toMatchObject({
      progress: 310,
      status: "reading",
    });
  });

  it("marks the item as done when progress reaches the total", () => {
    expect(withProgress(item, 364)).toMatchObject({
      progress: 364,
      status: "done",
    });
  });

  it("clamps progress to the [0, total] range", () => {
    expect(withProgress(item, 999).progress).toBe(364);
    expect(withProgress(item, -5).progress).toBe(0);
  });

  it("moves a done item back to reading when progress drops", () => {
    const done = { ...item, progress: 364, status: "done" as const };
    expect(withProgress(done, 363).status).toBe("reading");
  });
});

describe("progressPercent", () => {
  it("rounds to the nearest integer", () => {
    expect(progressPercent({ ...item, progress: 1, total: 3 })).toBe(33);
  });

  it("caps at 100 for legacy data with progress above total", () => {
    expect(progressPercent({ ...item, progress: 500, total: 100 })).toBe(100);
  });

  it("returns 0 instead of NaN for an empty total", () => {
    expect(progressPercent({ ...item, progress: 0, total: 0 })).toBe(0);
  });
});
