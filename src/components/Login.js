import React from 'react';
import { LoginContainer, LoginForm, LoginInput, LoginButton, LoginTitle } from '../styles/LoginStyle';

function Login() {
  return (
    <LoginContainer>
      <LoginTitle>Login to Your Account</LoginTitle>
      <LoginForm>
        <LoginInput type="text" placeholder="Username" />
        <LoginInput type="password" placeholder="Password" />
        <LoginButton>Login</LoginButton>
      </LoginForm>
    </LoginContainer>
  );
}

export default Login;