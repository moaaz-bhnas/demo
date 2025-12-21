"use client";

import useSWR from "swr";
import { useCallback } from "react";
import { api } from "@/lib/api";
import { getAuthenticatedApi } from "./use-auth";
import type {
  ReturnReasonsResponse,
  ReturnResponse,
  CreateReturnRequest,
  Return,
} from "@/lib/types";

export function useReturnReasons() {
  const fetcher = async (url: string) => {
    const response = await api.get<ReturnReasonsResponse>(url);
    return response.data;
  };

  const { data, error, isLoading } = useSWR<ReturnReasonsResponse>(
    "/store/return-reasons",
    fetcher
  );

  return {
    returnReasons: data?.return_reasons ?? [],
    count: data?.count ?? 0,
    isLoading,
    isError: error,
  };
}

export function useCreateReturn() {
  const createReturn = useCallback(
    async (request: CreateReturnRequest): Promise<Return> => {
      const authApi = getAuthenticatedApi();
      if (!authApi) throw new Error("Not authenticated");

      const response = await authApi.post<ReturnResponse>(
        "/store/returns",
        request
      );
      return response.data.return;
    },
    []
  );

  return { createReturn };
}
