import type { MediaItem, Moment } from "../../types";
import { Pill } from "../ui/UIHelpers";

interface RecentMomentsProps {
  moments: Moment[];
  items: MediaItem[];
  limit?: number;
}

export default function RecentMoments({
  moments,
  items,
  limit = 2,
}: RecentMomentsProps) {
  if (moments.length === 0) {
    return (
      <div className="p-recent-item p-recent-item--empty">
        <div className="p-recent-inner p-recent-empty">
          Nenhum momento memorável arquivado ainda.
        </div>
      </div>
    );
  }

  return moments.slice(0, limit).map((m) => {
    const item = items.find((i) => i.id === m.itemId);
    if (!item) return null;
    return (
      <div key={m.id} className="p-recent-item" data-type={item.type}>
        <div className="p-recent-inner">
          <span className="p-recent-sym">{m.sym}</span>
          <div className="p-recent-content">
            <div className="p-recent-title">
              {item.title} <span className="p-recent-ref">· {m.ref}</span>
            </div>
            <div className="p-recent-body">{m.text}</div>
          </div>
          <Pill type={item.type}>{m.tag}</Pill>
        </div>
      </div>
    );
  });
}
