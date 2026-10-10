import type { Connection, MediaItem, Moment, Session } from "../types";
import { SCHEMA_VERSION } from "./schema";
import {
  arrayOf,
  isConnection,
  isMediaItem,
  isMoment,
  isSession,
} from "./validate";

export interface LibraryData {
  items: MediaItem[];
  moments: Moment[];
  sessions: Session[];
  connections: Connection[];
}

const APP_ID = "paginas-cenas";

export function serializeBackup(data: LibraryData, now = new Date()) {
  return JSON.stringify(
    {
      app: APP_ID,
      version: SCHEMA_VERSION,
      exportedAt: now.toISOString(),
      ...data,
    },
    null,
    2,
  );
}

// Lê um arquivo de backup. Lança erro com mensagem para o usuário se o
// arquivo não for um backup do app; entradas inválidas ou que apontam para
// obras inexistentes são descartadas.
export function parseBackup(text: string): LibraryData {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    throw new Error("O arquivo não é um JSON válido.");
  }
  if (typeof raw !== "object" || raw === null || !("app" in raw)) {
    throw new Error("O arquivo não é um backup do Páginas & Cenas.");
  }
  const rec = raw as Record<string, unknown>;
  if (rec.app !== APP_ID) {
    throw new Error("O arquivo não é um backup do Páginas & Cenas.");
  }
  if (typeof rec.version !== "number" || rec.version > SCHEMA_VERSION) {
    throw new Error("O backup é de uma versão mais nova do app.");
  }

  try {
    const items = arrayOf(isMediaItem)(rec.items);
    const ids = new Set(items.map((i) => i.id));
    return {
      items,
      moments: arrayOf(isMoment)(rec.moments).filter((m) => ids.has(m.itemId)),
      sessions: arrayOf(isSession)(rec.sessions).filter((s) =>
        ids.has(s.itemId),
      ),
      connections: arrayOf(isConnection)(rec.connections).filter(
        (c) => ids.has(c.fromId) && ids.has(c.toId),
      ),
    };
  } catch {
    throw new Error("O backup está incompleto ou corrompido.");
  }
}

export function backupFileName(now = new Date()) {
  return `paginas-e-cenas-${now.toISOString().slice(0, 10)}.json`;
}
