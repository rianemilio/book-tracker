import { useState } from "react";
import type { MediaItem, Moment } from "../types";
import { NO_FILTER, matchesFilter } from "../utils/filters";
import JournalFilters from "../components/journal/JournalFilters";
import MomentCard from "../components/journal/MomentCard";

interface MomentsViewProps {
  items: MediaItem[];
  moments: Moment[];
  onAdd: () => void;
  onEditMoment: (moment: Moment) => void;
  onDeleteMoment: (id: number) => void;
  onOpenItem: (id: number) => void;
}

export default function MomentsView({
  items,
  moments,
  onAdd,
  onEditMoment,
  onDeleteMoment,
  onOpenItem,
}: MomentsViewProps) {
  const [filter, setFilter] = useState(NO_FILTER);
  const shown = moments.filter((m) => matchesFilter(m, filter));
  // Só as tags que já foram usadas, na ordem em que aparecem
  const tags = [...new Set(moments.map((m) => m.tag))];

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
        <>
          <JournalFilters
            items={items}
            value={filter}
            onChange={setFilter}
            tags={tags}
          />
          {shown.length === 0 && (
            <div className="p-drip-add p-drip-add--static">
              Nenhum momento com esses filtros.
            </div>
          )}
          {shown.map((m) => {
            const item = items.find((i) => i.id === m.itemId);
            if (!item) return null;
            return (
              <MomentCard
                key={m.id}
                moment={m}
                item={item}
                onEdit={onEditMoment}
                onDelete={onDeleteMoment}
                onOpenItem={onOpenItem}
              />
            );
          })}
          <button type="button" className="p-drip-add" onClick={onAdd}>
            + guardar um momento que ficou com você
          </button>
        </>
      )}
    </div>
  );
}
