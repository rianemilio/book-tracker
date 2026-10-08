import { describe, expect, it } from "vitest";
import { SCHEMA_VERSION, migrateStorage } from "./schema";

const KEY = "paginas_cenas_schema";

describe("migrateStorage", () => {
  it("stamps unversioned data with the current version", () => {
    localStorage.setItem("paginas_cenas_items", "[]");
    migrateStorage();
    expect(localStorage.getItem(KEY)).toBe(String(SCHEMA_VERSION));
    expect(localStorage.getItem("paginas_cenas_items")).toBe("[]");
  });

  it("leaves data from a newer app version untouched", () => {
    localStorage.setItem(KEY, String(SCHEMA_VERSION + 1));
    migrateStorage();
    expect(localStorage.getItem(KEY)).toBe(String(SCHEMA_VERSION + 1));
  });
});
