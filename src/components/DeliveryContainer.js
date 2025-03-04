// import React, { useState } from "react";
// import { Outlet, useParams } from "react-router-dom";
// import DeliverySidebar from "./DeliverySidebar";
// import { FiMenu, FiX } from "react-icons/fi";

// const DeliveryContainer = () => {
//   const { storeId } = useParams();
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

//   const toggleSidebar = () => {
//     setSidebarOpen(!sidebarOpen);
//   };

//   const toggleMobileSidebar = () => {
//     setMobileSidebarOpen(!mobileSidebarOpen);
//   };

//   return (
//     <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
//       {/* Desktop Sidebar */}
//       <div 
//         className={`hidden md:block transition-all duration-300 ease-in-out ${
//           sidebarOpen ? 'w-64' : 'w-0'
//         } h-screen overflow-y-auto`}
//       >
//         <DeliverySidebar />
//       </div>
      
//       {/* Mobile Sidebar */}
//       <div 
//         className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ease-in-out ${
//           mobileSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
//         }`}
//       >
//         <div className="absolute inset-0 bg-gray-600 dark:bg-gray-900 opacity-75"></div>
        
//         <div className={`relative flex flex-col w-64 h-full max-w-xs bg-white dark:bg-gray-800 transition-transform duration-300 ease-in-out ${
//           mobileSidebarOpen ? 'transform translate-x-0' : 'transform -translate-x-full'
//         }`}>
//           <div className="absolute top-0 right-0 pt-4 pr-4">
//             <button
//               className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
//               onClick={toggleMobileSidebar}
//             >
//               <FiX className="h-6 w-6" />
//             </button>
//           </div>
//           <div className="flex-1 overflow-y-auto">
//             <DeliverySidebar />
//           </div>
//         </div>
//       </div>
      
//       {/* Main Content */}
//       <div className="flex flex-col flex-1 overflow-hidden">
//         {/* Top Bar */}
//         <div className="md:hidden bg-white dark:bg-gray-800 shadow-sm px-4 py-2 flex items-center">
//           <button
//             onClick={toggleMobileSidebar}
//             className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
//           >
//             <FiMenu className="h-6 w-6" />
//           </button>
//         </div>
        
//         {/* Content Area */}
//         <div className="flex-1 overflow-auto">
//           <Outlet />
//         </div>
//       </div>
      
//       {/* Sidebar Toggle for Desktop */}
//       <button
//         onClick={toggleSidebar}
//         className="hidden md:block fixed left-64 bottom-4 z-30 bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-full shadow-lg transform transition-transform duration-300 ease-in-out"
//         style={{ 
//           transform: sidebarOpen ? 'translateX(0)' : 'translateX(-64px)'
//         }}
//       >
//         <FiMenu className="h-5 w-5" />
//       </button>
//     </div>
//   );
// }

// export default DeliveryContainer;


import React, { useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import DeliverySidebar from "./DeliverySidebar";
import { FiMenu, FiX } from "react-icons/fi";

const DeliveryContainer = () => {
  const { storeId } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Desktop Sidebar */}
      <div 
        className={`hidden md:block transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'w-64' : 'w-0'
        } h-screen overflow-y-auto`}
      >
        <DeliverySidebar />
      </div>
      
      {/* Mobile Sidebar */}
      <div 
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ease-in-out ${
          mobileSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-gray-600 dark:bg-gray-900 opacity-75"></div>
        
        <div className={`relative flex flex-col w-64 h-full max-w-xs bg-white dark:bg-gray-800 transition-transform duration-300 ease-in-out ${
          mobileSidebarOpen ? 'transform translate-x-0' : 'transform -translate-x-full'
        }`}>
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              onClick={toggleMobileSidebar}
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <DeliverySidebar />
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Bar */}
        <div className="md:hidden bg-white dark:bg-gray-800 shadow-sm px-4 py-2 flex items-center">
          <button
            onClick={toggleMobileSidebar}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
          >
            <FiMenu className="h-6 w-6" />
          </button>
        </div>
        
        {/* Content Area - This is critical for rendering child routes */}
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
      
      {/* Sidebar Toggle for Desktop */}
      <button
        onClick={toggleSidebar}
        className="hidden md:block fixed left-64 bottom-4 z-30 bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-full shadow-lg transform transition-transform duration-300 ease-in-out"
        style={{ 
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-64px)'
        }}
      >
        <FiMenu className="h-5 w-5" />
      </button>
    </div>
  );
};

export default DeliveryContainer;