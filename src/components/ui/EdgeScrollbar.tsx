import { useEffect, useRef, useState } from "react";

const EDGE = 24; // distância da borda direita (px) que revela a barra
const HIDE_DELAY = 600; // ms até esconder depois que o mouse sai da borda
const MIN_THUMB = 40;

// Barra de rolagem da página desenhada por cima do conteúdo. A barra nativa
// fica escondida (ver App.css) para não cortar o layout; esta só aparece
// quando o mouse chega no canto direito da tela ou durante o arraste.
export default function EdgeScrollbar() {
  const barRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<number | undefined>(undefined);
  const drag = useRef<{ startY: number; startScroll: number } | null>(null);
  const [near, setNear] = useState(false);
  const [dragging, setDragging] = useState(false);

  // Posiciona o thumb direto no DOM para não re-renderizar a cada scroll
  useEffect(() => {
    const root = document.documentElement;

    function layout() {
      const bar = barRef.current;
      const thumb = thumbRef.current;
      if (!bar || !thumb) return;
      const view = window.innerHeight;
      const total = root.scrollHeight;
      bar.dataset.scrollable = String(total > view);
      if (total <= view) return;
      const height = Math.max(MIN_THUMB, (view / total) * view);
      const top = (window.scrollY / (total - view)) * (view - height);
      thumb.style.height = `${height}px`;
      thumb.style.transform = `translateY(${top}px)`;
    }

    const frame = requestAnimationFrame(layout);
    window.addEventListener("scroll", layout, { passive: true });
    window.addEventListener("resize", layout);
    // Conteúdo que muda de tamanho (troca de aba, novos cards) muda a rolagem
    const observer =
      typeof ResizeObserver === "undefined"
        ? undefined
        : new ResizeObserver(layout);
    observer?.observe(document.body);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", layout);
      window.removeEventListener("resize", layout);
      observer?.disconnect();
    };
  }, []);

  // Mostra ao chegar perto da borda direita e esconde com um pequeno atraso
  useEffect(() => {
    function scheduleHide() {
      window.clearTimeout(hideTimer.current);
      hideTimer.current = window.setTimeout(() => setNear(false), HIDE_DELAY);
    }

    function onMouseMove(e: MouseEvent) {
      if (e.clientX >= window.innerWidth - EDGE) {
        window.clearTimeout(hideTimer.current);
        setNear(true);
      } else {
        scheduleHide();
      }
    }

    window.addEventListener("mousemove", onMouseMove);
    document.documentElement.addEventListener("mouseleave", scheduleHide);
    return () => {
      window.clearTimeout(hideTimer.current);
      window.removeEventListener("mousemove", onMouseMove);
      document.documentElement.removeEventListener("mouseleave", scheduleHide);
    };
  }, []);

  // Fator entre o movimento do thumb e o da página
  const scrollRatio = () => {
    const view = window.innerHeight;
    const total = document.documentElement.scrollHeight;
    const thumbHeight = thumbRef.current?.offsetHeight ?? MIN_THUMB;
    return (total - view) / Math.max(1, view - thumbHeight);
  };

  const onThumbPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    drag.current = { startY: e.clientY, startScroll: window.scrollY };
    setDragging(true);
  };

  const onThumbPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    const delta = e.clientY - drag.current.startY;
    window.scrollTo({ top: drag.current.startScroll + delta * scrollRatio() });
  };

  const endDrag = () => {
    drag.current = null;
    setDragging(false);
  };

  // Clique na trilha: pula para a posição proporcional
  const onTrackPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const view = window.innerHeight;
    const total = document.documentElement.scrollHeight;
    window.scrollTo({ top: (e.clientY / view) * (total - view) });
  };

  const visible = near || dragging;

  return (
    <div
      ref={barRef}
      className={`p-edge-scroll${visible ? " is-visible" : ""}${dragging ? " is-dragging" : ""}`}
      aria-hidden="true"
      onPointerDown={onTrackPointerDown}
    >
      <div
        ref={thumbRef}
        className="p-edge-scroll-thumb"
        onPointerDown={onThumbPointerDown}
        onPointerMove={onThumbPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      />
    </div>
  );
}
