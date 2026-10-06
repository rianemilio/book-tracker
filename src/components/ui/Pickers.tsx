import { MOODS, INK, PAPER, MUTED } from "../../constants";

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
          style={{
            background: value === m.k ? INK : "transparent",
            color: value === m.k ? PAPER : MUTED,
          }}
        >
          <span
            className="p-mood-sym"
            style={{ color: value === m.k ? PAPER : INK }}
          >
            {m.s}
          </span>
          <span
            className="p-mood-key"
            style={{ color: value === m.k ? PAPER : INK }}
          >
            {m.k}
          </span>
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
          style={{
            background: value === o ? INK : "transparent",
            color: value === o ? PAPER : MUTED,
          }}
        >
          {o}
        </button>
      ))}
    </div>
  );
}
