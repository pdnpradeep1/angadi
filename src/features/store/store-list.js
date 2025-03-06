import React from 'react';
import { Link } from 'react-router-dom';

const StoreList = ({ stores }) => {
  return (
    <div className="stores-list">
      {stores.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-gray-500 dark:text-gray-400">No stores available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store, index) => (
            <Link
              key={index}
              to={`/store-dashboard/${store.id}`}
              className="block transition duration-150 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="h-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:border-primary-500 dark:hover:border-primary-500">
                <div className="h-24 bg-gradient-to-r from-primary-500 to-primary-700 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">{store.name ? store.name.charAt(0) : 'S'}</span>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{store.name}</h3>
                  {store.description && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">{store.description}</p>
                  )}
                  {store.url && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                      <p>URL: {store.url}</p>
                    </div>
                  )}
                  {store.createdAt && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                      <p>Created: {store.createdAt}</p>
                    </div>
                  )}
                  {(store.products || store.orders || store.revenue) && (
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
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default StoreList;