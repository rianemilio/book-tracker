import type { Connection, MediaItem, Moment } from "../../types";
import ConfirmButton from "../ui/ConfirmButton";
import { Badge } from "../ui/UIHelpers";

interface ItemDetailsProps {
  item: MediaItem;
  items: MediaItem[];
  connections: Connection[];
  moments: Moment[];
  onDeleteConnection: (id: string) => void;
}

// Card abaixo do mapa: conexões da obra selecionada e um momento de destaque
export default function ItemDetails({
  item,
  items,
  connections,
  moments,
  onDeleteConnection,
}: ItemDetailsProps) {
  const links = connections.flatMap((c) => {
    if (c.fromId !== item.id && c.toId !== item.id) return [];
    const otherId = c.fromId === item.id ? c.toId : c.fromId;
    const other = items.find((i) => i.id === otherId);
    return other ? [{ connection: c, other }] : [];
  });
  const highlight = moments.find((m) => m.itemId === item.id);

  return (
    <div className="p-conn-card" data-type={item.type}>
      <div className="p-conn-body">
        <Badge type={item.type} />
        <div className="p-conn-title">{item.title}</div>
        <div className="p-conn-author">{item.creator}</div>

        <div className="p-field-label p-conn-label">Conexões Ativas</div>
        <div className="p-conn-tags">
          {links.map(({ connection, other }) => (
            <span
              key={connection.id}
              className="p-conn-tag"
              data-type={other.type}
            >
              {other.title} - {connection.reason}
              <ConfirmButton
                className="p-del-conn"
                title="Excluir conexão"
                onConfirm={() => onDeleteConnection(connection.id)}
              >
                ×
              </ConfirmButton>
            </span>
          ))}
          {links.length === 0 && (
            <span className="p-conn-empty">
              Nenhuma conexão temática cadastrada para esta obra.
            </span>
          )}
        </div>

        {highlight && (
          <div className="p-conn-highlight">
            <div className="p-field-label">Momento de destaque</div>
            <div className="p-conn-quote">"{highlight.text}"</div>
          </div>
        )}
      </div>
    </div>
  );
}
