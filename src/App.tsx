import { useState } from "react";
import "./styles/index.css";
import { useLibrary } from "./hooks/useLibrary";
import type { MediaItem, Moment, Session } from "./types";

import AppHeader, { type Tab } from "./components/layout/AppHeader";
import EdgeScrollbar from "./components/ui/EdgeScrollbar";
import HomeView from "./views/HomeView";
import ItemView from "./views/ItemView";
import MapView from "./views/MapView";
import MomentsView from "./views/MomentsView";
import SessionsView from "./views/SessionsView";
import DataModal from "./components/modals/DataModal";
import ItemModal from "./components/modals/ItemModal";
import MomentModal from "./components/modals/MomentModal";
import MoodModal from "./components/modals/MoodModal";

// No máximo um modal aberto por vez; registro null = criar um novo,
// itemId = obra já escolhida no formulário
type OpenModal =
  | { kind: "session"; session: Session | null; itemId?: number }
  | { kind: "moment"; moment: Moment | null; itemId?: number }
  | { kind: "item"; item: MediaItem | null }
  | { kind: "data" }
  | null;

export default function App() {
  const library = useLibrary();
  const { items, moments, sessions, connections } = library;
  const [tab, setTab] = useState<Tab>("home");
  const [modal, setModal] = useState<OpenModal>(null);
  // Página da obra aberta por cima da aba atual; "voltar" retorna à aba
  const [openItemId, setOpenItemId] = useState<number | null>(null);
  const openItem = items.find((i) => i.id === openItemId);
  const close = () => setModal(null);

  const showItem = (id: number | null) => {
    setOpenItemId(id);
    if (document.scrollingElement) document.scrollingElement.scrollTop = 0;
  };
  const changeTab = (next: Tab) => {
    setTab(next);
    setOpenItemId(null);
  };

  const editItem = (item: MediaItem) => setModal({ kind: "item", item });
  const newSession = (itemId?: number) =>
    setModal({ kind: "session", session: null, itemId });
  const editSession = (session: Session) =>
    setModal({ kind: "session", session });
  const newMoment = (itemId?: number) =>
    setModal({ kind: "moment", moment: null, itemId });
  const editMoment = (moment: Moment) => setModal({ kind: "moment", moment });

  return (
    <>
      {modal?.kind === "session" && items.length > 0 && (
        <MoodModal
          items={items}
          session={modal.session}
          initialItemId={modal.itemId}
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
          initialItemId={modal.itemId}
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
        onTabChange={changeTab}
        onNewItem={() => setModal({ kind: "item", item: null })}
        onNewSession={() => newSession(openItem?.id)}
      />

      <div className="p-body">
        {openItem ? (
          <ItemView
            key={openItem.id}
            item={openItem}
            items={items}
            sessions={sessions}
            moments={moments}
            connections={connections}
            onBack={() => showItem(null)}
            onOpenItem={showItem}
            onEditItem={editItem}
            onQuickProgress={library.quickProgress}
            onNewSession={newSession}
            onEditSession={editSession}
            onDeleteSession={library.deleteSession}
            onNewMoment={newMoment}
            onEditMoment={editMoment}
            onDeleteMoment={library.deleteMoment}
          />
        ) : (
          <>
            {tab === "home" && (
              <HomeView
                items={items}
                moments={moments}
                sessions={sessions}
                onTabMoments={() => changeTab("moments")}
                onEditItem={editItem}
                onOpenItem={showItem}
                onQuickProgress={library.quickProgress}
              />
            )}
            {tab === "sessions" && (
              <SessionsView
                items={items}
                sessions={sessions}
                onAdd={() => newSession()}
                onEditSession={editSession}
                onDeleteSession={library.deleteSession}
                onOpenItem={showItem}
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
                onOpenItem={showItem}
              />
            )}
            {tab === "moments" && (
              <MomentsView
                items={items}
                moments={moments}
                onAdd={() => newMoment()}
                onEditMoment={editMoment}
                onDeleteMoment={library.deleteMoment}
                onOpenItem={showItem}
              />
            )}
          </>
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
