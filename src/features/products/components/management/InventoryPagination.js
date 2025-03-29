// src/features/products/components/management/InventoryPagination.js
import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

/**
 * Enhanced pagination component for inventory tables
 */
const InventoryPagination = ({ 
  currentPage, 
  totalPages, 
  totalItems, 
  itemsPerPage, 
  onPageChange 
}) => {
  // Calculate the range of items currently being displayed
  const firstItem = Math.min((currentPage - 1) * itemsPerPage + 1, totalItems);
  const lastItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Move to previous page
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  // Move to next page
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Generate an array of page numbers to display
  const getPageNumbers = () => {
    const visiblePageNumbers = [];
    const MAX_VISIBLE_PAGES = 5;
    
    if (totalPages <= MAX_VISIBLE_PAGES) {
      // If only a few pages, show all of them
      for (let i = 1; i <= totalPages; i++) {
        visiblePageNumbers.push(i);
      }
    } else {
      // Always show the first page
      visiblePageNumbers.push(1);
      
      // Calculate middle range
      let startPage, endPage;
      
      if (currentPage <= 3) {
        // Near the start
        startPage = 2;
        endPage = 4;
        visiblePageNumbers.push(...Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i));
        visiblePageNumbers.push('...');
        visiblePageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        visiblePageNumbers.push('...');
        startPage = totalPages - 3;
        endPage = totalPages - 1;
        visiblePageNumbers.push(...Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i));
        visiblePageNumbers.push(totalPages);
      } else {
        // Middle - show current page and neighbors
        visiblePageNumbers.push('...');
        visiblePageNumbers.push(currentPage - 1);
        visiblePageNumbers.push(currentPage);
        visiblePageNumbers.push(currentPage + 1);
        visiblePageNumbers.push('...');
        visiblePageNumbers.push(totalPages);
      }
    }
    
    return visiblePageNumbers;
  };

  return (
    <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
      {/* Information about the current range (hidden on small screens) */}
      <div className="hidden sm:block">
        <p className="text-sm text-gray-700 dark:text-gray-400">
          Showing <span className="font-medium">{firstItem}</span> to <span className="font-medium">{lastItem}</span> of{' '}
          <span className="font-medium">{totalItems}</span> products
        </p>
      </div>
      
      {/* Pagination controls */}
      <div className="flex-1 flex justify-between sm:justify-end items-center">
        {/* Desktop version with page numbers */}
        <div className="hidden sm:flex rounded-md shadow-sm -space-x-px">
          {/* Previous page button */}
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="sr-only">Previous</span>
            <FiChevronLeft className="h-5 w-5" />
          </button>
          
          {/* Page numbers */}
          {getPageNumbers().map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300">
                  ...
                </span>
              ) : (
                <button
                  onClick={() => onPageChange(page)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium
                    ${currentPage === page
                      ? 'z-10 bg-primary-50 dark:bg-primary-900/20 border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  aria-current={currentPage === page ? 'page' : undefined}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
          
          {/* Next page button */}
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="sr-only">Next</span>
            <FiChevronRight className="h-5 w-5" />
          </button>
        </div>
        
        {/* Mobile version with just prev/next */}
        <div className="sm:hidden flex space-x-2">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiChevronLeft className="mr-1" size={14} />
            Previous
          </button>
          <span className="py-2 px-1 text-sm text-gray-700 dark:text-gray-300">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <FiChevronRight className="ml-1" size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryPagination;