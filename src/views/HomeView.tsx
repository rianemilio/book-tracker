import { useState } from "react";
import type { MediaItem, Moment, Session, MediaType } from "../types";
import { INK, PAPER, MUTED } from "../constants";
import { Badge, Pill, SectionHead } from "../components/ui/UIHelpers";
import { formatDate } from "../utils/date";
import { progressPercent } from "../utils/progress";

interface HomeViewProps {
  items: MediaItem[];
  moments: Moment[];
  sessions: Session[];
  onTabMoments: () => void;
  onEditItem: (item: MediaItem) => void;
  onQuickProgress: (id: number, delta: number) => void;
}

type FilterType = "all" | MediaType;

export default function HomeView({
  items,
  moments,
  sessions,
  onTabMoments,
  onEditItem,
  onQuickProgress,
}: HomeViewProps) {
  const [filter, setFilter] = useState<FilterType>("all");
  const reading = items.filter((i) => i.status === "reading");
  const filtered =
    filter === "all" ? reading : reading.filter((i) => i.type === filter);

  const cnt = {
    book: items.filter((i) => i.type === "book").length,
    film: items.filter((i) => i.type === "film").length,
    manga: items.filter((i) => i.type === "manga").length,
  };

  const last = sessions[sessions.length - 1];

  return (
    <div>
      <div className="p-stat-grid">
        {(
          [
            ["livros", cnt.book, "book"],
            ["filmes & séries", cnt.film, "film"],
            ["mangás & HQs", cnt.manga, "manga"],
          ] as const
        ).map(([lbl, val, type]) => (
          <div key={lbl} className="p-stat-card" data-type={type}>
            <div className="p-stat-label">{lbl}</div>
            <div className="p-stat-num" style={{ color: INK }}>
              {Number(val)}
            </div>
          </div>
        ))}
      </div>

      {last && (
        <div className="p-insight-bar">
          <span
            style={{
              fontSize: 24,
              fontFamily: "'Courier New',monospace",
              flexShrink: 0,
              fontWeight: "bold",
            }}
          >
            {last.sym}
          </span>
          <div>
            <div
              style={{
                fontSize: 10,
                opacity: 0.7,
                letterSpacing: ".14em",
                textTransform: "uppercase",
                marginBottom: 3,
                fontWeight: "900",
              }}
            >
              última sessão
            </div>
            <div
              style={{
                fontStyle: "italic",
                fontSize: 15,
                fontFamily: "Georgia,serif",
                fontWeight: "700",
              }}
            >
              {items.find((i) => i.id === last.itemId)?.title || "Obra"} ·{" "}
              {last.mood} · {last.ctx}
              {last.createdAt && <> · {formatDate(last.createdAt)}</>}
              {last.note && (
                <span
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontStyle: "normal",
                    fontWeight: "normal",
                    opacity: 0.9,
                    fontFamily: "sans-serif",
                    marginTop: "4px",
                  }}
                >
                  "{last.note}"
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      <SectionHead
        extra={
          <div className="p-filter-row">
            {(
              [
                ["all", "todos"],
                ["book", "livros"],
                ["film", "filmes"],
                ["manga", "mangás"],
              ] as [FilterType, string][]
            ).map(([k, l]) => (
              <button
                key={k}
                className="p-filter-btn"
                onClick={() => setFilter(k)}
                style={{
                  background: filter === k ? INK : "transparent",
                  color: filter === k ? PAPER : MUTED,
                }}
              >
                {l}
              </button>
            ))}
          </div>
        }
      >
        em andamento
      </SectionHead>

      {filtered.length === 0 ? (
        <div
          className="p-drip-add"
          style={{ cursor: "default", marginBottom: "2.5rem" }}
        >
          Nenhuma história em andamento nessa categoria.
        </div>
      ) : (
        <div className="p-item-grid">
          {filtered.map((item) => {
            const pct = progressPercent(item);
            return (
              <div key={item.id} className="p-item-card" data-type={item.type}>
                <Badge type={item.type} />
                <div className="p-item-title">{item.title}</div>
                <div className="p-item-author">{item.creator}</div>
                <div className="p-prog-pct" style={{ color: INK }}>
                  <span>
                    {item.progress} de {item.total} {item.unit}
                  </span>
                </div>
                <div className="p-prog-track">
                  <div className="p-prog-fill" style={{ width: `${pct}%` }} />
                </div>
                <div className="p-prog-pct p-prog-pct--accent">
                  <span>{pct}%</span>
                </div>

                <div className="p-item-controls">
                  <button
                    className="p-ctrl-btn"
                    title="-10"
                    onClick={() => onQuickProgress(item.id, -10)}
                  >
                    -10
                  </button>
                  <button
                    className="p-ctrl-btn"
                    title="-1"
                    onClick={() => onQuickProgress(item.id, -1)}
                  >
                    -
                  </button>
                  <button
                    className="p-ctrl-btn"
                    title="+1"
                    onClick={() => onQuickProgress(item.id, 1)}
                  >
                    +
                  </button>
                  <button
                    className="p-ctrl-btn"
                    title="+10"
                    onClick={() => onQuickProgress(item.id, 10)}
                  >
                    +10
                  </button>
                  <button
                    className="p-ctrl-edit"
                    onClick={() => onEditItem(item)}
                  >
                    ajustar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <SectionHead
        extra={
          <button
            onClick={onTabMoments}
            style={{
              flexShrink: 0,
              marginLeft: 10,
              background: "none",
              border: "none",
              color: INK,
              cursor: "pointer",
              fontSize: 10,
              fontWeight: 900,
              letterSpacing: ".14em",
              textTransform: "uppercase",
            }}
          >
            ver todos
          </button>
        }
      >
        momentos recentes
      </SectionHead>

      {moments.length === 0 ? (
        <div className="p-recent-item" style={{ color: MUTED }}>
          <div
            className="p-recent-inner"
            style={{ padding: "1.2rem", fontStyle: "italic", fontSize: "13px" }}
          >
            Nenhum momento memorável arquivado ainda.
          </div>
        </div>
      ) : (
        moments.slice(0, 2).map((m) => {
          const item = items.find((i) => i.id === m.itemId);
          if (!item) return null;
          return (
            <div key={m.id} className="p-recent-item" data-type={item.type}>
              <div className="p-recent-inner">
                <span className="p-recent-sym" style={{ color: INK }}>
                  {m.sym}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="p-recent-title" style={{ color: INK }}>
                    {item.title} <span className="p-recent-ref">· {m.ref}</span>
                  </div>
                  <div className="p-recent-body">{m.text}</div>
                </div>
                <Pill type={item.type}>{m.tag}</Pill>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
