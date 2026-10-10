import React from "react";
import type { MediaItem, MediaType } from "../../types";
import { TL } from "../../constants";

interface BadgeProps {
  type: MediaType;
}

export function Badge({ type }: BadgeProps) {
  return (
    <span className="p-type-badge" data-type={type}>
      {TL[type]}
    </span>
  );
}

interface PillProps {
  children: React.ReactNode;
  type: MediaType;
}

export function Pill({ children, type }: PillProps) {
  return (
    <span className="p-pill" data-type={type}>
      {children}
    </span>
  );
}

interface SectionHeadProps {
  children: React.ReactNode;
  extra?: React.ReactNode;
}

export function SectionHead({ children, extra }: SectionHeadProps) {
  return (
    <div className="p-section-head">
      <span className="p-section-label">{children}</span>
      <div className="p-section-line" />
      {extra}
    </div>
  );
}

interface TitleLinkProps {
  item: MediaItem;
  className?: string;
  onOpen?: (id: number) => void;
}

// Título da obra que leva à página dela; sem onOpen vira texto simples
export function TitleLink({ item, className, onOpen }: TitleLinkProps) {
  if (!onOpen) return <span className={className}>{item.title}</span>;
  return (
    <button
      type="button"
      className={className ? `${className} p-title-link` : "p-title-link"}
      onClick={() => onOpen(item.id)}
    >
      {item.title}
    </button>
  );
}
