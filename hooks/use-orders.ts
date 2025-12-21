"use client";

import useSWR from "swr";
import { useCallback } from "react";
import { useAuth, getAuthenticatedApi } from "./use-auth";
import type {
  CustomerOrder,
  OrdersResponse,
  SingleOrderResponse,
} from "@/lib/types";

export function useOrders() {
  const { isAuthenticated } = useAuth();

  const fetcher = async (url: string) => {
    const authApi = getAuthenticatedApi();
    if (!authApi) throw new Error("Not authenticated");
    const response = await authApi.get<OrdersResponse>(url);
    return response.data;
  };

  const { data, error, isLoading, mutate } = useSWR<OrdersResponse>(
    isAuthenticated ? "/store/orders" : null,
    fetcher
  );

  const cancelOrder = useCallback(
    async (orderId: string, noNotification: boolean = false): Promise<void> => {
      const authApi = getAuthenticatedApi();
      if (!authApi) throw new Error("Not authenticated");

      await authApi.post(`/store/orders/${orderId}/cancel`, {
        no_notification: noNotification,
      });
      mutate();
    },
    [mutate]
  );

  return {
    orders: data?.orders ?? [],
    count: data?.count ?? 0,
    isLoading,
    isError: error,
    cancelOrder,
    mutate,
  };
}

export function useOrder(orderId: string | null) {
  const { isAuthenticated } = useAuth();

  const fetcher = async (url: string) => {
    const authApi = getAuthenticatedApi();
    if (!authApi) throw new Error("Not authenticated");
    const response = await authApi.get<SingleOrderResponse>(url);
    return response.data;
  };

  const { data, error, isLoading, mutate } = useSWR<SingleOrderResponse>(
    isAuthenticated && orderId
      ? `/store/orders/${orderId}?fields=+cart.id`
      : null,
    fetcher
  );

  return {
    order: data?.order,
    isLoading,
    isError: error,
    mutate,
  };
}
