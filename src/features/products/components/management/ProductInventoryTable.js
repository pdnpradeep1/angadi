// src/features/products/components/management/ProductInventoryTable.js
import React, { useState, useEffect } from 'react';
import { 
  FiSearch, 
  FiFilter,
  FiAlertCircle,
  FiCheckCircle,
  FiPackage
} from 'react-icons/fi';
import { fetchProducts } from '../../services/inventoryService';
import InventoryTableFilters from './InventoryTableFilters';
import InventoryTableHeader from './InventoryTableHeader';
import InventoryList from './InventoryList';
import InventoryPagination from './InventoryPagination';
import SuccessAlert from '../../../common/SuccessAlert';

const ProductInventoryTable = ({ storeId, onViewHistory }) => {
  // State management
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState({
    category: 'all',
    stockStatus: 'all'
  });
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [successMessage, setSuccessMessage] = useState('');

  const ITEMS_PER_PAGE = 10;

  // Fetch products when dependencies change
  useEffect(() => {
    loadProducts();
  }, [storeId, currentPage, filters, sortField, sortDirection]);

  // Function to load products from API
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
      setTotalItems(response.totalElements || 0);
      setLoading(false);
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Failed to load products');
      setLoading(false);
    }
  };

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    loadProducts();
  };

  // Apply filters and reload products
  const handleFilter = () => {
    setCurrentPage(1); // Reset to first page when filtering
    loadProducts();
    setFilterOpen(false);
  };

  // Clear all filters and reload products
  const clearFilters = () => {
    setFilters({
      category: 'all',
      stockStatus: 'all'
    });
    setFilterOpen(false);
    setCurrentPage(1);
    loadProducts();
  };

  // Handle sorting column clicks
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

  // Handle inventory updates (for child components)
  const handleInventoryUpdate = (updatedProduct, message) => {
    // Update the local product data
    const updatedProducts = products.map(p => {
      if (p.id === updatedProduct.id) {
        return { ...p, stockQuantity: updatedProduct.stockQuantity };
      }
      return p;
    });
    
    setProducts(updatedProducts);
    setSuccessMessage(message || `Updated inventory for ${updatedProduct.name}`);
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
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
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md w-full md:w-64 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
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
        {successMessage && <SuccessAlert message={successMessage} />}

        {/* Filter panel */}
        <InventoryTableFilters 
          isOpen={filterOpen}
          filters={filters}
          setFilters={setFilters}
          categories={[...new Set(products.map(product => product.categoryName))].filter(Boolean)}
          onApplyFilters={handleFilter}
          onClearFilters={clearFilters}
        />
      </div>

      {/* Product Table */}
      {loading ? (
        <div className="flex justify-center items-center p-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-400">Loading products...</span>
        </div>
      ) : error ? (
        <div className="p-5 text-center text-red-500 flex justify-center items-center">
          <FiAlertCircle className="mr-2" />
          {error}
        </div>
      ) : products.length === 0 ? (
        <div className="p-10 text-center text-gray-500 dark:text-gray-400">
          <div className="mx-auto h-16 w-16 mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <FiPackage className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-lg font-medium">No products found</p>
          <p className="mt-1">Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <InventoryTableHeader 
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
          <InventoryList 
            products={products}
            onViewHistory={onViewHistory}
            onInventoryUpdate={handleInventoryUpdate}
            storeId={storeId}
          />
        </div>
      )}

      {/* Pagination */}
      {!loading && products.length > 0 && (
        <InventoryPagination 
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default ProductInventoryTable;