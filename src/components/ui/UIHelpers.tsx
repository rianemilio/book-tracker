import React from "react";
import type { MediaType } from "../../types";
import { TC, TL, INK } from "../../constants";

interface BadgeProps {
  type: MediaType;
}

export function Badge({ type }: BadgeProps) {
  const color = TC[type];
  return (
    <span className="p-type-badge" style={{ color, borderColor: color }}>
      {TL[type]}
    </span>
  );
}

interface PillProps {
  children: React.ReactNode;
  bg: string;
}

export function Pill({ children, bg }: PillProps) {
  return (
    <span
      className="p-pill"
      style={{ background: bg, border: `2px solid ${INK}` }}
    >
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
