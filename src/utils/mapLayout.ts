import type { MediaItem } from "../types";

export interface MapNode extends MediaItem {
  x: number;
  y: number;
}

export interface MapLayout {
  width: number;
  height: number;
  cx: number;
  cy: number;
  nodes: MapNode[];
}

// Distribui as obras num círculo em volta do centro ("você"). O raio cresce
// com a quantidade de obras para manter ~90px entre os nós. Em modo compacto
// (celular) o desenho usa só o espaço que precisa, para não encolher os
// rótulos; senão mantém a moldura mínima de 580x296.
export function layoutMap(items: MediaItem[], compact: boolean): MapLayout {
  const r = Math.max(108, Math.ceil((items.length * 90) / (2 * Math.PI)));
  const width = Math.max(compact ? 0 : 580, 2 * r + 100);
  const height = Math.max(compact ? 0 : 296, 2 * r + 60);
  const cx = width / 2;
  const cy = height / 2;

  const nodes = items.map((item, i) => {
    const angle = (2 * Math.PI * i) / items.length - Math.PI / 2;
    return {
      ...item,
      x: Math.round(cx + r * Math.cos(angle)),
      y: Math.round(cy + r * Math.sin(angle)),
    };
  });

  return { width, height, cx, cy, nodes };
}

// Contorno irregular ("orgânico") de cada nó, centrado em (x, y)
export function nodeShape(x: number, y: number) {
  return [
    `M ${x - 38},${y - 10}`,
    `C ${x - 22},${y - 22} ${x + 22},${y - 18} ${x + 38},${y - 10}`,
    `C ${x + 44},${y - 2} ${x + 42},${y + 10} ${x + 32},${y + 15}`,
    `C ${x + 18},${y + 18} ${x - 18},${y + 16} ${x - 32},${y + 14}`,
    `C ${x - 44},${y + 6} ${x - 42},${y - 4} ${x - 38},${y - 10} Z`,
  ].join(" ");
}

// Contorno do nó central, menor que os demais
export function centerShape(x: number, y: number) {
  return [
    `M ${x - 24},${y - 8}`,
    `C ${x - 15},${y - 18} ${x + 15},${y - 16} ${x + 24},${y - 8}`,
    `C ${x + 28},${y - 2} ${x + 26},${y + 10} ${x + 18},${y + 14}`,
    `C ${x + 10},${y + 16} ${x - 10},${y + 14} ${x - 18},${y + 12}`,
    `C ${x - 26},${y + 6} ${x - 28},${y - 4} ${x - 24},${y - 8} Z`,
  ].join(" ");
}

// Rótulo curto para caber no nó
export function nodeLabel(title: string) {
  return title.length > 11 ? title.slice(0, 10) + "…" : title;
}
