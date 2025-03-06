import React from "react";
import { Outlet, useParams } from "react-router-dom";
import OrdersHeader from "./OrdersHeader";

const OrdersContainer = () => {
  const { storeId } = useParams();

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Top Navigation with Order Filters */}
      <OrdersHeader />
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default OrdersContainer;