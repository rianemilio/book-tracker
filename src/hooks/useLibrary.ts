import { usePersistentState } from "./usePersistentState";
import { withProgress } from "../utils/progress";
import { isConnected } from "../utils/connections";
import { nextId, randomId } from "../utils/ids";
import { STORAGE_PREFIX } from "../storage/schema";
import {
  arrayOf,
  isConnection,
  isMediaItem,
  isMoment,
  isSession,
} from "../storage/validate";
import {
  INIT_CONNS,
  INIT_ITEMS,
  INIT_MOMENTS,
  INIT_SESSIONS,
} from "../data/seed";
import type { Connection, MediaItem, Moment, Session } from "../types";

export type ItemInput = Omit<MediaItem, "id"> & { id?: number };
export type ConnectionInput = Omit<Connection, "id">;
export type MomentInput = Omit<Moment, "id" | "sym" | "createdAt"> & {
  sym?: string;
};
export type SessionInput = Omit<Session, "id" | "sym" | "createdAt"> & {
  sym?: string;
  newProgress?: number;
};

// Estado persistido do app (obras, momentos, sessões e conexões) e as
// operações sobre ele. Não conhece nada da interface.
export function useLibrary() {
  const [items, setItems] = usePersistentState<MediaItem[]>(
    `${STORAGE_PREFIX}items`,
    INIT_ITEMS,
    arrayOf(isMediaItem),
  );
  const [moments, setMoments] = usePersistentState<Moment[]>(
    `${STORAGE_PREFIX}moments`,
    INIT_MOMENTS,
    arrayOf(isMoment),
  );
  const [sessions, setSessions] = usePersistentState<Session[]>(
    `${STORAGE_PREFIX}sessions`,
    INIT_SESSIONS,
    arrayOf(isSession),
  );
  const [connections, setConnections] = usePersistentState<Connection[]>(
    `${STORAGE_PREFIX}connections`,
    INIT_CONNS,
    arrayOf(isConnection),
  );

  const setProgress = (id: number, progress: number) =>
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? withProgress(item, progress) : item,
      ),
    );

  const quickProgress = (id: number, delta: number) =>
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? withProgress(item, item.progress + delta) : item,
      ),
    );

  const saveItem = (data: ItemInput) =>
    setItems((prev) =>
      data.id
        ? prev.map((item) =>
            item.id === data.id ? { ...item, ...data, id: item.id } : item,
          )
        : [...prev, { ...data, id: nextId(prev) }],
    );

  // Remove a obra e tudo que aponta para ela
  const deleteItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    setMoments((prev) => prev.filter((m) => m.itemId !== id));
    setSessions((prev) => prev.filter((s) => s.itemId !== id));
    setConnections((prev) =>
      prev.filter((c) => c.fromId !== id && c.toId !== id),
    );
  };

  const addConnection = (data: ConnectionInput) =>
    setConnections((prev) =>
      isConnected(prev, data.fromId, data.toId)
        ? prev
        : [...prev, { ...data, id: randomId("c") }],
    );

  const deleteConnection = (id: string) =>
    setConnections((prev) => prev.filter((c) => c.id !== id));

  // Momentos novos entram no topo da lista
  const addMoment = (data: MomentInput) =>
    setMoments((prev) => [
      {
        ...data,
        id: nextId(prev),
        sym: data.sym || "★",
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);

  // Edição mantém id e data de criação
  const updateMoment = (id: number, data: MomentInput) =>
    setMoments((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, ...data, sym: data.sym || m.sym } : m,
      ),
    );

  const deleteMoment = (id: number) =>
    setMoments((prev) => prev.filter((m) => m.id !== id));

  const addSession = ({ newProgress, ...data }: SessionInput) => {
    setSessions((prev) => [
      ...prev,
      {
        ...data,
        id: nextId(prev),
        sym: data.sym || "○",
        createdAt: new Date().toISOString(),
      },
    ]);
    if (newProgress !== undefined) setProgress(data.itemId, newProgress);
  };

  // Editar uma sessão não mexe no progresso da obra
  const updateSession = (id: number, data: SessionInput) =>
    setSessions((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              itemId: data.itemId,
              mood: data.mood,
              ctx: data.ctx,
              note: data.note,
              sym: data.sym || s.sym,
            }
          : s,
      ),
    );

  const deleteSession = (id: number) =>
    setSessions((prev) => prev.filter((s) => s.id !== id));

  return {
    items,
    moments,
    sessions,
    connections,
    quickProgress,
    saveItem,
    deleteItem,
    addConnection,
    deleteConnection,
    addMoment,
    updateMoment,
    deleteMoment,
    addSession,
    updateSession,
    deleteSession,
  };
}
