import { useEffect, useEffectEvent, useId, useRef } from "react";

interface ModalProps {
  eyebrow: string;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const FOCUSABLE =
  'button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])';

export default function Modal({
  eyebrow,
  title,
  onClose,
  children,
}: ModalProps) {
  const titleId = useId();
  const boxRef = useRef<HTMLDivElement>(null);
  const close = useEffectEvent(onClose);

  // Foca o modal ao abrir e devolve o foco a quem o abriu ao fechar
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    boxRef.current?.focus();
    return () => previous?.focus();
  }, []);

  // Esc fecha e Tab fica preso dentro do modal
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key !== "Tab" || !boxRef.current) return;
      const focusable = boxRef.current.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || active === boxRef.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="p-modal-overlay">
      <div
        ref={boxRef}
        className="p-modal-box"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <div className="p-modal-top">
          <button
            type="button"
            className="p-modal-close"
            aria-label="Fechar"
            onClick={onClose}
          >
            +
          </button>
          <div className="p-modal-eyebrow">{eyebrow}</div>
          <div className="p-modal-title" id={titleId}>
            {title}
          </div>
        </div>
        <div className="p-modal-body">{children}</div>
      </div>
    </div>
  );
}
