"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/api";
import type { ShippingOptionsResponse } from "@/lib/types";

export function useShippingOptions(cartId: string | null | undefined) {
  const { data, error, isLoading, mutate } = useSWR<ShippingOptionsResponse>(
    cartId ? `/store/shipping-options?cart_id=${cartId}` : null,
    fetcher
  );

  return {
    shippingOptions: data?.shipping_options ?? [],
    isLoading,
    isError: error,
    mutate,
  };
}

