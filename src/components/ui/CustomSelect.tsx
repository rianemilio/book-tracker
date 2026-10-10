import { useState, useRef, useEffect, useId } from "react";

interface Option<T> {
  value: T;
  label: string;
}

interface CustomSelectProps<T> {
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
  // Nome acessível quando não há <label> visível ao lado
  label?: string;
}

export default function CustomSelect<T extends string | number>({
  value,
  options,
  onChange,
  label,
}: CustomSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const selectedIndex = options.findIndex((opt) => opt.value === value);
  const selectedOption = options[selectedIndex];

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

  const open = () => {
    setActiveIndex(Math.max(0, selectedIndex));
    setIsOpen(true);
  };

  const select = (index: number) => {
    const opt = options[index];
    if (opt) onChange(opt.value);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        open();
      }
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => Math.min(options.length - 1, i + 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => Math.max(0, i - 1));
        break;
      case "Home":
        e.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        e.preventDefault();
        setActiveIndex(options.length - 1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        select(activeIndex);
        break;
      case "Escape":
        // Fecha só o dropdown, sem fechar o modal em volta
        e.preventDefault();
        e.stopPropagation();
        setIsOpen(false);
        break;
      case "Tab":
        setIsOpen(false);
        break;
    }
  };

  return (
    <div
      ref={containerRef}
      className={`p-custom-select-container ${isOpen ? "open" : ""}`}
    >
      <button
        type="button"
        className="p-custom-select-trigger"
        role="combobox"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-activedescendant={isOpen ? `${listId}-${activeIndex}` : undefined}
        onClick={() => (isOpen ? setIsOpen(false) : open())}
        onKeyDown={handleKeyDown}
      >
        {selectedOption ? selectedOption.label : "Selecione..."}
      </button>

      {isOpen && (
        <div className="p-custom-select-dropdown" role="listbox" id={listId}>
          {options.map((opt, index) => {
            const isSelected = opt.value === value;
            const isActive = index === activeIndex;
            return (
              <div
                key={String(opt.value)}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={isSelected}
                className={`p-custom-select-option ${isSelected ? "selected" : ""} ${isActive ? "active" : ""}`}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => select(index)}
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
