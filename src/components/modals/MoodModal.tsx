import { useState, useEffect } from "react";
import type { MediaItem } from "../../types";
import { MOODS, CTXS } from "../../constants";
import CustomSelect from "../ui/CustomSelect";
import { MoodPicker, ChipPicker } from "../ui/Pickers";

interface MoodModalProps {
  items: MediaItem[];
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

export default function MoodModal({ items, onSave, onClose }: MoodModalProps) {
  const [itemId, setItemId] = useState<number>(items[0]?.id || 0);
  const [mood, setMood] = useState<string | null>(null);
  const [ctx, setCtx] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const selectedItem = items.find((i) => i.id === itemId);
  const [newProg, setNewProg] = useState(selectedItem?.progress || 0);

  useEffect(() => {
    if (selectedItem) {
      setNewProg(selectedItem.progress);
    }
  }, [itemId, selectedItem]);

  const ok = mood && ctx && itemId;

  const itemOptions = items.map((item) => ({
    value: item.id,
    label: item.title,
  }));

  return (
    <div className="p-modal-overlay">
      <div className="p-modal-box">
        <div className="p-modal-top">
          <button className="p-modal-close" onClick={onClose}>
            +
          </button>
          <div className="p-modal-eyebrow">registrar sessão</div>
          <div className="p-modal-title">como você está agora?</div>
        </div>
        <div className="p-modal-body">
          <label className="p-field-label">O que você está consumindo</label>
          <CustomSelect
            value={itemId}
            options={itemOptions}
            onChange={(val) => setItemId(Number(val))}
          />

          {selectedItem && (
            <div
              style={{
                background: "rgba(14,12,10,0.05)",
                padding: "10px",
                marginBottom: "1.5rem",
                border: "2px solid #0E0C0A",
              }}
            >
              <label className="p-field-label" style={{ marginBottom: "4px" }}>
                Atualizar Progresso nesta sessão?
              </label>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <input
                  className="p-field-input"
                  style={{ marginBottom: 0, width: "80px" }}
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
                <span style={{ fontSize: "12px", fontWeight: "bold" }}>
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
                  newProg !== selectedItem?.progress ? newProg : undefined,
              })
            }
          >
            salvar sessão
          </button>
        </div>
      </div>
    </div>
  );
}
