"use client";

import useSWR, { mutate as globalMutate } from "swr";
import { useCallback, useEffect, useState } from "react";
import { api, fetcher, DEFAULT_REGION_ID } from "@/lib/api";
import type {
  Cart,
  CartResponse,
  ShippingOptionsResponse,
  PaymentProvidersResponse,
  PaymentCollectionResponse,
  OrderResponse,
  Address,
} from "@/lib/types";

const CART_ID_KEY = "shopyneer_cart_id";

function getStoredCartId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(CART_ID_KEY);
}

function setStoredCartId(id: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_ID_KEY, id);
}

function clearStoredCartId(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CART_ID_KEY);
}

export function useCart() {
  const [cartId, setCartId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const storedId = getStoredCartId();
    setCartId(storedId);
    setIsInitialized(true);
  }, []);

  const { data, error, isLoading, mutate } = useSWR<CartResponse>(
    isInitialized && cartId ? `/store/carts/${cartId}` : null,
    fetcher
  );

  const createCart = useCallback(async (): Promise<Cart> => {
    const response = await api.post<CartResponse>("/store/carts", {});
    const newCart = response.data.cart;
    setStoredCartId(newCart.id);
    setCartId(newCart.id);
    mutate({ cart: newCart });
    return newCart;
  }, [mutate]);

  const getOrCreateCart = useCallback(async (): Promise<Cart> => {
    if (data?.cart) {
      return data.cart;
    }
    return createCart();
  }, [data?.cart, createCart]);

  const addItem = useCallback(
    async (variantId: string, quantity: number = 1): Promise<Cart> => {
      const cart = await getOrCreateCart();
      const response = await api.post<CartResponse>(
        `/store/carts/${cart.id}/line-items`,
        { variant_id: variantId, quantity }
      );
      // Update cache locally and globally to ensure all instances update
      mutate({ cart: response.data.cart }, { revalidate: false });
      globalMutate(`/store/carts/${cart.id}`, { cart: response.data.cart }, { revalidate: false });
      return response.data.cart;
    },
    [getOrCreateCart, mutate]
  );

  const updateItem = useCallback(
    async (lineItemId: string, quantity: number): Promise<Cart> => {
      if (!cartId) throw new Error("No cart found");
      const response = await api.post<CartResponse>(
        `/store/carts/${cartId}/line-items/${lineItemId}`,
        { quantity }
      );
      mutate({ cart: response.data.cart });
      return response.data.cart;
    },
    [cartId, mutate]
  );

  const removeItem = useCallback(
    async (lineItemId: string): Promise<Cart> => {
      if (!cartId) throw new Error("No cart found");
      const response = await api.delete<CartResponse>(
        `/store/carts/${cartId}/line-items/${lineItemId}`
      );
      mutate({ cart: response.data.cart });
      return response.data.cart;
    },
    [cartId, mutate]
  );

  const applyPromoCode = useCallback(
    async (code: string): Promise<Cart> => {
      if (!cartId) throw new Error("No cart found");
      const response = await api.post<CartResponse>(
        `/store/carts/${cartId}/promotions`,
        { promo_codes: [code] }
      );
      mutate({ cart: response.data.cart });
      return response.data.cart;
    },
    [cartId, mutate]
  );

  const updateAddresses = useCallback(
    async (
      email: string,
      shippingAddress: Address,
      billingAddress?: Address
    ): Promise<Cart> => {
      if (!cartId) throw new Error("No cart found");
      const response = await api.post<CartResponse>(`/store/carts/${cartId}`, {
        email,
        shipping_address: shippingAddress,
        billing_address: billingAddress || shippingAddress,
      });
      mutate({ cart: response.data.cart });
      return response.data.cart;
    },
    [cartId, mutate]
  );

  const getShippingOptions = useCallback(async (): Promise<
    ShippingOptionsResponse["shipping_options"]
  > => {
    if (!cartId) throw new Error("No cart found");
    const response = await api.get<ShippingOptionsResponse>(
      `/store/shipping-options?cart_id=${cartId}`
    );
    return response.data.shipping_options;
  }, [cartId]);

  const selectShippingMethod = useCallback(
    async (optionId: string): Promise<Cart> => {
      if (!cartId) throw new Error("No cart found");
      const response = await api.post<CartResponse>(
        `/store/carts/${cartId}/shipping-methods`,
        { option_id: optionId }
      );
      mutate({ cart: response.data.cart });
      return response.data.cart;
    },
    [cartId, mutate]
  );

  const getPaymentProviders = useCallback(async (): Promise<
    PaymentProvidersResponse["payment_providers"]
  > => {
    const response = await api.get<PaymentProvidersResponse>(
      `/store/payment-providers?region_id=${DEFAULT_REGION_ID}`
    );
    return response.data.payment_providers;
  }, []);

  const initiatePayment = useCallback(
    async (
      providerId: string,
      returnUrl?: string
    ): Promise<PaymentCollectionResponse["payment_collection"]> => {
      if (!cartId) throw new Error("No cart found");

      // Create payment collection
      const collectionResponse = await api.post<PaymentCollectionResponse>(
        "/store/payment-collections",
        { cart_id: cartId }
      );

      const paymentCollectionId = collectionResponse.data.payment_collection.id;

      // Create payment session
      const sessionData: Record<string, string> = { cartId };
      if (returnUrl) {
        sessionData.returnUrl = returnUrl;
      }

      const sessionResponse = await api.post<PaymentCollectionResponse>(
        `/store/payment-collections/${paymentCollectionId}/payment-sessions`,
        {
          provider_id: providerId,
          data: sessionData,
        }
      );

      return sessionResponse.data.payment_collection;
    },
    [cartId]
  );

  const completeCart = useCallback(async (): Promise<OrderResponse["order"]> => {
    if (!cartId) throw new Error("No cart found");
    const response = await api.post<OrderResponse>(
      `/store/carts/${cartId}/complete`
    );
    // Clear cart after completion
    clearStoredCartId();
    setCartId(null);
    mutate(undefined);
    return response.data.order;
  }, [cartId, mutate]);

  const clearCart = useCallback(() => {
    clearStoredCartId();
    setCartId(null);
    mutate(undefined);
  }, [mutate]);

  return {
    cart: data?.cart,
    cartId,
    isLoading: !isInitialized || isLoading,
    isError: error,
    itemCount: data?.cart?.items?.reduce((acc, item) => acc + item.quantity, 0) ?? 0,
    createCart,
    addItem,
    updateItem,
    removeItem,
    applyPromoCode,
    updateAddresses,
    getShippingOptions,
    selectShippingMethod,
    getPaymentProviders,
    initiatePayment,
    completeCart,
    clearCart,
    mutate,
  };
}

