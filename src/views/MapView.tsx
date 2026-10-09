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
  onDeleteConnection: (id: string) => void;
}

export default function MapView({
  items,
  moments,
  connections,
  onAddConnection,
  onDeleteConnection,
}: MapViewProps) {
  const [selId, setSelId] = useState<number | undefined>(items[0]?.id);
  const selected = items.find((i) => i.id === selId) ?? items[0];
  const [showConnModal, setShowConnModal] = useState(false);
  const compact = useMediaQuery("(max-width: 600px)");

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
              onDeleteConnection={onDeleteConnection}
            />
          )}
        </>
      )}
    </div>
  );
}
