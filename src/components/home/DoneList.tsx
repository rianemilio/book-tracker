import type { MediaItem } from "../../types";
import { Badge, TitleLink } from "../ui/UIHelpers";

interface DoneListProps {
  items: MediaItem[];
  onEdit: (item: MediaItem) => void;
  onOpen: (id: number) => void;
}

// Obras concluídas em linhas compactas; "ajustar" permite reabrir
export default function DoneList({ items, onEdit, onOpen }: DoneListProps) {
  if (items.length === 0) {
    return (
      <div className="p-drip-add p-drip-add--static p-home-empty">
        Nenhuma obra concluída nessa categoria.
      </div>
    );
  }

  return (
    <div className="p-done-list">
      {items.map((item) => (
        <div key={item.id} className="p-recent-item" data-type={item.type}>
          <div className="p-recent-inner p-done-inner">
            <Badge type={item.type} />
            <div className="p-recent-content">
              <div className="p-recent-title">
                <TitleLink item={item} onOpen={onOpen} />
              </div>
              <div className="p-recent-body">
                {item.creator} · {item.total} {item.unit}
              </div>
            </div>
            <button className="p-ctrl-edit" onClick={() => onEdit(item)}>
              ajustar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
