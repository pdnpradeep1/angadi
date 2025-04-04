import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  FiPlus, 
  FiEdit2, 
  FiTrash2,
  FiUpload,
  FiImage,
  FiTag,
  FiCheck,
  FiX,
  FiChevronDown,
  FiChevronRight
} from 'react-icons/fi';
import api from '../../api/config';

// Utility Imports
import { formatCurrency } from '../../utils/currencyUtils';
import { getCategoryBreadcrumb } from '../../utils/category-image-utils';

// UI Component Imports
import GenericDataList from '../../components/common/GenericDataList';
import { EmptyStates } from '../../utils/loading-error-states';
import ProductImportExport from '../importexport/ProductImportExport';
import { Button } from '../../components/ui/Button';
import Pagination from '../../components/ui/Pagination';
import ImportFormatInfo from '../../components/products/ImportFormatInfo';
// Import the ShopLoader component
import ShopLoader from '../../components/loaders/ShopLoader';

const ProductList = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // State Management
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryHierarchy, setCategoryHierarchy] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showImportExport, setShowImportExport] = useState(false);
  const [showFormatInfo, setShowFormatInfo] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [viewMode, setViewMode] = useState('list');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 0); // Backend uses 0-based indexing
  const [pageSize, setPageSize] = useState(parseInt(searchParams.get('size')) || 10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Filters state
  const [filters, setFilters] = useState({
    status: searchParams.get('status') || 'all',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    category: searchParams.get('category') || 'all',
    inStock: searchParams.get('inStock') || 'all'
  });

  // Fetch Products and Categories
  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchCategoryHierarchy();
    
    // Initialize expanded state from URL
    if (searchParams.get('category')) {
      const categoryId = searchParams.get('category');
      // Expand all parent categories of the selected category
      expandParentCategories(categoryId);
    }
  }, [storeId, currentPage, pageSize, searchParams]); // Add dependencies to reload when they change

  // Update URL when filters or pagination change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (searchTerm) params.set('search', searchTerm);
    if (filters.status !== 'all') params.set('status', filters.status);
    if (filters.minPrice) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
    if (filters.category !== 'all') params.set('category', filters.category);
    if (filters.inStock !== 'all') params.set('inStock', filters.inStock);
    
    // Add pagination params (backend uses 0-based indexing)
    params.set('page', currentPage.toString());
    params.set('size', pageSize.toString());
    
    setSearchParams(params, { replace: true });
  }, [filters, searchTerm, currentPage, pageSize]);

  // Updated fetchProducts function to work with backend pagination
  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams();
      
      // Add search term if provided
      if (searchTerm) params.append('search', searchTerm);
      
      // Add filters if they are not the default values
      if (filters.status !== 'all') params.append('status', filters.status);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.category !== 'all') params.append('categoryId', filters.category);
      if (filters.inStock === 'true') params.append('inStock', true);
      else if (filters.inStock === 'false') params.append('inStock', false);
      
      // Add pagination parameters (backend uses 0-based indexing)
      params.append('page', currentPage.toString());
      params.append('size', pageSize.toString());
      params.append('sort', 'createdAt,desc'); // Sort by creation date, newest first
      
      // Make API request
      const response = await api.get(`/products/store/${storeId}?${params}`);
      
      // Check if the response is a Spring Page object
      if (response.data && 
          response.data.content !== undefined && 
          response.data.totalElements !== undefined && 
          response.data.totalPages !== undefined) {
        
        // Extract data from Spring Page response
        setProducts(response.data.content);
        setTotalPages(response.data.totalPages);
        setTotalItems(response.data.totalElements);
        
      } else if (Array.isArray(response.data)) {
        // Fallback for array response
        console.warn('API returned array instead of Page. Pagination may not work correctly.');
        setProducts(response.data);
        setTotalPages(Math.ceil(response.data.length / pageSize));
        setTotalItems(response.data.length);
      } else {
        console.error('Unexpected API response format:', response.data);
        setProducts([]);
        setTotalPages(1);
        setTotalItems(0);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
      setProducts([]);
      setTotalPages(1);
      setTotalItems(0);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get(`/categories/store/${storeId}`);
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategories([]);
    }
  };

  const fetchCategoryHierarchy = async () => {
    try {
      const response = await api.get(`/categories/store/${storeId}/hierarchy`);
      setCategoryHierarchy(response.data);
    } catch (err) {
      console.error('Error fetching category hierarchy:', err);
      setCategoryHierarchy([]);
    }
  };

  // Expand all parent categories for a given category
  const expandParentCategories = (categoryId) => {
    // Convert to number if it's a string
    const catId = typeof categoryId === 'string' ? parseInt(categoryId, 10) : categoryId;
    
    // Find the breadcrumb path to this category
    const path = getCategoryBreadcrumb(categoryHierarchy, catId);
    
    // Expand all categories in the path except the last one (which is the selected category)
    const newExpandedState = {...expandedCategories};
    path.forEach((cat, index) => {
      if (index < path.length - 1) {
        newExpandedState[cat.id] = true;
      }
    });
    
    setExpandedCategories(newExpandedState);
  };

  // Toggle expanded state for a category
  const toggleCategoryExpanded = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  // Handle page change - Note the +1 conversion since backend uses 0-based indexing but UI uses 1-based
  const handlePageChange = (page) => {
    // Convert from 1-based (UI) to 0-based (backend)
    setCurrentPage(page - 1);
    // Scroll to top when changing page
    window.scrollTo(0, 0);
  };

  // Handle page size change
  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(0); // Reset to first page when changing page size
  };

  // Recursively build category options for filter
  const buildCategoryOptions = (categories, level = 0, result = []) => {
    if (!categories || !Array.isArray(categories)) return result;
    
    categories.forEach(category => {
      // Add this category
      result.push({
        value: category.id.toString(),
        label: `${Array(level).fill('\u00A0\u00A0').join('')}${level > 0 ? '↳ ' : ''}${category.name}`,
        level,
        hasChildren: category.children && category.children.length > 0,
        count: category.productCount
      });
      
      // Add its children if expanded
      if (category.children && category.children.length > 0 && expandedCategories[category.id]) {
        buildCategoryOptions(category.children, level + 1, result);
      }
    });
    
    return result;
  };

  // Render category option with toggle button
  const renderCategoryOption = (option, isSelected) => {
    const hasChildren = option.hasChildren;
    const isExpanded = expandedCategories[option.value];
    
    return (
      <div className="flex items-center">
        {hasChildren && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleCategoryExpanded(option.value);
            }}
            className="mr-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
          >
            {isExpanded ? <FiChevronDown size={14} /> : <FiChevronRight size={14} />}
          </button>
        )}
        <span className={`flex-1 ${isSelected ? 'font-bold' : ''}`}>
          {option.label}
        </span>
        {option.count && (
          <span className="ml-2 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full px-2 py-1">
            {option.count}
          </span>
        )}
      </div>
    );
  };

  // Prepare category options with product counts
  const getCategoryOptions = () => {
    // Start with top-level options
    const options = [
      { value: 'all', label: 'All Categories' },
    ];
    
    // Add has-children flag to categories
    const categoriesWithHasChildren = categoryHierarchy.map(category => {
      return {
        ...category,
        hasChildren: category.children && category.children.length > 0,
      };
    });
    
    // Build hierarchical options
    return [...options, ...buildCategoryOptions(categoriesWithHasChildren)];
  };
  
  const handleSelectAllItems = (itemIds) => {
    if (itemIds.length === 0) {
      // Deselect all
      setSelectedProducts([]);
    } else {
      // Select all
      setSelectedProducts(itemIds);
    }
  };

  // Filter Configuration
  const filterConfig = {
    status: {
      type: 'select',
      label: 'Status',
      value: filters.status,
      options: [
        { value: 'all', label: 'All Products' },
        { value: 'Active', label: 'Active' },
        { value: 'Inactive', label: 'Inactive' }
      ]
    },
    category: {
      type: 'select',
      label: 'Category',
      value: filters.category,
      options: getCategoryOptions(),
      renderOption: renderCategoryOption
    },
    priceRange: {
      type: 'number-range',
      label: 'Price Range',
      from: filters.minPrice,
      to: filters.maxPrice
    },
    inStock: {
      type: 'select',
      label: 'Inventory',
      value: filters.inStock,
      options: [
        { value: 'all', label: 'All Products' },
        { value: 'true', label: 'In Stock' },
        { value: 'false', label: 'Out of Stock' }
      ]
    }
  };

  // Handle Filter Changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => {
      // Special handling for category filter
      if (key === 'category' && value !== 'all') {
        // Expand parent categories for this category
        expandParentCategories(value);
      }
      
      return { ...prev, [key]: value };
    });
  };

  // Apply filters on search
  const handleSearch = () => {
    setCurrentPage(0); // Reset to first page when applying search
    fetchProducts();
  };

  // Apply filters when filter panel is closed
  const applyFilters = () => {
    setCurrentPage(0); // Reset to first page when applying filters
    fetchProducts();
    setFilterOpen(false);
  };

  // Reset filters
  const clearFilters = () => {
    setFilters({
      status: 'all',
      minPrice: '',
      maxPrice: '',
      category: 'all',
      inStock: 'all'
    });
    setSearchTerm('');
    setCurrentPage(0); // Reset to first page when clearing filters
    setFilterOpen(false);
  };

  // Handle product deletion
  const handleDeleteProduct = async (product) => {
    try {
      // Handle bulk delete
      if (product.id === 'bulk') {
        // Call API for each item in the bulk selection
        await Promise.all(
          product.items.map(id => api.delete(`/products/${id}`))
        );
        
        // Update local state to remove deleted products
        setProducts(products.filter(p => !product.items.includes(p.id)));
        setSelectedProducts([]);
      } else {
        // Single delete
        await api.delete(`/products/${product.id}`);
        setProducts(products.filter(p => p.id !== product.id));
      }
      
      // Refresh product list after deletion
      fetchProducts();
      
    } catch (err) {
      console.error('Error deleting product(s):', err);
      setError('Failed to delete product(s). Please try again.');
    }
  };

  // Render product image with fallback
  const renderProductImage = (imageUrl, productName) => {
    if (!imageUrl) {
      return (
        <div className="h-10 w-10 rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <FiImage className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        </div>
      );
    }
    
    return (
      <img 
        src={imageUrl}
        alt={productName}
        className="h-10 w-10 rounded-md object-cover"
        onError={(e) => {
          e.target.onerror = null; // Prevent infinite loop
          e.target.parentNode.innerHTML = `
            <div class="h-10 w-10 rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="2" width="20" height="20" rx="2" ry="2"></rect>
                <circle cx="12" cy="12" r="0"></circle>
                <path d="M8 18 L16 18"></path>
                <path d="M12 4 L12 6"></path>
              </svg>
            </div>
          `;
        }}
      />
    );
  };

  // Get category name with breadcrumb from product
  const getProductCategoryDisplay = (product) => {
    const categoryId = product.category?.id || product.categoryId;
    if (!categoryId) return "Uncategorized";
    
    // Find breadcrumb for this category
    const breadcrumb = getCategoryBreadcrumb(categoryHierarchy, categoryId);
    
    if (breadcrumb.length === 0) {
      // Fallback to flat category name
      const category = categories.find(c => c.id === categoryId);
      return category ? category.name : "Uncategorized";
    }
    
    // Show breadcrumb path
    return breadcrumb.map(cat => cat.name).join(' > ');
  };

  // Table Columns Definition
  const columns = [
    {
      key: 'select',
      title: '',
      render: (row) => (
        <input
          type="checkbox"
          checked={selectedProducts.includes(row.id)}
          onChange={() => {
            setSelectedProducts(prev => 
              prev.includes(row.id) 
                ? prev.filter(id => id !== row.id)
                : [...prev, row.id]
            );
          }}
          className="h-4 w-4 text-primary-600 border-gray-300 rounded"
        />
      )
    },
    {
      key: 'name',
      title: 'Product Name',
      render: (row) => (
        <div className="flex items-center">
          {renderProductImage(row.image || row.imageUrl, row.name)}
          <div className="ml-3">
            <span className="font-medium">{row.name}</span>
            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1">
              <FiTag className="mr-1" size={12} /> 
              {getProductCategoryDisplay(row)}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'price',
      title: 'Price',
      render: (row) => (
        <div>
          <div className="font-medium">{formatCurrency(row.price)}</div>
          {row.originalPrice && row.originalPrice > row.price && (
            <div className="text-xs text-gray-500 dark:text-gray-400 line-through">
              {formatCurrency(row.originalPrice)}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'inventory',
      title: 'Inventory',
      render: (row) => {
        let inventoryStatus;
        let statusClass;
        
        if (row.stockQuantity === -1 || row.stockQuantity === 'Unlimited') {
          inventoryStatus = 'Unlimited';
          statusClass = 'text-green-600 dark:text-green-400';
        } else if (row.stockQuantity > row.lowStockThreshold || row.stockQuantity > 5) {
          inventoryStatus = 'In Stock';
          statusClass = 'text-green-600 dark:text-green-400';
        } else if (row.stockQuantity > 0) {
          inventoryStatus = 'Low Stock';
          statusClass = 'text-yellow-600 dark:text-yellow-400';
        } else {
          inventoryStatus = 'Out of Stock';
          statusClass = 'text-red-600 dark:text-red-400';
        }
        
        return (
          <div>
            <span className={statusClass}>{inventoryStatus}</span>
            {row.stockQuantity !== -1 && row.stockQuantity !== 'Unlimited' && (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {row.stockQuantity} units
              </div>
            )}
          </div>
        );
      }
    },
    {
      key: 'status',
      title: 'Status',
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium
          ${row.status === 'Active' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'}`}
        >
          {row.status}
        </span>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (row) => (
        <div className="flex items-center space-x-2">
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => navigate(`/store-dashboard/${storeId}/edit-product/${row.id}`)}
            title="Edit product"
          >
            <FiEdit2 className="mr-1" size={14} /> Edit
          </Button>
          <Button 
            variant="danger" 
            size="sm"
            onClick={() => handleDeleteProduct(row)}
            title="Delete product"
          >
            <FiTrash2 className="mr-1" size={14} /> Delete
          </Button>
        </div>
      )
    }
  ];

  // Bulk actions configuration
  const bulkActions = [
    {
      type: 'activate',
      label: 'Activate',
      variant: 'secondary',
      icon: <FiCheck className="mr-1" size={14} />,
      handler: (selectedIds) => {
        // Implementation for bulk activate
        console.log('Bulk activate:', selectedIds);
      }
    },
    {
      type: 'deactivate',
      label: 'Deactivate',
      variant: 'secondary',
      icon: <FiX className="mr-1" size={14} />,
      handler: (selectedIds) => {
        // Implementation for bulk deactivate
        console.log('Bulk deactivate:', selectedIds);
      }
    },
    {
      type: 'delete',
      label: 'Delete',
      variant: 'danger',
      icon: <FiTrash2 className="mr-1" size={14} />
      // No handler needed, will use the confirmation dialog
    }
  ];

  // Additional action buttons for the header
  const actionButtons = [
    {
      label: 'Import/Export',
      icon: <FiUpload />,
      variant: 'secondary',
      onClick: () => setShowImportExport(!showImportExport)
    }
  ];

  // Render a grid view (alternative to table view)
  const renderGridView = (data) => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        {data.map(product => (
          <div 
            key={product.id} 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="p-4">
              <div className="flex items-center mb-2">
                {renderProductImage(product.image || product.imageUrl, product.name)}
                <div className="ml-3 flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {getProductCategoryDisplay(product)}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={selectedProducts.includes(product.id)}
                  onChange={() => {
                    setSelectedProducts(prev => 
                      prev.includes(product.id) 
                        ? prev.filter(id => id !== product.id)
                        : [...prev, product.id]
                    );
                  }}
                  className="h-4 w-4 text-primary-600 border-gray-300 rounded ml-2"
                />
              </div>
              
              <div className="flex justify-between items-center mt-3">
                <div>
                  <div className="font-medium">{formatCurrency(product.price)}</div>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 line-through">
                      {formatCurrency(product.originalPrice)}
                    </div>
                  )}
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium
                  ${product.status === 'Active' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'}`}
                >
                  {product.status}
                </span>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => navigate(`/store-dashboard/${storeId}/edit-product/${product.id}`)}
                >
                  <FiEdit2 size={14} />
                </Button>
                <Button 
                  variant="danger" 
                  size="sm"
                  onClick={() => handleDeleteProduct(product)}
                >
                  <FiTrash2 size={14} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Pagination controls - Convert from 0-based (backend) to 1-based (UI)
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <Pagination 
        currentPage={currentPage + 1} // Convert 0-based to 1-based for display
        totalPages={totalPages}
        onPageChange={handlePageChange}
        maxVisiblePages={5}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
        pageSizeOptions={[10, 25, 50, 100]}
      />
    );
  };

  return (
    <>
      {/* Show ShopLoader when loading */}
      {loading && (
        <ShopLoader 
          size="lg" 
          message="Stocking your inventory..." 
          fullPage={true} 
        />
      )}

      {showImportExport && (
        <div className="mb-6">
          <ProductImportExport storeId={storeId} />
        </div>
      )}
      
      {!loading && (
        <GenericDataList
          title="Products"
          data={products}
          columns={columns}
          filters={filterConfig}
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          onApplyFilters={applyFilters}
          onClearFilters={clearFilters}
          onDelete={handleDeleteProduct}
          onAdd={() => navigate(`/store-dashboard/${storeId}/all-products/add-product`)}
          loading={loading}
          error={error}
          emptyState={
            <EmptyStates.Products 
              onAction={() => navigate(`/store-dashboard/${storeId}/all-products/add-product`)}
            />
          }
          actionButtons={actionButtons}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          showViewModeToggle={true}
          renderGridView={renderGridView}
          bulkActions={bulkActions}
          selectedItems={selectedProducts}
          onItemSelect={(id) => {
            setSelectedProducts(prev => 
              prev.includes(id) 
                ? prev.filter(itemId => itemId !== id)
                : [...prev, id]
            );
          }}
          onSelectAll={handleSelectAllItems}
          filterOpen={filterOpen}
          setFilterOpen={setFilterOpen}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          entityName="product"
          pagination={renderPagination()}
        />
      )}
    </>
  );
};

export default ProductList;