// components/CategoryFilter.jsx
// Renders a row of category pill buttons.
// Receives the full categories array so the parent controls the data.

import React from "react";

/**
 * @param {object}   props
 * @param {Array}    props.categories  - [{ id, name, slug }]
 * @param {string}   props.active      - currently active slug
 * @param {function} props.onChange    - (slug: string) => void
 */
export function CategoryFilter({ categories, active, onChange }) {
  return (
    <nav
      className="[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden flex flex-nowrap gap-2 overflow-x-auto pb-1"
      aria-label="Filter by category"
    >
      {categories.map((cat) => {
        const value = cat.slug ?? cat.id ?? cat.name;
        const isActive = active === value;

        return (
          <button
            key={cat.id}
            className={[
              "shrink-0 rounded-full px-4 py-[7px] font-sans text-[13px] font-semibold tracking-[-0.01em] transition-all duration-200 active:scale-95",
              isActive
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200",
            ].join(" ")}
            type="button"
            onClick={() => onChange(value)}
            aria-pressed={isActive}
          >
            {cat.name}
          </button>
        );
      })}
    </nav>
  );
}