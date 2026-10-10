import type { MediaItem, Moment } from "../../types";
import { formatDate } from "../../utils/date";
import ConfirmButton from "../ui/ConfirmButton";
import { Badge, Pill, TitleLink } from "../ui/UIHelpers";

interface MomentCardProps {
  moment: Moment;
  item: MediaItem;
  onEdit: (moment: Moment) => void;
  onDelete: (id: number) => void;
  // Sem onOpenItem (já na página da obra) o título é só texto
  onOpenItem?: (id: number) => void;
}

export default function MomentCard({
  moment: m,
  item,
  onEdit,
  onDelete,
  onOpenItem,
}: MomentCardProps) {
  return (
    <div className="p-moment-card" data-type={item.type}>
      <div className="p-moment-inner">
        <div className="p-moment-head">
          <Badge type={item.type} />
          <TitleLink
            className="p-moment-title"
            item={item}
            onOpen={onOpenItem}
          />
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
