import React, { useEffect , useState } from "react";
import {
  LoginContainer,
  LoginForm,
  LoginInput,
  LoginButton,
  LoginTitle,
  ForgotPasswordLink,
  GoogleLoginButton,
  ErrorMessage,
} from "../styles/LoginStyle";
import { getRolesFromToken } from "../utils/jwtUtils"; // Ensure named import



function Login() {
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   /* global gapi */
  //   const initGoogleSignIn = () => {
  //     gapi.load("auth2", () => {
  //       gapi.auth2.init({
  //         client_id: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com", // Replace with your client ID
  //       });
  //     });
  //   };

  //   initGoogleSignIn();
  // }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    
    const email = document.querySelector('input[name="username"]').value;
    const password = document.querySelector('input[name="password"]').value;
  
    fetch('http://localhost:8080/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })
    .then(response => {
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid username or password');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Login successful:', data);
      localStorage.setItem('jwtToken', data.token);
      // localStorage.setItem('jwtToken', data.token);
      
      const userRole = getRolesFromToken(data.token);

      // Get role from JWT
      // const userRole = getRoleFromJWT(response.data.token);
      
      // Redirect based on role
      if (userRole[0] === 'admin') {
        window.location.href = '/dashboard/admin';
      } else if (userRole[0] === 'user') {
        window.location.href = '/dashboard/user';
      }
        else if (userRole[0] === 'CUSTOMER') {
        window.location.href = '/customer/dashboard';
      } else {
        throw new Error('Unknown user role');
      }
      

      // Handle successful login (e.g., redirect or update UI)
    })
    .catch(error => {
      console.error('Error logging in:', error);
      setError(error.message || 'An unexpected error occurred');
      // Handle login error (e.g., show error message)
    });
  };
  
  const determineNextPage = (userData) => {
    // Assuming userData contains role information
    if (userData.role === 'admin') {
      return '/dashboard/admin';
    } else if (userData.role === 'user') {
      return '/dashboard/user';
    } else {
      throw new Error('Unknown user role');
    }
  };

  const handleGoogleLogin = () => {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signIn().then((googleUser) => {
      const profile = googleUser.getBasicProfile();
      console.log("ID: " + profile.getId()); // Do not send to your backend! Use an ID token instead.
      console.log("Name: " + profile.getName());
      console.log("Image URL: " + profile.getImageUrl());
      console.log("Email: " + profile.getEmail());
      // Handle login logic here (e.g., send token to your backend)
          
    // Send user data to backend
    fetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: profile.getId(),
        name: profile.getName(),
        email: profile.getEmail()
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log('Login successful:', data);
      setError(null);
      // Handle successful login (e.g., redirect or update UI)
    })
    .catch(error => {
      console.error('Error logging in:', error);
      setError(error.message || 'An unexpected error occurred');

      // Handle login error (e.g., show error message)
    });
    });
  };

  return (
    <LoginContainer>
      <LoginTitle>Login to Your Account</LoginTitle>
      {error && (
        <ErrorMessage>{error}</ErrorMessage>
      )}
      <LoginForm onSubmit={handleSubmit}>
        <LoginInput type="text" placeholder="username" name="username" required />
        <LoginInput type="password" placeholder="Password" name="password" required />
        <LoginButton type="submit">Login</LoginButton>
        <GoogleLoginButton onClick={handleGoogleLogin}>
          Login with Google
        </GoogleLoginButton>
        <ForgotPasswordLink href="/auth/forgetpassword">
          Forgot Password?
        </ForgotPasswordLink>
      </LoginForm>
    </LoginContainer>
  );
}

export default Login;
