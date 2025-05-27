// API Base URL - change this to production URL when deploying
export const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3000";

// Local Storage Keys
export const TOKEN_KEY = "auth_token";
export const USER_KEY = "user_data";

// Routes
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",

  // Links
  LINKS: "/links",
  LINK_BY_ID: (id) => `/links/${id}`,
  LINK_STATS: (id) => `/links/${id}/stats`,
  REDIRECT: (shortCode) => `/${shortCode}`,
};
