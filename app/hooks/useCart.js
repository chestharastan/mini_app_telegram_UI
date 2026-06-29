// hooks/useCart.js
// Encapsulates all cart state and derived values.
// Swap useState for useContext (CartContext) to share cart across pages.

import { useState, useMemo, useCallback } from "react";

/**
 * @returns {object}
 *   items    - { [productId]: quantity }
 *   add      - (product) => void
 *   remove   - (productId) => void  // decrements; removes at 0
 *   clear    - () => void
 *   total    - number  (sum of price × qty)
 *   count    - number  (total item count across all products)
 *   cartList - [{ product, qty }]  (ready to render)
 */
export function useCart(products = []) {
  const [items, setItems] = useState({});

  const add = useCallback((product) => {
    setItems((prev) => ({
      ...prev,
      [product.id]: (prev[product.id] ?? 0) + 1,
    }));
  }, []);

  const remove = useCallback((productId) => {
    setItems((prev) => {
      const next = { ...prev };
      if (next[productId] > 1) {
        next[productId]--;
      } else {
        delete next[productId];
      }
      return next;
    });
  }, []);

  const clear = useCallback(() => setItems({}), []);

  const cartList = useMemo(
    () =>
      Object.entries(items)
        .map(([id, qty]) => ({ product: products.find((p) => p.id === id), qty }))
        .filter((x) => x.product),
    [items, products]
  );

  const total = useMemo(
    () => cartList.reduce((sum, { product, qty }) => sum + product.price * qty, 0),
    [cartList]
  );

  const count = useMemo(
    () => Object.values(items).reduce((s, n) => s + n, 0),
    [items]
  );

  return { items, add, remove, clear, total, count, cartList };
}
