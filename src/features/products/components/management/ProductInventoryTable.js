import React, { useState, useEffect } from 'react';
import { 
  FiSearch, 
  FiFilter, 
  FiChevronDown, 
  FiEye, 
  FiEdit, 
  FiPlus, 
  FiMinus,
  FiChevronRight,
  FiChevronLeft,
  FiAlertCircle,
  FiCheckCircle
} from 'react-icons/fi';
import { fetchProducts, quickUpdateInventory } from '../../services/inventoryService';

const ProductInventoryTable = ({ storeId, onViewHistory }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    category: 'all',
    stockStatus: 'all'
  });
  const [filterOpen, setFilterOpen] = useState(false);
  const [expandedProducts, setExpandedProducts] = useState({});
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [quickEditingProduct, setQuickEditingProduct] = useState(null);
  const [editQuantity, setEditQuantity] = useState(0);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    loadProducts();
  }, [storeId, currentPage, filters, sortField, sortDirection]);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchProducts(storeId, {
        page: currentPage - 1, // API is 0-indexed, UI is 1-indexed
        size: ITEMS_PER_PAGE,
        sort: `${sortField},${sortDirection}`,
        category: filters.category !== 'all' ? filters.category : null,
        inStock: filters.stockStatus !== 'all' ? filters.stockStatus === 'inStock' : null,
        search: searchTerm || null
      });
      
      // Format response data
      setProducts(response.content || []);
      setTotalPages(response.totalPages || 1);
      setLoading(false);
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Failed to load products');
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    loadProducts();
  };

  const handleFilter = () => {
    setCurrentPage(1); // Reset to first page when filtering
    loadProducts();
    setFilterOpen(false);
  };

  const clearFilters = () => {
    setFilters({
      category: 'all',
      stockStatus: 'all'
    });
    setFilterOpen(false);
    setCurrentPage(1);
    loadProducts();
  };

  const handleSort = (field) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const toggleProductExpand = (productId) => {
    setExpandedProducts(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  const startQuickEdit = (product) => {
    setQuickEditingProduct(product);
    setEditQuantity(product.stockQuantity === -1 ? 0 : product.stockQuantity);
  };

  const cancelQuickEdit = () => {
    setQuickEditingProduct(null);
    setEditQuantity(0);
  };

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
      
      // Update the local product data
      const updatedProducts = products.map(p => {
        if (p.id === product.id) {
          return { ...p, stockQuantity: editQuantity };
        }
        return p;
      });
      
      setProducts(updatedProducts);
      setSuccessMessage(`Updated ${product.name} quantity to ${editQuantity}`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      
      cancelQuickEdit();
    } catch (err) {
      console.error('Error updating inventory:', err);
      setError('Failed to update inventory');
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
        <span className="flex items-center text-red-600 dark:text-red-400">
          <FiAlertCircle className="mr-1" /> Out of Stock
        </span>
      );
    } else if (stockQuantity <= lowStockThreshold) {
      return (
        <span className="flex items-center text-yellow-600 dark:text-yellow-400">
          <FiAlertCircle className="mr-1" /> Low Stock ({stockQuantity})
        </span>
      );
    } else {
      return (
        <span className="flex items-center text-green-600 dark:text-green-400">
          <FiCheckCircle className="mr-1" /> In Stock ({stockQuantity})
        </span>
      );
    }
  };

  // Render options for the category filter
  const renderCategoryOptions = () => {
    const uniqueCategories = [...new Set(products.map(product => product.categoryName))].filter(Boolean);
    
    return (
      <>
        <option value="all">All Categories</option>
        {uniqueCategories.map(category => (
          <option key={category} value={category}>{category}</option>
        ))}
      </>
    );
  };

  // Render product variants
  const renderVariants = (product) => {
    if (!product.variants || product.variants.length === 0) {
      return null;
    }
    
    return (
      <div className="pl-10 space-y-2 mt-2">
        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">
          Variants
        </div>
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-md overflow-hidden">
          <thead>
            <tr className="text-xs text-gray-500 dark:text-gray-400">
              <th className="py-2 px-4 text-left">Variant</th>
              <th className="py-2 px-4 text-left">SKU</th>
              <th className="py-2 px-4 text-left">Stock</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {product.variants.map((variant) => (
              <tr key={variant.id} className="hover:bg-gray-100 dark:hover:bg-gray-700 text-sm">
                <td className="py-2 px-4">
                  {variant.name || 
                   (variant.attributes ? 
                     Object.entries(variant.attributes)
                       .map(([key, value]) => `${key}: ${value}`)
                       .join(', ') : 
                     `Variant ${variant.id}`)}
                </td>
                <td className="py-2 px-4 text-gray-600 dark:text-gray-400">
                  {variant.sku || '-'}
                </td>
                <td className="py-2 px-4">
                  {quickEditingProduct && quickEditingProduct.id === product.id && quickEditingProduct.variantId === variant.id ? (
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={() => setEditQuantity(prev => Math.max(0, prev - 1))}
                        className="p-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-l-md"
                      >
                        <FiMinus size={16} />
                      </button>
                      <input
                        type="number"
                        value={editQuantity}
                        onChange={(e) => setEditQuantity(parseInt(e.target.value) || 0)}
                        className="w-16 px-2 py-1 border-t border-b border-gray-300 dark:border-gray-600 text-center bg-white dark:bg-gray-800"
                        min="0"
                      />
                      <button
                        type="button"
                        onClick={() => setEditQuantity(prev => prev + 1)}
                        className="p-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-r-md"
                      >
                        <FiPlus size={16} />
                      </button>
                    </div>
                  ) : (
                    getStockStatusDisplay(variant.stockQuantity, variant.lowStockThreshold || 5)
                  )}
                </td>
                <td className="py-2 px-4">
                  {quickEditingProduct && quickEditingProduct.id === product.id && quickEditingProduct.variantId === variant.id ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => saveQuickEdit({ ...variant, id: product.id, variantId: variant.id })}
                        disabled={updateLoading}
                        className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 p-1 disabled:opacity-50"
                      >
                        {updateLoading ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={cancelQuickEdit}
                        className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300 p-1"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startQuickEdit({ ...variant, id: product.id, variantId: variant.id })}
                        className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 p-1"
                        title="Quick edit inventory"
                      >
                        <FiEdit size={16} />
                      </button>
                      <button
                        onClick={() => onViewHistory(product.id, product.name)}
                        className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 p-1"
                        title="View history"
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
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-5 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Product Inventory
          </h3>

          <div className="flex items-center space-x-2">
            {/* Search bar */}
            <form onSubmit={handleSearch} className="relative w-full md:w-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md w-full md:w-64 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </form>

            {/* Filter button */}
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-1"
            >
              <FiFilter />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Success message */}
        {successMessage && (
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-md">
            <div className="flex items-center">
              <FiCheckCircle className="mr-2 text-green-500" />
              <span className="text-green-700 dark:text-green-300 text-sm">
                {successMessage}
              </span>
            </div>
          </div>
        )}

        {/* Filter panel */}
        {filterOpen && (
          <div className="mt-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                >
                  {renderCategoryOptions()}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Stock Status
                </label>
                <select
                  value={filters.stockStatus}
                  onChange={(e) => setFilters({ ...filters, stockStatus: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                >
                  <option value="all">All Products</option>
                  <option value="inStock">In Stock</option>
                  <option value="outOfStock">Out of Stock</option>
                  <option value="lowStock">Low Stock</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={clearFilters}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Clear Filters
              </button>
              <button
                onClick={handleFilter}
                className="px-3 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Product Table */}
      {loading ? (
        <div className="flex justify-center items-center p-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-400">Loading products...</span>
        </div>
      ) : error ? (
        <div className="p-5 text-center text-red-500">
          {error}
        </div>
      ) : products.length === 0 ? (
        <div className="p-10 text-center text-gray-500 dark:text-gray-400">
          No products found. Try adjusting your filters or search.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"></th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    Product Name
                    {sortField === 'name' && (
                      <span className="ml-1">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={() => handleSort('stockQuantity')}
                >
                  <div className="flex items-center">
                    Stock
                    {sortField === 'stockQuantity' && (
                      <span className="ml-1">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  SKU
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {products.map((product) => (
                <React.Fragment key={product.id}>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    {/* <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleProductExpand(product.id)}
                        className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        {expandedProducts[product.id] ? (
                          <FiChevronDown size={20} />
                        ) : (
                          <FiChevronRight size={20} />
                        )}
                      </button>
                    </td> */}
                    <td className="px-6 py-4 whitespace-nowrap">
  {product.variants && product.variants.length > 0 ? (
    <button
      onClick={() => toggleProductExpand(product.id)}
      className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
    >
      {expandedProducts[product.id] ? (
        <FiChevronDown size={20} />
      ) : (
        <FiChevronRight size={20} />
      )}
    </button>
  ) : (
    // Empty cell when no variants
    <span></span>
  )}
</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {product.imageUrl ? (
                          <img 
                            src={product.imageUrl} 
                            alt={product.name} 
                            className="h-10 w-10 rounded-md object-cover mr-2"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-2">
                            <span className="text-gray-500 dark:text-gray-400">
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
                        <div className="flex items-center">
                          <button
                            type="button"
                            onClick={() => setEditQuantity(prev => Math.max(0, prev - 1))}
                            className="p-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-l-md"
                          >
                            <FiMinus size={16} />
                          </button>
                          <input
                            type="number"
                            value={editQuantity}
                            onChange={(e) => setEditQuantity(parseInt(e.target.value) || 0)}
                            className="w-16 px-2 py-1 border-t border-b border-gray-300 dark:border-gray-600 text-center bg-white dark:bg-gray-800"
                            min="0"
                          />
                          <button
                            type="button"
                            onClick={() => setEditQuantity(prev => prev + 1)}
                            className="p-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-r-md"
                          >
                            <FiPlus size={16} />
                          </button>
                        </div>
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
                            className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 p-1 disabled:opacity-50"
                          >
                            {updateLoading ? "Saving..." : "Save"}
                          </button>
                          <button
                            onClick={cancelQuickEdit}
                            className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300 p-1"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => startQuickEdit(product)}
                            className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 p-1"
                            title="Quick edit inventory"
                          >
                            <FiEdit size={18} />
                          </button>
                          <button
                            onClick={() => onViewHistory(product.id, product.name)}
                            className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 p-1"
                            title="View history"
                          >
                            <FiEye size={18} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                  {expandedProducts[product.id] && (
                    <tr>
                      <td colSpan="6" className="px-6 py-4">
                        {renderVariants(product)}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!loading && products.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="hidden sm:block">
            <p className="text-sm text-gray-700 dark:text-gray-400">
              Showing <span className="font-medium">{((currentPage - 1) * ITEMS_PER_PAGE) + 1}</span> to <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, products.length)}</span> of{' '}
              <span className="font-medium">{totalPages * ITEMS_PER_PAGE}</span> products
            </p>
          </div>
          <div className="flex-1 flex justify-between sm:justify-end">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiChevronLeft className="mr-1" size={14} />
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <FiChevronRight className="ml-1" size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductInventoryTable;