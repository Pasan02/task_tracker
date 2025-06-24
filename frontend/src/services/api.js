import { API_ENDPOINTS } from '../utils/constants';

/**
 * Base API service for handling HTTP requests
 * This service will switch between localStorage and real API calls
 */
class ApiService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    this.useLocalStorage = !import.meta.env.VITE_API_URL || import.meta.env.MODE === 'development';
    this.defaultHeaders = {
      'Content-Type': 'application/json'
    };
    this.authToken = null;
  }

  /**
   * Generic request method
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise} Response data
   */
  async request(endpoint, options = {}) {
    // If using localStorage, return immediately
    if (this.useLocalStorage) {
      return this.handleLocalStorageRequest(endpoint, options);
    }

    // Real API request
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return await response.text();
    } catch (error) {
      console.error('API request failed:', error);
      throw this.handleApiError(error);
    }
  }

  /**
   * Handle localStorage requests (for development)
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise} Simulated response
   */
  async handleLocalStorageRequest(endpoint, options) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));

    const method = options.method || 'GET';
    
    // This is a mock implementation - actual localStorage logic
    // will be handled by taskService and habitService
    throw new Error(`localStorage simulation not implemented for ${method} ${endpoint}`);
  }

  /**
   * Handle API errors consistently
   * @param {Error} error - Original error
   * @returns {Error} Formatted error
   */
  handleApiError(error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return new Error('Network error: Please check your internet connection');
    }
    
    if (error.message.includes('404')) {
      return new Error('Resource not found');
    }
    
    if (error.message.includes('401')) {
      return new Error('Unauthorized: Please log in again');
    }
    
    if (error.message.includes('403')) {
      return new Error('Forbidden: You do not have permission to perform this action');
    }
    
    if (error.message.includes('500')) {
      return new Error('Server error: Please try again later');
    }
    
    return error;
  }

  /**
   * GET request
   * @param {string} endpoint - API endpoint
   * @param {Object} params - Query parameters
   * @returns {Promise} Response data
   */
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return this.request(url, {
      method: 'GET',
    });
  }

  /**
   * POST request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @returns {Promise} Response data
   */
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * PUT request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @returns {Promise} Response data
   */
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE request
   * @param {string} endpoint - API endpoint
   * @returns {Promise} Response data
   */
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  /**
   * PATCH request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @returns {Promise} Response data
   */
  async patch(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  /**
   * Check if API is available
   * @returns {Promise<boolean>} API availability status
   */
  async checkHealth() {
    if (this.useLocalStorage) {
      return true; // Local storage is always "available"
    }

    try {
      await this.get('/health');
      return true;
    } catch (error) {
      console.warn('API health check failed:', error);
      return false;
    }
  }

  /**
   * Set authentication token
   * @param {string} token - JWT token
   */
  setAuthToken(token) {
    this.authToken = token;
    if (token) {
      this.defaultHeaders = {
        ...this.defaultHeaders,
        Authorization: `Bearer ${token}`,
      };
    } else {
      delete this.defaultHeaders?.Authorization;
    }
  }

  /**
   * Clear authentication token
   */
  clearAuthToken() {
    this.authToken = null;
    if (this.defaultHeaders) {
      delete this.defaultHeaders.Authorization;
    }
  }
}

// Export singleton instance
const apiService = new ApiService();
export default apiService;

// Export class for testing
export { ApiService };