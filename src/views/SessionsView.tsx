import { useState } from "react";
import type { MediaItem, Session } from "../types";
import { NO_FILTER, matchesFilter } from "../utils/filters";
import HabitsPanel from "../components/journal/HabitsPanel";
import JournalFilters from "../components/journal/JournalFilters";
import SessionCard from "../components/journal/SessionCard";
import { SectionHead } from "../components/ui/UIHelpers";

interface SessionsViewProps {
  items: MediaItem[];
  sessions: Session[];
  onAdd: () => void;
  onEditSession: (session: Session) => void;
  onDeleteSession: (id: number) => void;
  onOpenItem: (id: number) => void;
}

export default function SessionsView({
  items,
  sessions,
  onAdd,
  onEditSession,
  onDeleteSession,
  onOpenItem,
}: SessionsViewProps) {
  const [filter, setFilter] = useState(NO_FILTER);
  // Sessões novas entram no fim da lista; aqui a mais recente vem primeiro
  const shown = sessions.filter((s) => matchesFilter(s, filter)).reverse();

  return (
    <div>
      <div className="p-view-head">
        <div className="p-section-head">
          <span className="p-section-label">seus hábitos</span>
          <div className="p-section-line" />
        </div>
        {items.length > 0 && (
          <button className="p-ghost-btn" onClick={onAdd}>
            + registrar
          </button>
        )}
      </div>

      {sessions.length === 0 ? (
        <div className="p-drip-add p-drip-add--static">
          Nenhuma sessão registrada ainda. Use "Registrar Sessão" depois de ler
          ou assistir algo.
        </div>
      ) : (
        <>
          <HabitsPanel sessions={sessions} items={items} />

          <SectionHead>histórico de sessões</SectionHead>
          <JournalFilters items={items} value={filter} onChange={setFilter} />

          {shown.length === 0 && (
            <div className="p-drip-add p-drip-add--static">
              Nenhuma sessão com esses filtros.
            </div>
          )}
          {shown.map((s) => {
            const item = items.find((i) => i.id === s.itemId);
            if (!item) return null;
            return (
              <SessionCard
                key={s.id}
                session={s}
                item={item}
                onEdit={onEditSession}
                onDelete={onDeleteSession}
                onOpenItem={onOpenItem}
              />
            );
          })}
        </>
      )}
    </div>
  );
}
