// src/utils/loading-error-states.js
import React from 'react';
import { FiLoader, FiAlertCircle, FiShoppingBag, FiPackage, FiUsers, FiInfo } from 'react-icons/fi';

/**
 * Loading state component used across multiple pages
 * @param {Object} props - Component properties
 * @param {string} props.message - Loading message
 * @param {string} props.size - Size of loader (sm, md, lg)
 * @returns {JSX.Element} - Loading component
 */
export const LoadingState = ({ message = 'Loading...', size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  return (
    <div className="flex flex-col items-center justify-center h-64">
      <FiLoader className={`animate-spin ${sizeClasses[size]} text-primary-600 mb-4`} />
      <p className="text-gray-600 dark:text-gray-400">{message}</p>
    </div>
  );
};

/**
 * Error state component used across multiple pages
 * @param {Object} props - Component properties
 * @param {string} props.error - Error message
 * @param {Function} props.onRetry - Retry function
 * @returns {JSX.Element} - Error component
 */
export const ErrorState = ({ error, onRetry }) => {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-md">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <FiAlertCircle className="h-5 w-5 text-red-500" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
        </div>
      </div>
      {onRetry && (
        <div className="mt-3">
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

/**
 * Empty state component for no data scenarios
 * @param {Object} props - Component properties
 * @param {string} props.title - Title to display
 * @param {string} props.message - Message to display
 * @param {JSX.Element} props.icon - Icon to display
 * @param {string} props.actionText - Text for action button
 * @param {Function} props.onAction - Action button callback
 * @returns {JSX.Element} - Empty state component
 */
export const EmptyState = ({ 
  title, 
  message, 
  icon, 
  actionText, 
  onAction 
}) => {
  // Default icon if none provided
  const IconComponent = icon || <FiInfo className="h-12 w-12 text-gray-400" />;

  return (
    <div className="text-center py-12">
      <div className="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
        {IconComponent}
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{title}</h3>
      {message && <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">{message}</p>}
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

/**
 * Pre-configured empty states for common scenarios
 */
export const EmptyStates = {
  Products: ({ onAction }) => (
    <EmptyState
      icon={<FiPackage className="h-12 w-12 text-gray-400" />}
      title="No products found"
      message="There are no products matching your criteria. Try adjusting your filters or add a new product."
      actionText="Add Product"
      onAction={onAction}
    />
  ),
  
  Orders: ({ onAction }) => (
    <EmptyState
      icon={<FiShoppingBag className="h-12 w-12 text-gray-400" />}
      title="No orders found"
      message="There are no orders matching your criteria. Try adjusting your filters or create a new order."
      actionText="Create Order"
      onAction={onAction}
    />
  ),
  
  Customers: ({ onAction }) => (
    <EmptyState
      icon={<FiUsers className="h-12 w-12 text-gray-400" />}
      title="No customers found" 
      message="There are no customers matching your criteria. Try adjusting your filters or add a new customer."
      actionText="Add Customer"
      onAction={onAction}
    />
  ),
  
  SearchResults: () => (
    <EmptyState
      title="No results found"
      message="We couldn't find any results matching your search. Try using different keywords or filters."
    />
  )
};

/**
 * Component for handling loading, error, and empty states in one place
 * @param {Object} props - Component properties
 * @param {boolean} props.loading - Whether data is loading
 * @param {string} props.error - Error message if any
 * @param {Array|Object} props.data - Data to check if empty
 * @param {JSX.Element} props.children - Children to render when data exists
 * @param {Object} props.emptyStateProps - Properties for empty state
 * @param {Function} props.onRetry - Function to retry on error
 * @returns {JSX.Element} - Appropriate component based on state
 */
export const DataStateHandler = ({
  loading,
  error,
  data,
  children,
  emptyStateProps,
  onRetry
}) => {
  if (loading) {
    return <LoadingState />;
  }
  
  if (error) {
    return <ErrorState error={error} onRetry={onRetry} />;
  }
  
  const isEmpty = Array.isArray(data) ? data.length === 0 : !data;
  
  if (isEmpty && emptyStateProps) {
    return <EmptyState {...emptyStateProps} />;
  }
  
  return children;
};