import { useEffect, useState } from "react";

interface ConfirmButtonProps {
  className: string;
  children: React.ReactNode;
  confirmLabel?: React.ReactNode;
  title?: string;
  onConfirm: () => void;
}

// Botão destrutivo em dois cliques: o primeiro troca o rótulo pelo pedido de
// confirmação, o segundo executa. Volta ao normal se perder o foco ou
// depois de alguns segundos.
export default function ConfirmButton({
  className,
  children,
  confirmLabel = "confirmar?",
  title,
  onConfirm,
}: ConfirmButtonProps) {
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (!armed) return;
    const timer = setTimeout(() => setArmed(false), 4000);
    return () => clearTimeout(timer);
  }, [armed]);

  return (
    <button
      type="button"
      className={className}
      data-armed={armed || undefined}
      title={title}
      onBlur={() => setArmed(false)}
      onClick={() => (armed ? onConfirm() : setArmed(true))}
    >
      {armed ? confirmLabel : children}
    </button>
  );
}
