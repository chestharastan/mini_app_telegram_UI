// components/SearchBar.jsx
// Controlled text input for product search.
// Stateless — parent owns the value.

import React from "react";

/**
 * @param {object}   props
 * @param {string}   props.value     - controlled input value
 * @param {function} props.onChange  - (value: string) => void
 */
export function SearchBar({ value, onChange }) {
  return (
    <div className="group relative flex min-w-[180px] flex-1 items-center">
      <svg
        className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 text-slate-400 transition group-focus-within:text-indigo-500"
        aria-hidden="true"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>

      <input
        type="text"
        className="h-[38px] w-full rounded-lg border border-slate-300 bg-white px-9 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search products…"
        aria-label="Search products"
        autoComplete="off"
        spellCheck={false}
      />

      {value && (
        <button
          className="absolute right-2 top-1/2 flex h-[22px] w-[22px] -translate-y-1/2 items-center justify-center rounded-md border-0 bg-transparent p-0 text-slate-400 transition hover:bg-slate-50 hover:text-slate-900"
          onClick={() => onChange("")}
          aria-label="Clear search"
          type="button"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
