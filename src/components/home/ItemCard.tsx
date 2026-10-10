import type { MediaItem } from "../../types";
import { progressPercent } from "../../utils/progress";
import { Badge, TitleLink } from "../ui/UIHelpers";

// Atalhos de progresso: [variação, rótulo]
const STEPS: [number, string][] = [
  [-10, "-10"],
  [-1, "-"],
  [1, "+"],
  [10, "+10"],
];

interface ItemCardProps {
  item: MediaItem;
  onQuickProgress: (id: number, delta: number) => void;
  onEdit: (item: MediaItem) => void;
  onOpen?: (id: number) => void;
}

export default function ItemCard({
  item,
  onQuickProgress,
  onEdit,
  onOpen,
}: ItemCardProps) {
  const pct = progressPercent(item);

  return (
    <div className="p-item-card" data-type={item.type}>
      <Badge type={item.type} />
      <div className="p-item-title">
        <TitleLink item={item} onOpen={onOpen} />
      </div>
      <div className="p-item-author">{item.creator}</div>
      <div className="p-prog-pct">
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
        {STEPS.map(([delta, label]) => (
          <button
            key={delta}
            className="p-ctrl-btn"
            title={delta > 0 ? `+${delta}` : String(delta)}
            onClick={() => onQuickProgress(item.id, delta)}
          >
            {label}
          </button>
        ))}
        <button className="p-ctrl-edit" onClick={() => onEdit(item)}>
          ajustar
        </button>
      </div>
    </div>
  );
}
