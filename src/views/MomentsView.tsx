import type { MediaItem, Moment } from "../types";
import { TC, INK } from "../constants";
import { Badge, Pill } from "../components/ui/UIHelpers";
import { formatDate } from "../utils/date";

interface MomentsViewProps {
  items: MediaItem[];
  moments: Moment[];
  onAdd: () => void;
  onDeleteMoment: (id: number) => void;
}

export default function MomentsView({
  items,
  moments,
  onAdd,
  onDeleteMoment,
}: MomentsViewProps) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.5rem",
        }}
      >
        <div className="p-section-head" style={{ margin: 0, flex: 1 }}>
          <span className="p-section-label">momentos guardados</span>
          <div className="p-section-line" />
        </div>
        <button
          className="p-ghost-btn"
          onClick={onAdd}
          style={{ marginLeft: 14, flexShrink: 0 }}
        >
          + guardar
        </button>
      </div>

      {moments.length === 0 ? (
        <button type="button" className="p-drip-add" onClick={onAdd}>
          + Você ainda não guardou momentos. Clique para catalogar o primeiro.
        </button>
      ) : (
        moments.map((m) => {
          const item = items.find((i) => i.id === m.itemId);
          if (!item) return null;
          const c = TC[item.type];
          return (
            <div key={m.id} className="p-moment-card" style={{ color: c }}>
              <div className="p-moment-inner">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 10,
                  }}
                >
                  <Badge type={item.type} />
                  <span
                    style={{
                      fontWeight: 900,
                      fontStyle: "italic",
                      fontSize: 16,
                      color: INK,
                      fontFamily: "Georgia,serif",
                    }}
                  >
                    {item.title}
                  </span>
                  <span className="p-meta-txt">· {m.ref}</span>
                  <button
                    className="p-ctrl-edit"
                    style={{ marginLeft: "auto", textDecoration: "none" }}
                    onClick={() => onDeleteMoment(m.id)}
                  >
                    excluir
                  </button>
                </div>
                <div
                  className="p-quote-text"
                  style={{ borderLeft: `3px solid ${INK}` }}
                >
                  "{m.text}"
                </div>
                <div className="p-moment-meta">
                  <span className="p-meta-sym" style={{ color: INK }}>
                    {m.sym}
                  </span>
                  <span className="p-meta-txt" style={{ color: INK }}>
                    {m.mood} · {m.ctx}
                    {m.createdAt && <> · {formatDate(m.createdAt)}</>}
                  </span>
                  <Pill bg={c}>{m.tag}</Pill>
                </div>
              </div>
            </div>
          );
        })
      )}
      {moments.length > 0 && (
        <button type="button" className="p-drip-add" onClick={onAdd}>
          + guardar um momento que ficou com você
        </button>
      )}
    </div>
  );
}
