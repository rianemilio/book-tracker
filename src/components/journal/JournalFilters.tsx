import type { MediaItem } from "../../types";
import { MOODS } from "../../constants";
import CustomSelect from "../ui/CustomSelect";
import { NO_FILTER, type JournalFilter } from "../../utils/filters";

interface JournalFiltersProps {
  items: MediaItem[];
  value: JournalFilter;
  onChange: (value: JournalFilter) => void;
  // Tags existentes; sem elas o filtro de tag não aparece
  tags?: string[];
}

export default function JournalFilters({
  items,
  value,
  onChange,
  tags,
}: JournalFiltersProps) {
  const set = (patch: Partial<JournalFilter>) =>
    onChange({ ...value, ...patch });
  const active = Boolean(value.itemId || value.mood || value.tag);

  return (
    <div className="p-journal-filters" data-cols={tags ? 3 : 2}>
      <CustomSelect
        label="Filtrar por obra"
        value={value.itemId}
        options={[
          { value: 0, label: "Todas as obras" },
          ...items.map((i) => ({ value: i.id, label: i.title })),
        ]}
        onChange={(itemId) => set({ itemId })}
      />
      <CustomSelect
        label="Filtrar por humor"
        value={value.mood}
        options={[
          { value: "", label: "Qualquer humor" },
          ...MOODS.map((m) => ({ value: m.k, label: `${m.s} ${m.k}` })),
        ]}
        onChange={(mood) => set({ mood })}
      />
      {tags && (
        <CustomSelect
          label="Filtrar por tag"
          value={value.tag}
          options={[
            { value: "", label: "Qualquer tag" },
            ...tags.map((t) => ({ value: t, label: t })),
          ]}
          onChange={(tag) => set({ tag })}
        />
      )}
      {active && (
        <button
          type="button"
          className="p-link-btn p-journal-clear"
          onClick={() => onChange(NO_FILTER)}
        >
          limpar filtros
        </button>
      )}
    </div>
  );
}
