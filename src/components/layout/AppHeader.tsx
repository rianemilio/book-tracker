export type Tab = "home" | "map" | "moments";

const TABS: [Tab, string][] = [
  ["home", "início"],
  ["map", "mapa"],
  ["moments", "momentos"],
];

interface AppHeaderProps {
  tab: Tab;
  canRegisterSession: boolean;
  onTabChange: (tab: Tab) => void;
  onNewItem: () => void;
  onNewSession: () => void;
}

export default function AppHeader({
  tab,
  canRegisterSession,
  onTabChange,
  onNewItem,
  onNewSession,
}: AppHeaderProps) {
  return (
    <>
      <div className="p-header-container">
        <div className="p-header">
          <div>
            <div className="p-logo">Páginas & Cenas</div>
            <div className="p-logo-sub">seu universo de histórias</div>
          </div>
          <div className="p-header-actions">
            <button className="p-reg-btn secondary" onClick={onNewItem}>
              + Nova Obra
            </button>
            <button
              className="p-reg-btn"
              disabled={!canRegisterSession}
              onClick={onNewSession}
            >
              + Registrar Sessão
            </button>
          </div>
        </div>
      </div>

      <div className="p-nav">
        {TABS.map(([key, label]) => (
          <button
            key={key}
            className={`p-nav-btn${tab === key ? " active" : ""}`}
            onClick={() => onTabChange(key)}
          >
            {label}
          </button>
        ))}
      </div>
    </>
  );
}
