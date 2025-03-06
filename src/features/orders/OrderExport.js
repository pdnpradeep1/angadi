// src/components/OrderExport.js
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  FiDownload, 
  FiFileText, 
  FiFilter, 
  FiCalendar, 
  FiDollarSign, 
  FiMail, 
  FiCheck, 
  FiAlertCircle 
} from 'react-icons/fi';
import axios from 'axios';

const OrderExport = () => {
  const { storeId } = useParams();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    dateFrom: '',
    dateTo: '',
    minAmount: '',
    maxAmount: '',
    customerEmail: ''
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const handleExport = async (format) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const token = localStorage.getItem('jwtToken');
      
      // Build URL with filters
      let url = `/orders/export/${format === 'csv' ? 'csv/' : ''}${storeId}?`;
      
      if (filters.status !== 'all') {
        url += `&status=${filters.status}`;
      }
      
      if (filters.dateFrom) {
        url += `&dateFrom=${filters.dateFrom}T00:00:00`;
      }
      
      if (filters.dateTo) {
        url += `&dateTo=${filters.dateTo}T23:59:59`;
      }
      
      if (filters.minAmount) {
        url += `&minAmount=${filters.minAmount}`;
      }
      
      if (filters.maxAmount) {
        url += `&maxAmount=${filters.maxAmount}`;
      }
      
      if (filters.customerEmail) {
        url += `&customerEmail=${filters.customerEmail}`;
      }
      
      const response = await axios.get(`http://localhost:8080${url}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        responseType: 'blob' // Important for file downloads
      });
      
      // Create download link
      const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = downloadUrl;
      
      // Generate filename with date
      const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      link.setAttribute('download', `orders_${storeId}_${date}.${format === 'csv' ? 'csv' : 'xlsx'}`);
      
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      setSuccess(true);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Error exporting orders:', err);
      setError('Failed to export orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Export Orders</h1>
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
            <span className="text-green-700 dark:text-green-400">Orders exported successfully!</span>
          </div>
        </div>
      )}
      
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <FiFilter className="mr-2" /> Export Filters
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Order Status
            </label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              <option value="all">All Orders</option>
              <option value="PENDING">Pending</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="REFUNDED">Refunded</option>
              <option value="RETURNED">Returned</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date Range
            </label>
            <div className="flex gap-2 items-center">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiCalendar className="text-gray-400" size={14} />
                </div>
                <input
                  type="date"
                  name="dateFrom"
                  value={filters.dateFrom}
                  onChange={handleFilterChange}
                  className="pl-8 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  placeholder="From"
                />
              </div>
              <span className="text-gray-500">to</span>
              <input
                type="date"
                name="dateTo"
                value={filters.dateTo}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                placeholder="To"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Amount Range
            </label>
            <div className="flex gap-2 items-center">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiDollarSign className="text-gray-400" size={14} />
                </div>
                <input
                  type="number"
                  name="minAmount"
                  value={filters.minAmount}
                  onChange={handleFilterChange}
                  className="pl-8 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  placeholder="Min"
                />
              </div>
              <span className="text-gray-500">to</span>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiDollarSign className="text-gray-400" size={14} />
                </div>
                <input
                  type="number"
                  name="maxAmount"
                  value={filters.maxAmount}
                  onChange={handleFilterChange}
                  className="pl-8 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  placeholder="Max"
                />
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Customer Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="text-gray-400" size={14} />
              </div>
              <input
                type="email"
                name="customerEmail"
                value={filters.customerEmail}
                onChange={handleFilterChange}
                className="pl-8 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                placeholder="customer@example.com"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <FiDownload className="mr-2" /> Export Format
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-500 dark:hover:border-primary-500 cursor-pointer"
            onClick={() => handleExport('excel')}>
            <div className="flex items-center mb-2">
              <FiFileText className="h-8 w-8 text-green-600 dark:text-green-400 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Excel Format</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Export orders as Excel spreadsheet</p>
              </div>
            </div>
            <button
              onClick={() => handleExport('excel')}
              disabled={loading}
              className="w-full mt-2 btn btn-primary flex items-center justify-center"
            >
              {loading ? 'Exporting...' : 'Export to Excel'}
            </button>
          </div>
          
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-500 dark:hover:border-primary-500 cursor-pointer"
            onClick={() => handleExport('csv')}>
            <div className="flex items-center mb-2">
              <FiFileText className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">CSV Format</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Export orders as CSV file</p>
              </div>
            </div>
            <button
              onClick={() => handleExport('csv')}
              disabled={loading}
              className="w-full mt-2 btn btn-primary flex items-center justify-center"
            >
              {loading ? 'Exporting...' : 'Export to CSV'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderExport;