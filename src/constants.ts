import type {
  MediaItem,
  Moment,
  Connection,
  Session,
  Mood,
  MediaType,
} from "./types";

export const INK = "#0E0C0A";
export const PAPER = "#F4EFE6";
export const PAPER2 = "#EDE7D9";
export const PAPER3 = "#C9C0AE";
export const MUTED = "#6B6358";
export const FAINT = "#A89F90";

export const TC: Record<MediaType, string> = {
  book: "#1A3A5C",
  film: "#8B1A1A",
  manga: "#2D5A27",
};

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

export const INIT_ITEMS: MediaItem[] = [
  {
    id: 1,
    title: "Berserk",
    creator: "Kentaro Miura",
    type: "manga",
    status: "reading",
    progress: 305,
    total: 364,
    unit: "cap.",
  },
  {
    id: 2,
    title: "O Senhor dos Anéis",
    creator: "J.R.R. Tolkien",
    type: "book",
    status: "reading",
    progress: 248,
    total: 400,
    unit: "pág.",
  },
  {
    id: 3,
    title: "Rashomon",
    creator: "Akira Kurosawa",
    type: "film",
    status: "done",
    progress: 88,
    total: 88,
    unit: "min",
  },
  {
    id: 4,
    title: "Kafka à Beira-Mar",
    creator: "Haruki Murakami",
    type: "book",
    status: "reading",
    progress: 187,
    total: 386,
    unit: "pág.",
  },
  {
    id: 5,
    title: "Vinland Saga",
    creator: "Makoto Yukimura",
    type: "manga",
    status: "reading",
    progress: 120,
    total: 200,
    unit: "cap.",
  },
  {
    id: 6,
    title: "Succession",
    creator: "Jesse Armstrong",
    type: "film",
    status: "reading",
    progress: 2,
    total: 4,
    unit: "temp.",
  },
];

export const INIT_MOMENTS: Moment[] = [
  {
    id: 101,
    itemId: 1,
    ref: "cap. 159",
    text: "A cena de Doldrey. Griffith entregando tudo por um sonho e Guts percebendo que nunca foi suficiente.",
    mood: "melancólico",
    sym: "◑",
    ctx: "meia-noite, em casa",
    tag: "me fez chorar",
  },
  {
    id: 102,
    itemId: 3,
    ref: "cena final",
    text: "O lenhador pega o bebê. Depois de tudo que o filme fez questionar sobre a humanidade, esse gesto simples te devolve o ar.",
    mood: "calmo",
    sym: "○",
    ctx: "tarde de domingo",
    tag: "ficou na cabeça",
  },
  {
    id: 103,
    itemId: 4,
    ref: "p. 187",
    text: "A tempestade não é algo que você atravessa. Você é a tempestade.",
    mood: "inspirado",
    sym: "★",
    ctx: "no metrô",
    tag: "reli 3×",
  },
];

export const INIT_CONNS: Connection[] = [
  { id: "c1", fromId: 1, toId: 3, reason: "ambiguidade moral extrema" },
  {
    id: "c2",
    fromId: 1,
    toId: 5,
    reason: "guerra, trauma e estética histórica",
  },
  { id: "c3", fromId: 2, toId: 5, reason: "jornada épica medieval" },
  { id: "c4", fromId: 4, toId: 1, reason: "existencialismo e niilismo" },
];

export const INIT_SESSIONS: Session[] = [
  {
    id: 201,
    itemId: 1,
    mood: "melancólico",
    sym: "◑",
    ctx: "em casa, à noite",
    note: "Lendo capítulos pesados hoje.",
  },
];
