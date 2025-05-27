import axios from "axios";
import { API_BASE_URL, TOKEN_KEY } from "../utils/constants";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - runs before every request
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem(TOKEN_KEY);

    // If token exists, add it to Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request for debugging in development
    if (process.env.NODE_ENV === "development") {
      console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - runs after every response
api.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (process.env.NODE_ENV === "development") {
      console.log(`✅ ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    // Handle common HTTP errors
    if (error.response) {
      const { status, config } = error.response;

      // Log errors in development
      if (process.env.NODE_ENV === "development") {
        console.error(`❌ ${status} ${config.url}`, error.response.data);
      }

      // Handle 401 Unauthorized - token expired or invalid
      if (status === 401) {
        // Clear invalid tokens
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem("user_data");

        // Redirect to login only if not already on auth pages
        const currentPath = window.location.pathname;
        if (
          !currentPath.includes("/login") &&
          !currentPath.includes("/register")
        ) {
          window.location.href = "/login";
        }
      }

      // Handle 403 Forbidden
      if (status === 403) {
        console.error("Access forbidden - insufficient permissions");
      }

      // Handle 500 Internal Server Error
      if (status >= 500) {
        console.error("Server error - please try again later");
      }
    } else if (error.request) {
      // Network error - no response received
      console.error("Network error - please check your connection");
    }

    return Promise.reject(error);
  }
);

export default api;
