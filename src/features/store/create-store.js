import React, { useState } from 'react';
import { FiShoppingBag, FiAlertCircle, FiCheck } from 'react-icons/fi';
import axios from 'axios';
import api from '../../api/config';
import { isAuthenticated } from '../../utils/jwtUtils';

const CreateStore = ({ onStoreCreated }) => {
  const [storeName, setStoreName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const validateForm = () => {
    if (!storeName.trim()) {
      setError('Store name is required');
      return false;
    }
    if (!description.trim()) {
      setError('Description is required');
      return false;
    }
    if (!address.trim()) {
      setError('Address is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      // Get JWT token
      if (!isAuthenticated()) {
        throw new Error('Authentication required. Please log in again.');
      }

      // Prepare store data
      const storeData = {
        name: storeName,
        description,
        address
      };

     // Send data to backend API
      const response = await api.post('/api/stores', storeData);

      console.log('Store created successfully:', response.data);
      
      // Call the onStoreCreated callback with the new store data
      onStoreCreated(response.data);
      
      // Reset form
      setStoreName('');
      setDescription('');
      setAddress('');
    } catch (error) {
      console.error('Error creating store:', error);
      setError(
        error.response?.data?.message || 
        error.message || 
        'Failed to create store. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg">
      <div className="flex items-center mb-4">
        <FiShoppingBag className="h-6 w-6 text-primary-600 mr-2" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Create a New Store</h3>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded">
          <div className="flex items-center">
            <FiAlertCircle className="text-red-500 mr-2" size={20} />
            <span className="text-red-700 dark:text-red-400">{error}</span>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Store Name *
          </label>
          <input
            id="storeName"
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            placeholder="Enter store name"
            className="input w-full"
            required
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description *
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter store description"
            rows="3"
            className="input w-full"
            required
          ></textarea>
        </div>
        
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Address *
          </label>
          <input
            id="address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter store address"
            className="input w-full"
            required
          />
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary px-6 py-2 flex items-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </>
            ) : (
              <>
                <FiCheck className="mr-2" />
                Create Store
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateStore;