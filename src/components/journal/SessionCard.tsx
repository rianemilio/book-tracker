import type { MediaItem, Session } from "../../types";
import { formatDate } from "../../utils/date";
import ConfirmButton from "../ui/ConfirmButton";
import { Badge } from "../ui/UIHelpers";

interface SessionCardProps {
  session: Session;
  item: MediaItem;
  onEdit: (session: Session) => void;
  onDelete: (id: number) => void;
}

export default function SessionCard({
  session: s,
  item,
  onEdit,
  onDelete,
}: SessionCardProps) {
  return (
    <div className="p-moment-card" data-type={item.type}>
      <div className="p-moment-inner">
        <div className="p-moment-head">
          <Badge type={item.type} />
          <span className="p-moment-title">{item.title}</span>
          <button
            className="p-ctrl-edit p-ctrl-edit--plain"
            onClick={() => onEdit(s)}
          >
            editar
          </button>
          <ConfirmButton
            className="p-ctrl-edit p-ctrl-edit--plain p-ctrl-edit--next"
            onConfirm={() => onDelete(s.id)}
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
}
