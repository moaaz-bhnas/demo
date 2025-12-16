"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/api";
import type { ProductsResponse } from "@/lib/types";

interface UseProductsOptions {
  tagId?: string;
  categoryId?: string;
  query?: string;
  limit?: number;
  enabled?: boolean; // Skip fetching when false
}

export function useProducts(options: UseProductsOptions = {}) {
  const { tagId, categoryId, query, limit, enabled = true } = options;

  const params = new URLSearchParams();
  params.append("fields", "*variants.calculated_price,*sales");

  if (tagId) {
    params.append("tag_id", tagId);
  }

  if (categoryId) {
    params.append("category_id", categoryId);
  }

  if (query) {
    params.append("q", query);
  }

  if (limit) {
    params.append("limit", limit.toString());
  }

  const url = `/store/products?${params.toString()}`;

  // Don't fetch if disabled
  const shouldFetch = enabled;

  const { data, error, isLoading, mutate } = useSWR<ProductsResponse>(shouldFetch ? url : null, fetcher);

  return {
    products: data?.products ?? [],
    count: data?.count ?? 0,
    isLoading: shouldFetch ? isLoading : false,
    isError: error,
    mutate,
  };
}
