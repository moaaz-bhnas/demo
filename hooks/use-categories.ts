"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/api";
import type { CategoriesResponse, CategoryResponse } from "@/lib/types";

export function useCategories() {
  const { data, error, isLoading, mutate } = useSWR<CategoriesResponse>(
    "/store/product-categories",
    fetcher
  );

  return {
    categories: data?.product_categories ?? [],
    count: data?.count ?? 0,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useCategory(id: string) {
  const { data, error, isLoading, mutate } = useSWR<CategoryResponse>(
    id ? `/store/product-categories/${id}` : null,
    fetcher
  );

  return {
    category: data?.product_category,
    isLoading,
    isError: error,
    mutate,
  };
}

