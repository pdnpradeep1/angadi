import React from 'react';
import { FiX } from 'react-icons/fi';
import { getCommonSizes } from './utils/variantHelpers';

/**
 * Reusable size picker component
 * 
 * @param {Object} props - Component properties
 * @param {Array} props.selectedSizes - Array of selected sizes
 * @param {Function} props.onSizeAdd - Handler for adding a size
 * @param {Function} props.onSizeRemove - Handler for removing a size
 */
const SizePicker = ({ selectedSizes = [], onSizeAdd, onSizeRemove }) => {
  const commonSizes = getCommonSizes();
  
  // Handle size input keydown
  const handleSizeKeyDown = (e) => {
    if (e.key === 'Enter' && e.target.value.trim() !== '') {
      e.preventDefault();
      onSizeAdd(e.target.value.trim());
      e.target.value = '';
    }
  };
  
  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2.5 bg-white dark:bg-gray-700">
      <div className="flex flex-wrap gap-2 mb-3">
        {selectedSizes.map((size, idx) => (
          <div
            key={idx}
            className="rounded-full px-3 py-1 flex items-center gap-1 bg-gray-100 dark:bg-gray-600"
          >
            {size}
            <button
              type="button"
              onClick={() => onSizeRemove(size, idx)}
              className="ml-1 text-gray-500 hover:text-gray-700"
              aria-label={`Remove ${size}`}
            >
              <FiX size={14} />
            </button>
          </div>
        ))}
      </div>
      
      {/* Size input */}
      <input
        type="text"
        placeholder="Type size and press Enter"
        className="w-full p-2 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md"
        onKeyDown={handleSizeKeyDown}
        aria-label="Enter custom size"
      />
      
      {/* Common size suggestions */}
      <div className="mt-3">
        <p className="text-xs text-gray-500 mb-2">Common sizes:</p>
        <div className="flex flex-wrap gap-2">
          {commonSizes.map((size) => (
            <button
              type="button"
              key={size}
              className="px-2 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
              onClick={() => {
                if (!selectedSizes.includes(size)) {
                  onSizeAdd(size);
                }
              }}
              aria-label={`Select size ${size}`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SizePicker;