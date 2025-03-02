import React from "react";
import { Outlet, useParams } from "react-router-dom";
import OrdersSidebar from "./OrdersSidebar";

const OrdersContainer = () => {
  const { storeId } = useParams();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Orders Sidebar */}
      <div className="w-64 flex-shrink-0 hidden md:block">
        <OrdersSidebar />
      </div>
      
      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden fixed bottom-4 right-4 z-20">
        <button
          onClick={() => document.getElementById('mobile-sidebar').classList.toggle('translate-x-0')}
          className="rounded-full w-12 h-12 bg-primary-600 text-white flex items-center justify-center shadow-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12h18M3 6h18M3 18h18"></path>
          </svg>
        </button>
      </div>
      
      {/* Mobile Sidebar */}
      <div
        id="mobile-sidebar"
        className="fixed inset-y-0 left-0 w-64 transform -translate-x-full transition-transform duration-300 ease-in-out z-30 md:hidden"
      >
        <div className="h-full relative">
          <button
            onClick={() => document.getElementById('mobile-sidebar').classList.remove('translate-x-0')}
            className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12"></path>
            </svg>
          </button>
          <OrdersSidebar />
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
};

export default OrdersContainer;