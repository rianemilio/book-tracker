import type { MediaItem, Session } from "../types";
import ConfirmButton from "../components/ui/ConfirmButton";
import { Badge } from "../components/ui/UIHelpers";
import { formatDate } from "../utils/date";

interface SessionsViewProps {
  items: MediaItem[];
  sessions: Session[];
  onAdd: () => void;
  onEditSession: (session: Session) => void;
  onDeleteSession: (id: number) => void;
}

export default function SessionsView({
  items,
  sessions,
  onAdd,
  onEditSession,
  onDeleteSession,
}: SessionsViewProps) {
  // Sessões novas entram no fim da lista; aqui a mais recente vem primeiro
  const newestFirst = [...sessions].reverse();

  return (
    <div>
      <div className="p-view-head">
        <div className="p-section-head">
          <span className="p-section-label">histórico de sessões</span>
          <div className="p-section-line" />
        </div>
        {items.length > 0 && (
          <button className="p-ghost-btn" onClick={onAdd}>
            + registrar
          </button>
        )}
      </div>

      {newestFirst.length === 0 ? (
        <div className="p-drip-add p-drip-add--static">
          Nenhuma sessão registrada ainda. Use "Registrar Sessão" depois de ler
          ou assistir algo.
        </div>
      ) : (
        newestFirst.map((s) => {
          const item = items.find((i) => i.id === s.itemId);
          if (!item) return null;
          return (
            <div key={s.id} className="p-moment-card" data-type={item.type}>
              <div className="p-moment-inner">
                <div className="p-moment-head">
                  <Badge type={item.type} />
                  <span className="p-moment-title">{item.title}</span>
                  <button
                    className="p-ctrl-edit p-ctrl-edit--plain"
                    onClick={() => onEditSession(s)}
                  >
                    editar
                  </button>
                  <ConfirmButton
                    className="p-ctrl-edit p-ctrl-edit--plain p-ctrl-edit--next"
                    onConfirm={() => onDeleteSession(s.id)}
                  >
                    excluir
                  </ConfirmButton>
                </div>
                {s.note && <div className="p-quote-text">"{s.note}"</div>}
                <div className="p-moment-meta">
                  <span className="p-meta-sym">{s.sym}</span>
                  <span className="p-meta-txt">
                    {s.mood} · {s.ctx}
                    {s.createdAt && <> · {formatDate(s.createdAt)}</>}
                  </span>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
