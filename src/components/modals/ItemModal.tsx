import { useState } from "react";
import type { MediaItem, MediaType, ItemStatus } from "../../types";
import CustomSelect from "../ui/CustomSelect";

interface ItemModalProps {
  item: MediaItem | null;
  onSave: (data: Omit<MediaItem, "id"> & { id?: number }) => void;
  onDelete: (id: number) => void;
  onClose: () => void;
}

export default function ItemModal({
  item,
  onSave,
  onDelete,
  onClose,
}: ItemModalProps) {
  const [title, setTitle] = useState(item?.title || "");
  const [creator, setCreator] = useState(item?.creator || "");
  const [type, setType] = useState<MediaType>(item?.type || "book");
  const [status, setStatus] = useState<ItemStatus>(item?.status || "reading");
  const [progress, setProgress] = useState(item?.progress ?? 0);
  const [total, setTotal] = useState(item?.total ?? 100);
  const [unit, setUnit] = useState(item?.unit || "pág.");

  const ok = title.trim() && creator.trim() && total > 0;

  // Opções mapeadas para o novo CustomSelect
  const typeOptions = [
    { value: "book", label: "Livro" },
    { value: "film", label: "Filme ou Série" },
    { value: "manga", label: "Mangá ou HQ" },
  ];

  const statusOptions = [
    { value: "reading", label: "Consumindo" },
    { value: "done", label: "Concluído" },
  ];

  return (
    <div className="p-modal-overlay">
      <div className="p-modal-box">
        <div className="p-modal-top">
          <button className="p-modal-close" onClick={onClose}>
            +
          </button>
          <div className="p-modal-eyebrow">
            {item ? "modificar" : "adicionar à estante"}
          </div>
          <div className="p-modal-title">
            {item ? "Editar Obra" : "Nova Obra"}
          </div>
        </div>
        <div className="p-modal-body">
          <label className="p-field-label">Título</label>
          <input
            className="p-field-input"
            placeholder="ex: O Alquimista..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label className="p-field-label">Autor / Criador / Diretor</label>
          <input
            className="p-field-input"
            placeholder="ex: Paulo Coelho..."
            value={creator}
            onChange={(e) => setCreator(e.target.value)}
          />

          <div className="p-field-row-2">
            <div>
              <label className="p-field-label">Tipo de Obra</label>
              <CustomSelect
                value={type}
                options={typeOptions}
                onChange={(val) => setType(val as MediaType)}
              />
            </div>
            <div>
              <label className="p-field-label">Status de consumo</label>
              <CustomSelect
                value={status}
                options={statusOptions}
                onChange={(val) => setStatus(val as ItemStatus)}
              />
            </div>
          </div>

          <div className="p-field-row-2">
            <div>
              <label className="p-field-label">Progresso Atual</label>
              <input
                className="p-field-input"
                type="number"
                value={progress}
                onChange={(e) =>
                  setProgress(Math.max(0, Number(e.target.value)))
                }
              />
            </div>
            <div>
              <label className="p-field-label">Total estimado</label>
              <input
                className="p-field-input"
                type="number"
                value={total}
                onChange={(e) => setTotal(Math.max(1, Number(e.target.value)))}
              />
            </div>
          </div>

          <label className="p-field-label">Unidade de Medida</label>
          <input
            className="p-field-input"
            placeholder="ex: pág., cap., min, temp."
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          />

          <button
            className="p-primary-btn"
            disabled={!ok}
            onClick={() =>
              ok &&
              onSave({
                id: item?.id,
                title: title.trim(),
                creator: creator.trim(),
                type,
                status,
                progress: Math.min(progress, total),
                total,
                unit,
              })
            }
          >
            {item ? "Salvar Alterações" : "Adicionar Obra"}
          </button>

          {item && (
            <button className="p-danger-btn" onClick={() => onDelete(item.id)}>
              Excluir Obra Permanentemente
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
