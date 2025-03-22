import React, { useState } from 'react';
import { FiAlertTriangle, FiBarChart2, FiSearch, FiEye } from 'react-icons/fi';
import { acknowledgeAlert } from '../../services/inventoryService';

const LowStockAlerts = ({ alerts, onViewProduct }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [acknowledging, setAcknowledging] = useState(null);

  // Filter alerts based on search term
  const filteredAlerts = alerts.filter(alert => 
    alert.product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAcknowledge = async (alertId) => {
    setAcknowledging(alertId);
    try {
      await acknowledgeAlert(alertId);
      
      // Update the alerts locally
      // This approach avoids a full reload while maintaining UI consistency
      const updatedAlerts = alerts.map(alert => 
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      );
      
      // You might want to pass this up to the parent component
      // onAlertsUpdate(updatedAlerts);
      
    } catch (error) {
      console.error('Error acknowledging alert:', error);
    } finally {
      setAcknowledging(null);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-5 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
            <FiAlertTriangle className="mr-2 text-yellow-500" /> 
            Low Stock Alerts
          </h3>
          <span className="px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 rounded-full">
            {filteredAlerts.length} items
          </span>
        </div>

        {/* Search input */}
        <div className="mt-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm py-2"
          />
        </div>
      </div>

      <div className="overflow-hidden">
        {filteredAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center text-gray-500 dark:text-gray-400">
            <FiBarChart2 className="h-12 w-12 mb-4" />
            {searchTerm ? (
              <>
                <p className="text-lg font-medium">No matching products</p>
                <p className="mt-1">Try adjusting your search term</p>
              </>
            ) : (
              <>
                <p className="text-lg font-medium">No low stock alerts</p>
                <p className="mt-1">All products have sufficient inventory</p>
              </>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Current Stock
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Threshold
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredAlerts.map((alert) => (
                  <tr key={alert.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        {alert.product.imageUrl ? (
                          <img 
                            src={alert.product.imageUrl} 
                            alt={alert.product.name}
                            className="h-10 w-10 object-cover rounded"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
                            <FiBarChart2 />
                          </div>
                        )}
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-xs">
                            {alert.product.name}
                          </p>
                          {alert.product.sku && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              SKU: {alert.product.sku}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-red-600 dark:text-red-400 font-medium">
                        {alert.currentStock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {alert.thresholdLevel}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onViewProduct(alert.product.id, alert.product.name)}
                          className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 p-1"
                          title="View history"
                        >
                          <FiEye size={18} />
                        </button>
                        {!alert.acknowledged ? (
                          <button
                            onClick={() => handleAcknowledge(alert.id)}
                            disabled={acknowledging === alert.id}
                            className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 p-1 font-medium disabled:opacity-50"
                          >
                            {acknowledging === alert.id ? 'Processing...' : 'Acknowledge'}
                          </button>
                        ) : (
                          <span className="text-gray-500 dark:text-gray-400 p-1">
                            Acknowledged
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LowStockAlerts;