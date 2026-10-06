import type { MediaItem } from "../types";

// Aplica um novo progresso limitado a [0, total]; completar marca como "done"
export function withProgress(item: MediaItem, progress: number): MediaItem {
  const next = Math.min(item.total, Math.max(0, progress));
  return {
    ...item,
    progress: next,
    status: next === item.total ? "done" : "reading",
  };
}

export function progressPercent(item: MediaItem) {
  return Math.min(100, Math.round((item.progress / item.total) * 100) || 0);
}
