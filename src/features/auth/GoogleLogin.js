// src/components/auth/GoogleLogin.js
import React, { useEffect } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';
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
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
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
      // Send the ID token to your backend
      const result = await api.post('/auth/google-login', {
        token: response.credential
      });
      
      // Save the JWT token from your backend
      localStorage.setItem('jwtToken', result.data.token);
      
      // Call the onSuccess callback if provided
      if (onSuccess) {
        onSuccess(result.data);
      } else {
        // Default navigation to stores page
        navigate('/stores', { replace: true });
      }
    } catch (error) {
      console.error('Google authentication error:', error);
    }
  };

  return (
    <div id="google-login-button" className={`w-full ${className}`}></div>
  );
};

export default GoogleLogin;