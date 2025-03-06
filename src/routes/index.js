import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import ForgetPassword from '../pages/ForgetPassword';
import Store from '../pages/Store';
import StoreDashboard from '../pages/StoreDashboard';
import ProductList from "../features/products/ProductList";
import AddProduct from "../features/products/AddProduct";
import InventoryManagement from "../features/products/InventoryManagement";
import OrdersContainer from '../features/orders/OrdersContainer'; // Updated component
import OrdersMainComponent from '../features/orders/OrdersMainComponent';
import OrderDetail from '../features/orders/OrderDetail';
import OrderExport from '../features/orders/OrderExport';
import PricingPage from '../pages/PricingPage';
import DeliveryContainer from '../features/delivery/DeliveryContainer';
import DeliveryMainComponent from '../features/delivery/DeliveryMainComponent';
import DeliveryDetail from '../features/delivery/DeliveryDetail';
import DeliveryMap from '../features/delivery/DeliveryMap';
import Audience from '../features/customers/Audience';
import PaymentsPage from '../pages/PaymentsPage';
import StoreAnalytics from '../features/analytics/StoreAnalytics';
import AbandonedOrders from '../features/orders/AbandonedOrders';
import StoreSettings from '../features/settings/index';
import { isAuthenticated } from '../utils/jwtUtils';

// Auth guard component
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Redirect if already authenticated
const RedirectIfAuthenticated = ({ children }) => {
  if (isAuthenticated()) {
    return <Navigate to="/stores" replace />;
  }
  
  return children;
};

// 404 Not Found Page Component
const NotFoundPage = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-gray-300 dark:text-gray-700">404</h1>
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Page Not Found</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">The page you're looking for doesn't exist or has been moved.</p>
      <a 
        href="/"
        className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
      >
        Go Home
      </a>
    </div>
  </div>
);

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route
        path="/login"
        element={
          <RedirectIfAuthenticated>
            <Login />
          </RedirectIfAuthenticated>
        }
      />
      <Route
        path="/signup"
        element={
          <RedirectIfAuthenticated>
            <Signup />
          </RedirectIfAuthenticated>
        }
      />
      <Route path="/auth/forgetpassword" element={<ForgetPassword />} />
      
      {/* Protected routes */}
      <Route
        path="/customer/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/stores"
        element={
          <ProtectedRoute>
            <Store />
          </ProtectedRoute>
        }
      />
      
      {/* Store dashboard and nested routes */}
      <Route
        path="/store-dashboard/:storeId"
        element={
          <ProtectedRoute>
            <StoreDashboard />
          </ProtectedRoute>
        }
      >
        {/* Product routes */}
        <Route path="all-products" element={<ProductList />} />
        <Route path="inventory" element={<InventoryManagement />} />

        {/* Orders routes using the updated OrdersContainer component */}
        <Route path="orders" element={<OrdersContainer />}>
          {/* <Route index element={<OrdersMainComponent />} /> */}
          <Route index path="all" element={<OrdersMainComponent />} />
          <Route path="pending" element={<OrdersMainComponent />} />
          <Route path="processing" element={<OrdersMainComponent />} />
          <Route path="shipped" element={<OrdersMainComponent />} />
          <Route path="delivered" element={<OrdersMainComponent />} />
          <Route path="cancelled" element={<OrdersMainComponent />} />
          <Route path="refunds" element={<OrdersMainComponent />} />
          <Route path="returns" element={<OrdersMainComponent />} />
          <Route path="view/:orderId" element={<OrderDetail />} />
          <Route path="export" element={<OrderExport />} />
        </Route>
        <Route path="orders/abandoned" element={<AbandonedOrders />} />

        {/* Delivery routes */}
        <Route path="delivery" element={<DeliveryContainer />}>
          <Route index element={<DeliveryMainComponent />} />
          <Route path="all" element={<DeliveryMainComponent />} />
          <Route path="pending" element={<DeliveryMainComponent />} />
          <Route path="intransit" element={<DeliveryMainComponent />} />
          <Route path="delivered" element={<DeliveryMainComponent />} />
          <Route path="cancelled" element={<DeliveryMainComponent />} />
          <Route path="returned" element={<DeliveryMainComponent />} />
          <Route path="partners/all" element={<DeliveryMainComponent />} />
          <Route path="partners/performance" element={<DeliveryMainComponent />} />
          <Route path="partners/settings" element={<DeliveryMainComponent />} />
          <Route path="view/:deliveryId" element={<DeliveryDetail />} />
        </Route>
        
        {/* Separate route for delivery map */}
        <Route path="delivery/map" element={<DeliveryMap />} />


        <Route path="inventory" element={<InventoryManagement />} />

        <Route path="audience" element={<Audience />} />
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="analytics" element={<StoreAnalytics />} />
        <Route path="settings" element={<StoreSettings />} />
        
      </Route>

      {/* Add the route for the AddProduct page */}
      <Route
        path="/store-dashboard/:storeId/add-product"
        element={
          <ProtectedRoute>
            <AddProduct />
          </ProtectedRoute>
        }
      />
      
      {/* Catch-all route for 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;