import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import InventoryMetrics from './components/management/InventoryMetrics';
import LowStockAlerts from './components/management/LowStockAlerts';
import InventoryAdjustment from './components/management/InventoryAdjustment';
import ProductInventoryTable from './components/management/ProductInventoryTable';
import TransactionHistory from './components/management/TransactionHistory';
import { fetchInventorySummary, fetchLowStockAlerts, fetchProductHistory } from './services/inventoryService';
import { FiAlertCircle, FiCheck } from 'react-icons/fi';

const InventoryManagement = () => {
  const { storeId } = useParams();
  const [summary, setSummary] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showTransactionHistory, setShowTransactionHistory] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadInventoryData();
  }, [storeId]);

  const loadInventoryData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [summaryData, alertsData] = await Promise.all([
        fetchInventorySummary(storeId),
        fetchLowStockAlerts(storeId)
      ]);
      
      setSummary(summaryData);
      setAlerts(alertsData);
      setLoading(false);
    } catch (err) {
      console.error('Error loading inventory data:', err);
      setError('Failed to load inventory data. Please try again.');
      setLoading(false);
    }
  };

  const handleViewProductHistory = async (productId, productName) => {
    setSelectedProduct({ id: productId, name: productName });
    setShowTransactionHistory(true);
    
    try {
      const history = await fetchProductHistory(productId);
      setTransactions(history);
    } catch (err) {
      console.error('Error fetching product history:', err);
      setError('Failed to load transaction history');
    }
  };

  const handleCloseTransactionHistory = () => {
    setShowTransactionHistory(false);
    setSelectedProduct(null);
    setTransactions([]);
  };

  const handleAdjustmentSuccess = (message) => {
    setSuccess(message || 'Inventory adjustment successful');
    loadInventoryData();
    
    // If the adjusted product is currently selected, refresh its history
    if (selectedProduct && showTransactionHistory) {
      handleViewProductHistory(selectedProduct.id, selectedProduct.name);
    }
    
    // Clear success message after a delay
    setTimeout(() => {
      setSuccess(null);
    }, 5000);
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
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Inventory Management</h2>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'overview'
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300 font-medium'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'products'
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300 font-medium'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Products
            </button>
          </div>
        </div>

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

        {activeTab === 'overview' ? (
          <>
            <InventoryMetrics summary={summary} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <LowStockAlerts 
                alerts={alerts} 
                onViewProduct={handleViewProductHistory} 
              />
              
              <InventoryAdjustment 
                storeId={storeId}
                productsList={summary?.lowStockProducts || []}
                selectedProductId={selectedProduct?.id}
                onSuccess={handleAdjustmentSuccess}
                onError={setError}
              />
            </div>

            {showTransactionHistory && (
              <TransactionHistory 
                productName={selectedProduct?.name}
                transactions={transactions}
                onClose={handleCloseTransactionHistory}
              />
            )}
          </>
        ) : (
          <ProductInventoryTable 
            storeId={storeId}
            onViewHistory={handleViewProductHistory}
          />
        )}
      </div>
    </div>
  );
};

export default InventoryManagement;