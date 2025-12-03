"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/api";
import type { FreeShippingThresholdResponse } from "@/lib/types";

export function useFreeShipping() {
  const { data, error, isLoading } = useSWR<FreeShippingThresholdResponse>(
    "/store/free-shipping-threshold",
    fetcher
  );

  return {
    threshold: data?.threshold ? parseFloat(data.threshold) : null,
    isLoading,
    isError: error,
  };
}

