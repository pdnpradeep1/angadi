import React from 'react';
import { 
  FiClipboard, 
  FiTruck, 
  FiCheck, 
  FiXCircle, 
  FiAlertCircle, 
  FiRefreshCw,
  FiPackage,
  FiClock
} from 'react-icons/fi';

/**
 * Generate a status badge with consistent styling
 * @param {string} status - Status to render
 * @param {Object} [options] - Additional options for customization
 * @param {string} [options.type] - Type of status (order, delivery, payment, etc.)
 * @returns {React.ReactNode} Status badge component
 */
export const getStatusBadge = (status, options = {}) => {
  const { type = 'default' } = options;
  
  const statusConfigs = {
    default: {
      PENDING: { 
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/30', 
        textColor: 'text-yellow-800 dark:text-yellow-300', 
        icon: <FiClock className="mr-1" /> 
      },
      PROCESSING: { 
        bgColor: 'bg-blue-100 dark:bg-blue-900/30', 
        textColor: 'text-blue-800 dark:text-blue-300', 
        icon: <FiPackage className="mr-1" /> 
      },
      SHIPPED: { 
        bgColor: 'bg-indigo-100 dark:bg-indigo-900/30', 
        textColor: 'text-indigo-800 dark:text-indigo-300', 
        icon: <FiTruck className="mr-1" /> 
      },
      DELIVERED: { 
        bgColor: 'bg-green-100 dark:bg-green-900/30', 
        textColor: 'text-green-800 dark:text-green-300', 
        icon: <FiCheck className="mr-1" /> 
      },
      CANCELLED: { 
        bgColor: 'bg-red-100 dark:bg-red-900/30', 
        textColor: 'text-red-800 dark:text-red-300', 
        icon: <FiXCircle className="mr-1" /> 
      },
      RETURNED: { 
        bgColor: 'bg-purple-100 dark:bg-purple-900/30', 
        textColor: 'text-purple-800 dark:text-purple-300', 
        icon: <FiRefreshCw className="mr-1" /> 
      }
    },
    payment: {
      PAID: { 
        bgColor: 'bg-green-100 dark:bg-green-900/30', 
        textColor: 'text-green-800 dark:text-green-300' 
      },
      PENDING: { 
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/30', 
        textColor: 'text-yellow-800 dark:text-yellow-300' 
      },
      FAILED: { 
        bgColor: 'bg-red-100 dark:bg-red-900/30', 
        textColor: 'text-red-800 dark:text-red-300' 
      },
      REFUNDED: { 
        bgColor: 'bg-purple-100 dark:bg-purple-900/30', 
        textColor: 'text-purple-800 dark:text-purple-300' 
      }
    }
  };

  // Normalize status (uppercase)
  const normalizedStatus = status.toUpperCase();
  
  // Get configuration for the specific type
  const config = statusConfigs[type][normalizedStatus] || 
                 statusConfigs['default'][normalizedStatus] || 
                 { 
                   bgColor: 'bg-gray-100 dark:bg-gray-900/30', 
                   textColor: 'text-gray-800 dark:text-gray-300',
                   icon: <FiAlertCircle className="mr-1" />
                 };

  return (
    <span 
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}
    >
      {config.icon}
      {normalizedStatus.charAt(0) + normalizedStatus.slice(1).toLowerCase()}
    </span>
  );
};