import { useState } from "react";
import type { MediaItem, Moment } from "../../types";
import { MOODS, TAGS, CTXS } from "../../constants";
import CustomSelect from "../ui/CustomSelect";
import Modal from "../ui/Modal";
import { MoodPicker, ChipPicker } from "../ui/Pickers";

interface MomentModalProps {
  items: MediaItem[];
  // Obra já escolhida ao abrir (ex.: pela página da obra)
  initialItemId?: number;
  // Momento existente = edição
  moment?: Moment | null;
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
  initialItemId,
  moment,
  onSave,
  onClose,
}: MomentModalProps) {
  const [itemId, setItemId] = useState<number>(
    moment?.itemId ?? initialItemId ?? (items[0]?.id || 0),
  );
  const [text, setText] = useState(moment?.text ?? "");
  const [mood, setMood] = useState<string | null>(moment?.mood ?? null);
  // Valores padrão gravados quando o campo fica vazio voltam a ser vazio
  const [tag, setTag] = useState<string | null>(
    moment && TAGS.includes(moment.tag) ? moment.tag : null,
  );
  const [ctx, setCtx] = useState<string | null>(
    moment && CTXS.includes(moment.ctx) ? moment.ctx : null,
  );
  const [ref, setRef] = useState(
    moment && moment.ref !== "—" ? moment.ref : "",
  );

  const ok = text.trim() && mood && itemId;

  const itemOptions = items.map((item) => ({
    value: item.id,
    label: item.title,
  }));

  return (
    <Modal
      eyebrow={moment ? "editar momento" : "guardar momento"}
      title="o que ficou com você?"
      onClose={onClose}
    >
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
      <MoodPicker value={mood} onChange={setMood} />
      <label className="p-field-label">onde você estava (opcional)</label>
      <ChipPicker options={CTXS} value={ctx} onChange={setCtx} />
      <label className="p-field-label">em uma palavra</label>
      <ChipPicker options={TAGS} value={tag} onChange={setTag} />
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
            tag: tag || (moment?.tag ?? "marcante"),
            ref: ref.trim() || "—",
            ctx: ctx || (moment?.ctx ?? "agora"),
          })
        }
      >
        {moment ? "salvar alterações" : "guardar momento"}
      </button>
    </Modal>
  );
}
