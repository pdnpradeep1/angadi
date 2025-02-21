import React from "react";
import {
  LoginContainer,
  LoginForm,
  LoginInput,
  LoginButton,
  LoginTitle,
  ForgotPasswordLink,
} from "../styles/LoginStyle";

function Login() {
  return (
    <LoginContainer>
      <LoginTitle>Login to Your Account</LoginTitle>
      <LoginForm>
        <LoginInput type="text" placeholder="Username" required />
        <LoginInput type="password" placeholder="Password" required />
        <LoginButton type="submit">Login</LoginButton>
        <ForgotPasswordLink href="/forgot-password">
          Forgot Password?
        </ForgotPasswordLink>
      </LoginForm>
    </LoginContainer>
  );
}

export default Login;
