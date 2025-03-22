import React, { useState, useEffect } from 'react';
import { FiPackage, FiPlus, FiMinus, FiInfo } from 'react-icons/fi';
import { adjustInventory } from '../../services/inventoryService';

const InventoryAdjustment = ({ 
  storeId, 
  productsList, 
  selectedProductId = null, 
  onSuccess, 
  onError 
}) => {
  const [adjustmentData, setAdjustmentData] = useState({
    productId: '',
    quantityChange: 0,
    type: 'ADJUSTMENT',
    reason: '',
    notes: ''
  });
  const [adjustmentLoading, setAdjustmentLoading] = useState(false);
  const [showVariants, setShowVariants] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [selectedVariantId, setSelectedVariantId] = useState('');

  // Set the productId if it's passed in from props
  useEffect(() => {
    if (selectedProductId) {
      setAdjustmentData(prev => ({ ...prev, productId: selectedProductId.toString() }));
      
      // Find the product in the list
      const product = productsList.find(p => p.id === selectedProductId);
      if (product) {
        setSelectedProduct(product);
        
        // Check if the product has variants
        if (product.variants && product.variants.length > 0) {
          setVariants(product.variants);
          setShowVariants(true);
        } else {
          setVariants([]);
          setShowVariants(false);
        }
      }
    }
  }, [selectedProductId, productsList]);

  // When product selection changes
  const handleProductChange = (e) => {
    const productId = e.target.value;
    setAdjustmentData({
      ...adjustmentData,
      productId
    });

    // Reset variant selection when product changes
    setSelectedVariantId('');
    
    // Find the selected product
    const product = productsList.find(p => p.id.toString() === productId);
    if (product) {
      setSelectedProduct(product);
      
      // Check if the product has variants
      if (product.variants && product.variants.length > 0) {
        setVariants(product.variants);
        setShowVariants(true);
      } else {
        setVariants([]);
        setShowVariants(false);
      }
    } else {
      setSelectedProduct(null);
      setVariants([]);
      setShowVariants(false);
    }
  };

  const handleVariantChange = (e) => {
    setSelectedVariantId(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdjustmentData({
      ...adjustmentData,
      [name]: value
    });
  };

  const submitAdjustment = async (e) => {
    e.preventDefault();
    setAdjustmentLoading(true);
    
    try {
      // Validate input
      if (!adjustmentData.productId) {
        throw new Error('Please select a product');
      }
      
      if (showVariants && !selectedVariantId) {
        throw new Error('Please select a variant');
      }
      
      if (!adjustmentData.reason) {
        throw new Error('Please provide a reason for the adjustment');
      }
      
      const payload = {
        ...adjustmentData,
        variantId: showVariants ? selectedVariantId : null,
        quantityChange: parseInt(adjustmentData.quantityChange)
      };
      
      await adjustInventory(storeId, payload);
      
      // Reset form
      setAdjustmentData({
        productId: '',
        quantityChange: 0,
        type: 'ADJUSTMENT',
        reason: '',
        notes: ''
      });
      setSelectedVariantId('');
      setSelectedProduct(null);
      setShowVariants(false);
      
      if (onSuccess) {
        onSuccess(`Inventory ${payload.quantityChange >= 0 ? 'increased' : 'decreased'} successfully`);
      }
    } catch (error) {
      console.error('Error adjusting inventory:', error);
      if (onError) {
        onError(error.message || 'Failed to adjust inventory');
      }
    } finally {
      setAdjustmentLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-5 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
          <FiPackage className="mr-2 text-primary-500" /> 
          Adjust Inventory
        </h3>
      </div>
      
      <form onSubmit={submitAdjustment} className="p-5 space-y-4">
        <div>
          <label htmlFor="productId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Product <span className="text-red-500">*</span>
          </label>
          <select
            id="productId"
            name="productId"
            value={adjustmentData.productId}
            onChange={handleProductChange}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            required
          >
            <option value="">Select a product</option>
            {productsList.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} ({product.stockQuantity === -1 ? 'Unlimited' : product.stockQuantity} in stock)
              </option>
            ))}
          </select>
        </div>
        
        {showVariants && variants.length > 0 && (
          <div>
            <label htmlFor="variantId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Variant <span className="text-red-500">*</span>
            </label>
            <select
              id="variantId"
              name="variantId"
              value={selectedVariantId}
              onChange={handleVariantChange}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              required
            >
              <option value="">Select a variant</option>
              {variants.map((variant) => (
                <option key={variant.id} value={variant.id}>
                  {variant.name || variant.attributes?.map(attr => `${attr.name}: ${attr.value}`).join(', ')} 
                  ({variant.stockQuantity === -1 ? 'Unlimited' : variant.stockQuantity} in stock)
                </option>
              ))}
            </select>
          </div>
        )}
        
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Adjustment Type
          </label>
          <select
            id="type"
            name="type"
            value={adjustmentData.type}
            onChange={handleInputChange}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            required
          >
            <option value="ADJUSTMENT">Manual Adjustment</option>
            <option value="PURCHASE">Purchase/Restock</option>
            <option value="DAMAGED">Damaged/Write-off</option>
            <option value="RETURN">Customer Return</option>
            <option value="TRANSFER">Transfer</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="quantityChange" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Quantity Change <span className="text-red-500">*</span>
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
              onChange={handleInputChange}
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
        
        <div>
          <label htmlFor="reason" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Reason <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="reason"
            name="reason"
            value={adjustmentData.reason}
            onChange={handleInputChange}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            placeholder="Reason for adjustment"
            required
          />
        </div>
        
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Notes (Optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            value={adjustmentData.notes}
            onChange={handleInputChange}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            rows="2"
            placeholder="Additional notes"
          ></textarea>
        </div>
        
        {/* Info box */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiInfo className="h-5 w-5 text-blue-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                {selectedProduct ? 
                  showVariants && !selectedVariantId ?
                    "Please select a variant to adjust its inventory" :
                    `Current stock: ${showVariants && selectedVariantId ? 
                      (variants.find(v => v.id.toString() === selectedVariantId)?.stockQuantity || 0) :
                      (selectedProduct.stockQuantity === -1 ? 'Unlimited' : selectedProduct.stockQuantity)}`
                  : 
                  "Select a product to adjust its inventory"
                }
              </p>
            </div>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={adjustmentLoading || !adjustmentData.productId || (showVariants && !selectedVariantId)}
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
  );
};

export default InventoryAdjustment;