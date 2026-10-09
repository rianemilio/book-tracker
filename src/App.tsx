import { useState } from "react";
import "./styles/index.css";
import { useLibrary } from "./hooks/useLibrary";
import type { MediaItem } from "./types";

import AppHeader, { type Tab } from "./components/layout/AppHeader";
import EdgeScrollbar from "./components/ui/EdgeScrollbar";
import HomeView from "./views/HomeView";
import MapView from "./views/MapView";
import MomentsView from "./views/MomentsView";
import ItemModal from "./components/modals/ItemModal";
import MomentModal from "./components/modals/MomentModal";
import MoodModal from "./components/modals/MoodModal";

// No máximo um modal aberto por vez; item null = obra nova
type OpenModal =
  | { kind: "session" }
  | { kind: "moment" }
  | { kind: "item"; item: MediaItem | null }
  | null;

export default function App() {
  const library = useLibrary();
  const { items, moments, sessions, connections } = library;
  const [tab, setTab] = useState<Tab>("home");
  const [modal, setModal] = useState<OpenModal>(null);
  const close = () => setModal(null);

  return (
    <>
      {modal?.kind === "session" && items.length > 0 && (
        <MoodModal
          items={items}
          onSave={(data) => {
            library.addSession(data);
            close();
          }}
          onClose={close}
        />
      )}

      {modal?.kind === "moment" && items.length > 0 && (
        <MomentModal
          items={items}
          onSave={(data) => {
            library.addMoment(data);
            close();
          }}
          onClose={close}
        />
      )}

      {modal?.kind === "item" && (
        <ItemModal
          item={modal.item}
          onSave={(data) => {
            library.saveItem(data);
            close();
          }}
          onDelete={(id) => {
            library.deleteItem(id);
            close();
          }}
          onClose={close}
        />
      )}

      <AppHeader
        tab={tab}
        canRegisterSession={items.length > 0}
        onTabChange={setTab}
        onNewItem={() => setModal({ kind: "item", item: null })}
        onNewSession={() => setModal({ kind: "session" })}
      />

      <div className="p-body">
        {tab === "home" && (
          <HomeView
            items={items}
            moments={moments}
            sessions={sessions}
            onTabMoments={() => setTab("moments")}
            onEditItem={(item) => setModal({ kind: "item", item })}
            onQuickProgress={library.quickProgress}
          />
        )}
        {tab === "map" && (
          <MapView
            items={items}
            moments={moments}
            connections={connections}
            onAddConnection={library.addConnection}
            onDeleteConnection={library.deleteConnection}
          />
        )}
        {tab === "moments" && (
          <MomentsView
            items={items}
            moments={moments}
            onAdd={() => setModal({ kind: "moment" })}
            onDeleteMoment={library.deleteMoment}
          />
        )}
      </div>

      <EdgeScrollbar />
    </>
  );
}
