import React from "react";
import type { MediaType } from "../../types";
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
