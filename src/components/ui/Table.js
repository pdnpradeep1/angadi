// src/components/ui/Table.js
import React from 'react';
import { LoadingState } from '../../utils/loading-error-states';
import { EmptyStates } from '../../utils/loading-error-states';

/**
 * Reusable Table component with support for sorting, custom column rendering,
 * loading states, and empty states
 * 
 * @param {Object} props - Component properties
 * @param {Array} props.columns - Column definitions
 * @param {Array} props.data - Table data
 * @param {Function} props.onRowClick - Function to call when a row is clicked (optional)
 * @param {boolean} props.isLoading - Whether data is loading
 * @param {JSX.Element} props.emptyState - Custom empty state component (optional)
 * @param {string} props.className - Additional class names for the table container (optional)
 */
const Table = ({ 
  columns,
  data = [], 
  onRowClick, 
  isLoading = false, 
  emptyState,
  className = ''
}) => {
  if (isLoading) {
    return <LoadingState />;
  }
  
  if (data.length === 0) {
    return emptyState || <EmptyStates.SearchResults />;
  }
  
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
                  onClick={() => column.sortable && column.onSort && column.onSort(column.key)}
                >
                  {column.sortable ? (
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