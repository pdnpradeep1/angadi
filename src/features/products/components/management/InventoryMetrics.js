import React from 'react';
import { 
  FiPackage, 
  FiAlertCircle, 
  FiCheck, 
  FiClock, 
  FiTrendingUp, 
  FiTrendingDown 
} from 'react-icons/fi';

const InventoryMetrics = ({ summary }) => {
  // If no summary, show a placeholder
  if (!summary) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow animate-pulse">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
              <div className="ml-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mt-2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const metrics = [
    {
      id: 'total',
      name: 'Total Products',
      value: summary.totalProducts || 0,
      icon: <FiPackage size={24} />,
      color: 'blue'
    },
    {
      id: 'instock',
      name: 'In Stock',
      value: summary.inStockCount || 0,
      icon: <FiCheck size={24} />,
      color: 'green'
    },
    {
      id: 'outofstock',
      name: 'Out of Stock',
      value: summary.outOfStockCount || 0,
      icon: <FiAlertCircle size={24} />,
      color: 'red'
    },
    {
      id: 'lowstock',
      name: 'Low Stock',
      value: summary.lowStockCount || 0,
      icon: <FiClock size={24} />,
      color: 'yellow'
    }
  ];

  // Optional trending metrics if available in summary
  if (summary.stockMovement) {
    metrics.push({
      id: 'incoming',
      name: 'Incoming Stock',
      value: summary.stockMovement.incoming || 0,
      icon: <FiTrendingUp size={24} />,
      color: 'indigo',
      trend: 'up'
    });
    
    metrics.push({
      id: 'outgoing',
      name: 'Outgoing Stock',
      value: summary.stockMovement.outgoing || 0,
      icon: <FiTrendingDown size={24} />,
      color: 'pink',
      trend: 'down'
    });
  }

  const colorClasses = {
    blue: {
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      text: 'text-blue-500',
      icon: 'text-blue-500'
    },
    green: {
      bg: 'bg-green-100 dark:bg-green-900/30',
      text: 'text-green-500',
      icon: 'text-green-500'
    },
    red: {
      bg: 'bg-red-100 dark:bg-red-900/30',
      text: 'text-red-500',
      icon: 'text-red-500'
    },
    yellow: {
      bg: 'bg-yellow-100 dark:bg-yellow-900/30',
      text: 'text-yellow-500',
      icon: 'text-yellow-500'
    },
    indigo: {
      bg: 'bg-indigo-100 dark:bg-indigo-900/30',
      text: 'text-indigo-500',
      icon: 'text-indigo-500'
    },
    pink: {
      bg: 'bg-pink-100 dark:bg-pink-900/30',
      text: 'text-pink-500',
      icon: 'text-pink-500'
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <div key={metric.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className={`p-3 rounded-full ${colorClasses[metric.color].bg}`}>
              <span className={colorClasses[metric.color].icon}>{metric.icon}</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{metric.name}</p>
              <div className="flex items-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{metric.value}</p>
                {metric.trend && (
                  <span className={`ml-2 ${metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {metric.trend === 'up' ? <FiTrendingUp size={16} /> : <FiTrendingDown size={16} />}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InventoryMetrics;