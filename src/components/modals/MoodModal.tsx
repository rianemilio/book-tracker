import { useState } from "react";
import type { MediaItem, Session } from "../../types";
import { MOODS, CTXS } from "../../constants";
import CustomSelect from "../ui/CustomSelect";
import Modal from "../ui/Modal";
import { MoodPicker, ChipPicker } from "../ui/Pickers";

interface MoodModalProps {
  items: MediaItem[];
  // Sessão existente = edição (sem atualizar progresso)
  session?: Session | null;
  onSave: (data: {
    itemId: number;
    mood: string;
    ctx: string;
    note: string;
    sym?: string;
    newProgress?: number;
  }) => void;
  onClose: () => void;
}

export default function MoodModal({
  items,
  session,
  onSave,
  onClose,
}: MoodModalProps) {
  const [itemId, setItemId] = useState<number>(
    session?.itemId ?? (items[0]?.id || 0),
  );
  const [mood, setMood] = useState<string | null>(session?.mood ?? null);
  const [ctx, setCtx] = useState<string | null>(session?.ctx ?? null);
  const [note, setNote] = useState(session?.note ?? "");

  const selectedItem = items.find((i) => i.id === itemId);
  const [newProg, setNewProg] = useState(selectedItem?.progress || 0);

  const handleItemChange = (id: number) => {
    setItemId(id);
    setNewProg(items.find((i) => i.id === id)?.progress || 0);
  };

  const ok = mood && ctx && itemId;

  const itemOptions = items.map((item) => ({
    value: item.id,
    label: item.title,
  }));

  return (
    <Modal
      eyebrow={session ? "editar sessão" : "registrar sessão"}
      title={session ? "como você estava?" : "como você está agora?"}
      onClose={onClose}
    >
      <label className="p-field-label">O que você está consumindo</label>
      <CustomSelect
        value={itemId}
        options={itemOptions}
        onChange={(val) => handleItemChange(Number(val))}
      />

      {selectedItem && !session && (
        <div className="p-progress-box">
          <label className="p-field-label">
            Atualizar Progresso nesta sessão?
          </label>
          <div className="p-progress-row">
            <input
              className="p-field-input"
              type="number"
              value={newProg}
              onChange={(e) =>
                setNewProg(
                  Math.min(
                    selectedItem.total,
                    Math.max(0, Number(e.target.value)),
                  ),
                )
              }
            />
            <span className="p-progress-total">
              de {selectedItem.total} {selectedItem.unit}
            </span>
          </div>
        </div>
      )}

      <label className="p-field-label">Seu humor</label>
      <MoodPicker value={mood} onChange={setMood} />

      <label className="p-field-label">Onde você está</label>
      <ChipPicker options={CTXS} value={ctx} onChange={setCtx} />

      <label className="p-field-label">Uma frase (opcional)</label>
      <textarea
        className="p-field-textarea"
        rows={3}
        placeholder="O que ficou dessa sessão..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <button
        className="p-primary-btn"
        disabled={!ok}
        onClick={() =>
          ok &&
          mood &&
          ctx &&
          onSave({
            itemId,
            mood,
            ctx,
            note,
            sym: MOODS.find((m) => m.k === mood)?.s,
            newProgress:
              !session && newProg !== selectedItem?.progress
                ? newProg
                : undefined,
          })
        }
      >
        {session ? "salvar alterações" : "salvar sessão"}
      </button>
    </Modal>
  );
}
