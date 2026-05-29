import React, { useState } from "react";
import type { MediaItem } from "../../types";
import CustomSelect from "../ui/CustomSelect";

interface ConnectionModalProps {
  items: MediaItem[];
  onSave: (data: { fromId: number; toId: number; reason: string }) => void;
  onClose: () => void;
}

export default function ConnectionModal({
  items,
  onSave,
  onClose,
}: ConnectionModalProps) {
  const [fromId, setFromId] = useState<number>(items[0]?.id || 0);
  const [toId, setToId] = useState<number>(items[1]?.id || 0);
  const [reason, setReason] = useState("");

  const ok = fromId && toId && fromId !== toId && reason.trim();

  const itemOptions = items.map((item) => ({
    value: item.id,
    label: item.title,
  }));

  return (
    <div className="p-modal-overlay">
      <div className="p-modal-box">
        <div className="p-modal-top">
          <button className="p-modal-close" onClick={onClose}>
            ×
          </button>
          <div className="p-modal-eyebrow">vincular ideias</div>
          <div className="p-modal-title">Nova Conexão</div>
        </div>
        <div className="p-modal-body">
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

          <button
            className="p-primary-btn"
            disabled={!ok}
            onClick={() =>
              ok && onSave({ fromId, toId, reason: reason.trim() })
            }
          >
            Criar Conexão
          </button>
        </div>
      </div>
    </div>
  );
}
