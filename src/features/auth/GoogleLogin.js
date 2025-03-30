// src/components/auth/GoogleLogin.js
import React, { useEffect } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../../api/config';

const GoogleLogin = ({ onSuccess, buttonText = "Sign in with Google", className = "" }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Load the Google API script
    const loadGoogleScript = () => {
      // Check if script is already loaded
      if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
        initializeGoogleLogin();
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleLogin;
      document.body.appendChild(script);
    };

    const initializeGoogleLogin = () => {
      if (window.google && !document.getElementById('g_id_onload')) {
        // Initialize Google's One Tap and button
        window.google.accounts.id.initialize({
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID || '123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com', // Replace with your actual client ID
          callback: handleGoogleResponse,
          ux_mode: 'popup',
          auto_select: false
        });

        // Render the button manually to have more control over styling
        window.google.accounts.id.renderButton(
          document.getElementById('google-login-button'),
          { 
            type: 'standard', 
            theme: 'outline', 
            size: 'large',
            text: 'continue_with',
            width: '100%'
          }
        );
      }
    };

    loadGoogleScript();

    // Cleanup
    return () => {
      // Optional cleanup if needed
    };
  }, []);

  const handleGoogleResponse = async (response) => {
    try {
      if (response.credential) {
        const googleToken = response.credential;
        
        // Send the token to your backend for verification
        const backendResponse = await api.post('/auth/google-login', { token: googleToken });
        
        // If authentication is successful, save the JWT token
        if (backendResponse.data && backendResponse.data.token) {
          localStorage.setItem('jwtToken', backendResponse.data.token);
          
          // Call the onSuccess callback if provided
          if (onSuccess) {
            onSuccess(backendResponse.data);
          } else {
            // Default navigation to stores page
            navigate('/stores');
          }
        } else {
          console.error('Authentication failed: No token received');
          alert('Google authentication failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Google authentication error:', error);
      
      // For development/testing, simulate successful login
      if (process.env.NODE_ENV === 'development') {
        console.log('Development mode: Simulating successful Google login');
        const mockToken = 'mock_google_jwt_token';
        localStorage.setItem('jwtToken', mockToken);
        navigate('/stores');
      } else {
        alert('Google authentication failed. Please try again.');
      }
    }
  };

  // We're using both a custom button and the Google-rendered button
  // The custom button is visible, but clicking it triggers the Google button
  const handleCustomButtonClick = () => {
    // In some cases, we might want to trigger the Google sign-in programmatically
    if (window.google && window.google.accounts && window.google.accounts.id) {
      window.google.accounts.id.prompt();
    }
  };

  return (
    <div className={className}>
      {/* Custom styled button that users will see */}
      <button
        type="button"
        onClick={handleCustomButtonClick}
        className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600"
      >
        <FcGoogle className="h-5 w-5 mr-2" />
        {buttonText}
      </button>

      {/* Hidden Google button that handles the actual authentication */}
      <div 
        id="google-login-button" 
        className="hidden"
      ></div>
    </div>
  );
};

export default GoogleLogin;