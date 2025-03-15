import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  FiPlus, 
  FiMoreVertical, 
  FiEdit2, 
  FiTrash2,
  FiUpload,
  FiImage
} from 'react-icons/fi';
import api from '../../api/config';

// Utility Imports
import { formatCurrency } from '../../utils/currencyUtils';
import { generateMockProducts } from '../../utils/mock-data-utils';

// UI Component Imports
import Table from '../../components/ui/Table';
import FilterPanel from '../../components/ui/FilterPanel';
import { EmptyStates } from '../../utils/loading-error-states';
import ProductImportExport from '../importexport/ProductImportExport';
import { Button } from '../../components/ui/Button';

const ProductList = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();

  // State Management
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showImportExport, setShowImportExport] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    minPrice: '',
    maxPrice: '',
    category: ''
  });

  // Fetch Products
  useEffect(() => {
    fetchProducts();
  }, [storeId]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // For development, use mock data
      const response = await api.get(`/products/store/${storeId}`);
      setProducts(response.data);
      // For development, use mock data
      // const mockProducts = generateMockProducts(10);
      // setProducts(mockProducts);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
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
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
      ]
    },
    priceRange: {
      type: 'number-range',
      label: 'Price Range',
      from: filters.minPrice,
      to: filters.maxPrice
    },
    category: {
      type: 'select',
      label: 'Category',
      value: filters.category,
      options: [
        { value: 'sweets', label: 'Sweets' },
        { value: 'snacks', label: 'Snacks' },
        { value: 'dryfruits', label: 'Dry Fruits' }
      ]
    }
  };

  // Handle Filter Changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
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
        />
      )
    },
    {
      key: 'name',
      title: 'Product Name',
      render: (row) => (
        <div className="flex items-center">
          {renderProductImage(row.image, row.name)}
          <span className="ml-3">{row.name}</span>
        </div>
      )
    },
    {
      key: 'price',
      title: 'Price',
      render: (row) => formatCurrency(row.price)
    },
    {
      key: 'inventory',
      title: 'Inventory',
      render: (row) => (
        <span className={`
          ${row.inventory === 'Unlimited' ? 'text-green-600 dark:text-green-400' : 
            row.inventory === 'Limited' ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}
        `}>
          {row.inventory}
        </span>
      )
    },
    {
      key: 'status',
      title: 'Status',
      render: (row) => (
        <span className={`
          px-2 py-1 rounded-full text-xs font-medium
          ${row.status === 'Active' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'}
        `}>
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
          >
            <FiEdit2 className="mr-1" /> Edit
          </Button>
          <Button 
            variant="danger" 
            size="sm"
            onClick={() => {/* Delete logic */}}
          >
            <FiTrash2 className="mr-1" /> Delete
          </Button>
        </div>
      )
    }
  ];

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

      <div className="flex mb-4 space-x-2">
        <input 
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 input"
        />
        <Button 
          variant="secondary" 
          onClick={() => setFilterOpen(!filterOpen)}
        >
          <FiMoreVertical className="mr-2" /> Filters
        </Button>
      </div>

      <FilterPanel
        isOpen={filterOpen}
        filters={filterConfig}
        onFilterChange={handleFilterChange}
        onApply={fetchProducts}
        onClear={() => {
          setFilters({
            status: 'all',
            minPrice: '',
            maxPrice: '',
            category: ''
          });
        }}
      />

      <Table
        columns={columns}
        data={products}
        isLoading={loading}
        emptyState={
          <EmptyStates.Products 
            onAction={() => navigate(`/store-dashboard/${storeId}/add-product`)}
          />
        }
      />
    </div>
  );
};

export default ProductList;