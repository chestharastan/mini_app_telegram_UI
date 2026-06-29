// hooks/useProducts.js
// Fetching, filtering, and sorting logic lives here — components stay render-focused.
// To add a new filter (e.g. price range), add a param and a .filter() below.

import { useEffect, useMemo, useState } from "react";
import { CATEGORIES_API_ENDPOINT, PRODUCTS_API_ENDPOINT } from "../data/products";

export function normalizeCategory(value = "") {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function filterProducts(
  sourceProducts,
  { search = "", category = "all", sort = "default" }
) {
  let list = [...sourceProducts];

  const selectedCategory = normalizeCategory(category);

  // Category filter
  if (selectedCategory && selectedCategory !== "all") {
    list = list.filter(
      (p) => normalizeCategory(p.category) === selectedCategory
    );
  }

  // Full-text search (name + description)
  const q = search.trim().toLowerCase();
  if (q) {
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  // Sort
  switch (sort) {
    case "price-asc":
      list.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      list.sort((a, b) => b.price - a.price);
      break;
    case "name":
      list.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      break;
  }

  return list;
}

function titleCaseCategory(value = "") {
  return String(value)
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function normalizeCategoryRecord(category) {
  if (!category) return null;

  const slug = normalizeCategory(category.slug ?? category.id ?? category.name);
  if (!slug) return null;

  return {
    id: category.id ?? slug,
    name: category.name ?? titleCaseCategory(slug),
    slug,
  };
}

export function getCategoriesFromData(apiCategories, products) {
  const normalizedApiCategories = Array.isArray(apiCategories)
    ? apiCategories
        .map(normalizeCategoryRecord)
        .filter(Boolean)
        .reduce((unique, category) => {
          if (!unique.some((item) => item.slug === category.slug)) {
            unique.push(category);
          }
          return unique;
        }, [])
    : [];

  if (normalizedApiCategories.length > 0) {
    const hasAll = normalizedApiCategories.some((category) => category.slug === "all");
    return hasAll
      ? normalizedApiCategories
      : [{ id: "all", name: "All", slug: "all" }, ...normalizedApiCategories];
  }

  const categorySlugs = [
    ...new Set(products.map((p) => normalizeCategory(p.category))),
  ].filter(Boolean);

  return [
    { id: "all", name: "All", slug: "all" },
    ...categorySlugs.map((slug) => ({
      id: slug,
      name: titleCaseCategory(slug),
      slug,
    })),
  ];
}

/**
 * @param {object} filters
 * @param {string} filters.search    - free-text search against name + description
 * @param {string} filters.category  - category slug, or "all"
 * @param {string} filters.sort      - "default" | "price-asc" | "price-desc" | "name"
 * @returns {Array} filtered + sorted product list
 */
export function useProducts({ search = "", category = "all", sort = "default" }) {
  const [sourceProducts, setSourceProducts] = useState([]);
  const [sourceCategories, setSourceCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    let isActive = true;

    async function loadProducts() {
      setLoading(true);
      setError("");

      const timeoutId = window.setTimeout(() => {
        controller.abort("timeout");
      }, 8000);

      try {
        console.info("[products] fetching", PRODUCTS_API_ENDPOINT, CATEGORIES_API_ENDPOINT);

        const [productsResponse, categoriesResponse] = await Promise.all([
          fetch(PRODUCTS_API_ENDPOINT, {
            headers: { accept: "application/json" },
            cache: "no-store",
            signal: controller.signal,
          }),
          fetch(CATEGORIES_API_ENDPOINT, {
            headers: { accept: "application/json" },
            cache: "no-store",
            signal: controller.signal,
          }),
        ]);

        const [productsPayload, categoriesPayload] = await Promise.all([
          productsResponse.json(),
          categoriesResponse.json(),
        ]);

        console.info("[products] response", {
          productsOk: productsResponse.ok,
          categoriesOk: categoriesResponse.ok,
          productsCount: Array.isArray(productsPayload?.data)
            ? productsPayload.data.length
            : null,
          categoriesCount: Array.isArray(categoriesPayload?.data)
            ? categoriesPayload.data.length
            : null,
        });

        if (!productsResponse.ok) {
          throw new Error(
            productsPayload?.error || `Request failed with ${productsResponse.status}`
          );
        }

        if (!Array.isArray(productsPayload?.data)) {
          throw new Error("Products API response must include a data array");
        }

        setSourceProducts(productsPayload.data);
        setSourceCategories(Array.isArray(categoriesPayload?.data) ? categoriesPayload.data : []);
      } catch (err) {
        if (!isActive) return;

        console.error("[products] fetch failed", err);
        setError(
          err instanceof DOMException && err.name === "AbortError"
            ? `Request timed out. Make sure the API is running at ${PRODUCTS_API_ENDPOINT}.`
            : err instanceof Error
            ? err.message
            : "Failed to load products"
        );
        setSourceProducts([]);
        setSourceCategories([]);
      } finally {
        window.clearTimeout(timeoutId);

        if (isActive) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, []);

  const categories = useMemo(
    () => getCategoriesFromData(sourceCategories, sourceProducts),
    [sourceCategories, sourceProducts]
  );

  const products = useMemo(() => {
    return filterProducts(sourceProducts, { search, category, sort });
  }, [sourceProducts, search, category, sort]);

  return {
    products,
    allProducts: sourceProducts,
    categories,
    loading,
    error,
    endpoint: PRODUCTS_API_ENDPOINT,
  };
}

export function useStaticProducts({ search = "", category = "all", sort = "default" }) {
  return useMemo(() => {
    return filterProducts([], { search, category, sort });
  }, [search, category, sort]);
}
