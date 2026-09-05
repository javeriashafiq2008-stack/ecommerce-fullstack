import axios from "axios";
import { isDemoModeActive, handleMockRequest } from "./mockApi.js";

// Normalize the baseURL:
// - Read from import.meta.env.VITE_API_BASE_URL (defaults to http://localhost:3000)
// - Strip any trailing slash or accidental '/api' suffix, because individual endpoint calls
//   in the frontend codebase already prepend '/api/' (e.g. api.get('/api/products')).
const rawBaseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const BASE_URL = rawBaseURL.replace(/\/+$/, "").replace(/\/api$/, "");

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Crucial for cross-origin cookies across Vercel subdomains
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach Bearer token as fallback for cross-domain cookie restrictions
api.interceptors.request.use(
  (config) => {
    // Avoid double /api/api if baseURL or URL contains it
    if (config.baseURL?.endsWith("/api") && config.url?.startsWith("/api/")) {
      config.url = config.url.replace(/^\/api/, "");
    }

    // Attach Authorization header from localStorage if available
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle token storage, 401 Unauthorized, and network errors
api.interceptors.response.use(
  (response) => {
    // If backend returned a token (e.g. login/register), persist it in localStorage
    if (response.data?.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response;
  },
  (error) => {
    // Network errors (backend offline, CORS failure, DNS resolution failure)
    if (!error.response) {
      console.error("[API Network Error]:", error.message || "Network error");
      return Promise.reject({
        ...error,
        message: "Unable to connect to server. Please check your network or try again.",
      });
    }

    // 401 Unauthorized handling
    if (error.response.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        window.dispatchEvent(new CustomEvent("auth:unauthorized"));
      }
    }

    return Promise.reject(error);
  }
);

// Mock adapter for standalone demo mode
const defaultAdapter = axios.getAdapter(axios.defaults.adapter);
api.defaults.adapter = async (config) => {
  if (isDemoModeActive()) {
    return handleMockRequest(config);
  }
  return defaultAdapter(config);
};

export default api;