import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  FiPlus, 
  FiMoreVertical, 
  FiEdit2, 
  FiTrash2,
  FiUpload,
  FiImage,
  FiChevronDown,
  FiChevronRight,
  FiTag,
  FiSearch
} from 'react-icons/fi';
import api from '../../api/config';

// Utility Imports
import { formatCurrency } from '../../utils/currencyUtils';
import { generateMockProducts } from '../../utils/mock-data-utils';
import { getCategoryBreadcrumb } from '../../utils/category-image-utils';

// UI Component Imports
import Table from '../../components/ui/Table';
import FilterPanel from '../../components/ui/FilterPanel';
import { EmptyStates } from '../../utils/loading-error-states';
import ProductImportExport from '../importexport/ProductImportExport';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/Modal';

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
  const [filterOpen, setFilterOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});

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
  }, [storeId]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (searchTerm) params.set('search', searchTerm);
    if (filters.status !== 'all') params.set('status', filters.status);
    if (filters.minPrice) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
    if (filters.category !== 'all') params.set('category', filters.category);
    if (filters.inStock !== 'all') params.set('inStock', filters.inStock);
    
    setSearchParams(params, { replace: true });
  }, [filters, searchTerm]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filters.status !== 'all') params.append('status', filters.status);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.category !== 'all') params.append('categoryId', filters.category);
      if (filters.inStock === 'true') params.append('inStock', true);
      
      const response = await api.get(`/products/store/${storeId}?${params}`);
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
      
      // For development, use mock data as fallback
      if (process.env.NODE_ENV === 'development') {
        const mockProducts = generateMockProducts(10);
        setProducts(mockProducts);
      }
      
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get(`/categories/store/${storeId}`);
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
      
      // For development, use mock data
      if (process.env.NODE_ENV === 'development') {
        const mockCategories = [
          {
            id: 1,
            name: 'Spicy',
            productCount: 12,
            status: 'Active',
            image: '/api/placeholder/50/50?text=Spicy'
          },
          {
            id: 2,
            name: 'Sweets',
            productCount: 24,
            status: 'Active',
            image: '/api/placeholder/50/50?text=Sweets'
          },
          {
            id: 3,
            name: 'Make On Order',
            productCount: 8,
            status: 'Active',
            image: '/api/placeholder/50/50?text=OnOrder'
          },
          {
            id: 4,
            name: 'Traditional',
            parentId: 2,
            productCount: 15,
            status: 'Active',
            image: '/api/placeholder/50/50?text=Trad'
          },
          {
            id: 5,
            name: 'Modern',
            parentId: 2,
            productCount: 9,
            status: 'Active',
            image: '/api/placeholder/50/50?text=Modern'
          },
          {
            id: 6,
            name: 'Seasonal',
            productCount: 6,
            status: 'Inactive',
            image: '/api/placeholder/50/50?text=Season'
          },
          {
            id: 7,
            name: 'Dry Fruits',
            productCount: 14,
            status: 'Active',
            image: '/api/placeholder/50/50?text=DryFr'
          }
        ];
        setCategories(mockCategories);
      }
    }
  };

  const fetchCategoryHierarchy = async () => {
    try {
      const response = await api.get(`/categories/store/${storeId}/hierarchy`);
      setCategoryHierarchy(response.data);
    } catch (err) {
      console.error('Error fetching category hierarchy:', err);
      
      // For development, create a mock hierarchy based on flat categories
      if (process.env.NODE_ENV === 'development') {
        setTimeout(() => {
          // Build hierarchy from flat categories
          const buildHierarchy = (cats, parentId = null) => {
            const children = cats.filter(cat => cat.parentId === parentId);
            return children.map(child => ({
              ...child,
              children: buildHierarchy(cats, child.id)
            }));
          };
          
          const mockHierarchy = buildHierarchy(categories);
          setCategoryHierarchy(mockHierarchy);
        }, 500);
      }
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

  // Recursively build category options for filter
  const buildCategoryOptions = (categories, level = 0, result = []) => {
    if (!categories || !Array.isArray(categories)) return result;
    
    categories.forEach(category => {
      // Add this category
      result.push({
        value: category.id.toString(),
        label: `${Array(level).fill('\u00A0\u00A0').join('')}${level > 0 ? '↳ ' : ''}${category.name}`,
        level
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
    
    // Get category counts from products
    const categoryCounts = {};
    products.forEach(product => {
      const categoryId = product.category?.id || product.categoryId;
      if (categoryId) {
        categoryCounts[categoryId] = (categoryCounts[categoryId] || 0) + 1;
      }
    });
    
    // Add has-children flag to categories
    const categoriesWithHasChildren = categoryHierarchy.map(category => {
      return {
        ...category,
        hasChildren: category.children && category.children.length > 0,
        count: categoryCounts[category.id] || 0
      };
    });
    
    // Build hierarchical options
    return [...options, ...buildCategoryOptions(categoriesWithHasChildren)];
  };

  // Filter Configuration
  const filterConfig = {
    status: {
      type: 'select',
      label: 'Status',
      value: filters.status,
      options: [
        { value: 'all', label: 'All Products' },
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
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
    fetchProducts();
  };

  // Apply filters when filter panel is closed
  const applyFilters = () => {
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
    setFilterOpen(false);
  };

  // Handle product deletion
  const handleDeleteProduct = (product) => {
    setProductToDelete(product);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteProduct = async () => {
    try {
      await api.delete(`/products/${productToDelete.id}`);
      
      // Update local state to remove the product
      setProducts(products.filter(p => p.id !== productToDelete.id));
      
      setShowDeleteConfirm(false);
      setProductToDelete(null);
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Failed to delete product. Please try again.');
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
          {renderProductImage(row.image, row.name)}
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

  // Handle bulk actions
  const handleBulkAction = (action) => {
    if (selectedProducts.length === 0) {
      alert('Please select at least one product');
      return;
    }
    
    switch (action) {
      case 'delete':
        // Implement bulk delete
        break;
      case 'activate':
        // Implement bulk activate
        break;
      case 'deactivate':
        // Implement bulk deactivate
        break;
      default:
        break;
    }
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h1>
        <div className="flex space-x-2">
          <Button 
            variant="secondary" 
            onClick={() => setShowImportExport(!showImportExport)}
          >
            <FiUpload className="mr-2" /> Import/Export
          </Button>
          <Button 
            variant="primary" 
            onClick={() => navigate(`/store-dashboard/${storeId}/all-products/add-product`)}
          >
            <FiPlus className="mr-2" /> Add Product
          </Button>
        </div>
      </div>

      {showImportExport && (
        <div className="mb-6">
          <ProductImportExport storeId={storeId} />
        </div>
      )}

      {/* Bulk actions bar */}
      {selectedProducts.length > 0 && (
        <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-3 mb-4 flex items-center justify-between">
          <div className="text-primary-800 dark:text-primary-300 font-medium">
            {selectedProducts.length} products selected
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={() => handleBulkAction('activate')}
            >
              Activate
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={() => handleBulkAction('deactivate')}
            >
              Deactivate
            </Button>
            <Button 
              variant="danger" 
              size="sm" 
              onClick={() => handleBulkAction('delete')}
            >
              Delete Selected
            </Button>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 space-y-4 md:space-y-0">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <form onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}>
            <input 
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </form>
        </div>
        <Button 
          variant="secondary" 
          onClick={() => setFilterOpen(!filterOpen)}
          className="ml-auto"
        >
          <FiMoreVertical className="mr-2" /> Filters
        </Button>
      </div>

      <FilterPanel
        isOpen={filterOpen}
        filters={filterConfig}
        onFilterChange={handleFilterChange}
        onApply={applyFilters}
        onClear={clearFilters}
      />

      <Table
        columns={columns}
        data={products}
        isLoading={loading}
        emptyState={
          <EmptyStates.Products 
            onAction={() => navigate(`/store-dashboard/${storeId}/all-products/add-product`)}
          />
        }
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDeleteProduct}
        title="Delete Product"
        message={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        confirmVariant="danger"
      />
    </div>
  );
};

export default ProductList;