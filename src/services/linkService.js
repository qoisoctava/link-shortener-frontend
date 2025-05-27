import api from "./api";
import { API_ENDPOINTS } from "../utils/constants";

class LinkService {
  // Get all links for authenticated user
  async getLinks() {
    try {
      const response = await api.get(API_ENDPOINTS.LINKS);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Create a new short link
  async createLink(originalUrl, customShortCode = null) {
    try {
      const data = { originalUrl };
      if (customShortCode) {
        data.customShortCode = customShortCode;
      }

      const response = await api.post(API_ENDPOINTS.LINKS, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update an existing link
  async updateLink(id, data) {
    try {
      const response = await api.put(API_ENDPOINTS.LINK_BY_ID(id), data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Delete a link
  async deleteLink(id) {
    try {
      await api.delete(API_ENDPOINTS.LINK_BY_ID(id));
      return true;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get link statistics
  async getLinkStats(id) {
    try {
      const response = await api.get(API_ENDPOINTS.LINK_STATS(id));
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Generate full short URL
  getShortUrl(shortCode) {
    return `${api.defaults.baseURL}/${shortCode}`;
  }

  // Handle errors
  handleError(error) {
    if (error.response?.data?.message) {
      const message = Array.isArray(error.response.data.message)
        ? error.response.data.message[0]
        : error.response.data.message;
      return new Error(message);
    }
    return new Error("An error occurred while processing your request");
  }
}

export default new LinkService();
