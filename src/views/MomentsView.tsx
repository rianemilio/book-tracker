import type { MediaItem, Moment } from "../types";
import ConfirmButton from "../components/ui/ConfirmButton";
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
      <div className="p-view-head">
        <div className="p-section-head">
          <span className="p-section-label">momentos guardados</span>
          <div className="p-section-line" />
        </div>
        <button className="p-ghost-btn" onClick={onAdd}>
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
          return (
            <div key={m.id} className="p-moment-card" data-type={item.type}>
              <div className="p-moment-inner">
                <div className="p-moment-head">
                  <Badge type={item.type} />
                  <span className="p-moment-title">{item.title}</span>
                  <span className="p-meta-txt">· {m.ref}</span>
                  <ConfirmButton
                    className="p-ctrl-edit p-ctrl-edit--plain"
                    onConfirm={() => onDeleteMoment(m.id)}
                  >
                    excluir
                  </ConfirmButton>
                </div>
                <div className="p-quote-text">"{m.text}"</div>
                <div className="p-moment-meta">
                  <span className="p-meta-sym">{m.sym}</span>
                  <span className="p-meta-txt">
                    {m.mood} · {m.ctx}
                    {m.createdAt && <> · {formatDate(m.createdAt)}</>}
                  </span>
                  <Pill type={item.type}>{m.tag}</Pill>
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
