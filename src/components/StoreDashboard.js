
// // StoreDashboard.js
// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import api from '../utils/apiConfig';
// import StoreSidebar from "./StoreSidebar";
// import "../styles/StoreDashboard.css";

// const StoreDashboard = () => {
//  const [store, setStore] = useState(null);  
//   const { storeId } = useParams(); 
// //   const store = {
// //     name: storeName,
// //     description: 'This is a placeholder description for ' + storeName,
// //     address: 'Placeholder address for ' + storeName,
// //   };

//     useEffect(() => {
//         const fetchStoreDetails = async () => {
//         try {
//             const response = await api.get(`/api/stores/stores/${storeId}`);  // Fetch store data using storeId
//             setStore(response.data);  // Set the fetched store data to state
//         } catch (error) {
//             console.error('Error fetching store details:', error);
//         }
//         };

//         fetchStoreDetails();
//     }, [storeId]);  // Re-fetch when storeId changes

//   if (!store) return <div>Loading...</div>;


// return (
//     <div className="dashboard-container">
//       {/* Sidebar will be rendered here */}
//       <StoreSidebar />

//       {/* Content Section */}
//       <div className="content">
//         <h2>{store.name} Dashboard</h2>
//         <p><strong>Description:</strong> {store.description}</p>
//         <p><strong>Address:</strong> {store.address}</p>
//       </div>
//     </div>
//   );

// };

// export default StoreDashboard;

// StoreDashboard.js
import React from "react";
import StoreSidebar from "./StoreSidebar"; // Sidebar component
import { Route, Routes } from "react-router-dom";
import ProductList from "./ProductList";  
import { Outlet } from "react-router-dom"; 
import "../styles/StoreDashboard.css"; // Import custom CSS
// import Orders from "./Orders";  // Orders component
// import Delivery from "./Delivery";  // Delivery component

const StoreDashboard = () => {
  return (
    <div className="dashboard-container">
      {/* Sidebar stays fixed on the left */}
      <StoreSidebar />

     

        <div className="content">
        {/* Nested content will render here */}
        <Outlet />
      
      </div>
    </div>
  );
};

export default StoreDashboard;

