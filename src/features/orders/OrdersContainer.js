import React, { useState, useEffect } from "react";
import { Outlet, useParams, useLocation } from "react-router-dom";
import OrdersHeader, { OrderStatusContext } from "./OrdersHeader";

const OrdersContainer = () => {
  const { storeId } = useParams();
  const location = useLocation();
  
  // Initialize with status from URL or default to 'all'
  const getInitialStatus = () => {
    const path = location.pathname;
    const statusMatch = path.match(/\/orders\/([^/]+)/);
    return statusMatch ? statusMatch[1] : 'all';
  };
  
  // State to track the current order status
  const [currentStatus, setCurrentStatus] = useState(getInitialStatus());
  
  // Update status from URL if it changes (like when using browser back/forward buttons)
  useEffect(() => {
    const status = getInitialStatus();
    if (status !== currentStatus) {
      setCurrentStatus(status);
    }
  }, [location.pathname]);

  return (
    <OrderStatusContext.Provider value={{ currentStatus, setCurrentStatus }}>
      <div className="flex flex-col h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
        {/* Top Navigation with Order Filters */}
        <OrdersHeader />
        
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </OrderStatusContext.Provider>
  );
};

export default OrdersContainer;