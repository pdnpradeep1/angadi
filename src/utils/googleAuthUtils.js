// src/utils/googleAuthUtils.js

/**
 * Utility functions for Google authentication
 */

/**
 * Loads the Google API script dynamically
 * @returns {Promise} Resolves when the script is loaded
 */
export const loadGoogleApi = () => {
    return new Promise((resolve, reject) => {
      // Check if script already exists
      if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
        resolve();
        return;
      }
  
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  };
  
  /**
   * Initialize Google Identity Services for One Tap and button rendering
   * @param {Object} config Configuration options
   * @param {string} config.clientId Google Client ID
   * @param {Function} config.handleCredentialResponse Callback to handle auth response
   * @param {boolean} config.autoSelect Whether to auto-select accounts (default false)
   * @returns {Object} The initialized Google Identity Services object
   */
  export const initializeGoogleAuth = ({ 
    clientId,
    handleCredentialResponse,
    autoSelect = false
  }) => {
    if (!window.google) {
      console.error('Google API not loaded. Call loadGoogleApi first.');
      return null;
    }
  
    // Configure the client
    window.google.accounts.id.initialize({
      client_id: clientId || process.env.REACT_APP_GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
      auto_select: autoSelect,
      cancel_on_tap_outside: true
    });
  
    return window.google;
  };
  
  /**
   * Renders a Google Sign-In button into a specified container
   * @param {string} buttonId The ID of the container element
   * @param {Object} options Button configuration options
   * @returns {boolean} Success status
   */
  export const renderGoogleButton = (buttonId, options = {}) => {
    if (!window.google || !window.google.accounts || !window.google.accounts.id) {
      console.error('Google API not initialized. Call initializeGoogleAuth first.');
      return false;
    }
  
    const buttonElement = document.getElementById(buttonId);
    if (!buttonElement) {
      console.error(`Button container with ID '${buttonId}' not found.`);
      return false;
    }
  
    const defaultOptions = {
      type: 'standard', 
      theme: 'outline', 
      size: 'large',
      text: 'continue_with',
      shape: 'rectangular',
      logo_alignment: 'left',
      width: '100%'
    };
  
    window.google.accounts.id.renderButton(
      buttonElement,
      { ...defaultOptions, ...options }
    );
  
    return true;
  };
  
  /**
   * Prompts the One Tap sign-in UI to appear
   * @returns {boolean} Success status
   */
  export const promptOneTapSignIn = () => {
    if (!window.google || !window.google.accounts || !window.google.accounts.id) {
      console.error('Google API not initialized. Call initializeGoogleAuth first.');
      return false;
    }
  
    window.google.accounts.id.prompt();
    return true;
  };
  
  /**
   * Cancel the One Tap UI if it's displayed
   */
  export const cancelOneTapPrompt = () => {
    if (window.google && window.google.accounts && window.google.accounts.id) {
      window.google.accounts.id.cancel();
    }
  };
  
  /**
   * Parse the JWT token from Google response
   * @param {string} credential The JWT credential string
   * @returns {Object} The decoded payload or null if invalid
   */
  export const parseGoogleCredential = (credential) => {
    try {
      // Simple JWT parser (for client-side only)
      // In production, validation should happen on server
      const base64Url = credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
  
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Error parsing Google credential:', e);
      return null;
    }
  };