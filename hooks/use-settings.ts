"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/api";
import type { SettingsResponse } from "@/lib/types";

export function useSettings() {
  const { data, error, isLoading, mutate } = useSWR<SettingsResponse>(
    "/store/settings",
    fetcher
  );

  return {
    settings: data,
    isLoading,
    isError: error,
    mutate,
  };
}

