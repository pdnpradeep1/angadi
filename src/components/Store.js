// // import React, { useState, useEffect } from 'react';
// // import '../styles/Store.css';
// // import CreateStore from './create-store';
// // import StoreList from './store-list';

// // const App = () => {
// //   const [userEmail] = useState('YourEmail@gmail.com');
// //   const [recentStores, setRecentStores] = useState([]);
// //   const [loadingStores, setLoadingStores] = useState(true);
// //   const [showCreateStore, setShowCreateStore] = useState(false);

// //   useEffect(() => {
// //     const fetchStores = async () => {
// //       setLoadingStores(true);
// //       const stores = await fetchStoresApi();
// //       setRecentStores(stores);
// //       setLoadingStores(false);
// //     };

// //     fetchStores();
// //   }, []);

// //   const fetchStoresApi = () => {
// //     return new Promise((resolve) => {
// //       setTimeout(() => {
// //         resolve([
// //           { name: 'My1stStore', url: 'My1stStore.myshopify.com' },
// //           { name: 'My2ndStore', url: 'My2ndStore.myshopify.com' },
// //           { name: 'My2ndStore', url: 'My2ndStore.myshopify.com' },
// //           { name: 'My2ndStore', url: 'My2ndStore.myshopify.com' },
// //           { name: 'My2ndStore', url: 'My2ndStore.myshopify.com' },
// //           { name: 'My2ndStore', url: 'My2ndStore.myshopify.com' },
// //           { name: 'My2ndStore', url: 'My2ndStore.myshopify.com' },
// //           { name: 'My2ndStore', url: 'My2ndStore.myshopify.com' },
// //         ]);
// //       }, 1000);
// //     });
// //   };

// //   const handleStoreCreated = (newStore) => {
// //     setRecentStores((prevStores) => [newStore, ...prevStores]);
// //     setShowCreateStore(false); // Hide the create store form after successful creation
// //   };

// //   const handleCreateStoreToggle = () => {
// //     setShowCreateStore(!showCreateStore); // Toggle the visibility of CreateStore form
// //   };

// //   return (
// //     <div className="app-container">
// //       <div className="content-box">
// //         <div className="header">
// //           <img src="https://cdn.shopify.com/shopify-marketing_assets/static/shopify-logo.svg" alt="Shopify" className="shopify-logo" />
// //           <div className="email-container">
// //             <span className="email">YE {userEmail}</span>
// //             <button className="logout-button">Log out</button>
// //           </div>
// //         </div>
// //         <div className="recent-stores">
// //           <h2>Recently accessed stores</h2>
// //           {loadingStores ? (
// //             <p>Loading stores...</p>
// //           ) : (
// //             <StoreList stores={recentStores} />
// //           )}
// //           <div className="actions">
// //             <button className="create-store-button" onClick={handleCreateStoreToggle}>
// //               {showCreateStore ? 'Cancel' : 'Create a New Store'}
// //             </button>
// //             {showCreateStore && <CreateStore onStoreCreated={handleStoreCreated} />}
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default App;

// import React, { useState, useEffect } from 'react';
// import '../styles/Store.css';
// import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
// import CreateStore from './create-store';
// import StoreList from './store-list';
// import StoreDashboard from './StoreDashboard'; // Import the StoreDashboard component

// const App = () => {
//   const [userEmail] = useState('YourEmail@gmail.com');
//   const [recentStores, setRecentStores] = useState([]);
//   const [loadingStores, setLoadingStores] = useState(true);
//   const [showCreateStore, setShowCreateStore] = useState(false);

//   useEffect(() => {
//     const fetchStores = async () => {
//       setLoadingStores(true);
//       const stores = await fetchStoresApi();
//       setRecentStores(stores);
//       setLoadingStores(false);
//     };

//     fetchStores();
//   }, []);

//   const fetchStoresApi = () => {
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         resolve([
//           { name: 'My1stStore', url: 'My1stStore.myshopify.com' },
//           { name: 'My2ndStore', url: 'My2ndStore.myshopify.com' },
//         ]);
//       }, 1000); // Simulate network delay
//     });
//   };

//   const handleStoreCreated = (newStore) => {
//     setRecentStores((prevStores) => [newStore, ...prevStores]);
//     setShowCreateStore(false); // Hide the create store form after successful creation
//   };

//   const handleCreateStoreToggle = () => {
//     setShowCreateStore(!showCreateStore); // Toggle the visibility of CreateStore form
//   };

//   return (
    
//       <div className="app-container">
//         <div className="content-box">
//           <div className="header">
//             <img
//               src="https://cdn.shopify.com/shopify-marketing_assets/static/shopify-logo.svg"
//               alt="Shopify"
//               className="shopify-logo"
//             />
//             <div className="email-container">
//               <span className="email">YE {userEmail}</span>
//               <button className="logout-button">Log out</button>
//             </div>
//           </div>
//           <div className="recent-stores">
//             <h2>Recently accessed stores</h2>
//             {loadingStores ? (
//               <p>Loading stores...</p>
//             ) : (
//               <StoreList stores={recentStores} />
//             )}
//             <div className="actions">
//               <button className="create-store-button" onClick={handleCreateStoreToggle}>
//                 {showCreateStore ? 'Cancel' : 'Create a New Store'}
//               </button>
//               {showCreateStore && <CreateStore onStoreCreated={handleStoreCreated} />}
//             </div>
//           </div>
//         </div>
//         <Routes>
//           {/* Route to the store dashboard page */}
//           {recentStores.map((store) => (
//             <Route
//               key={store.name}
//               path={`/store-dashboard/:storeName`}
//               element={<StoreDashboard />}
//             />
//           ))}
//            </Routes>
       
//       </div>
   
//   );
// };

// export default App;


import React, { useState, useEffect } from 'react';
import '../styles/Store.css';
import CreateStore from './create-store';
import StoreList from './store-list';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StoreDashboard from './StoreDashboard';
import api from '../utils/apiConfig';

const Store = () => {
  const [userEmail] = useState('YourEmail@gmail.com');
  const [recentStores, setRecentStores] = useState([]);
  const [loadingStores, setLoadingStores] = useState(true);
  const [showCreateStore, setShowCreateStore] = useState(false);

  useEffect(() => {
    const fetchStores = async () => {
      setLoadingStores(true);
      const stores = await api.get('/api/stores/my-stores'); // Fetch stores from the server
      setRecentStores(stores.data);
      setLoadingStores(false);
    };

    fetchStores();
  }, []);

//   const fetchStoresApi = () => {
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         resolve([
//           {
//             name: 'My1stStore',
//             description: 'A store for tech gadgets.',
//             address: '123 Tech Avenue',
//             url: 'My1stStore.myshopify.com',

//           },
//           {
//             name: 'My2ndStore',
//             description: 'An online clothing store.',
//             address: '456 Fashion Street',
//             url: 'My2ndStore.myshopify.com',
//           },
//         ]);
//       }, 1000);
//     });
//   };
const NoMatch = () => (
    <div>
      <h2>404 - Page Not Found</h2>
    </div>
  );
  const handleStoreCreated = (newStore) => {
    setRecentStores((prevStores) => [newStore, ...prevStores]);
    setShowCreateStore(false); // Hide the create store form after successful creation
  };

  const handleCreateStoreToggle = () => {
    setShowCreateStore(!showCreateStore); // Toggle the visibility of CreateStore form
  };

  return (
    
      <div className="app-container">
        <div className="content-box">
          <div className="header">
            <img
              src="https://cdn.shopify.com/shopify-marketing_assets/static/shopify-logo.svg"
              alt="Shopify"
              className="shopify-logo"
            />
            <div className="email-container">
              <span className="email">YE {userEmail}</span>
              <button className="logout-button">Log out</button>
            </div>
          </div>
          <div className="recent-stores">
            <h2>Recently accessed stores</h2>
            {loadingStores ? (
              <p>Loading stores...</p>
            ) : (
              <StoreList stores={recentStores} />
            )}
            <div className="actions">
              <button className="create-store-button" onClick={handleCreateStoreToggle}>
                {showCreateStore ? 'Cancel' : 'Create a New Store'}
              </button>
              {showCreateStore && <CreateStore onStoreCreated={handleStoreCreated} />}
            </div>
          </div>
        </div>
      
      </div>
  
  );
};

export default Store;

