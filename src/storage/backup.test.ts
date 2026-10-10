import { describe, expect, it } from "vitest";
import {
  INIT_CONNS,
  INIT_ITEMS,
  INIT_MOMENTS,
  INIT_SESSIONS,
} from "../data/seed";
import { backupFileName, parseBackup, serializeBackup } from "./backup";

const data = {
  items: INIT_ITEMS,
  moments: INIT_MOMENTS,
  sessions: INIT_SESSIONS,
  connections: INIT_CONNS,
};

describe("backup", () => {
  it("round-trips the library", () => {
    expect(parseBackup(serializeBackup(data))).toEqual(data);
  });

  it("rejects files that are not app backups", () => {
    expect(() => parseBackup("não é json")).toThrow("JSON válido");
    expect(() => parseBackup(JSON.stringify({ items: [] }))).toThrow(
      "não é um backup",
    );
    expect(() => parseBackup(JSON.stringify([1, 2]))).toThrow(
      "não é um backup",
    );
  });

  it("rejects backups from a newer schema", () => {
    const raw = JSON.parse(serializeBackup(data));
    raw.version = 999;
    expect(() => parseBackup(JSON.stringify(raw))).toThrow("versão mais nova");
  });

  it("rejects backups missing a collection", () => {
    const raw = JSON.parse(serializeBackup(data));
    delete raw.sessions;
    expect(() => parseBackup(JSON.stringify(raw))).toThrow("corrompido");
  });

  it("drops invalid entries and records pointing to missing works", () => {
    const raw = JSON.parse(serializeBackup(data));
    raw.items = [raw.items[0], { title: "sem id" }];
    const parsed = parseBackup(JSON.stringify(raw));
    const id = INIT_ITEMS[0].id;
    expect(parsed.items).toEqual([INIT_ITEMS[0]]);
    expect(parsed.moments.every((m) => m.itemId === id)).toBe(true);
    expect(parsed.sessions.every((s) => s.itemId === id)).toBe(true);
    expect(parsed.connections).toEqual([]);
  });

  it("names the file with the export date", () => {
    expect(backupFileName(new Date("2026-10-10T12:00:00Z"))).toBe(
      "paginas-e-cenas-2026-10-10.json",
    );
  });
});
