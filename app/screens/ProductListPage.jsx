"use client";

// pages/ProductListPage.jsx
// The only place that wires state together.
// Components receive what they need via props — no prop drilling beyond 1 level.

import React, { useEffect, useState } from "react";
import { useProducts } from "../hooks/useProducts";
import { useCart } from "../hooks/useCart";
import { SearchBar } from "../components/SearchBar";
import { CategoryFilter } from "../components/CategoryFilter";
import { ProductCard } from "../components/ProductCard";
import { CartDrawer } from "../components/CartDrawer";
import { AUTH_API_ENDPOINT } from "../data/auth";


export default function ProductListPage() {
  // Filter state
  const [user, setUser] = useState(null);   
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("default");

  // UI state
  const [cartOpen, setCartOpen] = useState(false);

  // Derived product list
  const { products, allProducts, categories, loading, error, endpoint } = useProducts({
    search,
    category,
    sort,
  });

  // Cart
  const { items, add, remove, clear, total, count, cartList } = useCart(allProducts);

  useEffect(() => {
    if (category === "all") return;
    if (!categories.some((cat) => cat.slug === category)) {
      setCategory("all");
    }
  }, [categories, category]);

  useEffect(() => {
    const initData = window.Telegram?.WebApp?.initData;
    if (!initData) return;

    fetch(AUTH_API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ initData }),
    })
      .then((r) => r.json())
      .then((data) => setUser(data.user))
      .catch((err) => console.error("Auth failed:", err));
  }, []);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur md:px-6">
        <span className="text-base font-semibold tracking-[-0.3px] text-slate-900">
          Shop
        </span>
        <button
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 font-sans text-[13px] font-medium text-slate-900 transition hover:border-slate-400 hover:bg-slate-50"
          type="button"
          onClick={() => setCartOpen((o) => !o)}
          aria-label={`Open cart, ${count} item${count !== 1 ? "s" : ""}`}
        >
          Cart
          {count > 0 && (
            <span className="inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-indigo-500 px-1.5 text-[11px] font-semibold leading-none text-white">
              {count}
            </span>
          )}
        </button>
      </header>

      <div className="flex flex-wrap items-center gap-2.5 px-4 py-3 md:px-6">
        <SearchBar value={search} onChange={setSearch} />
        <select
          className="h-[38px] rounded-lg border border-slate-300 bg-white px-3 text-[13px] text-slate-900 outline-none transition hover:border-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          aria-label="Sort products"
        >
          <option value="default">Sort: default</option>
          <option value="price-asc">Price: low → high</option>
          <option value="price-desc">Price: high → low</option>
          <option value="name">Name A–Z</option>
        </select>
      </div>

      <div className="px-4 pb-3 md:px-6">
        <CategoryFilter
          categories={categories}
          active={category}
          onChange={setCategory}
        />
      </div>

      <main className="px-4 pb-8 pt-4 md:px-6">
        {/* <p className="mb-3.5 mt-0 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[12px] text-slate-500">
          API: <span className="font-medium text-slate-700">{endpoint}</span>
          {" · "}
          Status: {loading ? "loading" : error ? "error" : `loaded ${allProducts.length}`}
        </p> */}

        {loading && (
          <p className="mb-3.5 mt-0 text-[13px] text-slate-400">
            Loading products from API…
          </p>
        )}

        {error && (
          <p className="mb-3.5 mt-0 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[13px] text-amber-700">
            Could not load API products. Showing fallback data. {error}
          </p>
        )}

        {products.length === 0 ? (
          <p className="m-0 py-16 text-center text-sm text-slate-400">
            No products match your search. Try a different term or category.
          </p>
        ) : (
          <>
            <p className="mb-3.5 mt-0 text-[13px] text-slate-400">
              {products.length} product{products.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(min(220px,100%),1fr))] gap-4">
              {products.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  cartQty={items[p.id] ?? 0}
                  onAdd={add}
                />
              ))}
            </div>
          </>
        )}
      </main>

      {cartOpen && (
        <CartDrawer
          cartList={cartList}
          onRemove={remove}
          onClear={clear}
          total={total}
          onClose={() => setCartOpen(false)}
        />
      )}
    </div>
  );
}
