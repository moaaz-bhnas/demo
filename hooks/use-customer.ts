"use client";

import useSWR from "swr";
import { useCallback } from "react";
import { useAuth, getAuthenticatedApi } from "./use-auth";
import type { Customer, CustomerResponse } from "@/lib/types";

export function useCustomer() {
  const { token, isAuthenticated } = useAuth();

  const fetcher = async (url: string) => {
    const authApi = getAuthenticatedApi();
    if (!authApi) throw new Error("Not authenticated");
    const response = await authApi.get<CustomerResponse>(url);
    return response.data;
  };

  const { data, error, isLoading, mutate } = useSWR<CustomerResponse>(
    isAuthenticated ? "/store/customers/me" : null,
    fetcher
  );

  const updateCustomer = useCallback(
    async (updates: Partial<Pick<Customer, "first_name" | "last_name" | "phone">>): Promise<Customer> => {
      const authApi = getAuthenticatedApi();
      if (!authApi) throw new Error("Not authenticated");

      const response = await authApi.post<CustomerResponse>(
        "/store/customers/me",
        updates
      );
      mutate({ customer: response.data.customer });
      return response.data.customer;
    },
    [mutate]
  );

  return {
    customer: data?.customer,
    isLoading,
    isError: error,
    updateCustomer,
    mutate,
  };
}

