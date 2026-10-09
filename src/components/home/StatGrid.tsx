import type { MediaItem, MediaType } from "../../types";

const STATS: [MediaType, string][] = [
  ["book", "livros"],
  ["film", "filmes & séries"],
  ["manga", "mangás & HQs"],
];

// Quantidade de obras por tipo (em andamento e concluídas)
export default function StatGrid({ items }: { items: MediaItem[] }) {
  return (
    <div className="p-stat-grid">
      {STATS.map(([type, label]) => (
        <div key={type} className="p-stat-card" data-type={type}>
          <div className="p-stat-label">{label}</div>
          <div className="p-stat-num">
            {items.filter((i) => i.type === type).length}
          </div>
        </div>
      ))}
    </div>
  );
}
