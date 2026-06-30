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
    <div className="group relative min-w-[220px] flex-1">
      <div className="relative flex items-center rounded-2xl border border-slate-200 bg-white transition-colors duration-200 group-hover:border-slate-300 group-focus-within:border-indigo-500">
        <svg
          className="pointer-events-none absolute left-4 h-[18px] w-[18px] text-slate-400 transition-colors duration-200 group-focus-within:text-indigo-500"
          aria-hidden="true"
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
          className="h-11 w-full rounded-2xl border-0 bg-transparent pl-11 pr-10 text-sm font-medium text-slate-900 outline-none placeholder:font-normal placeholder:text-slate-400"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search products…"
          aria-label="Search products"
          autoComplete="off"
          spellCheck={false}
        />

        <button
          className={`absolute right-2 flex h-7 w-7 items-center justify-center rounded-full border-0 bg-slate-100 p-0 text-slate-500 transition-all duration-200 hover:bg-slate-200 hover:text-slate-900 active:scale-90 ${
            value
              ? "scale-100 opacity-100"
              : "pointer-events-none scale-75 opacity-0"
          }`}
          onClick={() => onChange("")}
          aria-label="Clear search"
          type="button"
          tabIndex={value ? 0 : -1}
        >
          <svg
            width="13"
            height="13"
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
      </div>
    </div>
  );
}