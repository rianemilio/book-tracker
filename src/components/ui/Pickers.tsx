import { MOODS } from "../../constants";

interface MoodPickerProps {
  value: string | null;
  onChange: (mood: string) => void;
}

export function MoodPicker({ value, onChange }: MoodPickerProps) {
  return (
    <div className="p-mood-grid">
      {MOODS.map((m) => (
        <button
          type="button"
          key={m.k}
          className="p-mood-btn"
          aria-pressed={value === m.k}
          onClick={() => onChange(m.k)}
        >
          <span className="p-mood-sym">{m.s}</span>
          <span className="p-mood-key">{m.k}</span>
        </button>
      ))}
    </div>
  );
}

interface ChipPickerProps {
  options: string[];
  value: string | null;
  onChange: (option: string) => void;
}

export function ChipPicker({ options, value, onChange }: ChipPickerProps) {
  return (
    <div className="p-chip-row">
      {options.map((o) => (
        <button
          type="button"
          key={o}
          className="p-chip"
          aria-pressed={value === o}
          onClick={() => onChange(o)}
        >
          {o}
        </button>
      ))}
    </div>
  );
}
