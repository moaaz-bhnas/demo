import axios from "axios";

export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
export const DEFAULT_REGION_ID = process.env.NEXT_PUBLIC_DEFAULT_REGION_ID;

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "x-publishable-api-key": API_KEY,
    "Content-Type": "application/json",
  },
});

export const fetcher = async <T>(url: string): Promise<T> => {
  const response = await api.get<T>(url);
  return response.data;
};
