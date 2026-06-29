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
      className="[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden flex flex-nowrap gap-1.5 overflow-x-auto pb-1"
      aria-label="Filter by category"
    >
      {categories.map((cat) => {
        const value = cat.slug ?? cat.id ?? cat.name;
        const isActive = active === value;

        return (
          <button
            key={cat.id}
            className={[
              "shrink-0 rounded-full border px-3.5 py-1.5 font-sans text-[13px] font-medium transition",
              isActive
                ? "border-indigo-500 bg-indigo-50 text-indigo-600"
                : "border-slate-300 bg-white text-slate-500 hover:border-indigo-500 hover:text-indigo-600",
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
