import type { MediaItem, Session } from "../types";

const DAY = 24 * 60 * 60 * 1000;

// Valor mais frequente da lista; no empate fica o que apareceu primeiro
export function mostCommon<T>(values: T[]) {
  const counts = new Map<T, number>();
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
  let best: { value: T; count: number } | null = null;
  for (const [value, count] of counts) {
    if (!best || count > best.count) best = { value, count };
  }
  return best;
}

export interface SessionInsights {
  total: number;
  // Sessões sem data (antigas ou de exemplo) não entram nessa conta
  lastMonth: number;
  mood: { value: string; count: number } | null;
  ctx: { value: string; count: number } | null;
  item: { value: MediaItem; count: number } | null;
}

// Hábitos a partir das sessões registradas: humor, lugar e obra mais comuns
export function sessionInsights(
  sessions: Session[],
  items: MediaItem[],
  now = new Date(),
): SessionInsights {
  const since = now.getTime() - 30 * DAY;
  const topItem = mostCommon(sessions.map((s) => s.itemId));
  const item = items.find((i) => i.id === topItem?.value);

  return {
    total: sessions.length,
    lastMonth: sessions.filter(
      (s) => s.createdAt && Date.parse(s.createdAt) >= since,
    ).length,
    mood: mostCommon(sessions.map((s) => s.mood)),
    ctx: mostCommon(sessions.map((s) => s.ctx)),
    item: topItem && item ? { value: item, count: topItem.count } : null,
  };
}
