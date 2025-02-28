import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/signup";
import Dashboard from "./components/Dashboard";
import ForgetPassword from './components/ForgetPassword';
import ProfilePage from './components/ProfilePage';
import Store from './components/Store';
import StoreDashboard from './components/StoreDashboard';
import ProductList from "./components/ProductList";  

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
        path="/customer/dashboard"
        element={!isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
      />
       <Route
        path="/auth/forgetpassword"
        element={!isAuthenticated ? <ForgetPassword /> : <Navigate to="/login" />}
      />
       <Route path="/profile" component={ProfilePage} />
       <Route
        path="/stores"
        element={!isAuthenticated ? <Store /> : <Navigate to="/login" />}
      />
         <Route
          path="/store-dashboard/:storeId"
          element={<StoreDashboard />}
        >

        <Route path="all-products" element={<ProductList />} />
        

        </Route>

       
    </Routes>
  );
}

export default AppRoutes;
