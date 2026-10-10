import { useState } from "react";
import "./styles/index.css";
import { useLibrary } from "./hooks/useLibrary";
import type { MediaItem, Moment, Session } from "./types";

import AppHeader, { type Tab } from "./components/layout/AppHeader";
import EdgeScrollbar from "./components/ui/EdgeScrollbar";
import HomeView from "./views/HomeView";
import MapView from "./views/MapView";
import MomentsView from "./views/MomentsView";
import SessionsView from "./views/SessionsView";
import DataModal from "./components/modals/DataModal";
import ItemModal from "./components/modals/ItemModal";
import MomentModal from "./components/modals/MomentModal";
import MoodModal from "./components/modals/MoodModal";

// No máximo um modal aberto por vez; registro null = criar um novo
type OpenModal =
  | { kind: "session"; session: Session | null }
  | { kind: "moment"; moment: Moment | null }
  | { kind: "item"; item: MediaItem | null }
  | { kind: "data" }
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
          session={modal.session}
          onSave={(data) => {
            if (modal.session) library.updateSession(modal.session.id, data);
            else library.addSession(data);
            close();
          }}
          onClose={close}
        />
      )}

      {modal?.kind === "moment" && items.length > 0 && (
        <MomentModal
          items={items}
          moment={modal.moment}
          onSave={(data) => {
            if (modal.moment) library.updateMoment(modal.moment.id, data);
            else library.addMoment(data);
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

      {modal?.kind === "data" && (
        <DataModal
          data={{ items, moments, sessions, connections }}
          onReplace={(data) => {
            library.replaceAll(data);
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
        onNewSession={() => setModal({ kind: "session", session: null })}
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
        {tab === "sessions" && (
          <SessionsView
            items={items}
            sessions={sessions}
            onAdd={() => setModal({ kind: "session", session: null })}
            onEditSession={(session) => setModal({ kind: "session", session })}
            onDeleteSession={library.deleteSession}
          />
        )}
        {tab === "map" && (
          <MapView
            items={items}
            moments={moments}
            connections={connections}
            onAddConnection={library.addConnection}
            onUpdateConnectionReason={library.updateConnectionReason}
            onDeleteConnection={library.deleteConnection}
          />
        )}
        {tab === "moments" && (
          <MomentsView
            items={items}
            moments={moments}
            onAdd={() => setModal({ kind: "moment", moment: null })}
            onEditMoment={(moment) => setModal({ kind: "moment", moment })}
            onDeleteMoment={library.deleteMoment}
          />
        )}
      </div>

      <footer className="p-footer">
        <button
          className="p-link-btn"
          onClick={() => setModal({ kind: "data" })}
        >
          seus dados · backup
        </button>
      </footer>

      <EdgeScrollbar />
    </>
  );
}
