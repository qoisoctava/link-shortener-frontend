import api from "./api";
import { API_ENDPOINTS, TOKEN_KEY, USER_KEY } from "../utils/constants";

class AuthService {
  // Register new user
  async register(email, password) {
    try {
      const response = await api.post(API_ENDPOINTS.REGISTER, {
        email,
        password,
      });

      if (response.data.access_token) {
        this.setUserData(response.data);
      }

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Login user
  async login(email, password) {
    try {
      const response = await api.post(API_ENDPOINTS.LOGIN, {
        email,
        password,
      });

      if (response.data.access_token) {
        this.setUserData(response.data);
      }

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Logout user
  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  // Get current user
  getCurrentUser() {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem(TOKEN_KEY);
  }

  // Save user data to localStorage
  setUserData(data) {
    localStorage.setItem(TOKEN_KEY, data.access_token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  }

  // Handle API errors
  handleError(error) {
    if (error.response?.data?.message) {
      return new Error(
        Array.isArray(error.response.data.message)
          ? error.response.data.message[0]
          : error.response.data.message
      );
    }
    return new Error("An unexpected error occurred");
  }
}

const authService = new AuthService();
export default authService;
