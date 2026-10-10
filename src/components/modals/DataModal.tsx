import { useState } from "react";
import {
  backupFileName,
  parseBackup,
  serializeBackup,
  type LibraryData,
} from "../../storage/backup";
import ConfirmButton from "../ui/ConfirmButton";
import Modal from "../ui/Modal";

interface DataModalProps {
  data: LibraryData;
  onReplace: (data: LibraryData) => void;
  onClose: () => void;
}

const EMPTY: LibraryData = {
  items: [],
  moments: [],
  sessions: [],
  connections: [],
};

function summary(d: LibraryData) {
  return `${d.items.length} obras, ${d.sessions.length} sessões, ${d.moments.length} momentos e ${d.connections.length} conexões`;
}

function download(name: string, text: string) {
  const url = URL.createObjectURL(
    new Blob([text], { type: "application/json" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

// Backup em arquivo JSON e limpeza total, já que tudo vive só no navegador
export default function DataModal({
  data,
  onReplace,
  onClose,
}: DataModalProps) {
  const [pending, setPending] = useState<LibraryData | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File | undefined) {
    setPending(null);
    setError(null);
    if (!file) return;
    try {
      setPending(parseBackup(await file.text()));
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Não foi possível ler o arquivo.",
      );
    }
  }

  return (
    <Modal eyebrow="backup" title="Seus Dados" onClose={onClose}>
      <p className="p-data-note">
        Tudo fica salvo só neste navegador: {summary(data)}. Exporte um backup
        de vez em quando para não perder nada.
      </p>

      <button
        className="p-primary-btn"
        onClick={() => download(backupFileName(), serializeBackup(data))}
      >
        Exportar backup
      </button>

      <label className="p-field-label p-data-label" htmlFor="p-import-file">
        Importar backup
      </label>
      <input
        id="p-import-file"
        className="p-file-input"
        type="file"
        accept="application/json,.json"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {error && (
        <p className="p-field-error" role="alert">
          {error}
        </p>
      )}

      {pending && (
        <div className="p-progress-box">
          <p className="p-data-note">
            O backup tem {summary(pending)}. Importar substitui tudo o que está
            salvo agora.
          </p>
          <ConfirmButton
            className="p-danger-btn p-danger-btn--flush"
            confirmLabel="Clique de novo para substituir"
            onConfirm={() => onReplace(pending)}
          >
            Substituir meus dados
          </ConfirmButton>
        </div>
      )}

      <ConfirmButton
        className="p-danger-btn"
        confirmLabel="Clique de novo para apagar tudo"
        onConfirm={() => onReplace(EMPTY)}
      >
        Apagar tudo e começar do zero
      </ConfirmButton>
    </Modal>
  );
}
