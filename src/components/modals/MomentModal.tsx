import React, { useState } from "react";
import type { MediaItem } from "../../types";
import { MOODS, TAGS, INK, PAPER, MUTED } from "../../constants";
import CustomSelect from "../ui/CustomSelect";

interface MomentModalProps {
  items: MediaItem[];
  onSave: (data: {
    itemId: number;
    text: string;
    mood: string;
    sym?: string;
    tag: string;
    ref: string;
    ctx: string;
  }) => void;
  onClose: () => void;
}

export default function MomentModal({
  items,
  onSave,
  onClose,
}: MomentModalProps) {
  const [itemId, setItemId] = useState<number>(items[0]?.id || 0);
  const [text, setText] = useState("");
  const [mood, setMood] = useState<string | null>(null);
  const [tag, setTag] = useState<string | null>(null);
  const [ref, setRef] = useState("");

  const ok = text.trim() && mood && itemId;

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
          <div className="p-modal-eyebrow">guardar momento</div>
          <div className="p-modal-title">o que ficou com você?</div>
        </div>
        <div className="p-modal-body">
          <label className="p-field-label">De qual obra</label>
          <CustomSelect
            value={itemId}
            options={itemOptions}
            onChange={(val) => setItemId(Number(val))}
          />

          <label className="p-field-label">
            onde na obra (cap., pág., cena...)
          </label>
          <input
            className="p-field-input"
            placeholder="ex: cap. 23, p. 187..."
            value={ref}
            onChange={(e) => setRef(e.target.value)}
          />
          <label className="p-field-label">descreva o momento</label>
          <textarea
            className="p-field-textarea"
            rows={4}
            placeholder="a cena, a frase que te marcou..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <label className="p-field-label">como você se sentiu</label>
          <div className="p-mood-grid">
            {MOODS.map((m) => (
              <div
                key={m.k}
                className="p-mood-btn"
                onClick={() => setMood(m.k)}
                style={{
                  background: mood === m.k ? INK : "transparent",
                  color: mood === m.k ? PAPER : MUTED,
                }}
              >
                <span
                  className="p-mood-sym"
                  style={{ color: mood === m.k ? PAPER : INK }}
                >
                  {m.s}
                </span>
                <span
                  className="p-mood-key"
                  style={{ color: mood === m.k ? PAPER : INK }}
                >
                  {m.k}
                </span>
              </div>
            ))}
          </div>
          <label className="p-field-label">em uma palavra</label>
          <div className="p-chip-row">
            {TAGS.map((t) => (
              <div
                key={t}
                className="p-chip"
                onClick={() => setTag(t)}
                style={{
                  background: tag === t ? INK : "transparent",
                  color: tag === t ? PAPER : MUTED,
                }}
              >
                {t}
              </div>
            ))}
          </div>
          <button
            className="p-primary-btn"
            disabled={!ok}
            onClick={() =>
              ok &&
              mood &&
              onSave({
                itemId,
                text: text.trim(),
                mood,
                sym: MOODS.find((m) => m.k === mood)?.s,
                tag: tag || "marcante",
                ref: ref || "—",
                ctx: "agora",
              })
            }
          >
            guardar momento
          </button>
        </div>
      </div>
    </div>
  );
}
