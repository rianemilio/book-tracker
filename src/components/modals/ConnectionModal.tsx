import { useState } from "react";
import type { Connection, MediaItem } from "../../types";
import { isConnected } from "../../utils/connections";
import CustomSelect from "../ui/CustomSelect";
import Modal from "../ui/Modal";

interface ConnectionModalProps {
  items: MediaItem[];
  connections: Connection[];
  onSave: (data: { fromId: number; toId: number; reason: string }) => void;
  onClose: () => void;
}

export default function ConnectionModal({
  items,
  connections,
  onSave,
  onClose,
}: ConnectionModalProps) {
  const [fromId, setFromId] = useState<number>(items[0]?.id || 0);
  const [toId, setToId] = useState<number>(items[1]?.id || 0);
  const [reason, setReason] = useState("");

  const duplicate = isConnected(connections, fromId, toId);
  const ok = fromId && toId && fromId !== toId && !duplicate && reason.trim();

  const itemOptions = items.map((item) => ({
    value: item.id,
    label: item.title,
  }));

  return (
    <Modal eyebrow="vincular ideias" title="Nova Conexão" onClose={onClose}>
      <label className="p-field-label">Obra Origem</label>
      <CustomSelect
        value={fromId}
        options={itemOptions}
        onChange={(val) => setFromId(Number(val))}
      />

      <label className="p-field-label">Obra Destino</label>
      <CustomSelect
        value={toId}
        options={itemOptions}
        onChange={(val) => setToId(Number(val))}
      />

      <label className="p-field-label">Motivo do vínculo / Paralelo</label>
      <textarea
        className="p-field-textarea"
        rows={3}
        placeholder="O que conecta essas duas histórias?"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />

      {duplicate && (
        <p className="p-field-error" role="alert">
          Essas obras já estão conectadas.
        </p>
      )}

      <button
        className="p-primary-btn"
        disabled={!ok}
        onClick={() => ok && onSave({ fromId, toId, reason: reason.trim() })}
      >
        Criar Conexão
      </button>
    </Modal>
  );
}
