import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../api/config';
import { isAuthenticated } from '../utils/jwtUtils';

// Create context
const StoreContext = createContext();

// Custom hook to use the store context
export const useStore = () => useContext(StoreContext);

export const StoreProvider = ({ children }) => {
  const [currentStore, setCurrentStore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Function to fetch and set store data
  const fetchStoreData = async (storeId) => {
    // Don't refetch if we already have this store loaded
    if (currentStore && currentStore.id === parseInt(storeId)) {
      return currentStore;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.get(`/api/stores/stores/${storeId}`);
      const storeData = response.data;
      setCurrentStore(storeData);
      
      // Store the current store ID in localStorage for persistence
      localStorage.setItem('currentStoreId', storeId);
      
      return storeData;
    } catch (error) {
      console.error('Error fetching store data:', error);
      setError('Failed to load store data');
      
      // For development, return mock data
      if (process.env.NODE_ENV === 'development') {
        const mockStore = {
          id: parseInt(storeId),
          name: `Store ${storeId}`,
          description: "This is a mock store description for development",
          address: "123 Mock Street",
          active: true,
          logo: "/api/placeholder/100/100",
          stats: {
            totalSales: "$15,345",
            totalOrders: 256,
            activeProducts: 32,
            customers: 189
          }
        };
        setCurrentStore(mockStore);
        return mockStore;
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Function to clear current store data (for logout or store switch)
  const clearStoreData = () => {
    setCurrentStore(null);
    localStorage.removeItem('currentStoreId');
  };

  // Restore store from localStorage on initial load
  useEffect(() => {
    const restoreStore = async () => {
      // Only try to restore if user is authenticated
      if (!isAuthenticated()) return;
      
      const storedStoreId = localStorage.getItem('currentStoreId');
      if (storedStoreId && !currentStore) {
        await fetchStoreData(storedStoreId);
      }
    };
    
    restoreStore();
  }, []);

  // Context value
  const value = {
    currentStore,
    loading,
    error,
    fetchStoreData,
    clearStoreData
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContext;