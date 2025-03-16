// src/components/ui/Table.js
import React from 'react';

/**
 * Fixed Table component that properly handles empty states
 * 
 * @param {Object} props - Component properties
 * @param {Array} props.columns - Column definitions
 * @param {Array} props.data - Table data
 * @param {Function} props.onRowClick - Function to call when a row is clicked (optional)
 * @param {boolean} props.isLoading - Whether data is loading
 * @param {React.ReactNode} props.emptyState - Custom empty state component (optional)
 * @param {string} props.className - Additional class names for the table container (optional)
 * @param {Function} props.onSelectAll - Function to handle select all checkbox (optional)
 * @param {Array} props.selectedItems - Array of selected item IDs (optional)
 */
const Table = ({ 
  columns,
  data = [], 
  onRowClick, 
  isLoading = false, 
  emptyState,
  className = '',
  onSelectAll = null,
  selectedItems = []
}) => {
  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        <span className="ml-3 text-lg text-gray-700 dark:text-gray-300">Loading...</span>
      </div>
    );
  }
  
  // Handle empty state
  if (data.length === 0) {
    // Check if emptyState is a React element, otherwise render a default empty state
    if (React.isValidElement(emptyState)) {
      return emptyState;
    }
    
    // Default empty state if none provided
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No items found</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {emptyState && typeof emptyState === 'object' && emptyState.message 
            ? emptyState.message 
            : "No items match your criteria. Try adjusting your filters or create a new item."}
        </p>
        {emptyState && typeof emptyState === 'object' && emptyState.actionText && emptyState.onAction && (
          <div className="mt-6">
            <button
              type="button"
              onClick={emptyState.onAction}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {emptyState.actionText}
            </button>
          </div>
        )}
      </div>
    );
  }

  // Check if all items are selected
  const allSelected = data.length > 0 && data.every(item => 
    selectedItems.includes(item.id)
  );
  
  // Handle select all functionality
  const handleSelectAll = () => {
    if (onSelectAll) {
      if (allSelected) {
        // If all are selected, deselect all
        onSelectAll([]);
      } else {
        // Otherwise, select all items
        onSelectAll(data.map(item => item.id));
      }
    }
  };
  
  return (
    <div className={`bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {columns.map((column, index) => (
                <th 
                  key={column.key || index}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${column.sortable ? 'cursor-pointer' : ''} ${column.className || ''}`}
                  onClick={column.key === 'select' ? null : () => column.sortable && column.onSort && column.onSort(column.key)}
                >
                  {column.key === 'select' && onSelectAll ? (
                    <div onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={handleSelectAll}
                        className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                      />
                    </div>
                  ) : (
                    // Original column rendering
                    column.sortable ? (
                      <div className="flex items-center">
                        <span>{column.title}</span>
                        {column.isSorted && (
                          <span className="ml-1">
                            {column.sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    ) : (
                      column.title
                    )
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {data.map((row, rowIndex) => (
              <tr 
                key={row.id || rowIndex} 
                className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((column, colIndex) => (
                  <td 
                    key={`${rowIndex}-${column.key || colIndex}`} 
                    className={`px-6 py-4 whitespace-nowrap ${column.cellClassName || ''}`}
                  >
                    {column.render 
                      ? column.render(row) 
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;