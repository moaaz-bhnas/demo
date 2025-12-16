"use client";

import React, { createContext, useContext, useCallback, useEffect, useState, useMemo } from "react";
import { api, BASE_URL, API_KEY } from "@/lib/api";
import type { AuthResponse, Customer, CustomerResponse } from "@/lib/types";
import axios, { AxiosInstance } from "axios";

const AUTH_TOKEN_KEY = "shopyneer_auth_token";

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
