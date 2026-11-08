import type { Connection, MediaItem, Moment, Session } from "../types";

// Dados de exemplo carregados na primeira visita

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
    text: "Kafka sozinho na biblioteca, e a sensação de que fugir de casa é, no fundo, ir ao encontro de si mesmo.",
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
