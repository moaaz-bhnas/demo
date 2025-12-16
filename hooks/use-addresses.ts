"use client";

import useSWR from "swr";
import { useCallback } from "react";
import { useAuth, getAuthenticatedApi } from "./use-auth";
import type { CustomerAddress, AddressesResponse, CustomerResponse } from "@/lib/types";

interface AddressInput {
  first_name: string;
  last_name: string;
  phone?: string;
  company?: string;
  address_1: string;
  address_2?: string;
  city: string;
  country_code: string;
  province?: string;
  postal_code?: string;
  is_default_shipping?: boolean;
  is_default_billing?: boolean;
  metadata?: Record<string, unknown>;
}

export function useAddresses() {
  const { isAuthenticated } = useAuth();

  const fetcher = async (url: string) => {
    const authApi = getAuthenticatedApi();
    if (!authApi) throw new Error("Not authenticated");
    const response = await authApi.get<AddressesResponse>(url);
    return response.data;
  };

  const { data, error, isLoading, mutate } = useSWR<AddressesResponse>(
    isAuthenticated ? "/store/customers/me/addresses" : null,
    fetcher
  );

  const createAddress = useCallback(
    async (address: AddressInput): Promise<CustomerAddress[]> => {
      const authApi = getAuthenticatedApi();
      if (!authApi) throw new Error("Not authenticated");

      const response = await authApi.post<CustomerResponse>(
        "/store/customers/me/addresses",
        address
      );
      mutate();
      return response.data.customer.addresses ?? [];
    },
    [mutate]
  );

  const updateAddress = useCallback(
    async (
      addressId: string,
      updates: Partial<AddressInput>
    ): Promise<CustomerAddress[]> => {
      const authApi = getAuthenticatedApi();
      if (!authApi) throw new Error("Not authenticated");

      const response = await authApi.post<CustomerResponse>(
        `/store/customers/me/addresses/${addressId}`,
        updates
      );
      mutate();
      return response.data.customer.addresses ?? [];
    },
    [mutate]
  );

  const deleteAddress = useCallback(
    async (addressId: string): Promise<void> => {
      const authApi = getAuthenticatedApi();
      if (!authApi) throw new Error("Not authenticated");

      await authApi.delete(`/store/customers/me/addresses/${addressId}`);
      mutate();
    },
    [mutate]
  );

  const setDefaultShipping = useCallback(
    async (addressId: string): Promise<void> => {
      await updateAddress(addressId, { is_default_shipping: true });
    },
    [updateAddress]
  );

  const setDefaultBilling = useCallback(
    async (addressId: string): Promise<void> => {
      await updateAddress(addressId, { is_default_billing: true });
    },
    [updateAddress]
  );

  return {
    addresses: data?.addresses ?? [],
    count: data?.count ?? 0,
    isLoading,
    isError: error,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultShipping,
    setDefaultBilling,
    mutate,
  };
}

