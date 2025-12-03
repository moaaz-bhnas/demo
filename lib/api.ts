import axios from "axios";

export const BASE_URL = "https://backend-production-f59a.up.railway.app";
export const API_KEY = "pk_a48bcdbf4f1f8197a35e99cde5374e470989ecd9e34d0b101a0cdbb908c83c3d";
export const DEFAULT_REGION_ID = "reg_01JVS99K21H4M6E2DN639Q9NXG";

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

