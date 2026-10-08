import { useState } from "react";
import type { MediaItem, Moment, Connection } from "../types";
import { Badge } from "../components/ui/UIHelpers";
import ConnectionModal from "../components/modals/ConnectionModal";

interface MapViewProps {
  items: MediaItem[];
  moments: Moment[];
  connections: Connection[];
  onAddConnection: (data: {
    fromId: number;
    toId: number;
    reason: string;
  }) => void;
  onDeleteConnection: (id: string) => void;
}

interface MapNode extends MediaItem {
  x: number;
  y: number;
}

export default function MapView({
  items,
  moments,
  connections,
  onAddConnection,
  onDeleteConnection,
}: MapViewProps) {
  const [selId, setSelId] = useState<number | undefined>(items[0]?.id);
  const sel = items.find((i) => i.id === selId) ?? items[0];
  const [showConnModal, setShowConnModal] = useState(false);

  // Raio cresce com a quantidade de obras para manter ~90px entre os nós
  const r = Math.max(108, Math.ceil((items.length * 90) / (2 * Math.PI)));
  const width = Math.max(580, 2 * r + 100);
  const height = Math.max(296, 2 * r + 60);
  const cx = width / 2,
    cy = height / 2;

  const nodes: MapNode[] = items.map((item, i) => {
    const a = (2 * Math.PI * i) / items.length - Math.PI / 2;
    return {
      ...item,
      x: Math.round(cx + r * Math.cos(a)),
      y: Math.round(cy + r * Math.sin(a)),
    };
  });

  const mmt = sel ? moments.find((m) => m.itemId === sel.id) : undefined;

  return (
    <div>
      <div className="p-view-head">
        <div className="p-section-head">
          <span className="p-section-label">mapa de conexões</span>
          <div className="p-section-line" />
        </div>
        <button className="p-ghost-btn" onClick={() => setShowConnModal(true)}>
          + Vincular ideias
        </button>
      </div>

      {showConnModal && (
        <ConnectionModal
          items={items}
          connections={connections}
          onClose={() => setShowConnModal(false)}
          onSave={(data) => {
            onAddConnection(data);
            setShowConnModal(false);
          }}
        />
      )}

      {items.length === 0 ? (
        <div className="p-drip-add p-drip-add--static">
          Adicione obras à sua estante para começar a mapear paralelos.
        </div>
      ) : (
        <>
          <div className="p-map-bg">
            <svg className="p-map-svg" viewBox={`0 0 ${width} ${height}`}>
              {/* Linhas de Conexões de Assuntos */}
              {connections.map((conn) => {
                const nodeA = nodes.find((n) => n.id === conn.fromId);
                const nodeB = nodes.find((n) => n.id === conn.toId);
                if (!nodeA || !nodeB) return null;
                const active =
                  sel && (sel.id === nodeA.id || sel.id === nodeB.id);
                return (
                  <line
                    key={conn.id}
                    className={`p-map-link${active ? " is-active" : ""}`}
                    x1={nodeA.x}
                    y1={nodeA.y}
                    x2={nodeB.x}
                    y2={nodeB.y}
                  />
                );
              })}

              {/* Raios centralizadores */}
              {nodes.map((n) => (
                <line
                  key={`v-${n.id}`}
                  className={`p-map-spoke${sel?.id === n.id ? " is-active" : ""}`}
                  data-type={n.type}
                  x1={cx}
                  y1={cy}
                  x2={n.x}
                  y2={n.y}
                />
              ))}

              {/* Formas orgânicas dos nós */}
              {nodes.map((n) => {
                const active = sel?.id === n.id;
                const lbl =
                  n.title.length > 11 ? n.title.slice(0, 10) + "…" : n.title;
                return (
                  <g
                    key={n.id}
                    className="p-map-node"
                    data-type={n.type}
                    role="button"
                    tabIndex={0}
                    aria-label={n.title}
                    aria-pressed={active}
                    onClick={() => setSelId(n.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelId(n.id);
                      }
                    }}
                  >
                    <path
                      d={`
                      M ${n.x - 38},${n.y - 10} 
                      C ${n.x - 22},${n.y - 22} ${n.x + 22},${n.y - 18} ${n.x + 38},${n.y - 10} 
                      C ${n.x + 44},${n.y - 2} ${n.x + 42},${n.y + 10} ${n.x + 32},${n.y + 15} 
                      C ${n.x + 18},${n.y + 18} ${n.x - 18},${n.y + 16} ${n.x - 32},${n.y + 14} 
                      C ${n.x - 44},${n.y + 6} ${n.x - 42},${n.y - 4} ${n.x - 38},${n.y - 10} Z
                    `}
                    />
                    <text
                      x={n.x}
                      y={n.y + 4}
                      textAnchor="middle"
                      fontSize={9}
                      fontFamily="'Helvetica Neue',Arial,sans-serif"
                      letterSpacing=".04em"
                      fontWeight={900}
                    >
                      {lbl}
                    </text>
                  </g>
                );
              })}

              {/* Centro do Grafo */}
              <path
                className="p-map-center"
                d={`
                M ${cx - 24},${cy - 8} 
                C ${cx - 15},${cy - 18} ${cx + 15},${cy - 16} ${cx + 24},${cy - 8} 
                C ${cx + 28},${cy - 2} ${cx + 26},${cy + 10} ${cx + 18},${cy + 14} 
                C ${cx + 10},${cy + 16} ${cx - 10},${cy + 14} ${cx - 18},${cy + 12} 
                C ${cx - 26},${cy + 6} ${cx - 28},${cy - 4} ${cx - 24},${cy - 8} Z
              `}
              />
              <text
                className="p-map-center-label"
                x={cx}
                y={cy + 4}
                textAnchor="middle"
                fontSize={9}
                fontFamily="'Helvetica Neue',Arial,sans-serif"
                letterSpacing=".12em"
                fontWeight={900}
              >
                você
              </text>
            </svg>
          </div>

          {sel && (
            <div className="p-conn-card" data-type={sel.type}>
              <div className="p-conn-body">
                <Badge type={sel.type} />
                <div className="p-conn-title">{sel.title}</div>
                <div className="p-conn-author">{sel.creator}</div>
                <div className="p-field-label p-conn-label">
                  Conexões Ativas
                </div>
                <div className="p-conn-tags">
                  {connections
                    .filter((c) => c.fromId === sel.id || c.toId === sel.id)
                    .map((c) => {
                      const otherItem = items.find(
                        (i) =>
                          i.id === (c.fromId === sel.id ? c.toId : c.fromId),
                      );
                      if (!otherItem) return null;
                      return (
                        <span
                          key={c.id}
                          className="p-conn-tag"
                          data-type={otherItem.type}
                        >
                          {otherItem.title} - {c.reason}
                          <button
                            className="p-del-conn"
                            title="Excluir conexão"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteConnection(c.id);
                            }}
                          >
                            ×
                          </button>
                        </span>
                      );
                    })}
                  {connections.filter(
                    (c) => c.fromId === sel.id || c.toId === sel.id,
                  ).length === 0 && (
                    <span className="p-conn-empty">
                      Nenhuma conexão temática cadastrada para esta obra.
                    </span>
                  )}
                </div>
                {mmt && (
                  <div className="p-conn-highlight">
                    <div className="p-field-label">Momento de destaque</div>
                    <div className="p-conn-quote">"{mmt.text}"</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
