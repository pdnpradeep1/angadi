import api, { apiService } from '../../../api/config';

/**
 * Fetch inventory summary for a store
 * @param {string|number} storeId - Store ID
 * @returns {Promise<Object>} - Inventory summary data
 */
export const fetchInventorySummary = async (storeId) => {
  try {
    const response = await apiService.get(`/inventory/summary/${storeId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching inventory summary:', error);
    
    // For development, return mock data
    if (process.env.NODE_ENV === 'development') {
      return getMockInventorySummary();
    }
    throw error;
  }
};

/**
 * Fetch low stock alerts for a store
 * @param {string|number} storeId - Store ID
 * @returns {Promise<Array>} - Array of low stock alerts
 */
// export const fetchLowStockAlerts = async (storeId) => {
//   try {
//     const response = await api.get(`/inventory/alerts/${storeId}`);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching low stock alerts:', error);
    
//     // For development, return mock data
//     if (process.env.NODE_ENV === 'development') {
//       return getMockLowStockAlerts();
//     }
//     throw error;
//   }
// };

/**
 * Fetch transaction history for a product
 * @param {string|number} productId - Product ID
 * @param {string|number} variantId - Optional variant ID
 * @returns {Promise<Array>} - Array of transactions
 */
export const fetchProductHistory = async (productId, variantId = null) => {
  try {
    const url = variantId 
      ? `/inventory/history/${productId}/variant/${variantId}` 
      : `/inventory/history/${productId}`;
    
    const response = await apiService.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching product history:', error);
    
    // For development, return mock data
    if (process.env.NODE_ENV === 'development') {
      return getMockTransactionHistory();
    }
    throw error;
  }
};

/**
 * Acknowledge a low stock alert
 * @param {string|number} alertId - Alert ID
 * @returns {Promise<Object>} - Acknowledged alert data
 */
export const acknowledgeAlert = async (alertId) => {
  try {
    const response = await apiService.post(`/inventory/alerts/${alertId}/acknowledge`, {});
    return response.data;
  } catch (error) {
    console.error('Error acknowledging alert:', error);
    
    // For development, just return success to simulate API response
    if (process.env.NODE_ENV === 'development') {
      return { success: true, id: alertId };
    }
    throw error;
  }
};

/**
 * Adjust inventory for a product
 * @param {string|number} storeId - Store ID
 * @param {Object} adjustmentData - Adjustment data
 * @returns {Promise<Object>} - Updated inventory data
 */
export const adjustInventory = async (storeId, adjustmentData) => {
  try {
    // Fix: Update the endpoint to match the backend API structure
    const response = await apiService.post(`/inventory/adjust/${storeId}`, adjustmentData);
    return response.data;
  } catch (error) {
    console.error('Error adjusting inventory:', error);
    
    // For development, just return success to simulate API response
    if (process.env.NODE_ENV === 'development') {
      return { 
        success: true, 
        productId: adjustmentData.productId,
        quantityChange: adjustmentData.quantityChange
      };
    }
    throw error;
  }
};

/**
 * Quick update for inventory quantity
 * @param {string|number} storeId - Store ID 
 * @param {Object} updateData - Update data
 * @returns {Promise<Object>} - Updated product data
 */
export const quickUpdateInventory = async (storeId, updateData) => {
  try {
    // Fix: Ensure variantId is properly formatted before sending to API
    const payload = { ...updateData };
    
    // If variantId is an object, extract just the ID value
    if (payload.variantId && typeof payload.variantId === 'object') {
      payload.variantId = payload.variantId.variantId || null;
    }
    
    // Add type if not provided
    if (!payload.type) {
      payload.type = "ADJUSTMENT";
    }
    
    // Add reason if not provided
    if (!payload.reason) {
      payload.reason = "Quick edit from inventory management";
    }
    
    let response;
    
    // Use the specific variant endpoint if a variantId is provided
    if (payload.variantId) {
      response = await apiService.post(
        `/inventory/${storeId}/update/product/${payload.productId}/variant/${payload.variantId}`, 
        payload
      );
    } else {
      // Use the regular product endpoint if no variantId
      response = await apiService.post(`/inventory/${storeId}/update`, payload);
    }
    
    return response.data;
  } catch (error) {
    console.error('Error updating inventory:', error);
    
    // For development, fall back to mock data
    if (process.env.NODE_ENV === 'development') {
      return { 
        success: true, 
        id: updateData.productId,
        stockQuantity: updateData.newQuantity || (updateData.quantityChange > 0 ? 10 : 5),
        name: 'Updated Product'
      };
    }
    throw error;
  }
};

/**
 * Fetch products with inventory information
 * @param {string|number} storeId - Store ID
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} - Paginated products data
 */
export const fetchProducts = async (storeId, params = {}) => {
  try {
    const response = await apiService.get(`/products/store/${storeId}`, params);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    
    // For development, return mock data
    if (process.env.NODE_ENV === 'development') {
      return getMockProductsData(params);
    }
    throw error;
  }
};

// Mock data for development
const getMockInventorySummary = () => {
  return {
    totalProducts: 87,
    inStockCount: 72,
    outOfStockCount: 8,
    lowStockCount: 15,
    stockMovement: {
      incoming: 35,
      outgoing: 23
    },
    lowStockProducts: [
      { id: 1, name: 'Karapu Boondi', stockQuantity: 3, lowStockThreshold: 5, sku: 'KB-001' },
      { id: 2, name: 'Kaju Chikki', stockQuantity: 4, lowStockThreshold: 10, sku: 'KC-002', variants: [
        { id: 21, name: 'Small Pack', stockQuantity: 2, lowStockThreshold: 5, sku: 'KC-002-S' },
        { id: 22, name: 'Large Pack', stockQuantity: 2, lowStockThreshold: 5, sku: 'KC-002-L' }
      ]},
      { id: 3, name: 'Sajja Buralu', stockQuantity: 2, lowStockThreshold: 5, sku: 'SB-003' },
      { id: 4, name: 'Dry Fruits Bar', stockQuantity: 7, lowStockThreshold: 10, sku: 'DFB-004' }
    ],
    recentTransactions: []
  };
};

const getMockLowStockAlerts = () => {
  return [
    { 
      id: 1, 
      product: { id: 1, name: 'Karapu Boondi', sku: 'KB-001', imageUrl: '/api/placeholder/64/64?text=KB' }, 
      currentStock: 3, 
      thresholdLevel: 5, 
      acknowledged: false 
    },
    { 
      id: 2, 
      product: { id: 2, name: 'Kaju Chikki', sku: 'KC-002', imageUrl: '/api/placeholder/64/64?text=KC' }, 
      currentStock: 4, 
      thresholdLevel: 10, 
      acknowledged: false 
    },
    { 
      id: 3, 
      product: { id: 3, name: 'Sajja Buralu', sku: 'SB-003' }, 
      currentStock: 2, 
      thresholdLevel: 5, 
      acknowledged: true 
    },
    { 
      id: 4, 
      product: { id: 4, name: 'Dry Fruits Bar', sku: 'DFB-004', imageUrl: '/api/placeholder/64/64?text=DFB' }, 
      currentStock: 7, 
      thresholdLevel: 10, 
      acknowledged: false 
    }
  ];
};

const getMockTransactionHistory = () => {
  return [
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
    },
    { 
      id: 4, 
      timestamp: '2025-02-26T09:30:00', 
      type: 'TRANSFER', 
      quantityChange: -3, 
      remainingQuantity: 10,
      reason: 'Transferred to Warehouse B',
      performedBy: 'manager@example.com'
    },
    { 
      id: 5, 
      timestamp: '2025-02-25T11:20:00', 
      type: 'RETURN', 
      quantityChange: 2, 
      remainingQuantity: 13,
      reason: 'Customer return - damaged',
      performedBy: 'support@example.com'
    }
  ];
};

const getMockProductsData = (params = {}) => {
  const page = params.page || 0;
  const size = params.size || 10;
  
  // Generate mock products
  const totalProducts = 35;
  const mockProducts = Array.from({ length: size }, (_, i) => {
    const productIndex = page * size + i;
    if (productIndex >= totalProducts) return null;
    
    const id = productIndex + 1;
    const stockQuantity = Math.random() > 0.8 ? 0 : Math.floor(Math.random() * 50);
    const lowStockThreshold = 10;
    const hasVariants = Math.random() > 0.7;
    
    return {
      id,
      name: `Product ${id}`,
      description: `Description for Product ${id}`,
      sku: `SKU-${id.toString().padStart(3, '0')}`,
      stockQuantity,
      lowStockThreshold,
      price: Math.floor(Math.random() * 100) + 10,
      imageUrl: `/api/placeholder/64/64?text=P${id}`,
      status: stockQuantity > 0 ? 'Active' : 'Out of Stock',
      categoryId: Math.floor(Math.random() * 5) + 1,
      categoryName: ['Sweets', 'Snacks', 'Spices', 'Beverages', 'Dairy'][Math.floor(Math.random() * 5)],
      variants: hasVariants ? getRandomVariants(id) : []
    };
  }).filter(Boolean);  // Remove any null entries if page * size > totalProducts
  
  return {
    content: mockProducts,
    page,
    size,
    totalPages: Math.ceil(totalProducts / size),
    totalElements: totalProducts
  };
};

const getRandomVariants = (productId) => {
  const count = Math.floor(Math.random() * 3) + 1;  // 1-3 variants
  const sizes = ['Small', 'Medium', 'Large', 'XL'];
  const colors = ['Red', 'Blue', 'Green', 'Black', 'White'];
  
  return Array.from({ length: count }, (_, i) => {
    const id = (productId * 10) + i + 1;
    const size = sizes[Math.floor(Math.random() * sizes.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const stockQuantity = Math.random() > 0.7 ? 0 : Math.floor(Math.random() * 20);
    
    return {
      id,
      name: `${size} / ${color}`,
      sku: `SKU-${productId.toString().padStart(3, '0')}-${i + 1}`,
      stockQuantity,
      lowStockThreshold: 5,
      price: Math.floor(Math.random() * 50) + 5,
      attributes: {
        size,
        color
      }
    };
  });
};