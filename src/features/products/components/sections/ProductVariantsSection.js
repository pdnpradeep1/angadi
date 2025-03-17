// src/features/products/components/sections/ProductVariantsSection.js
import React, { useEffect, useState } from 'react';
import { FiSave } from 'react-icons/fi';
import ProductVariantsComponent from '../../ProductVariantsComponent';

/**
 * Product Variants section for managing product options like size, color, etc.
 */
const ProductVariantsSection = ({ 
  variants: initialVariants = [], 
  onVariantsChange, 
  onPrevious, 
  progress,
  loading,
  isEditing,
  handleSubmit
}) => {
  const [variants, setVariants] = useState([]);

  // Initialize variants from props
  useEffect(() => {
    // Check if we're receiving variants from parent
    if (initialVariants && initialVariants.length > 0) {
      // Transform variants if needed (e.g., if coming from API with different structure)
      const formattedVariants = initialVariants.map(variant => {
        // If variant has attributes as a map, convert to array form for UI
        let attributes = [];
        if (variant.attributes && !Array.isArray(variant.attributes)) {
          // If attributes is an object/map, convert to array of {name, value} pairs
          attributes = Object.entries(variant.attributes).map(([name, value]) => ({
            name,
            value
          }));
        } else if (Array.isArray(variant.attributes)) {
          attributes = variant.attributes;
        }
        
        return {
          ...variant,
          attributes,
          // Ensure stockQuantity is properly formatted for the UI
          stockQuantity: variant.stockQuantity === -1 ? 'Unlimited' : variant.stockQuantity
        };
      });
      
      setVariants(formattedVariants);
    } else {
      setVariants([]);
    }
  }, [initialVariants]);

  // Helper function to render progress indicator
  const renderProgressIndicator = (progress) => (
    <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
      <div 
        className={`h-full rounded-full ${progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );

  // Handle variants changes and pass them to parent component
  const handleVariantsChange = (newVariants) => {
    setVariants(newVariants);
    
    // Only notify parent when we have updates
    if (onVariantsChange) {
      onVariantsChange(newVariants);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Product Variants</h2>
        <div className="w-24">
          {renderProgressIndicator(progress)}
        </div>
      </div>
      
      <div className="space-y-6">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Create variants if your product comes in different options like size, color, or style. 
          Each variant can have its own price, inventory, and SKU.
        </p>
        
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-5">
          <ProductVariantsComponent 
            initialVariants={variants} 
            onChange={handleVariantsChange} 
          />
        </div>
      </div>
      
      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={onPrevious}
          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Previous: Categories & Tags
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="inline-flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {isEditing ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            <>
              <FiSave className="mr-2 -ml-1" />
              {isEditing ? 'Update Product' : 'Save Product'}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductVariantsSection;