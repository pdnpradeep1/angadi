// src/features/products/components/management/ProductInventoryHeader.js
import React from 'react';
import { FiPackage, FiAlertCircle, FiCheck, FiClock, FiAlertTriangle } from 'react-icons/fi';

/**
 * Component to display inventory metrics at the top of the inventory management page
 */
const ProductInventoryHeader = ({ summary }) => {
  // If no summary data is available, show a loading placeholder
  if (!summary) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {Array(4).fill(0).map((_, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm animate-pulse">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0"></div>
              <div className="ml-3 w-full">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  // Define metrics cards
  const metrics = [
    {
      id: 'total',
      name: 'Total Products',
      value: summary.totalProducts || 0,
      icon: <FiPackage className="h-6 w-6" />,
      color: 'blue'
    },
    {
      id: 'instock',
      name: 'In Stock',
      value: summary.inStockCount || 0,
      icon: <FiCheck className="h-6 w-6" />,
      color: 'green'
    },
    {
      id: 'outofstock',
      name: 'Out of Stock',
      value: summary.outOfStockCount || 0,
      icon: <FiAlertCircle className="h-6 w-6" />,
      color: 'red',
      alert: summary.outOfStockCount > 0
    },
    {
      id: 'lowstock',
      name: 'Low Stock',
      value: summary.lowStockCount || 0,
      icon: <FiAlertTriangle className="h-6 w-6" />,
      color: 'yellow',
      alert: summary.lowStockCount > 0
    }
  ];
  
  // Color classes for metrics
  const colorClasses = {
    blue: {
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      text: 'text-blue-600 dark:text-blue-400',
      icon: 'text-blue-500'
    },
    green: {
      bg: 'bg-green-100 dark:bg-green-900/30',
      text: 'text-green-600 dark:text-green-400',
      icon: 'text-green-500'
    },
    red: {
      bg: 'bg-red-100 dark:bg-red-900/30',
      text: 'text-red-600 dark:text-red-400',
      icon: 'text-red-500'
    },
    yellow: {
      bg: 'bg-yellow-100 dark:bg-yellow-900/30',
      text: 'text-yellow-600 dark:text-yellow-400',
      icon: 'text-yellow-500'
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metrics.map((metric) => (
        <div 
          key={metric.id} 
          className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow ${
            metric.alert ? 'border-l-4 border-' + metric.color + '-500' : ''
          }`}
        >
          <div className="flex items-center">
            <div className={`p-3 rounded-full ${colorClasses[metric.color].bg}`}>
              <span className={colorClasses[metric.color].icon}>{metric.icon}</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{metric.name}</p>
              <p className={`text-2xl font-bold ${colorClasses[metric.color].text}`}>{metric.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductInventoryHeader;