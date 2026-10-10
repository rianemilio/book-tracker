import { useState } from "react";
import type { MediaItem, Moment, Connection } from "../types";
import type { ConnectionInput } from "../hooks/useLibrary";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { layoutMap } from "../utils/mapLayout";
import ConnectionModal from "../components/modals/ConnectionModal";
import MapGraph from "../components/map/MapGraph";
import ItemDetails from "../components/map/ItemDetails";

interface MapViewProps {
  items: MediaItem[];
  moments: Moment[];
  connections: Connection[];
  onAddConnection: (data: ConnectionInput) => void;
  onUpdateConnectionReason: (id: string, reason: string) => void;
  onDeleteConnection: (id: string) => void;
}

export default function MapView({
  items,
  moments,
  connections,
  onAddConnection,
  onUpdateConnectionReason,
  onDeleteConnection,
}: MapViewProps) {
  const [selId, setSelId] = useState<number | undefined>(items[0]?.id);
  const selected = items.find((i) => i.id === selId) ?? items[0];
  // null = conexão nova
  const [connModal, setConnModal] = useState<{
    connection: Connection | null;
  } | null>(null);
  const compact = useMediaQuery("(max-width: 600px)");

  return (
    <div>
      <div className="p-view-head">
        <div className="p-section-head">
          <span className="p-section-label">mapa de conexões</span>
          <div className="p-section-line" />
        </div>
        <button
          className="p-ghost-btn"
          onClick={() => setConnModal({ connection: null })}
        >
          + Vincular ideias
        </button>
      </div>

      {connModal && (
        <ConnectionModal
          items={items}
          connections={connections}
          connection={connModal.connection}
          onClose={() => setConnModal(null)}
          onSave={(data) => {
            if (connModal.connection) {
              onUpdateConnectionReason(connModal.connection.id, data.reason);
            } else {
              onAddConnection(data);
            }
            setConnModal(null);
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
            <MapGraph
              layout={layoutMap(items, compact)}
              connections={connections}
              selectedId={selected?.id}
              onSelect={setSelId}
            />
          </div>

          {selected && (
            <ItemDetails
              item={selected}
              items={items}
              connections={connections}
              moments={moments}
              onEditConnection={(connection) => setConnModal({ connection })}
              onDeleteConnection={onDeleteConnection}
            />
          )}
        </>
      )}
    </div>
  );
}
