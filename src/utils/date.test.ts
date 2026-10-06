import { describe, expect, it } from "vitest";
import { formatDate } from "./date";

describe("formatDate", () => {
  it("formats an ISO date in pt-BR", () => {
    expect(formatDate("2026-10-06T12:00:00Z")).toBe("06 de out. de 2026");
  });
});
