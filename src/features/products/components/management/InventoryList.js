// src/features/products/components/management/InventoryList.js
import React, { useState } from 'react';
import { FiChevronDown, FiChevronRight, FiEdit, FiEye, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import InventoryQuickEdit from './InventoryQuickEdit';
import InventoryVariants from './InventoryVariants';
import { quickUpdateInventory } from '../../services/inventoryService';

const InventoryList = ({ products, onViewHistory, onInventoryUpdate, storeId }) => {
  const [expandedProducts, setExpandedProducts] = useState({});
  const [quickEditingProduct, setQuickEditingProduct] = useState(null);
  const [editQuantity, setEditQuantity] = useState(0);
  const [updateLoading, setUpdateLoading] = useState(false);

  // Toggle product expansion to show/hide variants
  const toggleProductExpand = (productId) => {
    setExpandedProducts(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  // Start quick edit for a product's inventory
  const startQuickEdit = (product) => {
    setQuickEditingProduct(product);
    setEditQuantity(product.stockQuantity === -1 ? 0 : product.stockQuantity);
  };

  // Cancel quick edit without saving
  const cancelQuickEdit = () => {
    setQuickEditingProduct(null);
    setEditQuantity(0);
  };

  // Save quick edit inventory changes
  const saveQuickEdit = async (product) => {
    setUpdateLoading(true);
    try {
      // Calculate the change in quantity
      const originalQty = product.stockQuantity === -1 ? 0 : product.stockQuantity;
      const change = editQuantity - originalQty;
      
      if (change === 0) {
        // No change, just cancel
        cancelQuickEdit();
        return;
      }
      
      await quickUpdateInventory(storeId, {
        productId: product.id,
        quantityChange: change,
        type: 'ADJUSTMENT',
        reason: 'Quick edit from inventory management'
      });
      
      const updatedProduct = { ...product, stockQuantity: editQuantity };
      
      // Notify parent component
      if (onInventoryUpdate) {
        onInventoryUpdate(
          updatedProduct, 
          `Updated ${product.name} quantity to ${editQuantity}`
        );
      }
      
      cancelQuickEdit();
    } catch (err) {
      console.error('Error updating inventory:', err);
    } finally {
      setUpdateLoading(false);
    }
  };

  // Get appropriate stock status UI elements
  const getStockStatusDisplay = (stockQuantity, lowStockThreshold) => {
    if (stockQuantity === -1) {
      return (
        <span className="flex items-center text-gray-600 dark:text-gray-400">
          Unlimited
        </span>
      );
    } else if (stockQuantity <= 0) {
      return (
        <span className="flex items-center text-red-600 dark:text-red-400 font-medium">
          <FiAlertCircle className="mr-1" /> Out of Stock</span>
      );
    } else if (stockQuantity <= lowStockThreshold) {
      return (
        <span className="flex items-center text-yellow-600 dark:text-yellow-400 font-medium">
          <FiAlertCircle className="mr-1" /> Low Stock ({stockQuantity})
        </span>
      );
    } else {
      return (
        <span className="flex items-center text-green-600 dark:text-green-400 font-medium">
          <FiCheckCircle className="mr-1" /> In Stock ({stockQuantity})
        </span>
      );
    }
  };

  return (
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
        {products.map((product) => (
          <React.Fragment key={product.id}>
            <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                {product.variants && product.variants.length > 0 ? (
                  <button
                    onClick={() => toggleProductExpand(product.id)}
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    aria-label={expandedProducts[product.id] ? "Collapse variants" : "Expand variants"}
                  >
                    {expandedProducts[product.id] ? (
                      <FiChevronDown size={20} />
                    ) : (
                      <FiChevronRight size={20} />
                    )}
                  </button>
                ) : (
                  <span></span>
                )}
              </td>
              
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {product.imageUrl ? (
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="h-10 w-10 rounded-md object-cover mr-3 border border-gray-200 dark:border-gray-700"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/api/placeholder/64/64?text=' + product.name.charAt(0).toUpperCase();
                      }}
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-3">
                      <span className="text-gray-500 dark:text-gray-400 font-medium">
                        {product.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {product.name}
                    </div>
                    {product.variants && product.variants.length > 0 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {product.variants.length} variants
                      </div>
                    )}
                  </div>
                </div>
              </td>
              
              <td className="px-6 py-4 whitespace-nowrap">
                {quickEditingProduct && quickEditingProduct.id === product.id && !quickEditingProduct.variantId ? (
                  <InventoryQuickEdit 
                    editQuantity={editQuantity}
                    setEditQuantity={setEditQuantity}
                    onSave={() => saveQuickEdit(product)}
                    onCancel={cancelQuickEdit}
                    isLoading={updateLoading}
                  />
                ) : (
                  getStockStatusDisplay(product.stockQuantity, product.lowStockThreshold || 5)
                )}
              </td>
              
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                {product.sku || '-'}
              </td>
              
              <td className="px-6 py-4 whitespace-nowrap">
                {product.categoryName ? (
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    {product.categoryName}
                  </span>
                ) : '-'}
              </td>
              
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {quickEditingProduct && quickEditingProduct.id === product.id && !quickEditingProduct.variantId ? (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => saveQuickEdit(product)}
                      disabled={updateLoading}
                      className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 p-1 rounded-full hover:bg-green-50 dark:hover:bg-green-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      aria-label="Save changes"
                    >
                      {updateLoading ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={cancelQuickEdit}
                      className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      aria-label="Cancel editing"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startQuickEdit(product)}
                      className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 p-1 rounded-full hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                      title="Quick edit inventory"
                      aria-label="Quick edit inventory"
                    >
                      <FiEdit size={18} />
                    </button>
                    <button
                      onClick={() => onViewHistory(product.id, product.name)}
                      className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 p-1 rounded-full hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                      title="View transaction history"
                      aria-label="View transaction history"
                    >
                      <FiEye size={18} />
                    </button>
                  </div>
                )}
              </td>
            </tr>
            
            {/* Show variants when expanded */}
            {expandedProducts[product.id] && (
              <tr>
                <td colSpan="6" className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50">
                  <InventoryVariants 
                    product={product}
                    storeId={storeId}
                    onViewHistory={onViewHistory}
                    onInventoryUpdate={onInventoryUpdate}
                  />
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
};

export default InventoryList;