import type { Connection, MediaItem, Moment, Session } from "../types";
import { MOODS } from "../constants";
import { formatDate } from "../utils/date";
import { mostCommon } from "../utils/insights";
import ItemCard from "../components/home/ItemCard";
import MomentCard from "../components/journal/MomentCard";
import SessionCard from "../components/journal/SessionCard";
import { SectionHead } from "../components/ui/UIHelpers";

interface ItemViewProps {
  item: MediaItem;
  items: MediaItem[];
  sessions: Session[];
  moments: Moment[];
  connections: Connection[];
  onBack: () => void;
  onOpenItem: (id: number) => void;
  onEditItem: (item: MediaItem) => void;
  onQuickProgress: (id: number, delta: number) => void;
  onNewSession: (itemId: number) => void;
  onEditSession: (session: Session) => void;
  onDeleteSession: (id: number) => void;
  onNewMoment: (itemId: number) => void;
  onEditMoment: (moment: Moment) => void;
  onDeleteMoment: (id: number) => void;
}

// Tudo de uma obra num lugar só: progresso, sessões, momentos e conexões
export default function ItemView({
  item,
  items,
  sessions,
  moments,
  connections,
  onBack,
  onOpenItem,
  onEditItem,
  onQuickProgress,
  onNewSession,
  onEditSession,
  onDeleteSession,
  onNewMoment,
  onEditMoment,
  onDeleteMoment,
}: ItemViewProps) {
  const own = sessions.filter((s) => s.itemId === item.id).reverse();
  const ownMoments = moments.filter((m) => m.itemId === item.id);
  const links = connections.flatMap((c) => {
    if (c.fromId !== item.id && c.toId !== item.id) return [];
    const other = items.find(
      (i) => i.id === (c.fromId === item.id ? c.toId : c.fromId),
    );
    return other ? [{ connection: c, other }] : [];
  });
  const mood = mostCommon(own.map((s) => s.mood));
  const lastDate = own.find((s) => s.createdAt)?.createdAt;

  return (
    <div>
      <button type="button" className="p-link-btn p-back-btn" onClick={onBack}>
        ← voltar
      </button>

      <div className="p-item-page-top">
        <ItemCard
          item={item}
          onQuickProgress={onQuickProgress}
          onEdit={onEditItem}
        />
        <div className="p-item-summary">
          <Summary label="sessões" value={own.length} />
          <Summary label="momentos" value={ownMoments.length} />
          <Summary label="conexões" value={links.length} />
          {mood && (
            <div className="p-item-summary-line">
              humor mais comum:{" "}
              <strong>
                {MOODS.find((m) => m.k === mood.value)?.s} {mood.value}
              </strong>
            </div>
          )}
          {lastDate && (
            <div className="p-item-summary-line">
              última sessão: <strong>{formatDate(lastDate)}</strong>
            </div>
          )}
        </div>
      </div>

      <SectionHead
        extra={
          <button className="p-link-btn" onClick={() => onNewSession(item.id)}>
            + registrar
          </button>
        }
      >
        sessões
      </SectionHead>
      {own.length === 0 ? (
        <div className="p-drip-add p-drip-add--static p-home-empty">
          Nenhuma sessão registrada para esta obra.
        </div>
      ) : (
        <div className="p-item-page-list">
          {own.map((s) => (
            <SessionCard
              key={s.id}
              session={s}
              item={item}
              onEdit={onEditSession}
              onDelete={onDeleteSession}
            />
          ))}
        </div>
      )}

      <SectionHead
        extra={
          <button className="p-link-btn" onClick={() => onNewMoment(item.id)}>
            + guardar
          </button>
        }
      >
        momentos
      </SectionHead>
      {ownMoments.length === 0 ? (
        <div className="p-drip-add p-drip-add--static p-home-empty">
          Nenhum momento guardado desta obra.
        </div>
      ) : (
        <div className="p-item-page-list">
          {ownMoments.map((m) => (
            <MomentCard
              key={m.id}
              moment={m}
              item={item}
              onEdit={onEditMoment}
              onDelete={onDeleteMoment}
            />
          ))}
        </div>
      )}

      <SectionHead>conexões</SectionHead>
      {links.length === 0 ? (
        <div className="p-drip-add p-drip-add--static">
          Nenhuma conexão. Ligue esta obra a outras na aba mapa.
        </div>
      ) : (
        <div className="p-conn-tags">
          {links.map(({ connection, other }) => (
            <button
              key={connection.id}
              type="button"
              className="p-conn-tag p-conn-tag--link"
              data-type={other.type}
              onClick={() => onOpenItem(other.id)}
            >
              {other.title} - {connection.reason}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Summary({ label, value }: { label: string; value: number }) {
  return (
    <div className="p-item-summary-stat">
      <span className="p-item-summary-num">{value}</span>
      <span className="p-stat-label">{label}</span>
    </div>
  );
}
