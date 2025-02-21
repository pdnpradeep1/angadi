import React, { useEffect } from "react";
import {
  LoginContainer,
  LoginForm,
  LoginInput,
  LoginButton,
  LoginTitle,
  ForgotPasswordLink,
  GoogleLoginButton,
} from "../styles/LoginStyle";

function Login() {
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

  const handleGoogleLogin = () => {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signIn().then((googleUser) => {
      const profile = googleUser.getBasicProfile();
      console.log("ID: " + profile.getId()); // Do not send to your backend! Use an ID token instead.
      console.log("Name: " + profile.getName());
      console.log("Image URL: " + profile.getImageUrl());
      console.log("Email: " + profile.getEmail());
      // Handle login logic here (e.g., send token to your backend)
    });
  };

  return (
    <LoginContainer>
      <LoginTitle>Login to Your Account</LoginTitle>
      <LoginForm>
        <LoginInput type="text" placeholder="Username" required />
        <LoginInput type="password" placeholder="Password" required />
        <LoginButton type="submit">Login</LoginButton>
        <GoogleLoginButton onClick={handleGoogleLogin}>
          Login with Google
        </GoogleLoginButton>
        <ForgotPasswordLink href="/forgot-password">
          Forgot Password?
        </ForgotPasswordLink>
      </LoginForm>
    </LoginContainer>
  );
}

export default Login;
