import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiPlus, 
  FiShoppingBag, 
  FiGrid, 
  FiList, 
  FiSearch, 
  FiLogOut, 
  FiAlertCircle,
  FiCheck,
  FiX
} from 'react-icons/fi';
import CreateStore from '../features/store/create-store';
import api from '../api/config';
import { jwtDecode } from 'jwt-decode';

const ToggleSwitch = ({ isActive, onChange, loading, size = "md" }) => {
  // Define the track (background) styles
  const trackWidth = size === "sm" ? "w-9" : "w-11";
  const trackHeight = size === "sm" ? "h-5" : "h-6";
  const trackClasses = `${trackWidth} ${trackHeight} rounded-full transition-colors duration-200 ease-in-out relative`;
  
  // Use original colors
  const trackColorClasses = isActive 
    ? "bg-green-500" 
    : "bg-gray-300 dark:bg-gray-600";
  
  // Define the thumb (circle) styles
  const thumbSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  const thumbClasses = `${thumbSize} bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out absolute top-1/2 -translate-y-1/2`;
  const thumbPosition = isActive ? "right-0.5" : "left-0.5";
  
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isActive}
      onClick={!loading ? onChange : undefined}
      disabled={loading}
      className={`relative inline-flex items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span className="sr-only">{isActive ? 'Active' : 'Inactive'}</span>
      <div className={`${trackClasses} ${trackColorClasses}`}>
        <span className={`${thumbClasses} ${thumbPosition}`}>
          {loading && (
            <svg className="animate-spin h-3 w-3 text-primary-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
        </span>
      </div>
    </button>
  );
};

const Store = () => {
  // const [userEmail, setUserEmail] = useState('user@example.com');
  const [stores, setStores] = useState([]);
  const [loadingStores, setLoadingStores] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateStore, setShowCreateStore] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [toggleLoading, setToggleLoading] = useState({});
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      navigate('/login');
      return;
    }

      // Extract user email from token
  try {
    const decodedToken = jwtDecode(token);
    // The email might be in different properties depending on your JWT structure
    // Common ones include 'email', 'sub', or 'username'
    if (decodedToken.email) {
      setUserEmail(decodedToken.email);
    } else if (decodedToken.sub) {
      setUserEmail(decodedToken.sub);
    } else if (decodedToken.username) {
      setUserEmail(decodedToken.username);
    } else {
      console.warn('Could not find email in JWT token:', decodedToken);
    }
  } catch (error) {
    console.error('Error decoding JWT token:', error);
  }

    // Fetch stores from backend API
    const fetchStores = async () => {
      setLoadingStores(true);
      setError(null);
      try {
        // Get user email/info from token if needed
        try {
          const decoded = JSON.parse(atob(token.split('.')[1]));
          if (decoded.email) {
            setUserEmail(decoded.email);
          }
        } catch (e) {
          console.log('Could not decode token for user info');
        }

        // Make API request to fetch stores
        const response = await api.get('/api/stores/my-stores');

        console.log('API Response:', response.data);
        
        // Check if the response data is in the expected format
        if (Array.isArray(response.data)) {
          setStores(response.data);
        } else if (response.data && Array.isArray(response.data.data)) {
          // Some APIs wrap the data in a data property
          setStores(response.data.data);
        } else {
          // If the data structure is different, log it for debugging
          console.warn('Unexpected data structure:', response.data);
          setStores([]); // Set empty array as fallback
          setError('Received unexpected data structure from the server');
        }
      } catch (error) {
        console.error('Error fetching stores:', error);
        setError(error.response?.data?.message || 'Failed to load stores. Please try again.');
        
        // For development/testing, use mock data as fallback if API fails
        if (process.env.NODE_ENV === 'development') {
          console.log('Using mock data as fallback in development mode');
          const mockStores = [
            {
              id: 1,
              name: "Fashion Boutique",
              description: "A boutique for trendy fashion items.",
              address: "123 Fashion Street",
              url: "fashion-boutique.myshop.com",
              createdAt: "2024-12-15",
              active: true,
              visible: true,
              products: 45,
              orders: 120,
              revenue: "$12,350"
            },
            {
              id: 2,
              name: "Tech Haven",
              description: "The ultimate gadget store.",
              address: "456 Tech Avenue",
              url: "tech-haven.myshop.com",
              createdAt: "2025-01-20",
              active: false,
              visible: false,
              products: 87,
              orders: 210,
              revenue: "$32,780"
            }
          ];
          setStores(mockStores);
        }
      } finally {
        setLoadingStores(false);
      }
    };

    fetchStores();
  }, [navigate]);

  const handleStoreCreated = (newStore) => {
    setStores((prevStores) => [newStore, ...prevStores]);
    setShowCreateStore(false);
  };

  const handleCreateStoreToggle = () => {
    setShowCreateStore(!showCreateStore);
  };

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    navigate('/login');
  };

  const handleToggleActive = async (storeId, currentStatus) => {
    // Set loading state for this specific store toggle
    setToggleLoading(prev => ({ ...prev, [storeId]: true }));

    try {
      // Toggle the store status immediately in UI for better responsiveness
      setStores(prevStores => 
        prevStores.map(store => 
          store.id === storeId 
            ? { ...store, active: !currentStatus, visible: !currentStatus } 
            : store
        )
      );
      
      // Send update to backend
      await api.put(`/api/stores/${storeId}/visibility?visible=${!currentStatus}`);
      
      console.log(`Store ${storeId} visibility updated successfully`);
    } catch (error) {
      console.error('Error updating store status:', error);
      
      // Revert the change if there was an error
      setStores(prevStores => 
        prevStores.map(store => 
          store.id === storeId 
            ? { ...store, active: currentStatus, visible: currentStatus } 
            : store
        )
      );
      
      // More detailed error handling
      if (error.message === 'Network Error') {
        alert('Failed to update store status: Connection to server failed. Please check if the backend is running.');
      } else {
        alert(`Failed to update store status: ${error.response?.data?.message || error.message}`);
      }
    } finally {
      // Clear loading state for this toggle
      setToggleLoading(prev => ({ ...prev, [storeId]: false }));
    }
  };

  // Filter stores based on search term
  const filteredStores = stores.filter(store => 
    store.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate state based on both active and visible properties
  const getStoreState = (store) => {
    // If both properties exist, use visible, otherwise fall back
    return store.visible !== undefined ? store.visible : 
           store.active !== undefined ? store.active : false;
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <FiShoppingBag className="h-8 w-8 text-primary-600" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900 dark:text-white">MyShop</h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* <span className="text-gray-600 dark:text-gray-300">{userEmail}</span> */}
              <span className="text-gray-600 dark:text-gray-300">
                {userEmail || 'Welcome'}
              </span>
              <button 
                onClick={handleLogout}
                className="flex items-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
              >
                <FiLogOut className="mr-2" /> Log out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Stores</h2>
              <button
                onClick={handleCreateStoreToggle}
                className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
              >
                <FiPlus className="mr-2" /> 
                {showCreateStore ? 'Cancel' : 'Create a New Store'}
              </button>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-md">
                <div className="flex items-center">
                  <FiAlertCircle className="text-red-500 mr-2" size={20} />
                  <span className="text-red-700 dark:text-red-400">{error}</span>
                </div>
              </div>
            )}

            {/* Search and View Options */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
              <div className="relative flex-1 max-w-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search stores..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10 w-full"
                />
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md ${
                    viewMode === 'grid'
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <FiGrid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md ${
                    viewMode === 'list'
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <FiList className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Create Store Form */}
            {showCreateStore && (
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-6 mb-6 border border-gray-200 dark:border-gray-600">
                <CreateStore onStoreCreated={handleStoreCreated} />
              </div>
            )}

            {/* Store Listings */}
            {loadingStores ? (
              <div className="flex justify-center items-center py-12">
                <svg className="animate-spin h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="ml-2 text-gray-600 dark:text-gray-400">Loading stores...</span>
              </div>
            ) : filteredStores.length === 0 ? (
              <div className="text-center py-12">
                <FiShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No stores found</h3>
                <p className="mt-1 text-gray-500 dark:text-gray-400">
                  {searchTerm ? "Try a different search term." : "Get started by creating a new store."}
                </p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStores.map((store) => {
                  const isStoreActive = getStoreState(store);
                  
                  return (
                    <div
                      key={store.id}
                      className="relative block transition duration-150 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
                    >
                      {/* Status Toggle in top-right */}
                      <div className="absolute top-3 right-3 z-10 flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-full px-2 py-1 shadow">
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                          {isStoreActive ? 'Active' : 'Inactive'}
                        </span>
                        <ToggleSwitch
                          isActive={isStoreActive}
                          onChange={() => handleToggleActive(store.id, isStoreActive)}
                          loading={toggleLoading[store.id] || false}
                          size="sm"
                        />
                      </div>
                      
                      <Link to={`/store-dashboard/${store.id}`}>
                        <div className="h-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:border-primary-500 dark:hover:border-primary-500">
                          <div className={`h-24 flex items-center justify-center ${
                            isStoreActive
                              ? 'bg-gradient-to-r from-primary-500 to-primary-700'
                              : 'bg-gradient-to-r from-gray-400 to-gray-600'
                          }`}>
                            <span className="text-white text-xl font-bold">{store.name ? store.name.charAt(0) : 'S'}</span>
                          </div>
                          <div className="p-5">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                              {store.name || 'Unnamed Store'}
                              {!isStoreActive && (
                                <span className="ml-2 text-xs font-medium text-red-500 dark:text-red-400">
                                  (Inactive)
                                </span>
                              )}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">{store.description || 'No description available'}</p>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                              {store.createdAt && <p>Created: {store.createdAt}</p>}
                              {store.url && <p>URL: {store.url}</p>}
                            </div>
                            <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                              {store.products !== undefined && (
                                <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
                                  <p className="text-xs text-gray-500 dark:text-gray-400">Products</p>
                                  <p className="font-bold text-gray-900 dark:text-white">{store.products}</p>
                                </div>
                              )}
                              {store.orders !== undefined && (
                                <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
                                  <p className="text-xs text-gray-500 dark:text-gray-400">Orders</p>
                                  <p className="font-bold text-gray-900 dark:text-white">{store.orders}</p>
                                </div>
                              )}
                              {store.revenue !== undefined && (
                                <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
                                  <p className="text-xs text-gray-500 dark:text-gray-400">Revenue</p>
                                  <p className="font-bold text-gray-900 dark:text-white">{store.revenue}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Store</th>
                      <th className="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                      {filteredStores.some(store => store.url) && (
                        <th className="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">URL</th>
                      )}
                      {filteredStores.some(store => store.createdAt) && (
                        <th className="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created</th>
                      )}
                      {filteredStores.some(store => store.products !== undefined) && (
                        <th className="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Products</th>
                      )}
                      {filteredStores.some(store => store.orders !== undefined) && (
                        <th className="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Orders</th>
                      )}
                      {filteredStores.some(store => store.revenue !== undefined) && (
                        <th className="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Revenue</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredStores.map((store) => {
                      const isStoreActive = getStoreState(store);
                      
                      return (
                        <tr 
                          key={store.id} 
                          className="hover:bg-gray-50 dark:hover:bg-gray-700/30"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Link 
                                to={`/store-dashboard/${store.id}`}
                                className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-white font-bold"
                                style={{
                                  background: isStoreActive 
                                    ? 'linear-gradient(to right, rgb(99, 102, 241), rgb(79, 70, 229))'
                                    : 'linear-gradient(to right, rgb(156, 163, 175), rgb(107, 114, 128))'
                                }}
                              >
                                {store.name ? store.name.charAt(0) : 'S'}
                              </Link>
                              <div className="ml-4">
                                <Link 
                                  to={`/store-dashboard/${store.id}`}
                                  className="text-sm font-medium text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400"
                                >
                                  {store.name || 'Unnamed Store'}
                                </Link>
                                {store.description && (
                                  <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{store.description}</div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <ToggleSwitch
                                isActive={isStoreActive}
                                onChange={() => handleToggleActive(store.id, isStoreActive)}
                                loading={toggleLoading[store.id] || false}
                              />
                              <span className="text-sm text-gray-600 dark:text-gray-300">
                                {isStoreActive ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          </td>
                          {filteredStores.some(s => s.url) && (
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{store.url || '-'}</td>
                          )}
                          {filteredStores.some(s => s.createdAt) && (
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{store.createdAt || '-'}</td>
                          )}
                          {filteredStores.some(s => s.products !== undefined) && (
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{store.products !== undefined ? store.products : '-'}</td>
                          )}
                          {filteredStores.some(s => s.orders !== undefined) && (
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{store.orders !== undefined ? store.orders : '-'}</td>
                          )}
                          {filteredStores.some(s => s.revenue !== undefined) && (
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{store.revenue || '-'}</td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Store;