"use client";

import React, { createContext, useContext, useCallback, useEffect, useState, useMemo } from "react";
import { api, BASE_URL, API_KEY } from "@/lib/api";
import type { AuthResponse, Customer, CustomerResponse } from "@/lib/types";
import axios, { AxiosInstance } from "axios";
import { decodeToken } from "react-jwt";

const AUTH_TOKEN_KEY = "shopyneer_auth_token";

interface DecodedToken {
  actor_id: string;
  user_metadata?: {
    email?: string;
    given_name?: string;
    family_name?: string;
    name?: string;
    picture?: string;
  };
}

interface GoogleAuthResponse {
  location?: string;
  token?: string;
}

// Result from validating Google callback
export interface GoogleCallbackResult {
  token: string;
  needsCustomerCreation: boolean;
}

function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

function setStoredToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

function clearStoredToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

// Create an authenticated API instance
export function getAuthenticatedApi(): AxiosInstance | null {
  const token = getStoredToken();
  if (!token) return null;

  return axios.create({
    baseURL: BASE_URL,
    headers: {
      "x-publishable-api-key": API_KEY,
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

interface AuthContextType {
  token: string | null;
  customer: Customer | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  register: (email: string, password: string, firstName: string, lastName: string, phone?: string) => Promise<Customer>;
  login: (email: string, password: string) => Promise<Customer>;
  loginWithGoogle: () => Promise<string | null>;
  validateGoogleCallback: (queryParams: Record<string, string>) => Promise<GoogleCallbackResult>;
  createGoogleCustomer: (callbackToken: string) => Promise<Customer>;
  completeGoogleLogin: (callbackToken: string) => Promise<Customer>;
  logout: () => void;
  requestPasswordReset: (email: string) => Promise<void>;
  updatePassword: (email: string, password: string, resetToken: string) => Promise<void>;
  refetchCustomer: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const fetchCustomer = useCallback(async (authToken: string) => {
    try {
      const response = await axios.get<CustomerResponse>(`${BASE_URL}/store/customers/me`, {
        headers: {
          "x-publishable-api-key": API_KEY,
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      setCustomer(response.data.customer);
    } catch {
      // Token might be expired
      clearStoredToken();
      setToken(null);
      setCustomer(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load token and customer on mount
  useEffect(() => {
    const storedToken = getStoredToken();
    if (storedToken) {
      setToken(storedToken);
      fetchCustomer(storedToken);
    } else {
      setIsLoading(false);
    }
    setIsInitialized(true);
  }, [fetchCustomer]);

  const register = useCallback(
    async (email: string, password: string, firstName: string, lastName: string, phone?: string): Promise<Customer> => {
      // Step 1: Register to get initial token
      const authResponse = await api.post<AuthResponse>("/auth/customer/emailpass/register", { email, password });
      const initialToken = authResponse.data.token;

      // Step 2: Create customer profile
      const customerResponse = await axios.post<CustomerResponse>(
        `${BASE_URL}/store/customers`,
        {
          email,
          first_name: firstName,
          last_name: lastName,
          phone,
        },
        {
          headers: {
            "x-publishable-api-key": API_KEY,
            "Content-Type": "application/json",
            Authorization: `Bearer ${initialToken}`,
          },
        }
      );

      // Step 3: Login to get final token
      const loginResponse = await api.post<AuthResponse>("/auth/customer/emailpass", { email, password });
      const finalToken = loginResponse.data.token;

      setStoredToken(finalToken);
      setToken(finalToken);
      setCustomer(customerResponse.data.customer);

      return customerResponse.data.customer;
    },
    []
  );

  const login = useCallback(async (email: string, password: string): Promise<Customer> => {
    const authResponse = await api.post<AuthResponse>("/auth/customer/emailpass", { email, password });
    const authToken = authResponse.data.token;

    setStoredToken(authToken);
    setToken(authToken);

    // Fetch customer data
    const customerResponse = await axios.get<CustomerResponse>(`${BASE_URL}/store/customers/me`, {
      headers: {
        "x-publishable-api-key": API_KEY,
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });

    setCustomer(customerResponse.data.customer);
    return customerResponse.data.customer;
  }, []);

  // Google OAuth: Step 1 - Get redirect URL
  const loginWithGoogle = useCallback(async (): Promise<string | null> => {
    try {
      const response = await api.post<GoogleAuthResponse>("/auth/customer/google", {});

      // If location is returned, redirect to Google
      if (response.data.location) {
        return response.data.location;
      }

      // If token is returned, customer was previously authenticated
      if (response.data.token) {
        const authToken = response.data.token;
        setStoredToken(authToken);
        setToken(authToken);
        await fetchCustomer(authToken);
        return null; // No redirect needed
      }

      throw new Error("Invalid response from Google auth");
    } catch (error) {
      console.error("Google login error:", error);
      throw error;
    }
  }, [fetchCustomer]);

  // Google OAuth: Step 2 - Validate callback from Google (returns token and whether customer needs to be created)
  const validateGoogleCallback = useCallback(
    async (queryParams: Record<string, string>): Promise<GoogleCallbackResult> => {
      // Build query string from all params received from Google
      const queryString = new URLSearchParams(queryParams).toString();

      // Send callback to validate with Medusa - pass query params as URL query string
      const callbackResponse = await api.post<AuthResponse>(`/auth/customer/google/callback?${queryString}`, {});
      const authToken = callbackResponse.data.token;

      if (!authToken) {
        throw new Error("No token received from callback");
      }

      // Decode token to check if customer exists
      const decoded = decodeToken<DecodedToken>(authToken);

      if (!decoded) {
        throw new Error("Failed to decode token");
      }

      // If actor_id is empty, customer needs to be created
      const needsCustomerCreation = !decoded.actor_id || decoded.actor_id === "";

      return {
        token: authToken,
        needsCustomerCreation,
      };
    },
    []
  );

  // Google OAuth: Step 3a - Create customer with data from decoded token (for new users)
  const createGoogleCustomer = useCallback(async (callbackToken: string): Promise<Customer> => {
    // Decode token to extract user metadata
    const decoded = decodeToken<DecodedToken>(callbackToken);

    if (!decoded || !decoded.user_metadata) {
      throw new Error("Failed to decode token or missing user metadata");
    }

    const { email, given_name, family_name } = decoded.user_metadata;

    if (!email) {
      throw new Error("Email not found in token");
    }

    // Create customer with data from token
    await axios.post(
      `${BASE_URL}/store/customers`,
      {
        email,
        first_name: given_name || "",
        last_name: family_name || "",
      },
      {
        headers: {
          "x-publishable-api-key": API_KEY,
          "Content-Type": "application/json",
          Authorization: `Bearer ${callbackToken}`,
        },
      }
    );

    // Refresh token to get updated token with customer data
    const refreshResponse = await axios.post<AuthResponse>(
      `${BASE_URL}/auth/token/refresh`,
      {},
      {
        headers: {
          Authorization: `Bearer ${callbackToken}`,
        },
      }
    );

    const finalToken = refreshResponse.data.token;
    setStoredToken(finalToken);
    setToken(finalToken);

    // Fetch customer data
    const customerResponse = await axios.get<CustomerResponse>(`${BASE_URL}/store/customers/me`, {
      headers: {
        "x-publishable-api-key": API_KEY,
        "Content-Type": "application/json",
        Authorization: `Bearer ${finalToken}`,
      },
    });

    setCustomer(customerResponse.data.customer);
    return customerResponse.data.customer;
  }, []);

  // Google OAuth: Step 3b - Complete login for existing customers
  const completeGoogleLogin = useCallback(async (callbackToken: string): Promise<Customer> => {
    // Customer already exists, just store token and fetch data
    setStoredToken(callbackToken);
    setToken(callbackToken);

    const customerResponse = await axios.get<CustomerResponse>(`${BASE_URL}/store/customers/me`, {
      headers: {
        "x-publishable-api-key": API_KEY,
        "Content-Type": "application/json",
        Authorization: `Bearer ${callbackToken}`,
      },
    });

    setCustomer(customerResponse.data.customer);
    return customerResponse.data.customer;
  }, []);

  const logout = useCallback(() => {
    clearStoredToken();
    setToken(null);
    setCustomer(null);
  }, []);

  const requestPasswordReset = useCallback(async (email: string) => {
    await api.post("/auth/customer/emailpass/reset-password", {
      identifier: email,
    });
  }, []);

  const updatePassword = useCallback(async (email: string, password: string, resetToken: string) => {
    await axios.post(
      `${BASE_URL}/auth/customer/emailpass/update`,
      { email, password },
      {
        headers: {
          "x-publishable-api-key": API_KEY,
          "Content-Type": "application/json",
          Authorization: `Bearer ${resetToken}`,
        },
      }
    );
  }, []);

  const value = useMemo(
    () => ({
      token,
      customer,
      isAuthenticated: !!token && !!customer,
      isLoading: !isInitialized || isLoading,
      register,
      login,
      loginWithGoogle,
      validateGoogleCallback,
      createGoogleCustomer,
      completeGoogleLogin,
      logout,
      requestPasswordReset,
      updatePassword,
      refetchCustomer: () => token && fetchCustomer(token),
    }),
    [
      token,
      customer,
      isInitialized,
      isLoading,
      register,
      login,
      loginWithGoogle,
      validateGoogleCallback,
      createGoogleCustomer,
      completeGoogleLogin,
      logout,
      requestPasswordReset,
      updatePassword,
      fetchCustomer,
    ]
  );

  return React.createElement(AuthContext.Provider, { value }, children);
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
