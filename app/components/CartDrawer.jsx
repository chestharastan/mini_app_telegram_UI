// components/CartDrawer.jsx
// Slide-in panel that shows cart contents, per-item remove, and a total.
// Receives cartList + handlers from useCart — no internal state.

import React from "react";

/**
 * @param {object}   props
 * @param {Array}    props.cartList  - [{ product, qty }] from useCart
 * @param {function} props.onRemove  - (productId) => void
 * @param {number}   props.total     - cart total in dollars
 * @param {function} props.onClose   - () => void
 * @param {function} props.onClear   - () => void  (optional)
 * @param {function} props.onCheckout - () => void  (optional)
 * @param {string}   props.customerPhone - checkout phone number
 * @param {function} props.onCustomerPhoneChange - (phone) => void
 * @param {boolean}  props.canRequestTelegramContact - show Telegram contact action
 * @param {boolean}  props.isRequestingTelegramContact - Telegram contact request state
 * @param {function} props.onRequestTelegramContact - () => void
 */
export function CartDrawer({
  cartList,
  onRemove,
  total,
  onClose,
  onClear,
  onCheckout,
  customerPhone = "",
  onCustomerPhoneChange,
  canRequestTelegramContact = false,
  isRequestingTelegramContact = false,
  onRequestTelegramContact,
  checkoutStatus = "idle",
  checkoutMessage = "",
}) {
  const isEmpty = cartList.length === 0;
  const isSubmitting = checkoutStatus === "submitting";
  const isSuccess = checkoutStatus === "success";
  const isError = checkoutStatus === "error";

  return (
    <>
      <div
        className="fixed inset-0 z-[99] bg-slate-900/20 backdrop-blur-sm transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className="fixed bottom-0 right-0 top-0 z-[100] flex w-full max-w-[340px] flex-col border-l border-slate-200 bg-white"
        aria-label="Shopping cart"
      >
        <div className="flex flex-none items-center justify-between border-b border-slate-200 px-5 py-4">
          <span className="text-[15px] font-semibold tracking-[-0.2px] text-slate-900">
            Your cart
          </span>
          <button
            className="flex h-7 w-7 items-center justify-center rounded-full border-0 bg-slate-100 p-0 text-slate-500 transition-all duration-200 hover:bg-slate-200 hover:text-slate-900 active:scale-95"
            type="button"
            onClick={onClose}
            aria-label="Close cart"
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

        <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-5 py-3">
          {isEmpty ? (
            <p className="mt-12 text-center text-sm leading-7 text-slate-400">
              {isSuccess
                ? checkoutMessage || "Order placed successfully."
                : "Your cart is empty. Add some products to get started."}
            </p>
          ) : (
            cartList.map(({ product, qty }) => (
              <div
                key={product.id}
                className="flex items-center gap-2.5 rounded-2xl bg-slate-50 px-3 py-2.5 transition-colors duration-200 hover:bg-slate-100"
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-11 w-11 flex-none rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="m-0 overflow-hidden text-ellipsis whitespace-nowrap text-[13px] font-medium text-slate-900">
                    {product.name}
                  </p>
                  <p className="mb-0 mt-0.5 text-xs text-slate-500">
                    ${product.price} × {qty}
                  </p>
                </div>
                <button
                  className="flex h-7 w-7 flex-none items-center justify-center rounded-full border-0 bg-white p-0 text-slate-400 transition-all duration-200 hover:bg-red-50 hover:text-red-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-slate-400"
                  type="button"
                  onClick={() => onRemove(product.id)}
                  disabled={isSubmitting}
                  aria-label={`Remove one ${product.name} from cart`}
                >
                  −
                </button>
              </div>
            ))
          )}
        </div>

        {!isEmpty && (
          <div className="flex flex-none flex-col gap-3 border-t border-slate-200 px-5 py-4">
            <div className="flex items-baseline justify-between text-sm text-slate-500">
              <span>Total</span>
              <span className="text-lg font-semibold tracking-[-0.3px] text-slate-900">
                ${total.toLocaleString()}
              </span>
            </div>
            <label className="flex flex-col gap-1.5 text-[13px] font-medium text-slate-600">
              Phone number
              <input
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-[15px] font-semibold text-slate-900 outline-none transition-colors duration-200 placeholder:text-slate-400 focus:border-slate-900 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={customerPhone}
                onChange={(event) =>
                  onCustomerPhoneChange?.(event.target.value)
                }
                placeholder="+855 12 345 678"
                disabled={isSubmitting}
                aria-label="Phone number"
              />
            </label>
            {canRequestTelegramContact && (
              <button
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-slate-100 px-3.5 py-2 text-[13px] font-semibold tracking-[-0.01em] text-slate-600 transition-all duration-200 hover:bg-slate-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                type="button"
                onClick={onRequestTelegramContact}
                disabled={isSubmitting || isRequestingTelegramContact}
              >
                {isRequestingTelegramContact
                  ? "Requesting phone..."
                  : "Share Telegram phone"}
              </button>
            )}
            {(isError || isSuccess) && checkoutMessage && (
              <p
                className={`m-0 rounded-lg border px-3 py-2 text-[13px] leading-5 ${
                  isError
                    ? "border-red-200 bg-red-50 text-red-700"
                    : "border-emerald-200 bg-emerald-50 text-emerald-700"
                }`}
              >
                {checkoutMessage}
              </p>
            )}
            {onClear && (
              <button
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-slate-100 px-3.5 py-2 text-[13px] font-semibold tracking-[-0.01em] text-slate-600 transition-all duration-200 hover:bg-slate-200 active:scale-95"
                type="button"
                onClick={onClear}
                disabled={isSubmitting}
              >
                Clear cart
              </button>
            )}
            <button
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-slate-900 p-3 text-sm font-semibold tracking-[-0.01em] text-white transition-all duration-200 hover:bg-slate-800 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-slate-900"
              type="button"
              onClick={onCheckout}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Placing order..." : "Checkout"}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
