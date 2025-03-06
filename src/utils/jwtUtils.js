import { jwtDecode } from "jwt-decode"; // Named import, not default

export const getRolesFromToken = (token) => {
  try {
    const decodedToken = jwtDecode(token);
    return decodedToken?.roles || []; // Adjust based on your JWT structure
  } catch (error) {
    console.error("Invalid token", error);
    return [];
  }
};

/**
 * Extract user information from a JWT token
 * @param {string} token - JWT token
 * @returns {Object|null} User object or null if invalid
 */
export const getUserFromToken = (token) => {
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
};

/**
 * Extract user email from a JWT token
 * @param {string} token - JWT token
 * @returns {string|null} User email or null if invalid
 */
export const getUserEmail = (token) => {
  try {
    const decoded = jwtDecode(token);
    // Check common properties where email might be stored
    return decoded.email || decoded.sub || decoded.username || null;
  } catch (error) {
    console.error("Error extracting user email:", error);
    return null;
  }
};

/**
 * Get authentication headers for API requests
 * @param {boolean} includeOwnerEmail - Whether to include the owner email header
 * @returns {Object} Headers object
 */
export const getAuthHeaders = (includeOwnerEmail = false) => {
  const token = localStorage.getItem('jwtToken');
  if (!token) return {};
  
  const headers = {
    'Authorization': `Bearer ${token}`
  };
  
  if (includeOwnerEmail) {
    try {
      const decoded = jwtDecode(token);
      const email = decoded.email || decoded.sub;
      if (email) {
        headers['Owner-Email'] = email;
      }
    } catch (error) {
      console.error("Error adding owner email header:", error);
    }
  }
  
  return headers;
};

/**
 * Check if the current user is authenticated
 * @returns {boolean} True if authenticated
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('jwtToken');
  if (!token) return false;
  
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    
    // Check if token is expired
    return decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
};