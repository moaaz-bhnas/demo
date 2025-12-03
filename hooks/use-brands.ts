"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/api";
import type { BrandsResponse, BrandResponse } from "@/lib/types";

export function useBrands() {
  const { data, error, isLoading, mutate } = useSWR<BrandsResponse>(
    "/store/brands",
    fetcher
  );

  return {
    brands: data?.brands ?? [],
    isLoading,
    isError: error,
    mutate,
  };
}

export function useBrand(id: string) {
  const { data, error, isLoading, mutate } = useSWR<BrandResponse>(
    id ? `/store/brands/${id}` : null,
    fetcher
  );

  return {
    brand: data?.brand,
    isLoading,
    isError: error,
    mutate,
  };
}

