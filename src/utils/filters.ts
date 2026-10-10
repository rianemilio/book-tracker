// Valor vazio (0 ou "") = sem filtro
export interface JournalFilter {
  itemId: number;
  mood: string;
  tag: string;
}

export const NO_FILTER: JournalFilter = { itemId: 0, mood: "", tag: "" };

export function matchesFilter(
  record: { itemId: number; mood: string; tag?: string },
  f: JournalFilter,
) {
  return (
    (!f.itemId || record.itemId === f.itemId) &&
    (!f.mood || record.mood === f.mood) &&
    (!f.tag || record.tag === f.tag)
  );
}
