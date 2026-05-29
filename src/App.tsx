import React, { useState, useEffect } from "react";
import "./App.css";

import type { MediaItem, Moment, Connection, Session } from "./types";
import {
  INK,
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

  const [items, setItems] = useState<MediaItem[]>(() => {
    const saved = localStorage.getItem("paginas_cenas_items");
    return saved ? JSON.parse(saved) : INIT_ITEMS;
  });

  const [moments, setMoments] = useState<Moment[]>(() => {
    const saved = localStorage.getItem("paginas_cenas_moments");
    return saved ? JSON.parse(saved) : INIT_MOMENTS;
  });

  const [sessions, setSessions] = useState<Session[]>(() => {
    const saved = localStorage.getItem("paginas_cenas_sessions");
    return saved ? JSON.parse(saved) : INIT_SESSIONS;
  });

  const [connections, setConnections] = useState<Connection[]>(() => {
    const saved = localStorage.getItem("paginas_cenas_connections");
    return saved ? JSON.parse(saved) : INIT_CONNS;
  });

  const [showMood, setShowMood] = useState(false);
  const [showMoment, setShowMoment] = useState(false);
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  const [showNewItem, setShowNewItem] = useState(false);

  useEffect(() => {
    localStorage.setItem("paginas_cenas_items", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem("paginas_cenas_moments", JSON.stringify(moments));
  }, [moments]);

  useEffect(() => {
    localStorage.setItem("paginas_cenas_sessions", JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem(
      "paginas_cenas_connections",
      JSON.stringify(connections),
    );
  }, [connections]);

  const handleQuickProgress = (id: number, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextProg = Math.min(
            item.total,
            Math.max(0, item.progress + delta),
          );
          const autoStatus = nextProg === item.total ? "done" : "reading";
          return { ...item, progress: nextProg, status: autoStatus };
        }
        return item;
      }),
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
      const newItem: MediaItem = { ...data, id: Date.now() } as MediaItem;
      setItems((prev) => [...prev, newItem]);
    }
    setEditingItem(null);
    setShowNewItem(false);
  };

  const handleDeleteItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    setMoments((prev) => prev.filter((m) => m.itemId !== id));
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
    const newConn: Connection = { ...data, id: `c-${Date.now()}` };
    setConnections((prev) => [...prev, newConn]);
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
      { id: Date.now(), itemId, mood, ctx, note, sym: sym || "○" },
    ]);

    if (newProgress !== undefined) {
      setItems((prev) =>
        prev.map((item) => {
          if (item.id === itemId) {
            const autoStatus = newProgress === item.total ? "done" : "reading";
            return { ...item, progress: newProgress, status: autoStatus };
          }
          return item;
        }),
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
              { id: Date.now(), ...d, sym: d.sym || "★" },
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
        <div className="p-header-drips">
          <svg
            viewBox="0 0 1440 24"
            preserveAspectRatio="none"
            style={{
              display: "block",
              width: "100%",
              height: "24px",
              fill: INK,
            }}
          >
            <path d="M0,0 L1440,0 L1440,6 Q1420,18 1400,6 Q1380,2 1360,14 Q1320,24 1290,10 Q1250,2 1220,18 Q1180,22 1150,10 Q1100,0 1060,14 Q1020,24 980,10 Q950,2 920,18 Q880,22 850,10 Q800,0 760,14 Q720,24 680,10 Q650,2 620,18 Q580,22 550,10 Q500,0 460,14 Q420,24 380,10 Q350,2 320,18 Q280,22 250,10 Q200,0 160,14 Q120,24 80,10 Q50,2 20,18 L0,8 Z" />
          </svg>
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
