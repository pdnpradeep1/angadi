import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiAlertCircle, FiPackage, FiRefreshCw } from 'react-icons/fi';
import { fetchInventorySummary, fetchProductHistory } from './services/inventoryService';
import { ProductInventoryTable, ProductInventoryHeader } from './components/management';
import TransactionHistory from './components/management/TransactionHistory';
import SuccessAlert from '../common/SuccessAlert';

const InventoryManagement = () => {
  const { storeId } = useParams();
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showTransactionHistory, setShowTransactionHistory] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Load inventory data on component mount or refresh
  useEffect(() => {
    loadInventoryData();
  }, [storeId, refreshTrigger]);

  // Refresh data function
  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Load inventory data from API
  const loadInventoryData = async () => {
    setLoading(true);
    setError(null);
    try {
      const summaryData = await fetchInventorySummary(storeId);
      setSummary(summaryData);
      setLoading(false);
    } catch (err) {
      console.error('Error loading inventory data:', err);
      setError('Failed to load inventory data. Please try again.');
      setLoading(false);
    }
  };

  // Handle viewing a product's transaction history
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

  // Close transaction history modal
  const handleCloseTransactionHistory = () => {
    setShowTransactionHistory(false);
    setSelectedProduct(null);
    setTransactions([]);
  };

  // Handle successful inventory update
  const handleInventoryUpdate = (message) => {
    setSuccess(message);
    loadInventoryData(); // Reload data to reflect changes
    
    // Clear success message after a delay
    setTimeout(() => {
      setSuccess(null);
    }, 5000);
  };

  if (loading && !summary) {
    return (
      <div className="flex justify-center items-center h-64 p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        <span className="ml-3 text-lg text-gray-700 dark:text-gray-300">Loading inventory data...</span>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <FiPackage className="mr-2 text-primary-500" />
            Inventory Management
          </h2>
          
          <div className="flex space-x-3 mt-4 md:mt-0">
            <button
              onClick={refreshData}
              className="p-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
              title="Refresh data"
            >
              <FiRefreshCw />
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-md">
            <div className="flex items-center">
              <FiAlertCircle className="text-red-500 mr-2" size={20} />
              <span className="text-red-700 dark:text-red-400">{error}</span>
            </div>
          </div>
        )}

        {/* Success message */}
        {success && <SuccessAlert message={success} />}

        {/* Inventory metrics summary */}
        <ProductInventoryHeader summary={summary} />

        {/* Main Content Area */}
        <div className="space-y-6">
          {/* Products Table */}
          <ProductInventoryTable 
            storeId={storeId}
            onViewHistory={handleViewProductHistory}
            onInventoryUpdate={handleInventoryUpdate}
          />
        </div>

        {/* Transaction history modal */}
        {showTransactionHistory && (
          <TransactionHistory 
            productName={selectedProduct?.name}
            transactions={transactions}
            onClose={handleCloseTransactionHistory}
          />
        )}
      </div>
    </div>
  );
};

export default InventoryManagement;