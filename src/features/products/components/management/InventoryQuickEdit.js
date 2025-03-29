
// src/features/products/components/management/InventoryQuickEdit.js
import React from 'react';
import { FiPlus, FiMinus } from 'react-icons/fi';

/**
 * Component for quick editing inventory quantities
 */
const InventoryQuickEdit = ({ editQuantity, setEditQuantity, onSave, onCancel, isLoading }) => {
  // Handle increment quantity
  const handleIncrement = () => {
    setEditQuantity(prev => prev + 1);
  };

  // Handle decrement quantity (with minimum of 0)
  const handleDecrement = () => {
    setEditQuantity(prev => Math.max(0, prev - 1));
  };

  // Handle direct input change
  const handleChange = (e) => {
    const value = parseInt(e.target.value);
    setEditQuantity(isNaN(value) ? 0 : value);
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center">
        <button
          type="button"
          onClick={handleDecrement}
          className="p-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-l-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          aria-label="Decrease quantity"
        >
          <FiMinus size={16} />
        </button>
        <input
          type="number"
          value={editQuantity}
          onChange={handleChange}
          className="w-20 px-2 py-1.5 border-t border-b border-gray-300 dark:border-gray-600 text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
          min="0"
          aria-label="Quantity"
        />
        <button
          type="button"
          onClick={handleIncrement}
          className="p-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-r-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          aria-label="Increase quantity"
        >
          <FiPlus size={16} />
        </button>
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400">
        Enter new quantity value
      </div>
    </div>
  );
};

export default InventoryQuickEdit;