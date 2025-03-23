import React, { useState } from 'react';
import { getCommonColors } from './utils/variantHelpers';
import VariantMediaModal from './VariantMediaModal';

/**
 * Enhanced component for displaying variants in a table format
 * With support for editing variant images through a modal
 * 
 * @param {Object} props - Component properties
 * @param {Array} props.variants - Array of variant objects
 * @param {Function} props.onVariantUpdate - Handler for variant updates
 * @param {Function} props.onEditVariants - Handler for editing all variants
 * @param {Function} props.onDeleteVariant - Handler for deleting a variant
 */
const VariantTable = ({ 
  variants = [], 
  onVariantUpdate, 
  onEditVariants, 
  onDeleteVariant 
}) => {
  const commonColors = getCommonColors();
  
  // New state for the media modal
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  
  // For color display
  const getColorDisplay = (color) => {
    const lowerColor = color.toLowerCase();
    const bgColor = commonColors[lowerColor] || '#cccccc';
    
    return (
      <span className="flex items-center">
        <span 
          className="rounded-full w-4 h-4 mr-1 inline-block border border-gray-300" 
          style={{ backgroundColor: bgColor }}
        ></span>
        {color}
      </span>
    );
  };
  
  // Open the media modal for a variant
  const openMediaModal = (variant) => {
    setSelectedVariant(variant);
    setMediaModalOpen(true);
  };
  
  // Handle image update from the modal
  const handleImageUpdate = (variantId, imageUrl) => {
    onVariantUpdate(variantId, 'imageUrl', imageUrl);
  };
  
  // If no variants, show placeholder
  if (!variants || variants.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No variants have been created yet.
      </div>
    );
  }
  
  return (
    <div>
      {/* Display selected option types as header */}
      {variants.length > 0 && variants[0].options && (
        <div className="flex flex-wrap gap-4 mb-4">
          {/* Group options by name to show unique option types */}
          {Object.entries(
            variants.reduce((acc, variant) => {
              if (!variant.options) return acc;
              
              variant.options.forEach(opt => {
                if (!acc[opt.name]) {
                  acc[opt.name] = new Set();
                }
                acc[opt.name].add(opt.value);
              });
              
              return acc;
            }, {})
          ).map(([name, valuesSet]) => (
            <div key={name} className="font-medium text-gray-700 dark:text-gray-300">
              {name}:
              <div className="flex flex-wrap gap-1 mt-2">
                {Array.from(valuesSet).map((value, idx) => (
                  <span 
                    key={idx} 
                    className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-sm"
                  >
                    {name.toLowerCase().includes('color') 
                      ? getColorDisplay(value) 
                      : value}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="relative overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="sticky left-0 z-10 px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-gray-800 shadow-sm">
                  Variant Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" style={{ width: "150px" }}>
                  Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" style={{ width: "150px" }}>
                  Discounted price
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" style={{ width: "150px" }}>
                  SKU ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" style={{ width: "120px" }}>
                  Quantity
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" style={{ width: "150px" }}>
                  Image
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" style={{ width: "80px" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {variants.map((variant) => (
                <tr key={variant.variantId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="sticky left-0 z-10 px-4 py-4 whitespace-nowrap bg-white dark:bg-gray-800 shadow-sm border-r border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      <div>
                        {variant.options && variant.options.map((option, idx) => (
                          <span key={idx} className="flex items-center">
                            {option.name.toLowerCase().includes('color') 
                              ? getColorDisplay(option.value) 
                              : option.value}
                            {idx < variant.options.length - 1 && <span className="mx-1">|</span>}
                          </span>
                        ))}
                        <div className="text-sm text-green-500">In stock</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap" style={{ width: "150px" }}>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        ₹
                      </span>
                      <input
                        type="text"
                        className="pl-6 block w-full border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm py-2"
                        placeholder="Enter price"
                        value={variant.price || ''}
                        onChange={(e) => {
                          onVariantUpdate(variant.variantId, 'price', e.target.value);
                        }}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap" style={{ width: "150px" }}>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        ₹
                      </span>
                      <input
                        type="text"
                        className="pl-6 block w-full border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm py-2"
                        placeholder="Enter original price"
                        value={variant.originalPrice || variant.discountedPrice || ''}
                        onChange={(e) => {
                          onVariantUpdate(variant.variantId, 'originalPrice', e.target.value);
                        }}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap" style={{ width: "150px" }}>
                    <input
                      type="text"
                      className="block w-full border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm py-2"
                      placeholder="Eg. 1000000001"
                      value={variant.sku}
                      onChange={(e) => onVariantUpdate(variant.variantId, 'sku', e.target.value)}
                    />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap" style={{ width: "120px" }}>
                    <input
                      type="text"
                      className="block w-full border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm py-2"
                      placeholder="Unlimited"
                      value={variant.stockQuantity || variant.quantity || ''}
                      onChange={(e) => {
                        onVariantUpdate(variant.variantId, 'stockQuantity', e.target.value);
                      }}
                    />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap" style={{ width: "150px" }}>
                    <div 
                      className="w-16 h-16 border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden cursor-pointer hover:border-primary-500 transition-colors"
                      onClick={() => openMediaModal(variant)}
                    >
                      {variant.imageUrl ? (
                        <img 
                          src={variant.imageUrl}
                          alt={variant.name || 'Variant'}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/api/placeholder/64/64?text=Image';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                          <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" className="w-8 h-8 text-gray-400" xmlns="http://www.w3.org/2000/svg">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <circle cx="8.5" cy="8.5" r="1.5"></circle>
                            <polyline points="21 15 16 10 5 21"></polyline>
                          </svg>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onDeleteVariant && onDeleteVariant(variant.variantId)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      title="Delete variant"
                      aria-label="Delete variant"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="absolute bottom-0 right-0 p-1 bg-gray-100 dark:bg-gray-700 bg-opacity-80 rounded-tl-md">
          <span className="text-xs text-gray-500 dark:text-gray-400">← Scroll to see more →</span>
        </div>
      </div>
      
      <div className="mt-4">
        <button
          type="button"
          onClick={onEditVariants}
          className="text-primary-600 dark:text-primary-400 border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-md"
        >
          Edit or add variants
        </button>
      </div>

      {/* Media Modal */}
      <VariantMediaModal 
        isOpen={mediaModalOpen}
        onClose={() => setMediaModalOpen(false)}
        variant={selectedVariant}
        onImageUpdate={handleImageUpdate}
        currentImage={selectedVariant?.imageUrl || ''}
      />
    </div>
  );
};

export default VariantTable;