import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/signup";
import Dashboard from "./components/Dashboard";
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

function AppRoutes() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleGoogleLogin = () => {
    console.log("Google login initiated");
    setIsAuthenticated(true);
  };

  const handleFacebookLogin = () => {
    console.log("Facebook login initiated");
    setIsAuthenticated(true);
  };

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/login"
        element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />}
      />
      <Route
        path="/signup"
        element={!isAuthenticated ? <Signup /> : <Navigate to="/dashboard" />}
      />
      <Route
        path="/dashboard"
        element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
      />
    </Routes>
  );
}

export default AppRoutes;
