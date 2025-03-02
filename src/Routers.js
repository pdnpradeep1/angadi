// import React from "react";
// import { Route, Routes, Navigate } from "react-router-dom";
// import Home from "./components/Home";
// import Login from "./components/Login";
// // Check if you're using the correct capitalization for the filename
// // If it's lowercase in your file system:
// import Signup from "./components/signup"; 
// import Dashboard from "./components/Dashboard";
// import ForgetPassword from './components/ForgetPassword';
// // The ProfilePage component might be causing issues - let's comment it out for now
// // import ProfilePage from './components/ProfilePage';
// import Store from './components/Store';
// import StoreDashboard from './components/StoreDashboard';
// import ProductList from "./components/ProductList";
// import AddProduct from "./components/AddProduct"; // Import the AddProduct component

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
      
//       {/* Temporarily comment out ProfilePage route if it's causing issues */}
//       {/*
//       <Route
//         path="/profile"
//         element={
//           <ProtectedRoute>
//             <ProfilePage />
//           </ProtectedRoute>
//         }
//       />
//       */}
      
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
import InventoryManagement from "./components/InventoryManagement"; // Import the new component
import OrdersContainer from './components/OrdersContainer';
import OrdersMainComponent from './components/OrdersMainComponent';
import OrderDetail from './components/OrderDetail';

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
        <Route path="all-products" element={<ProductList />} />
        <Route path="inventory" element={<InventoryManagement />} />
      </Route>

        {/* Orders routes */}
        <Route path="/store-dashboard/:storeId/orders" element={<OrdersContainer />}>
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