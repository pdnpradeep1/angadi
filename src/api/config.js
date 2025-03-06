import axios from 'axios';
import { getAuthHeaders, isAuthenticated } from '../utils/jwtUtils';

// Base API configuration
const API_BASE_URL = 'http://localhost:8080';

// Create a customized axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  config => {
    // Add auth headers if user is logged in
    if (isAuthenticated()) {
      const authHeaders = getAuthHeaders();
      config.headers = { 
        ...config.headers,
        ...authHeaders
      };
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  response => response,
  error => {
    const { response } = error;
    
    // Handle authentication errors
    if (response && response.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('jwtToken');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    // Handle server errors
    if (response && response.status >= 500) {
      console.error('Server error:', error);
    }

    return Promise.reject(error);
  }
);

// Helper functions for common API operations
export const apiService = {
  /**
   * Make a GET request
   * @param {string} url - Request URL
   * @param {Object} params - URL parameters
   * @param {Object} config - Additional axios config
   * @returns {Promise} Promise with response
   */
  get: (url, params = {}, config = {}) => {
    return api.get(url, { ...config, params });
  },
  
  /**
   * Make a POST request
   * @param {string} url - Request URL
   * @param {Object} data - Request body
   * @param {Object} config - Additional axios config
   * @returns {Promise} Promise with response
   */
  post: (url, data = {}, config = {}) => {
    return api.post(url, data, config);
  },
  
  /**
   * Make a PUT request
   * @param {string} url - Request URL
   * @param {Object} data - Request body
   * @param {Object} config - Additional axios config
   * @returns {Promise} Promise with response
   */
  put: (url, data = {}, config = {}) => {
    return api.put(url, data, config);
  },
  
  /**
   * Make a DELETE request
   * @param {string} url - Request URL
   * @param {Object} config - Additional axios config
   * @returns {Promise} Promise with response
   */
  delete: (url, config = {}) => {
    return api.delete(url, config);
  },
  
  /**
   * Upload a file
   * @param {string} url - Upload URL
   * @param {FormData} formData - Form data with file
   * @param {Function} onProgress - Progress callback
   * @returns {Promise} Promise with response
   */
  uploadFile: (url, formData, onProgress = null) => {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    };
    
    if (onProgress) {
      config.onUploadProgress = progressEvent => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      };
    }
    
    return api.post(url, formData, config);
  }
};

export default api;