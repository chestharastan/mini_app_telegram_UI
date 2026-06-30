"use client";

import React, { useEffect, useRef, useState } from "react";
import { useProducts } from "../hooks/useProducts";
import { useCart } from "../hooks/useCart";
import { SearchBar } from "../components/SearchBar";
import { CategoryFilter } from "../components/CategoryFilter";
import { ProductCard } from "../components/ProductCard";
import { CartDrawer } from "../components/CartDrawer";
import { AUTH_API_ENDPOINT } from "../data/auth";
import { ORDERS_API_ENDPOINT } from "../data/orders";

const PHONE_REQUIRED_MESSAGE = "Enter a valid phone number to checkout.";
const TELEGRAM_PHONE_SHARED_MESSAGE = "Telegram phone shared. You can checkout now.";
const TELEGRAM_PHONE_UNAVAILABLE_MESSAGE =
  "Could not get your Telegram phone. Enter it manually to checkout.";

function getTelegramWebApp() {
  return window.Telegram?.WebApp;
}

function getTelegramLaunchParam(name) {
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const searchParams = new URLSearchParams(window.location.search);

  return hashParams.get(name) || searchParams.get(name) || "";
}

function getTelegramInitData() {
  return getTelegramWebApp()?.initData || getTelegramLaunchParam("tgWebAppData");
}

function getTelegramContactPhone(contactPayload) {
  if (!contactPayload || typeof contactPayload !== "object") return "";

  const contact = contactPayload.contact ?? contactPayload;
  return (
    contact.phone_number ??
    contact.phoneNumber ??
    contact.phone ??
    ""
  );
}

function normalizePhoneNumber(value) {
  const cleaned = String(value)
    .trim()
    .replace(/[^\d+]/g, "")
    .replace(/(?!^)\+/g, "");

  return cleaned;
}

function isValidPhoneNumber(value) {
  const normalized = normalizePhoneNumber(value);
  const digitCount = normalized.replace(/\D/g, "").length;

  return digitCount >= 7 && digitCount <= 15;
}

function getCheckoutErrorMessage(data, fallback) {
  if (typeof data?.detail === "string") return data.detail;

  if (Array.isArray(data?.detail)) {
    const detailMessage = data.detail
      .map((item) => item?.msg)
      .filter(Boolean)
      .join(" ");

    if (detailMessage) return detailMessage;
  }

  return data?.error || data?.message || fallback;
}

// Arrow button component
function ScrollArrow({ direction, onClick, visible }) {
  if (!visible) return null;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "left" ? "Scroll left" : "Scroll right"}
      className="absolute top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white shadow-md transition hover:border-slate-300 hover:bg-slate-50 active:scale-95"
      style={{ [direction === "left" ? "left" : "right"]: "-16px" }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-slate-600"
      >
        {direction === "left" ? (
          <path d="M15 18l-6-6 6-6" />
        ) : (
          <path d="M9 18l6-6-6-6" />
        )}
      </svg>
    </button>
  );
}

// Brand row with horizontal scroll + arrow buttons
// Replace just the BrandRow component in ProductListPage.jsx

function BrandRow({ brand, products, items, onAdd }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const CARD_WIDTH = 220 + 16;

  const updateArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  useEffect(() => {
    updateArrows();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [products]);

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "right" ? CARD_WIDTH * 2 : -CARD_WIDTH * 2, behavior: "smooth" });
  };

  return (
    <section>
      {/* Brand heading */}
      <div className="mb-3 flex items-center gap-3 px-4 md:px-6">
        <h2 className="text-[15px] font-semibold text-slate-900">{brand}</h2>
        <span className="text-[12px] text-slate-400">
          {products.length} item{products.length !== 1 ? "s" : ""}
        </span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      {/* Scroll row */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto px-4 pb-2 md:px-6"
        style={{ scrollbarWidth: "none" }}
      >
        {products.map((p) => (
          <div key={p.id} className="w-[220px] flex-none">
            <ProductCard
              product={p}
              cartQty={items[p.id] ?? 0}
              onAdd={onAdd}
            />
          </div>
        ))}
      </div>

      {/* Arrow buttons below cards */}
      <div className="mt-3 flex items-center gap-2 px-4 md:px-6">
        <button
          type="button"
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
          aria-label="Scroll left"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm transition hover:border-slate-300 hover:bg-slate-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <button
          type="button"
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
          aria-label="Scroll right"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm transition hover:border-slate-300 hover:bg-slate-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </section>
  );
}

export default function ProductListPage() {
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("default");
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutStatus, setCheckoutStatus] = useState("idle");
  const [checkoutMessage, setCheckoutMessage] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [canRequestTelegramContact, setCanRequestTelegramContact] = useState(false);
  const [isRequestingTelegramContact, setIsRequestingTelegramContact] =
    useState(false);
  const [hasSharedTelegramContact, setHasSharedTelegramContact] = useState(false);

  const { products, allProducts, categories, loading, error } = useProducts({
    search,
    category,
    sort,
  });

  const { items, add, remove, clear, total, count, cartList } = useCart(allProducts);

  const productsByBrand = products.reduce((acc, product) => {
    const brand = product.brand ?? "Other";
    if (!acc[brand]) acc[brand] = [];
    acc[brand].push(product);
    return acc;
  }, {});

  const sortedBrands = Object.keys(productsByBrand).sort();

  const resetCheckoutState = () => {
    setCheckoutStatus("idle");
    setCheckoutMessage("");
  };

  const handleAddToCart = (product) => {
    if (checkoutStatus === "submitting") return;

    resetCheckoutState();
    add(product);
  };

  const handleRemoveFromCart = (productId) => {
    if (checkoutStatus === "submitting") return;

    resetCheckoutState();
    remove(productId);
  };

  const handleClearCart = () => {
    if (checkoutStatus === "submitting") return;

    resetCheckoutState();
    clear();
  };

  const handleRequestTelegramContact = () => {
    const webApp = getTelegramWebApp();

    if (!webApp?.requestContact || isRequestingTelegramContact) return;

    resetCheckoutState();
    setIsRequestingTelegramContact(true);

    try {
      webApp.requestContact((isShared, contactPayload) => {
        const phone = normalizePhoneNumber(
          getTelegramContactPhone(contactPayload)
        );

        if (isValidPhoneNumber(phone)) {
          setCustomerPhone(phone);
        }

        if (isShared) {
          setHasSharedTelegramContact(true);
          setCheckoutStatus("success");
          setCheckoutMessage(TELEGRAM_PHONE_SHARED_MESSAGE);
        } else {
          setCheckoutStatus("error");
          setCheckoutMessage(TELEGRAM_PHONE_UNAVAILABLE_MESSAGE);
        }

        setIsRequestingTelegramContact(false);
      });
    } catch (error) {
      console.error("Telegram contact request failed:", error);
      setIsRequestingTelegramContact(false);
      setCheckoutStatus("error");
      setCheckoutMessage(TELEGRAM_PHONE_UNAVAILABLE_MESSAGE);
    }
  };

  const handleCheckout = async () => {
    if (cartList.length === 0 || checkoutStatus === "submitting") return;

    const initData = getTelegramInitData();
    const normalizedPhone = normalizePhoneNumber(customerPhone);
    const canUseTelegramContact = Boolean(initData && hasSharedTelegramContact);

    if (!isValidPhoneNumber(normalizedPhone) && !canUseTelegramContact) {
      setCheckoutStatus("error");
      setCheckoutMessage(PHONE_REQUIRED_MESSAGE);
      return;
    }

    const payload = {
      items: cartList.map(({ product, qty }) => ({
        product_id: product.id,
        quantity: qty,
      })),
    };

    if (isValidPhoneNumber(normalizedPhone)) {
      payload.customerPhone = normalizedPhone;
    }

    if (initData) {
      payload.initData = initData;
    }

    setCheckoutStatus("submitting");
    setCheckoutMessage("");

    try {
      const response = await fetch(ORDERS_API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          getCheckoutErrorMessage(
            data,
            `Order request failed with status ${response.status}`
          )
        );
      }

      clear();
      setCustomerPhone("");
      setHasSharedTelegramContact(false);
      setCheckoutStatus("success");
      setCheckoutMessage("Order placed successfully.");
    } catch (error) {
      setCheckoutStatus("error");
      setCheckoutMessage(
        error instanceof Error ? error.message : "Could not place order."
      );
    }
  };

  useEffect(() => {
    if (category === "all") return;
    if (!categories.some((cat) => cat.slug === category)) {
      setCategory("all");
    }
  }, [categories, category]);

  useEffect(() => {
    getTelegramWebApp()?.ready?.();
    getTelegramWebApp()?.expand?.();

    setCanRequestTelegramContact(Boolean(getTelegramWebApp()?.requestContact));

    const initData = getTelegramInitData();
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
          className="relative inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-[7px] font-sans text-[13px] font-semibold tracking-[-0.01em] text-slate-900 transition-all duration-200 hover:bg-slate-200 active:scale-95"
          type="button"
          onClick={() => setCartOpen((o) => !o)}
          aria-label={`Open cart, ${count} item${count !== 1 ? "s" : ""}`}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          Cart
          {count > 0 && (
            <span className="inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-slate-900 px-1.5 text-[11px] font-semibold leading-none text-white">
              {count}
            </span>
          )}
        </button>
      </header>

      <div className="flex flex-wrap items-center gap-2.5 px-4 py-3 md:px-6">
        <SearchBar value={search} onChange={setSearch} />
        <select
          className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition-colors duration-200 hover:border-slate-300 focus:border-indigo-500"
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

      <main className="pb-8 pt-4">
        {loading && (
          <p className="mb-3.5 mt-0 px-4 text-[13px] text-slate-400 md:px-6">
            Loading products from API…
          </p>
        )}
        {error && (
          <p className="mb-3.5 mt-0 mx-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[13px] text-amber-700 md:mx-6">
            Could not load API products. Showing fallback data. {error}
          </p>
        )}

        {products.length === 0 && !loading ? (
          <p className="m-0 py-16 text-center text-sm text-slate-400">
            No products match your search. Try a different term or category.
          </p>
        ) : (
          <div className="flex flex-col gap-8">
            {sortedBrands.map((brand) => (
              <BrandRow
                key={brand}
                brand={brand}
                products={productsByBrand[brand]}
                items={items}
                onAdd={handleAddToCart}
              />
            ))}
          </div>
        )}
      </main>

      {cartOpen && (
        <CartDrawer
          cartList={cartList}
          onRemove={handleRemoveFromCart}
          onClear={handleClearCart}
          onCheckout={handleCheckout}
          customerPhone={customerPhone}
          onCustomerPhoneChange={setCustomerPhone}
          canRequestTelegramContact={canRequestTelegramContact}
          isRequestingTelegramContact={isRequestingTelegramContact}
          onRequestTelegramContact={handleRequestTelegramContact}
          checkoutStatus={checkoutStatus}
          checkoutMessage={checkoutMessage}
          total={total}
          onClose={() => setCartOpen(false)}
        />
      )}
    </div>
  );
}
