import type { Connection, MediaItem, Moment, Session } from "../types";

type Rec = Record<string, unknown>;

const isRec = (v: unknown): v is Rec => typeof v === "object" && v !== null;
const isStr = (v: unknown): v is string => typeof v === "string";
const isNum = (v: unknown): v is number =>
  typeof v === "number" && Number.isFinite(v);
const isOptStr = (v: unknown) => v === undefined || isStr(v);

export function isMediaItem(v: unknown): v is MediaItem {
  return (
    isRec(v) &&
    isNum(v.id) &&
    isStr(v.title) &&
    isStr(v.creator) &&
    (v.type === "book" || v.type === "film" || v.type === "manga") &&
    (v.status === "reading" || v.status === "done") &&
    isNum(v.progress) &&
    isNum(v.total) &&
    v.total > 0 &&
    isStr(v.unit)
  );
}

export function isMoment(v: unknown): v is Moment {
  return (
    isRec(v) &&
    isNum(v.id) &&
    isNum(v.itemId) &&
    isStr(v.ref) &&
    isStr(v.text) &&
    isStr(v.mood) &&
    isStr(v.sym) &&
    isStr(v.ctx) &&
    isStr(v.tag) &&
    isOptStr(v.createdAt)
  );
}

export function isSession(v: unknown): v is Session {
  return (
    isRec(v) &&
    isNum(v.id) &&
    isNum(v.itemId) &&
    isStr(v.mood) &&
    isStr(v.sym) &&
    isStr(v.ctx) &&
    isOptStr(v.note) &&
    isOptStr(v.createdAt)
  );
}

export function isConnection(v: unknown): v is Connection {
  return (
    isRec(v) &&
    isStr(v.id) &&
    isNum(v.fromId) &&
    isNum(v.toId) &&
    isStr(v.reason)
  );
}

// Mantém só as entradas válidas; lança erro se o valor nem for uma lista
export function arrayOf<T>(guard: (v: unknown) => v is T) {
  return (raw: unknown): T[] => {
    if (!Array.isArray(raw)) throw new Error("expected an array");
    return raw.filter(guard);
  };
}
