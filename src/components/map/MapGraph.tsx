import type { Connection } from "../../types";
import {
  centerShape,
  nodeLabel,
  nodeShape,
  type MapLayout,
} from "../../utils/mapLayout";

interface MapGraphProps {
  layout: MapLayout;
  connections: Connection[];
  selectedId: number | undefined;
  onSelect: (id: number) => void;
}

export default function MapGraph({
  layout,
  connections,
  selectedId,
  onSelect,
}: MapGraphProps) {
  const { width, height, cx, cy, nodes } = layout;

  return (
    <svg className="p-map-svg" viewBox={`0 0 ${width} ${height}`}>
      {/* Conexões entre obras */}
      {connections.map((conn) => {
        const a = nodes.find((n) => n.id === conn.fromId);
        const b = nodes.find((n) => n.id === conn.toId);
        if (!a || !b) return null;
        const active = selectedId === a.id || selectedId === b.id;
        return (
          <line
            key={conn.id}
            className={`p-map-link${active ? " is-active" : ""}`}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
          />
        );
      })}

      {/* Raios do centro até cada obra */}
      {nodes.map((n) => (
        <line
          key={`v-${n.id}`}
          className={`p-map-spoke${selectedId === n.id ? " is-active" : ""}`}
          data-type={n.type}
          x1={cx}
          y1={cy}
          x2={n.x}
          y2={n.y}
        />
      ))}

      {/* Nós */}
      {nodes.map((n) => (
        <g
          key={n.id}
          className="p-map-node"
          data-type={n.type}
          role="button"
          tabIndex={0}
          aria-label={n.title}
          aria-pressed={selectedId === n.id}
          onClick={() => onSelect(n.id)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onSelect(n.id);
            }
          }}
        >
          <path d={nodeShape(n.x, n.y)} />
          <text
            x={n.x}
            y={n.y + 4}
            textAnchor="middle"
            fontSize={9}
            fontFamily="'Helvetica Neue',Arial,sans-serif"
            letterSpacing=".04em"
            fontWeight={900}
          >
            {nodeLabel(n.title)}
          </text>
        </g>
      ))}

      {/* Centro */}
      <path className="p-map-center" d={centerShape(cx, cy)} />
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
  );
}
