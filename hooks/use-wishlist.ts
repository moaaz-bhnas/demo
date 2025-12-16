"use client";

import useSWR from "swr";
import { useCallback } from "react";
import { useAuth, getAuthenticatedApi } from "./use-auth";
import type { Wishlist, WishlistResponse } from "@/lib/types";

export function useWishlist() {
  const { isAuthenticated } = useAuth();

  const fetcher = async (url: string) => {
    const authApi = getAuthenticatedApi();
    if (!authApi) throw new Error("Not authenticated");
    const response = await authApi.get<WishlistResponse>(url);
    return response.data;
  };

  const { data, error, isLoading, mutate } = useSWR<WishlistResponse>(
    isAuthenticated ? "/store/customers/me/wishlists" : null,
    fetcher
  );

  const createWishlist = useCallback(async (): Promise<Wishlist> => {
    const authApi = getAuthenticatedApi();
    if (!authApi) throw new Error("Not authenticated");

    const response = await authApi.post<WishlistResponse>(
      "/store/customers/me/wishlists",
      {}
    );
    mutate({ wishlist: response.data.wishlist });
    return response.data.wishlist;
  }, [mutate]);

  const addItem = useCallback(
    async (variantId: string): Promise<Wishlist> => {
      const authApi = getAuthenticatedApi();
      if (!authApi) throw new Error("Not authenticated");

      // Create wishlist if it doesn't exist
      if (!data?.wishlist) {
        await createWishlist();
      }

      const response = await authApi.post<WishlistResponse>(
        "/store/customers/me/wishlists/items",
        { variant_id: variantId }
      );
      mutate({ wishlist: response.data.wishlist });
      return response.data.wishlist;
    },
    [data?.wishlist, createWishlist, mutate]
  );

  const removeItem = useCallback(
    async (itemId: string): Promise<Wishlist> => {
      const authApi = getAuthenticatedApi();
      if (!authApi) throw new Error("Not authenticated");

      const response = await authApi.delete<WishlistResponse>(
        `/store/customers/me/wishlists/items/${itemId}`
      );
      mutate({ wishlist: response.data.wishlist });
      return response.data.wishlist;
    },
    [mutate]
  );

  const isInWishlist = useCallback(
    (variantId: string): boolean => {
      if (!data?.wishlist?.items) return false;
      return data.wishlist.items.some(
        (item) => item.product_variant_id === variantId
      );
    },
    [data?.wishlist?.items]
  );

  const getWishlistItemId = useCallback(
    (variantId: string): string | null => {
      if (!data?.wishlist?.items) return null;
      const item = data.wishlist.items.find(
        (item) => item.product_variant_id === variantId
      );
      return item?.id ?? null;
    },
    [data?.wishlist?.items]
  );

  return {
    wishlist: data?.wishlist,
    items: data?.wishlist?.items ?? [],
    itemCount: data?.wishlist?.items?.length ?? 0,
    isLoading,
    isError: error,
    createWishlist,
    addItem,
    removeItem,
    isInWishlist,
    getWishlistItemId,
    mutate,
  };
}

