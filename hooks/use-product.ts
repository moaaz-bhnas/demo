"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/api";
import type { ProductResponse, TogetherResponse } from "@/lib/types";

const PRODUCT_FIELDS =
  "*brand,*variants.calculated_price,+variants.inventory_quantity,*supplier,*categories,*collection.metadata,*reviews,*reviews.customer,*sales";

export function useProduct(id: string) {
  const { data, error, isLoading, mutate } = useSWR<ProductResponse>(
    id ? `/store/products/${id}?fields=${PRODUCT_FIELDS}` : null,
    fetcher
  );

  return {
    product: data?.product,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useBoughtTogether(productId: string) {
  const { data, error, isLoading } = useSWR<TogetherResponse>(
    productId ? `/store/together/${productId}` : null,
    fetcher
  );

  return {
    products: data?.products ?? [],
    isLoading,
    isError: error,
  };
}

