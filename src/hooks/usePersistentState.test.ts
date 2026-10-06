import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { usePersistentState } from "./usePersistentState";

describe("usePersistentState", () => {
  it("uses the initial value when nothing is stored", () => {
    const { result } = renderHook(() => usePersistentState("k", [1, 2]));
    expect(result.current[0]).toEqual([1, 2]);
  });

  it("loads a previously stored value", () => {
    localStorage.setItem("k", JSON.stringify({ a: 1 }));
    const { result } = renderHook(() => usePersistentState("k", {}));
    expect(result.current[0]).toEqual({ a: 1 });
  });

  it("persists updates to localStorage", () => {
    const { result } = renderHook(() => usePersistentState("k", 0));
    act(() => result.current[1](42));
    expect(localStorage.getItem("k")).toBe("42");
  });

  it("falls back to the initial value on corrupt data", () => {
    localStorage.setItem("k", "{not json");
    const { result } = renderHook(() => usePersistentState("k", "fallback"));
    expect(result.current[0]).toBe("fallback");
  });

  it("keeps working in memory when storage writes fail", () => {
    const spy = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new Error("QuotaExceededError");
      });
    const { result } = renderHook(() => usePersistentState("k", 0));
    act(() => result.current[1](7));
    expect(result.current[0]).toBe(7);
    spy.mockRestore();
  });
});
