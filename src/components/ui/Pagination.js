import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

/**
 * Enhanced pagination component with responsive design and accessibility improvements
 * 
 * @param {Object} props - Component properties
 * @param {number} props.currentPage - Current page number (1-based)
 * @param {number} props.totalPages - Total number of pages
 * @param {Function} props.onPageChange - Function to call when page changes
 * @param {number} props.maxVisiblePages - Maximum number of page buttons to show
 * @param {string} props.className - Additional class names
 * @param {number} props.totalItems - Total number of items (optional)
 * @param {number} props.pageSize - Number of items per page (optional)
 * @param {Function} props.onPageSizeChange - Function to handle page size changes (optional)
 * @param {Array} props.pageSizeOptions - Available page size options (optional)
 */
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 5,
  className = '',
  totalItems = 0,
  pageSize = 0,
  onPageSizeChange = null,
  pageSizeOptions = [10, 25, 50, 100]
}) => {
  if (totalPages <= 1) {
    return null;
  }

  // Calculate visible page range
  const getPageNumbers = () => {
    const pageNumbers = [];
    
    if (totalPages <= maxVisiblePages) {
      // If total pages less than max visible, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);
      
      let startPage, endPage;
      
      if (currentPage <= Math.ceil(maxVisiblePages / 2)) {
        // Near the start
        startPage = 2;
        endPage = maxVisiblePages - 1;
        
        // Add pages
        for (let i = startPage; i <= endPage; i++) {
          pageNumbers.push(i);
        }
        
        // Add ellipsis and last page
        if (endPage < totalPages - 1) {
          pageNumbers.push('...');
        }
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - Math.floor(maxVisiblePages / 2)) {
        // Near the end
        const startPage = totalPages - maxVisiblePages + 2;
        
        // Add ellipsis after first page
        if (startPage > 2) {
          pageNumbers.push('...');
        }
        
        // Add pages
        for (let i = startPage; i < totalPages; i++) {
          pageNumbers.push(i);
        }
        
        // Add last page
        pageNumbers.push(totalPages);
      } else {
        // Middle - show current page with neighbors
        const offset = Math.floor((maxVisiblePages - 3) / 2);
        
        // Add ellipsis after first page
        pageNumbers.push('...');
        
        // Add pages around current page
        for (let i = currentPage - offset; i <= currentPage + offset; i++) {
          pageNumbers.push(i);
        }
        
        // Add ellipsis and last page
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  // Calculate range of items being displayed
  const calculateItemRange = () => {
    if (!totalItems || !pageSize) return null;
    
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalItems);
    
    return { start, end };
  };

  const itemRange = calculateItemRange();

  return (
    <div className={`px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 rounded-md ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Item range and page size selector */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {itemRange && (
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Showing <span className="font-medium">{itemRange.start}</span> to{' '}
              <span className="font-medium">{itemRange.end}</span> of{' '}
              <span className="font-medium">{totalItems}</span> items
            </p>
          )}
          
          {onPageSizeChange && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Show:</span>
              <select
                value={pageSize}
                onChange={(e) => onPageSizeChange(parseInt(e.target.value))}
                className="text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
                           focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 
                           text-gray-900 dark:text-white p-1"
                aria-label="Number of items per page"
              >
                {pageSizeOptions.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
          )}
        </div>
        
        {/* Page navigation */}
        <nav className="inline-flex rounded-md shadow-sm" aria-label="Pagination">
          {/* Previous page button */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`relative inline-flex items-center px-2 py-2 rounded-l-md border 
                      border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium
                      ${currentPage === 1
                        ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                        : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
            aria-label="Previous page"
          >
            <FiChevronLeft className="h-5 w-5" />
          </button>
          
          {/* Page numbers */}
          {pageNumbers.map((pageNum, index) => {
            if (pageNum === '...') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 
                            dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium 
                            text-gray-700 dark:text-gray-300"
                >
                  ...
                </span>
              );
            }
            
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium 
                          ${currentPage === pageNum
                            ? 'z-10 bg-primary-50 dark:bg-primary-900/30 border-primary-500 dark:border-primary-500 text-primary-600 dark:text-primary-300'
                            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                aria-current={currentPage === pageNum ? 'page' : undefined}
                aria-label={`Page ${pageNum}`}
              >
                {pageNum}
              </button>
            );
          })}
          
          {/* Next page button */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`relative inline-flex items-center px-2 py-2 rounded-r-md border 
                      border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium
                      ${currentPage === totalPages
                        ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                        : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
            aria-label="Next page"
          >
            <FiChevronRight className="h-5 w-5" />
          </button>
        </nav>
      </div>
      
      {/* Mobile pagination (simplified) */}
      <div className="mt-4 flex justify-between items-center sm:hidden">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`relative inline-flex items-center px-4 py-2 border border-gray-300 
                    dark:border-gray-600 text-sm font-medium rounded-md
                    ${currentPage === 1
                      ? 'text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 cursor-not-allowed'
                      : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
        >
          <FiChevronLeft className="h-5 w-5 mr-1" />
          Previous
        </button>
        <span className="text-sm text-gray-700 dark:text-gray-300">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 
                    dark:border-gray-600 text-sm font-medium rounded-md
                    ${currentPage === totalPages
                      ? 'text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 cursor-not-allowed'
                      : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
        >
          Next
          <FiChevronRight className="h-5 w-5 ml-1" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;