"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/api";
import type { ProductTagsResponse } from "@/lib/types";

export function useTags() {
  const { data, error, isLoading, mutate } = useSWR<ProductTagsResponse>(
    "/store/product-tags?fields=value,metadata",
    fetcher
  );

  return {
    tags: data?.product_tags ?? [],
    count: data?.count ?? 0,
    isLoading,
    isError: error,
    mutate,
  };
}

