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

  it("backs up corrupt data before falling back", () => {
    localStorage.setItem("k", "{not json");
    renderHook(() => usePersistentState("k", "fallback"));
    expect(localStorage.getItem("k_backup")).toBe("{not json");
  });

  it("sanitizes stored data and backs up the original when it changes", () => {
    localStorage.setItem("k", JSON.stringify([1, "x", 2]));
    const onlyNumbers = (raw: unknown) =>
      (raw as unknown[]).filter((v): v is number => typeof v === "number");
    const { result } = renderHook(() =>
      usePersistentState<number[]>("k", [], onlyNumbers),
    );
    expect(result.current[0]).toEqual([1, 2]);
    expect(localStorage.getItem("k_backup")).toBe('[1,"x",2]');
  });

  it("does not create a backup when stored data is already valid", () => {
    localStorage.setItem("k", "[1,2]");
    renderHook(() =>
      usePersistentState<number[]>("k", [], (raw) => raw as number[]),
    );
    expect(localStorage.getItem("k_backup")).toBeNull();
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
