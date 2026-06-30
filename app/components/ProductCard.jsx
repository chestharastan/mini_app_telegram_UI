// components/ProductCard.jsx

import React, { useState } from "react";

export function ProductCard({ product, cartQty = 0, onAdd }) {
  const [imgError, setImgError] = useState(false);
  const outOfStock = product.stock === 0;
  const buttonLabel = outOfStock
    ? "Unavailable"
    : cartQty > 0
    ? `×${cartQty} in cart`
    : "Add +";

  return (
    <article
      className="group flex min-h-[410px] min-w-0 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)]"
      aria-label={product.name}
    >
      <div className="relative h-[252px] flex-none overflow-hidden bg-slate-900">
        <span className="absolute left-2.5 top-2.5 z-20 rounded-full border border-white/40 bg-white/20 px-2.5 py-1.5 text-[11px] font-semibold capitalize leading-none text-white/90 shadow-[0_4px_14px_rgba(15,23,42,0.14)] backdrop-blur-md">
          {product.category}
        </span>

        {!imgError ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            onError={() => setImgError(true)}
            className="absolute inset-0 block h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.04]"
          />
        ) : (
          <div
            className="absolute inset-0 block h-full w-full bg-[linear-gradient(135deg,rgba(99,102,241,0.18),rgba(20,184,166,0.16)),#f1f5f9]"
            aria-hidden="true"
          />
        )}

        <div
          className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-slate-900/[0.02] via-slate-900/30 to-slate-900/80"
          aria-hidden="true"
        />

        <span
          className="absolute bottom-5 right-2.5 z-20 rounded-full border border-white/35 bg-white/20 px-3 py-2 text-[11px] font-semibold leading-none text-white shadow-[0_4px_14px_rgba(15,23,42,0.14)] backdrop-blur-md"
          aria-label={`Price: $${product.price}`}
        >
          ${product.price}
        </span>
      </div>

      <div className="relative z-20 flex flex-1 flex-col gap-[9px] bg-white p-4">
        <div className="flex items-start gap-2">
          {/* ✅ clamp to 2 lines */}
          <h3 className="m-0 min-w-0 flex-1 line-clamp-2 text-[15px] font-semibold leading-[1.3] text-slate-900">
            {product.name}
          </h3>
        </div>

        {/* ✅ clamp to 3 lines, flex-1 pushes bottom row down */}
        <p className="m-0 flex-1 line-clamp-3 text-[13px] leading-[1.45] text-slate-500">
          {product.description}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-0.5">
          <div className="flex min-w-0 items-center gap-2.5 text-xs font-medium text-slate-500">
            <span className="inline-flex min-w-0 items-center gap-1">
              <svg
                className="flex-none text-slate-400"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 8.5 12 3 3 8.5l9 5.5 9-5.5Z" />
                <path d="M3 8.5v7L12 21l9-5.5v-7" />
                <path d="M12 14v7" />
              </svg>
              {product.stock}
            </span>
            <span className="inline-flex min-w-0 items-center gap-1 overflow-hidden text-ellipsis whitespace-nowrap capitalize">
              <svg
                className="flex-none text-slate-400"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
              {product.category}
            </span>
          </div>

          <button
            type="button"
            className="min-h-8 flex-none rounded-full border border-slate-300 bg-white px-3.5 text-xs font-semibold leading-none text-slate-900 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:border-slate-300 disabled:hover:bg-white"
            onClick={() => onAdd(product)}
            disabled={outOfStock}
            aria-label={`Add ${product.name} to cart`}
          >
            {buttonLabel}
          </button>
        </div>
      </div>
    </article>
  );
}