// // In your AppRoutes.js file, add the new pricing route

// import React from "react";
// import { Route, Routes, Navigate } from "react-router-dom";
// import Home from "./components/Home";
// import Login from "./components/Login";
// import Signup from "./components/signup";
// import Dashboard from "./components/Dashboard";
// import ForgetPassword from './components/ForgetPassword';
// import Store from './components/Store';
// import StoreDashboard from './components/StoreDashboard';
// import ProductList from "./components/ProductList";
// import AddProduct from "./components/AddProduct";
// import InventoryManagement from "./components/InventoryManagement";
// import OrdersContainer from './components/OrdersContainer';
// import OrdersMainComponent from './components/OrdersMainComponent';
// import OrderDetail from './components/OrderDetail';
// import OrderExport from './components/OrderExport';
// import PricingPage from './components/PricingPage'; // Import the new PricingPage component

// // Auth guard component
// const ProtectedRoute = ({ children }) => {
//   const isAuthenticated = localStorage.getItem('jwtToken') !== null;
  
//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }
  
//   return children;
// };

// // Redirect if already authenticated
// const RedirectIfAuthenticated = ({ children }) => {
//   const isAuthenticated = localStorage.getItem('jwtToken') !== null;
  
//   if (isAuthenticated) {
//     return <Navigate to="/stores" replace />;
//   }
  
//   return children;
// };

// // 404 Not Found Page Component
// const NotFoundPage = () => (
//   <div className="flex items-center justify-center h-screen">
//     <div className="text-center">
//       <h1 className="text-6xl font-bold text-gray-300 dark:text-gray-700">404</h1>
//       <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Page Not Found</h2>
//       <p className="text-gray-600 dark:text-gray-400 mb-6">The page you're looking for doesn't exist or has been moved.</p>
//       <a 
//         href="/"
//         className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
//       >
//         Go Home
//       </a>
//     </div>
//   </div>
// );

// function AppRoutes() {
//   return (
//     <Routes>
//       {/* Public routes */}
//       <Route path="/" element={<Home />} />
//       <Route path="/pricing" element={<PricingPage />} /> {/* Add the pricing route */}
//       <Route
//         path="/login"
//         element={
//           <RedirectIfAuthenticated>
//             <Login />
//           </RedirectIfAuthenticated>
//         }
//       />
//       <Route
//         path="/signup"
//         element={
//           <RedirectIfAuthenticated>
//             <Signup />
//           </RedirectIfAuthenticated>
//         }
//       />
//       <Route path="/auth/forgetpassword" element={<ForgetPassword />} />
      
//       {/* Protected routes */}
//       <Route
//         path="/customer/dashboard"
//         element={
//           <ProtectedRoute>
//             <Dashboard />
//           </ProtectedRoute>
//         }
//       />
      
//       <Route
//         path="/stores"
//         element={
//           <ProtectedRoute>
//             <Store />
//           </ProtectedRoute>
//         }
//       />
      
//       {/* Store dashboard and nested routes */}
//       <Route
//         path="/store-dashboard/:storeId"
//         element={
//           <ProtectedRoute>
//             <StoreDashboard />
//           </ProtectedRoute>
//         }
//       >
//         <Route path="all-products" element={<ProductList />} />
//         <Route path="inventory" element={<InventoryManagement />} />

//         <Route path="orders" element={<OrdersContainer />}>
//           <Route index element={<OrdersMainComponent />} />
//           <Route path="all" element={<OrdersMainComponent />} />
//           <Route path="pending" element={<OrdersMainComponent />} />
//           <Route path="processing" element={<OrdersMainComponent />} />
//           <Route path="shipped" element={<OrdersMainComponent />} />
//           <Route path="delivered" element={<OrdersMainComponent />} />
//           <Route path="cancelled" element={<OrdersMainComponent />} />
//           <Route path="refunds" element={<OrdersMainComponent />} />
//           <Route path="returns" element={<OrdersMainComponent />} />
//           <Route path="view/:orderId" element={<OrderDetail />} />
//           <Route path="export" element={<OrderExport />} />
//         </Route>
//       </Route>

//       {/* Add the route for the AddProduct page */}
//       <Route
//         path="/store-dashboard/:storeId/add-product"
//         element={
//           <ProtectedRoute>
//             <AddProduct />
//           </ProtectedRoute>
//         }
//       />
      
//       {/* Catch-all route for 404 */}
//       <Route path="*" element={<NotFoundPage />} />
//     </Routes>
//   );
// }

// export default AppRoutes;

import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/signup";
import Dashboard from "./components/Dashboard";
import ForgetPassword from './components/ForgetPassword';
import Store from './components/Store';
import StoreDashboard from './components/StoreDashboard';
import ProductList from "./components/ProductList";
import AddProduct from "./components/AddProduct";
import InventoryManagement from "./components/InventoryManagement";
import OrdersContainer from './components/OrdersContainer';
import OrdersMainComponent from './components/OrdersMainComponent';
import OrderDetail from './components/OrderDetail';
import OrderExport from './components/OrderExport';
import PricingPage from './components/PricingPage';
import DeliveryContainer from './components/DeliveryContainer';
import DeliveryMainComponent from './components/DeliveryMainComponent';
import DeliveryDetail from './components/DeliveryDetail';
import DeliveryMap from './components/DeliveryMap';

// Auth guard component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('jwtToken') !== null;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Redirect if already authenticated
const RedirectIfAuthenticated = ({ children }) => {
  const isAuthenticated = localStorage.getItem('jwtToken') !== null;
  
  if (isAuthenticated) {
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



        {/* Orders routes */}
        <Route path="orders" element={<OrdersContainer />}>
          <Route index element={<OrdersMainComponent />} />
          <Route path="all" element={<OrdersMainComponent />} />
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

                {/* Delivery routes */}
        {/* <Route path="delivery" element={<DeliveryContainer />}>
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
         */}
        {/* Separate route for delivery map */}
        {/* <Route path="delivery/map" element={<DeliveryMap />} /> */}
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
    <Route
        path="/store-dashboard/:storeId/delivery"
        element={
          <ProtectedRoute>
            <DeliveryContainer />
          </ProtectedRoute>
        }
      >
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
        
      <Route
        path="/store-dashboard/:storeId/delivery/map"
        element={
          <ProtectedRoute>
            <DeliveryMap />
          </ProtectedRoute>
        }
      />
      
      {/* Catch-all route for 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;