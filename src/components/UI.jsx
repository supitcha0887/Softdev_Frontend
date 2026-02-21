import React from "react";

export function Pill({ tone = "new", children }) {
  return <span className={`pill pill-${tone}`}>{children}</span>;
}

export function Card({ children, className = "" }) {
  return <div className={`panel ${className}`}>{children}</div>;
}
