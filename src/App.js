import React from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import Navbar from "./components/layouts/Navbar";
import Footer from "./components/layouts/Footer";
import { ThemeProvider } from "./contexts/ThemeProvider";
import { StoreProvider } from "./contexts/StoreContext";
import AppRoutes from "./routes/index";
import "./index.css";

// This component determines whether to show navbar based on current route
const AppContent = () => {
  const location = useLocation();
  
  // List of routes where navbar should be hidden
  const hideNavbarRoutes = [
    '/stores',
    '/store-dashboard',
    '/customer/dashboard',
    '/profile'
  ];

  // Check if current path starts with any of the hideNavbarRoutes
  const shouldHideNavbar = () => {
    const isAuthenticated = localStorage.getItem('jwtToken') !== null;
    
    if (isAuthenticated) {
      return hideNavbarRoutes.some(route => 
        location.pathname === route || location.pathname.startsWith(`${route}/`)
      );
    }
    return false;
  };

  const hideNavbar = shouldHideNavbar();
  const hideFooter = hideNavbar; // Hide footer on the same routes as navbar

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      {!hideNavbar && <Navbar />}
      <main className="flex-grow">
        <AppRoutes />
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <ThemeProvider>
        <StoreProvider>
          <AppContent />
        </StoreProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;