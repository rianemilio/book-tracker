import type { Mood, MediaType } from "./types";

export const TL: Record<MediaType, string> = {
  book: "livro",
  film: "filme/série",
  manga: "mangá/HQ",
};

export const MOODS: Mood[] = [
  { k: "calmo", s: "○" },
  { k: "melancólico", s: "◑" },
  { k: "agitado", s: "◉" },
  { k: "cansado", s: "◌" },
  { k: "inspirado", s: "★" },
];

export const CTXS: string[] = [
  "em casa, à noite",
  "no metrô",
  "café / pausa",
  "de manhã",
  "fim de semana",
];

export const TAGS: string[] = [
  "me fez chorar",
  "ficou na cabeça",
  "reli 3×",
  "precisei parar",
  "perturbador",
  "me deixou em paz",
];
