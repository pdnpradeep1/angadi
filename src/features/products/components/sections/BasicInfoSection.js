import React from 'react';
import { FiDollarSign, FiInfo } from 'react-icons/fi';

/**
 * Enhanced Basic Information section for product add/edit form
 * With support for disabling price fields when variants exist
 */
const BasicInfoSection = ({ 
  product, 
  handleInputChange, 
  progress, 
  onNext,
  variants = [] // Add variants as a prop
}) => {
  // Check if variants exist and have items
  const hasVariants = Array.isArray(variants) && variants.length > 0;

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
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Basic Information</h2>
        <div className="w-24">
          {renderProgressIndicator(progress)}
        </div>
      </div>
      
      <div className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={product.name}
            onChange={handleInputChange}
            className="block w-full p-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Enter product name"
            required
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={product.description}
            onChange={handleInputChange}
            rows="4"
            className="block w-full p-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Enter product description"
          />
          <p className="mt-1 text-sm text-gray-500">
            Provide a detailed description that helps customers understand your product.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Price <span className="text-red-500">*</span>
              {hasVariants && <span className="ml-2 text-xs text-amber-600 dark:text-amber-400">(Set in variants)</span>}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiDollarSign className={`${hasVariants ? 'text-gray-400 dark:text-gray-600' : 'text-gray-500 dark:text-gray-400'}`} />
              </div>
              <input
                type="number"
                id="price"
                name="price"
                value={product.price}
                onChange={handleInputChange}
                className={`block w-full pl-10 p-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500 ${
                  hasVariants ? 'opacity-60 cursor-not-allowed' : ''
                }`}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
                disabled={hasVariants}
              />
            </div>
            {hasVariants && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Price is managed at the variant level when variants exist.
              </p>
            )}
          </div>
          
          <div>
            <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Original Price (for discounts)
              {hasVariants && <span className="ml-2 text-xs text-amber-600 dark:text-amber-400">(Set in variants)</span>}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiDollarSign className={`${hasVariants ? 'text-gray-400 dark:text-gray-600' : 'text-gray-500 dark:text-gray-400'}`} />
              </div>
              <input
                type="number"
                id="originalPrice"
                name="originalPrice"
                value={product.originalPrice}
                onChange={handleInputChange}
                className={`block w-full pl-10 p-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500 ${
                  hasVariants ? 'opacity-60 cursor-not-allowed' : ''
                }`}
                placeholder="0.00"
                min="0"
                step="0.01"
                disabled={hasVariants}
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              {hasVariants 
                ? "Original price is managed at the variant level when variants exist."
                : "Leave blank if not offering a discount"}
            </p>
          </div>
        </div>

        {/* Info banner when variants exist */}
        {hasVariants && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiInfo className="h-5 w-5 text-blue-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Price information is disabled because this product has variants. 
                  Please set prices in the Variants section.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={product.status}
            onChange={handleInputChange}
            className="block w-full p-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Draft">Draft</option>
          </select>
          <p className="mt-1 text-sm text-gray-500">
            Set to "Active" to make the product visible to customers
          </p>
        </div>
      </div>
      
      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Next: Product Media
        </button>
      </div>
    </div>
  );
};

export default BasicInfoSection;