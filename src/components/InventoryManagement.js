import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FiPackage, 
  FiAlertCircle, 
  FiTrendingUp, 
  FiTrendingDown,
  FiCheck,
  FiPlus,
  FiMinus 
} from 'react-icons/fi';

const InventoryManagement = ({ storeId }) => {
  const [summary, setSummary] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [adjustmentData, setAdjustmentData] = useState({
    productId: null,
    quantityChange: 0,
    type: 'ADJUSTMENT',
    reason: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Load inventory summary
  useEffect(() => {
    fetchSummary();
    fetchAlerts();
  }, [storeId]);
  
  const fetchSummary = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.get(
        `/inventory/summary/${storeId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      setSummary(response.data);
    } catch (err) {
      console.error('Error fetching inventory summary:', err);
      setError('Failed to load inventory summary');
    }
  };
  
  const fetchAlerts = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.get(
        `/inventory/alerts/${storeId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      setAlerts(response.data);
    } catch (err) {
      console.error('Error fetching alerts:', err);
    }
  };
  
  const fetchProductHistory = async (productId) => {
    setSelectedProduct(productId);
    
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.get(
        `/inventory/history/${productId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      setTransactions(response.data);
    } catch (err) {
      console.error('Error fetching product history:', err);
    }
  };
  
  const acknowledgeAlert = async (alertId) => {
    try {
      const token = localStorage.getItem('jwtToken');
      await axios.post(
        `/inventory/alerts/${alertId}/acknowledge`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Owner-Email': JSON.parse(atob(token.split('.')[1])).sub
          }
        }
      );
      
      // Refresh alerts
      fetchAlerts();
    } catch (err) {
      console.error('Error acknowledging alert:', err);
    }
  };
  
  const handleAdjustmentChange = (e) => {
    const { name, value } = e.target;
    setAdjustmentData({
      ...adjustmentData,
      [name]: value
    });
  };
  
  const submitAdjustment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    // Validate input
    if (!adjustmentData.productId) {
      setError('Please select a product');
      setLoading(false);
      return;
    }
    
    if (!adjustmentData.reason) {
      setError('Please provide a reason for the adjustment');
      setLoading(false);
      return;
    }
    
    try {
      const token = localStorage.getItem('jwtToken');
      await axios.post(
        '/inventory/adjust',
        adjustmentData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Owner-Email': JSON.parse(atob(token.split('.')[1])).sub,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setSuccess('Stock adjustment successful');
      
      // Reset form
      setAdjustmentData({
        productId: null,
        quantityChange: 0,
        type: 'ADJUSTMENT',
        reason: '',
        notes: ''
      });
      
      // Refresh data
      fetchSummary();
      if (selectedProduct) {
        fetchProductHistory(selectedProduct);
      }
    } catch (err) {
      console.error('Error adjusting stock:', err);
      setError(err.response?.data?.message || 'Failed to adjust stock');
    } finally {
      setLoading(false);
    }
  };
  
  if (!summary) {
    return <div className="p-4">Loading inventory data...</div>;
  }
  
  return (
    <div className="inventory-management p-4">
      <h2 className="text-2xl font-bold mb-6">Inventory Management</h2>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-500">
              <FiPackage size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Products</p>
              <p className="text-2xl font-bold">{summary.totalProducts}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 text-green-500">
              <FiCheck size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">In Stock</p>
              <p className="text-2xl font-bold">{summary.inStockCount}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30 text-red-500">
              <FiAlertCircle size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Out of Stock</p>
              <p className="text-2xl font-bold">{summary.outOfStockCount}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-500">
              <FiAlertCircle size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Low Stock</p>
              <p className="text-2xl font-bold">{summary.lowStockCount}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alerts */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-bold mb-4">Low Stock Alerts</h3>
          
          {alerts.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No low stock alerts at this time.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left">Product</th>
                    <th className="px-4 py-2 text-left">Current Stock</th>
                    <th className="px-4 py-2 text-left">Threshold</th>
                    <th className="px-4 py-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {alerts.map((alert) => (
                    <tr key={alert.id}>
                      <td className="px-4 py-3">
                        <button 
                          onClick={() => fetchProductHistory(alert.product.id)}
                          className="text-primary-600 dark:text-primary-400 hover:underline"
                        >
                          {alert.product.name}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-red-600 dark:text-red-400 font-medium">
                        {alert.currentStock}
                      </td>
                      <td className="px-4 py-3">
                        {alert.thresholdLevel}
                      </td>
                      <td className="px-4 py-3">
                        {alert.acknowledged ? (
                          <span className="text-gray-500 dark:text-gray-400">
                            Acknowledged
                          </span>
                        ) : (
                          <button
                            onClick={() => acknowledgeAlert(alert.id)}
                            className="text-primary-600 dark:text-primary-400 hover:underline"
                          >
                            Acknowledge
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Stock Adjustment Form */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-bold mb-4">Adjust Stock</h3>
          
          {/* Error and Success Messages */}
          {error && (
            <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-3 rounded-md mb-4">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 p-3 rounded-md mb-4">
              {success}
            </div>
          )}
          
          <form onSubmit={submitAdjustment}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Product
              </label>
              <select
                name="productId"
                value={adjustmentData.productId || ''}
                onChange={handleAdjustmentChange}
                className="input w-full"
                required
              >
                <option value="">Select a product</option>
                {summary.lowStockProducts.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} (Current Stock: {product.stockQuantity})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Adjustment Type
              </label>
              <select
                name="type"
                value={adjustmentData.type}
                onChange={handleAdjustmentChange}
                className="input w-full"
                required
              >
                <option value="ADJUSTMENT">Manual Adjustment</option>
                <option value="PURCHASE">Purchase/Restock</option>
                <option value="DAMAGED">Damaged/Write-off</option>
                <option value="RETURN">Customer Return</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Quantity Change
              </label>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => setAdjustmentData({
                    ...adjustmentData,
                    quantityChange: adjustmentData.quantityChange - 1
                  })}
                  className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-l-md"
                >
                  <FiMinus />
                </button>
                <input
                  type="number"
                  name="quantityChange"
                  value={adjustmentData.quantityChange}
                  onChange={handleAdjustmentChange}
                  className="input !rounded-none text-center"
                  required
                />
                <button
                  type="button"
                  onClick={() => setAdjustmentData({
                    ...adjustmentData,
                    quantityChange: adjustmentData.quantityChange + 1
                  })}
                  className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-r-md"
                >
                  <FiPlus />
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Use positive numbers to add stock, negative to remove.
              </p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Reason
              </label>
              <input
                type="text"
                name="reason"
                value={adjustmentData.reason}
                onChange={handleAdjustmentChange}
                className="input w-full"
                placeholder="Reason for adjustment"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Notes (Optional)
              </label>
              <textarea
                name="notes"
                value={adjustmentData.notes}
                onChange={handleAdjustmentChange}
                className="input w-full"
                rows="2"
                placeholder="Additional notes"
              ></textarea>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? 'Processing...' : 'Submit Adjustment'}
            </button>
          </form>
        </div>
      </div>
      
      {/* Transaction History */}
      {selectedProduct && transactions.length > 0 && (
        <div className="mt-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-bold mb-4">Transaction History</h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Type</th>
                  <th className="px-4 py-2 text-left">Change</th>
                  <th className="px-4 py-2 text-left">Resulting Stock</th>
                  <th className="px-4 py-2 text-left">Reason</th>
                  <th className="px-4 py-2 text-left">Performed By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-4 py-3">
                      {new Date(transaction.timestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      {transaction.type}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`flex items-center ${
                        transaction.quantityChange > 0 
                          ? 'text-green-600 dark:text-green-400' 
                          : transaction.quantityChange < 0 
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {transaction.quantityChange > 0 && <FiTrendingUp className="mr-1" />}
                        {transaction.quantityChange < 0 && <FiTrendingDown className="mr-1" />}
                        {transaction.quantityChange > 0 ? '+' : ''}{transaction.quantityChange}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {transaction.remainingQuantity}
                    </td>
                    <td className="px-4 py-3">
                      {transaction.reason}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {transaction.performedBy}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;