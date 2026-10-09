import type { MediaItem, Session } from "../../types";
import { formatDate } from "../../utils/date";

interface LastSessionProps {
  session: Session;
  items: MediaItem[];
}

export default function LastSession({ session, items }: LastSessionProps) {
  const title = items.find((i) => i.id === session.itemId)?.title || "Obra";

  return (
    <div className="p-insight-bar">
      <span className="p-insight-sym">{session.sym}</span>
      <div>
        <div className="p-insight-label">última sessão</div>
        <div className="p-insight-text">
          {title} · {session.mood} · {session.ctx}
          {session.createdAt && <> · {formatDate(session.createdAt)}</>}
          {session.note && (
            <span className="p-insight-note">"{session.note}"</span>
          )}
        </div>
      </div>
    </div>
  );
}
