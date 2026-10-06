import { MOODS, INK, PAPER, MUTED } from "../../constants";

interface MoodPickerProps {
  value: string | null;
  onChange: (mood: string) => void;
}

export function MoodPicker({ value, onChange }: MoodPickerProps) {
  return (
    <div className="p-mood-grid">
      {MOODS.map((m) => (
        <div
          key={m.k}
          className="p-mood-btn"
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
        </div>
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
        <div
          key={o}
          className="p-chip"
          onClick={() => onChange(o)}
          style={{
            background: value === o ? INK : "transparent",
            color: value === o ? PAPER : MUTED,
          }}
        >
          {o}
        </div>
      ))}
    </div>
  );
}
