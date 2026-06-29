// components/StockBadge.jsx
// Purely presentational — maps a stock number to a coloured label.

import React from "react";

const LEVELS = {
  out: {
    label: "Out of stock",
    className: "bg-red-50 text-red-600",
  },
  low: {
    label: "Low stock",
    className: "bg-amber-50 text-amber-700",
  },
  ok: {
    label: "In stock",
    className: "bg-green-50 text-green-600",
  },
};

function getLevel(stock) {
  if (stock === 0) return "out";
  if (stock <= 7) return "low";
  return "ok";
}

export function StockBadge({ stock }) {
  const { label, className } = LEVELS[getLevel(stock)];

  return (
    <span
      className={`inline-block flex-shrink-0 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium ${className}`}
    >
      {label}
    </span>
  );
}
