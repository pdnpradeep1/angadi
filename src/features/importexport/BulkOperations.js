import React, { useState } from 'react';
import axios from 'axios';
import { apiService } from '../../common/api/apiConfig';
import { getAuthHeaders } from '../../common/auth/jwtUtils';


const BulkOperations = ({ selectedProducts, onOperationComplete }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  
  const handleBulkPublish = async () => {
    setLoading(true);
    try {
      const headers = getAuthHeaders(true); // true includes Owner-Email
      const response = await apiService.post('/products/bulk/publish', selectedProducts, { headers });
      
      setResult(response.data);
      onOperationComplete('publish', response.data);
    } catch (error) {
      console.error('Error performing bulk publish:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) {
      return;
    }
    
    setLoading(true);
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.post(
        '/products/bulk/delete',
        selectedProducts,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Owner-Email': JSON.parse(atob(token.split('.')[1])).sub
          }
        }
      );
      
      setResult(response.data);
      onOperationComplete('delete', response.data);
    } catch (error) {
      console.error('Error performing bulk delete:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleApplyDiscount = async (discountPercentage) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.post(
        `/products/bulk/apply-discount?discountPercentage=${discountPercentage}`,
        selectedProducts,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Owner-Email': JSON.parse(atob(token.split('.')[1])).sub
          }
        }
      );
      
      setResult(response.data);
      onOperationComplete('discount', response.data);
    } catch (error) {
      console.error('Error applying bulk discount:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // ... other bulk operations as needed
  
  return (
    <div className="bulk-operations">
      <h3>Bulk Operations ({selectedProducts.length} products selected)</h3>
      
      <div className="operation-buttons">
        <button 
          onClick={handleBulkPublish} 
          disabled={loading || selectedProducts.length === 0}
          className="btn btn-primary mr-2"
        >
          Publish All
        </button>
        
        <button 
          onClick={() => handleApplyDiscount(10)} // 10% discount
          disabled={loading || selectedProducts.length === 0}
          className="btn btn-secondary mr-2"
        >
          Apply 10% Discount
        </button>
        
        <button 
          onClick={handleBulkDelete} 
          disabled={loading || selectedProducts.length === 0}
          className="btn btn-danger"
        >
          Delete All
        </button>
      </div>
      
      {/* Show result summary if available */}
      {result && (
        <div className="operation-result mt-3">
          <p>Operation completed:</p>
          <ul>
            <li>Total requested: {result.totalRequested}</li>
            <li>Successful: {result.successCount}</li>
            <li>Failed: {result.failedCount}</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default BulkOperations;