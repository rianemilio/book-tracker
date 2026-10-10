import type { MediaItem, Session } from "../../types";
import { MOODS } from "../../constants";
import { sessionInsights } from "../../utils/insights";

interface HabitsPanelProps {
  sessions: Session[];
  items: MediaItem[];
}

// Resumo das sessões: humor, lugar e obra mais frequentes
export default function HabitsPanel({ sessions, items }: HabitsPanelProps) {
  const h = sessionInsights(sessions, items);
  if (h.total === 0) return null;
  const moodSym = MOODS.find((m) => m.k === h.mood?.value)?.s;

  return (
    <div className="p-habits">
      <Habit label="sessões no último mês" value={String(h.lastMonth)} />
      {h.mood && (
        <Habit
          label="humor mais comum"
          value={`${moodSym ?? ""} ${h.mood.value}`.trim()}
          count={h.mood.count}
        />
      )}
      {h.ctx && (
        <Habit
          label="onde você mais lê"
          value={h.ctx.value}
          count={h.ctx.count}
        />
      )}
      {h.item && (
        <Habit
          label="obra mais presente"
          value={h.item.value.title}
          count={h.item.count}
        />
      )}
    </div>
  );
}

function Habit({
  label,
  value,
  count,
}: {
  label: string;
  value: string;
  count?: number;
}) {
  return (
    <div className="p-habit">
      <div className="p-stat-label">{label}</div>
      <div className="p-habit-value">{value}</div>
      {count !== undefined && <div className="p-habit-count">{count}×</div>}
    </div>
  );
}
