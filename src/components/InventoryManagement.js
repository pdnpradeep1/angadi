import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  FiPackage, 
  FiAlertCircle, 
  FiCheck, 
  FiTrendingUp, 
  FiTrendingDown,
  FiPlus,
  FiMinus 
} from 'react-icons/fi';
import axios from 'axios';

const InventoryManagement = () => {
  const { storeId } = useParams();
  const [summary, setSummary] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Stock adjustment form
  const [adjustmentData, setAdjustmentData] = useState({
    productId: null,
    quantityChange: 0,
    type: 'ADJUSTMENT',
    reason: '',
    notes: ''
  });
  const [adjustmentLoading, setAdjustmentLoading] = useState(false);

  useEffect(() => {
    fetchInventoryData();
    fetchLowStockAlerts();
  }, [storeId]);

  const fetchInventoryData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      // For development, use mock data since the API endpoint might not be available
      setTimeout(() => {
        const mockSummary = {
          totalProducts: 87,
          inStockCount: 72,
          outOfStockCount: 8,
          lowStockCount: 15,
          lowStockProducts: [
            { id: 1, name: 'Karapu Boondi', stockQuantity: 3, lowStockThreshold: 5 },
            { id: 2, name: 'Kaju Chikki', stockQuantity: 4, lowStockThreshold: 10 },
            { id: 3, name: 'Sajja Buralu', stockQuantity: 2, lowStockThreshold: 5 },
            { id: 4, name: 'Dry Fruits Bar', stockQuantity: 7, lowStockThreshold: 10 }
          ],
          recentTransactions: []
        };
        setSummary(mockSummary);
        setLoading(false);
      }, 600);
      
      // In a production environment, you would use:
      // const response = await axios.get(`http://localhost:8080/inventory/summary/${storeId}`, {
      //   headers: { 'Authorization': `Bearer ${token}` }
      // });
      // setSummary(response.data);
    } catch (err) {
      console.error('Error fetching inventory summary:', err);
      setError('Failed to load inventory summary. Please try again.');
      setLoading(false);
    }
  };

  const fetchLowStockAlerts = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      // Mock data for development
      setTimeout(() => {
        const mockAlerts = [
          { 
            id: 1, 
            product: { id: 1, name: 'Karapu Boondi' }, 
            currentStock: 3, 
            thresholdLevel: 5, 
            acknowledged: false 
          },
          { 
            id: 2, 
            product: { id: 2, name: 'Kaju Chikki' }, 
            currentStock: 4, 
            thresholdLevel: 10, 
            acknowledged: false 
          },
          { 
            id: 3, 
            product: { id: 3, name: 'Sajja Buralu' }, 
            currentStock: 2, 
            thresholdLevel: 5, 
            acknowledged: true 
          }
        ];
        setAlerts(mockAlerts);
      }, 800);
      
      // Production code:
      // const response = await axios.get(`http://localhost:8080/inventory/alerts/${storeId}`, {
      //   headers: { 'Authorization': `Bearer ${token}` }
      // });
      // setAlerts(response.data);
    } catch (err) {
      console.error('Error fetching alerts:', err);
    }
  };

  const fetchProductHistory = async (productId) => {
    setSelectedProduct(productId);
    
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      // Mock transaction history for development
      setTimeout(() => {
        const mockTransactions = [
          { 
            id: 1, 
            timestamp: '2025-03-01T14:30:00', 
            type: 'PURCHASE', 
            quantityChange: 20, 
            remainingQuantity: 23,
            reason: 'Monthly restock',
            performedBy: 'admin@example.com'
          },
          { 
            id: 2, 
            timestamp: '2025-02-28T10:15:00', 
            type: 'SALE', 
            quantityChange: -2, 
            remainingQuantity: 3,
            reason: 'Order #ORD-1234',
            performedBy: 'system'
          },
          { 
            id: 3, 
            timestamp: '2025-02-27T16:45:00', 
            type: 'ADJUSTMENT', 
            quantityChange: -5, 
            remainingQuantity: 5,
            reason: 'Inventory correction',
            performedBy: 'admin@example.com'
          }
        ];
        setTransactions(mockTransactions);
      }, 500);
      
      // Production code:
      // const response = await axios.get(`http://localhost:8080/inventory/history/${productId}`, {
      //   headers: { 'Authorization': `Bearer ${token}` }
      // });
      // setTransactions(response.data);
    } catch (err) {
      console.error('Error fetching product history:', err);
    }
  };

  const acknowledgeAlert = async (alertId) => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      // Mock acknowledge for development
      setAlerts(prevAlerts => 
        prevAlerts.map(alert => 
          alert.id === alertId 
            ? { ...alert, acknowledged: true } 
            : alert
        )
      );
      
      // Production code:
      // await axios.post(
      //   `http://localhost:8080/inventory/alerts/${alertId}/acknowledge`,
      //   {},
      //   {
      //     headers: {
      //       'Authorization': `Bearer ${token}`,
      //       'Owner-Email': JSON.parse(atob(token.split('.')[1])).sub
      //     }
      //   }
      // );
      // fetchLowStockAlerts();
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
    setAdjustmentLoading(true);
    setError(null);
    setSuccess(null);
    
    // Validate input
    if (!adjustmentData.productId) {
      setError('Please select a product');
      setAdjustmentLoading(false);
      return;
    }
    
    if (!adjustmentData.reason) {
      setError('Please provide a reason for the adjustment');
      setAdjustmentLoading(false);
      return;
    }
    
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      // Mock successful adjustment for development
      setTimeout(() => {
        setSuccess('Stock adjustment successful');
        
        // Update the product's stock in the UI
        setSummary(prev => ({
          ...prev,
          lowStockProducts: prev.lowStockProducts.map(product => 
            product.id === parseInt(adjustmentData.productId) 
              ? { 
                  ...product, 
                  stockQuantity: product.stockQuantity + parseInt(adjustmentData.quantityChange) 
                }
              : product
          )
        }));
        
        // Reset form
        setAdjustmentData({
          productId: null,
          quantityChange: 0,
          type: 'ADJUSTMENT',
          reason: '',
          notes: ''
        });
        
        setAdjustmentLoading(false);
        
        // If we were viewing the transaction history of this product, refresh it
        if (selectedProduct === parseInt(adjustmentData.productId)) {
          fetchProductHistory(selectedProduct);
        }
      }, 1000);
      
      // Production code:
      // await axios.post(
      //   '/inventory/adjust',
      //   adjustmentData,
      //   {
      //     headers: {
      //       'Authorization': `Bearer ${token}`,
      //       'Owner-Email': JSON.parse(atob(token.split('.')[1])).sub,
      //       'Content-Type': 'application/json'
      //     }
      //   }
      // );
      
      // setSuccess('Stock adjustment successful');
      // setAdjustmentData({
      //   productId: null,
      //   quantityChange: 0,
      //   type: 'ADJUSTMENT',
      //   reason: '',
      //   notes: ''
      // });
      // fetchInventoryData();
      // if (selectedProduct) {
      //   fetchProductHistory(selectedProduct);
      // }
    } catch (err) {
      console.error('Error adjusting stock:', err);
      setError(err.response?.data?.message || 'Failed to adjust stock');
    } finally {
      setAdjustmentLoading(false);
    }
  };

  if (loading && !summary) {
    return (
      <div className="flex justify-center items-center h-full p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        <span className="ml-3 text-lg text-gray-700 dark:text-gray-300">Loading inventory data...</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Inventory Management</h2>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-md">
          <div className="flex items-center">
            <FiAlertCircle className="text-red-500 mr-2" size={20} />
            <span className="text-red-700 dark:text-red-400">{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded-md">
          <div className="flex items-center">
            <FiCheck className="text-green-500 mr-2" size={20} />
            <span className="text-green-700 dark:text-green-400">{success}</span>
          </div>
        </div>
      )}
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-500">
              <FiPackage size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Products</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{summary?.totalProducts}</p>
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
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{summary?.inStockCount}</p>
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
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{summary?.outOfStockCount}</p>
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
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{summary?.lowStockCount}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alerts */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Low Stock Alerts</h3>
          
          {alerts.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No low stock alerts at this time.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Product</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Current Stock</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Threshold</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {alerts.map((alert) => (
                    <tr key={alert.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                      <td className="px-4 py-3 text-sm">
                        <button 
                          onClick={() => fetchProductHistory(alert.product.id)}
                          className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
                        >
                          {alert.product.name}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-sm text-red-600 dark:text-red-400 font-medium">
                        {alert.currentStock}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {alert.thresholdLevel}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {alert.acknowledged ? (
                          <span className="text-gray-500 dark:text-gray-400">
                            Acknowledged
                          </span>
                        ) : (
                          <button
                            onClick={() => acknowledgeAlert(alert.id)}
                            className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
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
          <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Adjust Stock</h3>
          
          <form onSubmit={submitAdjustment}>
            <div className="mb-4">
              <label htmlFor="productId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Product
              </label>
              <select
                id="productId"
                name="productId"
                value={adjustmentData.productId || ''}
                onChange={handleAdjustmentChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                required
              >
                <option value="">Select a product</option>
                {summary?.lowStockProducts?.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} (Current Stock: {product.stockQuantity})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Adjustment Type
              </label>
              <select
                id="type"
                name="type"
                value={adjustmentData.type}
                onChange={handleAdjustmentChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                required
              >
                <option value="ADJUSTMENT">Manual Adjustment</option>
                <option value="PURCHASE">Purchase/Restock</option>
                <option value="DAMAGED">Damaged/Write-off</option>
                <option value="RETURN">Customer Return</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label htmlFor="quantityChange" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Quantity Change
              </label>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => setAdjustmentData({
                    ...adjustmentData,
                    quantityChange: parseInt(adjustmentData.quantityChange) - 1
                  })}
                  className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <FiMinus />
                </button>
                <input
                  type="number"
                  id="quantityChange"
                  name="quantityChange"
                  value={adjustmentData.quantityChange}
                  onChange={handleAdjustmentChange}
                  className="w-full px-3 py-2 border-t border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center"
                  required
                />
                <button
                  type="button"
                  onClick={() => setAdjustmentData({
                    ...adjustmentData,
                    quantityChange: parseInt(adjustmentData.quantityChange) + 1
                  })}
                  className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-r-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <FiPlus />
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Use positive numbers to add stock, negative to remove.
              </p>
            </div>
            
            <div className="mb-4">
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Reason
              </label>
              <input
                type="text"
                id="reason"
                name="reason"
                value={adjustmentData.reason}
                onChange={handleAdjustmentChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                placeholder="Reason for adjustment"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                name="notes"
                value={adjustmentData.notes}
                onChange={handleAdjustmentChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                rows="2"
                placeholder="Additional notes"
              ></textarea>
            </div>
            
            <button
              type="submit"
              disabled={adjustmentLoading}
              className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {adjustmentLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : 'Submit Adjustment'}
            </button>
          </form>
        </div>
      </div>
      
      {/* Transaction History */}
      {selectedProduct && transactions.length > 0 && (
        <div className="mt-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Transaction History</h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Change</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Resulting Stock</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Reason</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Performed By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {new Date(transaction.timestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {transaction.type}
                    </td>
                    <td className="px-4 py-3 text-sm">
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
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {transaction.remainingQuantity}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {transaction.reason}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
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