import { useState } from "react";
import "./App.css";
import { usePersistentState } from "./hooks/usePersistentState";
import { withProgress } from "./utils/progress";
import { isConnected } from "./utils/connections";
import { nextId, randomId } from "./utils/ids";

import type { MediaItem, Moment, Connection, Session } from "./types";
import {
  INIT_ITEMS,
  INIT_MOMENTS,
  INIT_CONNS,
  INIT_SESSIONS,
} from "./constants";

// Importação das Views
import HomeView from "./views/HomeView";
import MapView from "./views/MapView";
import MomentsView from "./views/MomentsView";

// Importação dos Modais
import MoodModal from "./components/modals/MoodModal";
import MomentModal from "./components/modals/MomentModal";
import ItemModal from "./components/modals/ItemModal";

export default function App() {
  const [tab, setTab] = useState<"home" | "map" | "moments">("home");

  const [items, setItems] = usePersistentState<MediaItem[]>(
    "paginas_cenas_items",
    INIT_ITEMS,
  );

  const [moments, setMoments] = usePersistentState<Moment[]>(
    "paginas_cenas_moments",
    INIT_MOMENTS,
  );

  const [sessions, setSessions] = usePersistentState<Session[]>(
    "paginas_cenas_sessions",
    INIT_SESSIONS,
  );

  const [connections, setConnections] = usePersistentState<Connection[]>(
    "paginas_cenas_connections",
    INIT_CONNS,
  );

  const [showMood, setShowMood] = useState(false);
  const [showMoment, setShowMoment] = useState(false);
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  const [showNewItem, setShowNewItem] = useState(false);

  const handleQuickProgress = (id: number, delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? withProgress(item, item.progress + delta) : item,
      ),
    );
  };

  const handleSaveItem = (data: Omit<MediaItem, "id"> & { id?: number }) => {
    if (data.id) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === data.id ? ({ ...item, ...data } as MediaItem) : item,
        ),
      );
    } else {
      setItems((prev) => [...prev, { ...data, id: nextId(prev) } as MediaItem]);
    }
    setEditingItem(null);
    setShowNewItem(false);
  };

  const handleDeleteItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    setMoments((prev) => prev.filter((m) => m.itemId !== id));
    setSessions((prev) => prev.filter((s) => s.itemId !== id));
    setConnections((prev) =>
      prev.filter((c) => c.fromId !== id && c.toId !== id),
    );
    setEditingItem(null);
  };

  const handleAddConnection = (data: {
    fromId: number;
    toId: number;
    reason: string;
  }) => {
    const newConn: Connection = { ...data, id: randomId("c") };
    setConnections((prev) =>
      isConnected(prev, data.fromId, data.toId) ? prev : [...prev, newConn],
    );
  };

  const handleDeleteConnection = (id: string) => {
    setConnections((prev) => prev.filter((c) => c.id !== id));
  };

  const handleDeleteMoment = (id: number) => {
    setMoments((prev) => prev.filter((m) => m.id !== id));
  };

  const handleSaveSession = (data: {
    itemId: number;
    mood: string;
    ctx: string;
    note: string;
    sym?: string;
    newProgress?: number;
  }) => {
    const { itemId, mood, ctx, note, sym, newProgress } = data;

    setSessions((prev) => [
      ...prev,
      {
        id: nextId(prev),
        itemId,
        mood,
        ctx,
        note,
        sym: sym || "○",
        createdAt: new Date().toISOString(),
      },
    ]);

    if (newProgress !== undefined) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? withProgress(item, newProgress) : item,
        ),
      );
    }
    setShowMood(false);
  };

  return (
    <>
      {showMood && items.length > 0 && (
        <MoodModal
          items={items}
          onSave={handleSaveSession}
          onClose={() => setShowMood(false)}
        />
      )}

      {showMoment && items.length > 0 && (
        <MomentModal
          items={items}
          onSave={(d) => {
            setMoments((p) => [
              {
                id: nextId(p),
                ...d,
                sym: d.sym || "★",
                createdAt: new Date().toISOString(),
              },
              ...p,
            ]);
            setShowMoment(false);
          }}
          onClose={() => setShowMoment(false)}
        />
      )}

      {(showNewItem || editingItem) && (
        <ItemModal
          item={editingItem}
          onSave={handleSaveItem}
          onDelete={handleDeleteItem}
          onClose={() => {
            setEditingItem(null);
            setShowNewItem(false);
          }}
        />
      )}

      <div className="p-header-container">
        <div className="p-header">
          <div>
            <div className="p-logo">Páginas & Cenas</div>
            <div className="p-logo-sub">seu universo de histórias</div>
          </div>
          <div className="p-header-actions">
            <button
              className="p-reg-btn secondary"
              onClick={() => setShowNewItem(true)}
            >
              + Nova Obra
            </button>
            <button
              className="p-reg-btn"
              disabled={items.length === 0}
              onClick={() => setShowMood(true)}
            >
              + Registrar Sessão
            </button>
          </div>
        </div>
      </div>

      <div className="p-nav">
        {(
          [
            ["home", "início"],
            ["map", "mapa"],
            ["moments", "momentos"],
          ] as const
        ).map(([k, l]) => (
          <button
            key={k}
            className={`p-nav-btn${tab === k ? " active" : ""}`}
            onClick={() => setTab(k)}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="p-body">
        {tab === "home" && (
          <HomeView
            items={items}
            moments={moments}
            sessions={sessions}
            onTabMoments={() => setTab("moments")}
            onEditItem={setEditingItem}
            onQuickProgress={handleQuickProgress}
          />
        )}
        {tab === "map" && (
          <MapView
            items={items}
            moments={moments}
            connections={connections}
            onAddConnection={handleAddConnection}
            onDeleteConnection={handleDeleteConnection}
          />
        )}
        {tab === "moments" && (
          <MomentsView
            items={items}
            moments={moments}
            onAdd={() => setShowMoment(true)}
            onDeleteMoment={handleDeleteMoment}
          />
        )}
      </div>
    </>
  );
}
