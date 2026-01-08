"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/api";
import type { ShippingOptionsResponse } from "@/lib/types";

export function useShippingOptions(
  cartId: string | null | undefined,
  isReturn: boolean = false
) {
  const url = cartId
    ? `/store/shipping-options?cart_id=${cartId}${
        isReturn ? "&is_return=true" : ""
      }`
    : null;

  const { data, error, isLoading, mutate } = useSWR<ShippingOptionsResponse>(
    url,
    fetcher
  );

  return {
    shippingOptions: data?.shipping_options ?? [],
    isLoading,
    isError: error,
    mutate,
  };
}
