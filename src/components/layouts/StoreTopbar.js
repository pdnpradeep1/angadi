import React from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiBell, FiSettings } from 'react-icons/fi';
import { useStore } from '../../contexts/StoreContext';
import { useParams } from 'react-router-dom';

const StoreTopbar = () => {
  const { currentStore } = useStore();
  const { storeId } = useParams();

  return (
    <header className="bg-white dark:bg-secondary-800 border-b border-secondary-200 dark:border-secondary-700" style={{ height: '56px' }}>
      <div className="flex items-center justify-between px-4 h-full">
        {/* Only show store name once with lowercase styling */}
        <div className="flex items-center">
          <h1 className="text-sm font-medium text-secondary-700 dark:text-secondary-300" style={{ textTransform: 'lowercase' }}>
            {currentStore?.name || 'Store'}
          </h1>
        </div>
        
        {/* Right side actions */}
        <div className="flex items-center space-x-3">
          <button className="p-2 text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-200 rounded-full hover:bg-secondary-100 dark:hover:bg-secondary-700">
            <FiBell className="h-5 w-5" />
          </button>
          <Link 
            to={`/store-dashboard/${storeId}/settings`}
            className="p-2 text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-200 rounded-full hover:bg-secondary-100 dark:hover:bg-secondary-700"
          >
            <FiSettings className="h-5 w-5" />
          </Link>
          <div className="relative">
            <button className="flex items-center space-x-2 p-1 rounded-full hover:bg-secondary-100 dark:hover:bg-secondary-700">
              <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white">
                <FiUser className="h-4 w-4" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default StoreTopbar;