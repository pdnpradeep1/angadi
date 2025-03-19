import React from 'react';
import { getCommonColors } from './utils/variantHelpers';

/**
 * Component for displaying variants in a table format
 * 
 * @param {Object} props - Component properties
 * @param {Array} props.variants - Array of variant objects
 * @param {Function} props.onVariantUpdate - Handler for variant updates
 * @param {Function} props.onEditVariants - Handler for editing all variants
 * @param {Function} props.onDeleteVariant - Handler for deleting a variant
 */
const VariantTable = ({ variants = [], onVariantUpdate, onEditVariants, onDeleteVariant }) => {
  const commonColors = getCommonColors();
  
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
                  Weight
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" style={{ width: "150px" }}>
                  GTIN
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
                      <button type="button" className="mr-3">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                      </button>
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
                    <div className="flex items-center">
                      <input
                        type="text"
                        className="block w-24 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm py-2"
                        placeholder="Eg. 1.2"
                        value={variant.weight || ''}
                        onChange={(e) => onVariantUpdate(variant.variantId, 'weight', e.target.value)}
                      />
                      <select 
                        className="ml-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm py-2 w-16"
                        onChange={(e) => onVariantUpdate(variant.variantId, 'weightUnit', e.target.value)}
                        value={variant.weightUnit || 'kg'}
                      >
                        <option value="kg">kg</option>
                        <option value="g">g</option>
                        <option value="lb">lb</option>
                      </select>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap" style={{ width: "150px" }}>
                    <input
                      type="text"
                      className="block w-full border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm py-2"
                      placeholder="Enter GTIN"
                      value={variant.gtin || ''}
                      onChange={(e) => onVariantUpdate(variant.variantId, 'gtin', e.target.value)}
                    />
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
    </div>
  );
};

export default VariantTable;