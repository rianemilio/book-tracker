import React, { useState, useRef, useEffect } from "react";

interface Option {
  value: any;
  label: string;
}

interface CustomSelectProps {
  value: any;
  options: Option[];
  onChange: (value: any) => void;
}

export default function CustomSelect({
  value,
  options,
  onChange,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Fecha o dropdown caso o usuário clique fora dele
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`p-custom-select-container ${isOpen ? "open" : ""}`}
    >
      <button
        type="button"
        className="p-custom-select-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOption ? selectedOption.label : "Selecione..."}
      </button>

      {isOpen && (
        <div className="p-custom-select-dropdown">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <div
                key={String(opt.value)}
                className={`p-custom-select-option ${isSelected ? "selected" : ""}`}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
              >
                {opt.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
