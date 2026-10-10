import type { MediaItem, Moment } from "../../types";
import { formatDate } from "../../utils/date";
import ConfirmButton from "../ui/ConfirmButton";
import { Badge, Pill } from "../ui/UIHelpers";

interface MomentCardProps {
  moment: Moment;
  item: MediaItem;
  onEdit: (moment: Moment) => void;
  onDelete: (id: number) => void;
}

export default function MomentCard({
  moment: m,
  item,
  onEdit,
  onDelete,
}: MomentCardProps) {
  return (
    <div className="p-moment-card" data-type={item.type}>
      <div className="p-moment-inner">
        <div className="p-moment-head">
          <Badge type={item.type} />
          <span className="p-moment-title">{item.title}</span>
          <span className="p-meta-txt">· {m.ref}</span>
          <button
            className="p-ctrl-edit p-ctrl-edit--plain"
            onClick={() => onEdit(m)}
          >
            editar
          </button>
          <ConfirmButton
            className="p-ctrl-edit p-ctrl-edit--plain p-ctrl-edit--next"
            onConfirm={() => onDelete(m.id)}
          >
            excluir
          </ConfirmButton>
        </div>
        <div className="p-quote-text">"{m.text}"</div>
        <div className="p-moment-meta">
          <span className="p-meta-sym">{m.sym}</span>
          <span className="p-meta-txt">
            {m.mood} · {m.ctx}
            {m.createdAt && <> · {formatDate(m.createdAt)}</>}
          </span>
          <Pill type={item.type}>{m.tag}</Pill>
        </div>
      </div>
    </div>
  );
}
