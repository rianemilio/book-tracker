export type MediaType = "book" | "film" | "manga";
export type ItemStatus = "reading" | "done";

export interface MediaItem {
  id: number;
  title: string;
  creator: string;
  type: MediaType;
  status: ItemStatus;
  progress: number;
  total: number;
  unit: string;
}

export interface Moment {
  id: number;
  itemId: number;
  ref: string;
  text: string;
  mood: string;
  sym: string;
  ctx: string;
  tag: string;
}

export interface Connection {
  id: string;
  fromId: number;
  toId: number;
  reason: string;
}

export interface Session {
  id: number;
  itemId: number;
  mood: string;
  sym: string;
  ctx: string;
  note?: string;
}

export interface Mood {
  k: string;
  s: string;
}
