"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/api";
import type { SliderImagesResponse } from "@/lib/types";

export function useSecondarySlider() {
  const { data, error, isLoading, mutate } = useSWR<SliderImagesResponse>(
    "/store/sliders/secondary",
    fetcher
  );

  return {
    images: data?.images ?? [],
    count: data?.count ?? 0,
    isLoading,
    isError: error,
    mutate,
  };
}

