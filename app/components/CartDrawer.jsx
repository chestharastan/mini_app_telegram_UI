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
 */
export function CartDrawer({ cartList, onRemove, total, onClose, onClear }) {
  const isEmpty = cartList.length === 0;

  return (
    <>
      <div
        className="fixed inset-0 z-[99] bg-slate-900/30 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className="fixed bottom-0 right-0 top-0 z-[100] flex w-full max-w-[340px] flex-col border-l border-slate-200 bg-white shadow-[-8px_0_32px_rgba(0,0,0,0.08)]"
        aria-label="Shopping cart"
      >
        <div className="flex flex-none items-center justify-between border-b border-slate-200 px-5 py-4">
          <span className="text-[15px] font-semibold tracking-[-0.2px]">
            Your cart
          </span>
          <button
            className="flex h-7 w-7 items-center justify-center rounded-md border-0 bg-transparent p-0 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
            type="button"
            onClick={onClose}
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-5 py-3">
          {isEmpty ? (
            <p className="mt-12 text-center text-sm leading-7 text-slate-400">
              Your cart is empty. Add some products to get started.
            </p>
          ) : (
            cartList.map(({ product, qty }) => (
              <div
                key={product.id}
                className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-[#f8f9fb] px-3 py-2.5 transition hover:border-slate-300"
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-11 w-11 flex-none rounded-md object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="m-0 overflow-hidden text-ellipsis whitespace-nowrap text-[13px] font-medium">
                    {product.name}
                  </p>
                  <p className="mb-0 mt-0.5 text-xs text-slate-500">
                    ${product.price} × {qty}
                  </p>
                </div>
                <button
                  className="flex h-6 w-6 flex-none items-center justify-center rounded-md border-0 bg-transparent p-0 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                  type="button"
                  onClick={() => onRemove(product.id)}
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
            {onClear && (
              <button
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-transparent px-3.5 py-2 text-[13px] font-medium text-slate-500 transition hover:bg-[#f8f9fb] active:scale-95"
                type="button"
                onClick={onClear}
              >
                Clear cart
              </button>
            )}
            <button
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-indigo-500 p-3 text-sm font-medium text-white transition hover:bg-indigo-600 active:scale-95"
              type="button"
            >
              Checkout
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
