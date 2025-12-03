"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/api";
import type { ProductsResponse } from "@/lib/types";

interface UseProductsOptions {
  tagId?: string;
  categoryId?: string;
  query?: string;
  limit?: number;
}

export function useProducts(options: UseProductsOptions = {}) {
  const { tagId, categoryId, query, limit } = options;

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

  const { data, error, isLoading, mutate } = useSWR<ProductsResponse>(
    url,
    fetcher
  );

  return {
    products: data?.products ?? [],
    count: data?.count ?? 0,
    isLoading,
    isError: error,
    mutate,
  };
}

