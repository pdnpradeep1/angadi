// src/features/products/components/management/InventoryTableHeader.js
import React from 'react';

const InventoryTableHeader = ({ sortField, sortDirection, onSort }) => {
  // Render a sortable column header
  const renderSortableHeader = (label, field) => (
    <th 
      scope="col" 
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center">
        {label}
        {sortField === field && (
          <span className="ml-1 text-primary-500">
            {sortDirection === 'asc' ? '↑' : '↓'}
          </span>
        )}
      </div>
    </th>
  );

  // Render a regular column header
  const renderHeader = (label) => (
    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
      {label}
    </th>
  );

  return (
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead className="bg-gray-50 dark:bg-gray-700">
        <tr>
          {renderHeader("")} {/* Expand/collapse column */}
          {renderSortableHeader("Product Name", "name")}
          {renderSortableHeader("Stock", "stockQuantity")}
          {renderHeader("SKU")}
          {renderHeader("Category")}
          {renderHeader("Actions")}
        </tr>
      </thead>
    </table>
  );
};

export default InventoryTableHeader;