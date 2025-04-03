import React, { useEffect } from 'react';
import { Outlet, useParams, useNavigate } from 'react-router-dom';
import StoreSidebar from './StoreSidebar';
import StoreTopbar from './StoreTopbar';
import { useStore } from '../../contexts/StoreContext';
import { isAuthenticated } from '../../utils/jwtUtils';

const StoreDashboardLayout = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const { fetchStoreData, currentStore, loading, error } = useStore();

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Fetch store data if not already loaded
    if (!currentStore || currentStore.id !== parseInt(storeId)) {
      fetchStoreData(storeId);
    }
  }, [storeId, fetchStoreData, navigate, currentStore]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="flex h-screen bg-secondary-100 dark:bg-secondary-900">
      {/* Sidebar */}
      <StoreSidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <StoreTopbar />
        
        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default StoreDashboardLayout;