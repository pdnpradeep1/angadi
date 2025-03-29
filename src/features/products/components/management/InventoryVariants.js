// src/features/products/components/management/InventoryVariants.js
import React, { useState } from 'react';
import { FiEdit, FiEye, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import InventoryQuickEdit from './InventoryQuickEdit';
import { quickUpdateInventory } from '../../services/inventoryService';

/**
 * Component for displaying and managing product variants
 */
const InventoryVariants = ({ product, storeId, onViewHistory, onInventoryUpdate }) => {
  const [quickEditingVariant, setQuickEditingVariant] = useState(null);
  const [editQuantity, setEditQuantity] = useState(0);
  const [updateLoading, setUpdateLoading] = useState(false);

  // Start quick edit for a variant
  const startQuickEdit = (variant) => {
    setQuickEditingVariant(variant);
    setEditQuantity(variant.stockQuantity === -1 ? 0 : variant.stockQuantity);
  };

  // Cancel quick edit without saving
  const cancelQuickEdit = () => {
    setQuickEditingVariant(null);
    setEditQuantity(0);
  };

  // Save quick edit inventory changes for a variant
  const saveQuickEdit = async (variant) => {
    setUpdateLoading(true);
    try {
      // Calculate the change in quantity
      const originalQty = variant.stockQuantity === -1 ? 0 : variant.stockQuantity;
      const change = editQuantity - originalQty;
      
      if (change === 0) {
        // No change, just cancel
        cancelQuickEdit();
        return;
      }
      
      // Call API to update variant stock
      await quickUpdateInventory(storeId, {
        productId: product.id,
        variantId: variant.id,
        quantityChange: change,
        type: 'ADJUSTMENT',
        reason: 'Quick edit from inventory management'
      });
      
      // Update the variant's stock quantity for display
      const updatedVariant = { ...variant, stockQuantity: editQuantity };
      
      // Notify parent component about the update
      if (onInventoryUpdate) {
        // Create display name for the variant
        const variantName = variant.name || 
          (variant.attributes ? 
            Object.entries(variant.attributes)
              .map(([key, value]) => `${key}: ${value}`)
              .join(', ') : 
            `Variant ${variant.id}`);
            
        onInventoryUpdate(
          { ...product, variant: updatedVariant },
          `Updated ${product.name} (${variantName}) quantity to ${editQuantity}`
        );
      }
      
      cancelQuickEdit();
    } catch (err) {
      console.error('Error updating variant inventory:', err);
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
          <FiAlertCircle className="mr-1" /> Out of Stock
        </span>
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

  // If no variants, show a message
  if (!product.variants || product.variants.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500 dark:text-gray-400">
        No variants available for this product.
      </div>
    );
  }

  return (
    <div className="pl-8 space-y-2">
      <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">
        Variants
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-md overflow-hidden">
          <thead>
            <tr className="text-xs text-gray-500 dark:text-gray-400">
              <th className="py-2 px-4 text-left">Variant</th>
              <th className="py-2 px-4 text-left">Image</th>
              <th className="py-2 px-4 text-left">SKU</th>
              <th className="py-2 px-4 text-left">Stock</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {product.variants.map((variant) => (
              <tr key={variant.id} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm">
                <td className="py-3 px-4">
                  {variant.name || 
                   (variant.attributes ? 
                     Object.entries(variant.attributes)
                       .map(([key, value]) => `${key}: ${value}`)
                       .join(', ') : 
                     `Variant ${variant.id}`)}
                </td>
                <td className="py-3 px-4">
                  {variant.imageUrl ? (
                    <img 
                      src={variant.imageUrl} 
                      alt={variant.name || "Variant"}
                      className="h-10 w-10 object-cover rounded-md border border-gray-200 dark:border-gray-700"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/api/placeholder/64/64?text=No+Image';
                      }}
                    />
                  ) : (
                    <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
                      <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                      </svg>
                    </div>
                  )}
                </td>
                <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                  {variant.sku || '-'}
                </td>
                <td className="py-3 px-4">
                  {quickEditingVariant && quickEditingVariant.id === variant.id ? (
                    <InventoryQuickEdit 
                      editQuantity={editQuantity}
                      setEditQuantity={setEditQuantity}
                      onSave={() => saveQuickEdit(variant)}
                      onCancel={cancelQuickEdit}
                      isLoading={updateLoading}
                    />
                  ) : (
                    getStockStatusDisplay(variant.stockQuantity, variant.lowStockThreshold || 5)
                  )}
                </td>
                <td className="py-3 px-4">
                  {quickEditingVariant && quickEditingVariant.id === variant.id ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => saveQuickEdit(variant)}
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
                        onClick={() => startQuickEdit(variant)}
                        className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 p-1 rounded-full hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                        title="Quick edit inventory"
                        aria-label="Quick edit inventory"
                      >
                        <FiEdit size={16} />
                      </button>
                      <button
                        onClick={() => onViewHistory(product.id, `${product.name} (${variant.name || variant.id})`)}
                        className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 p-1 rounded-full hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                        title="View transaction history"
                        aria-label="View transaction history"
                      >
                        <FiEye size={16} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryVariants;