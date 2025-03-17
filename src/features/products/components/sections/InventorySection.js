// src/features/products/components/sections/InventorySection.js
import React from 'react';
import { FiPackage, FiInfo } from 'react-icons/fi';

/**
 * Inventory section for managing product stock
 */
const InventorySection = ({ product, setProduct, onPrevious, onNext, progress }) => {
  // Helper function to render progress indicator
  const renderProgressIndicator = (progress) => (
    <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
      <div 
        className={`h-full rounded-full ${progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Inventory</h2>
        <div className="w-24">
          {renderProgressIndicator(progress)}
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="p-5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="stockType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Track Inventory
              </label>
            </div>
            <select
              id="stockType"
              value={product.stockQuantity === 'Unlimited' ? 'Unlimited' : 'Limited'}
              onChange={(e) => {
                if (e.target.value === 'Unlimited') {
                  setProduct({ ...product, stockQuantity: 'Unlimited' });
                } else {
                  setProduct({ ...product, stockQuantity: '' });
                }
              }}
              className="block w-full p-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="Unlimited">Don't track inventory</option>
              <option value="Limited">Track inventory</option>
            </select>
            <p className="mt-1 text-sm text-gray-500">
              Select "Don't track inventory" for digital products or unlimited stock
            </p>
          </div>
          
          {product.stockQuantity !== 'Unlimited' && (
            <div className="mb-4">
              <label htmlFor="stockQuantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Stock Quantity
              </label>
              <div className="flex items-center">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiPackage className="text-gray-500 dark:text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="stockQuantity"
                    name="stockQuantity"
                    value={product.stockQuantity}
                    onChange={(e) => setProduct({ ...product, stockQuantity: e.target.value })}
                    className="block w-full pl-10 p-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter quantity"
                    min="0"
                  />
                </div>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Current available inventory
              </p>
            </div>
          )}
          
          <div className="mb-4">
            <label htmlFor="lowStockThreshold" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Low Stock Threshold
            </label>
            <div className="flex items-center">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiPackage className="text-gray-500 dark:text-gray-400" />
                </div>
                <input
                  type="number"
                  id="lowStockThreshold"
                  name="lowStockThreshold"
                  value={product.lowStockThreshold || ''}
                  onChange={(e) => setProduct({ ...product, lowStockThreshold: e.target.value })}
                  className="block w-full pl-10 p-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter threshold"
                  min="0"
                  disabled={product.stockQuantity === 'Unlimited'}
                />
              </div>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Get notified when stock falls below this level
            </p>
          </div>
          
          <div className="mb-4">
            <label htmlFor="sku" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              SKU (Stock Keeping Unit)
            </label>
            <input
              type="text"
              id="sku"
              name="sku"
              value={product.sku || ''}
              onChange={(e) => setProduct({ ...product, sku: e.target.value })}
              className="block w-full p-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter SKU (e.g., PROD-001)"
            />
            <p className="mt-1 text-sm text-gray-500">
              Unique identifier for inventory management
            </p>
          </div>
        </div>
        
        <div className="p-5 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/30">
          <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-300 flex items-center">
            <FiInfo className="mr-2" /> Inventory Management Tips
          </h4>
          <ul className="mt-2 text-sm text-yellow-700 dark:text-yellow-400 space-y-1">
            <li>• Set up low stock alerts in inventory settings</li>
            <li>• Regular inventory audits help maintain accuracy</li>
            <li>• Consider setting a reorder point for popular items</li>
            <li>• Use product variants for items with multiple options (size, color, etc.)</li>
          </ul>
        </div>
      </div>
      
      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={onPrevious}
          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Previous: Product Media
        </button>
        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Next: Categories & Tags
        </button>
      </div>
    </div>
  );
};

export default InventorySection;