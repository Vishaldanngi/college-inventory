import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

if (!API_BASE_URL) {
  console.error("❌ VITE_API_URL is not defined");
}

export const api = axios.create({
  baseURL: API_BASE_URL ? `${API_BASE_URL}/api` : "",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
