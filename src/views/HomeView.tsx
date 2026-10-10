import { useState } from "react";
import type { MediaItem, Moment, Session, MediaType } from "../types";
import { SectionHead } from "../components/ui/UIHelpers";
import DoneList from "../components/home/DoneList";
import ItemCard from "../components/home/ItemCard";
import LastSession from "../components/home/LastSession";
import RecentMoments from "../components/home/RecentMoments";
import StatGrid from "../components/home/StatGrid";

type Filter = "all" | MediaType;

const FILTERS: [Filter, string][] = [
  ["all", "todos"],
  ["book", "livros"],
  ["film", "filmes"],
  ["manga", "mangás"],
];

interface HomeViewProps {
  items: MediaItem[];
  moments: Moment[];
  sessions: Session[];
  onTabMoments: () => void;
  onEditItem: (item: MediaItem) => void;
  onOpenItem: (id: number) => void;
  onQuickProgress: (id: number, delta: number) => void;
}

export default function HomeView({
  items,
  moments,
  sessions,
  onTabMoments,
  onEditItem,
  onOpenItem,
  onQuickProgress,
}: HomeViewProps) {
  const [filter, setFilter] = useState<Filter>("all");
  const shown = items.filter((i) => filter === "all" || i.type === filter);
  const reading = shown.filter((i) => i.status === "reading");
  const done = shown.filter((i) => i.status === "done");
  const lastSession = sessions[sessions.length - 1];

  return (
    <div>
      <StatGrid items={items} />

      {lastSession && <LastSession session={lastSession} items={items} />}

      <SectionHead
        extra={
          <div className="p-filter-row">
            {FILTERS.map(([key, label]) => (
              <button
                key={key}
                className="p-filter-btn"
                aria-pressed={filter === key}
                onClick={() => setFilter(key)}
              >
                {label}
              </button>
            ))}
          </div>
        }
      >
        em andamento
      </SectionHead>

      {reading.length === 0 ? (
        <div className="p-drip-add p-drip-add--static p-home-empty">
          Nenhuma história em andamento nessa categoria.
        </div>
      ) : (
        <div className="p-item-grid">
          {reading.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onQuickProgress={onQuickProgress}
              onEdit={onEditItem}
              onOpen={onOpenItem}
            />
          ))}
        </div>
      )}

      {items.some((i) => i.status === "done") && (
        <>
          <SectionHead>concluídas</SectionHead>
          <DoneList items={done} onEdit={onEditItem} onOpen={onOpenItem} />
        </>
      )}

      <SectionHead
        extra={
          <button className="p-link-btn" onClick={onTabMoments}>
            ver todos
          </button>
        }
      >
        momentos recentes
      </SectionHead>

      <RecentMoments moments={moments} items={items} />
    </div>
  );
}
