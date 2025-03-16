import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FiEdit2, 
  FiEye, 
  FiTrash2,
  FiPlus,
  FiList,
  FiGrid,
  FiSearch,
  FiFilter,
  FiAlertCircle,
  FiChevronDown,
  FiChevronRight
} from 'react-icons/fi';
import { apiService } from '../../api/config';
import { renderCategoryImage, getCategoryColor } from '../../utils/category-image-utils';
import AddCategoryModal from './AddCategoryModal';
import EditCategoryModal from './EditCategoryModal';
import CategoryDetailsModal from './CategoryDetailsModal';
import ReorderCategoriesModal from './ReorderCategoriesModal';
import ConfirmDialog from '../../components/ui/Modal';

const CategoriesPage = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();

  // State Management
  const [categories, setCategories] = useState([]);
  const [categoryHierarchy, setCategoryHierarchy] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const [categoryToView, setCategoryToView] = useState(null);
  const [showReorderModal, setShowReorderModal] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'hierarchy'
  const [expandedCategories, setExpandedCategories] = useState({});
  const [filters, setFilters] = useState({
    status: 'all',
    parentId: 'all'
  });

  // Fetch Categories
  useEffect(() => {
    fetchCategories();
    fetchCategoryHierarchy();
  }, [storeId]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await apiService.get(`/categories/store/${storeId}`);
      setCategories(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories. Please try again.');
      
      // For development, use mock data as fallback
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
      
      setLoading(false);
    }
  };

  const fetchCategoryHierarchy = async () => {
    try {
      const response = await apiService.get(`/categories/store/${storeId}/hierarchy`);
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

  // Get available parent categories for filtering
  const getParentCategories = () => {
    // Find all categories that have children
    const parentIds = new Set(
      categories
        .filter(cat => cat.parentId)
        .map(cat => cat.parentId)
    );
    
    return categories
      .filter(cat => parentIds.has(cat.id) || !cat.parentId)
      .map(cat => ({
        value: cat.id.toString(),
        label: cat.name
      }));
  };

  // Filter Configuration
  const filterConfig = {
    status: {
      type: 'select',
      label: 'Status',
      value: filters.status,
      options: [
        { value: 'all', label: 'All Categories' },
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
      ]
    },
    parentId: {
      type: 'select',
      label: 'Parent Category',
      value: filters.parentId,
      options: [
        { value: 'all', label: 'All Categories' },
        { value: 'root', label: 'Root Categories Only' },
        ...getParentCategories()
      ]
    }
  };

  // Handle Filter Changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Apply filters to categories
  const applyFilters = (categoriesList) => {
    return categoriesList.filter(category => {
      // Status filter
      if (filters.status !== 'all' && 
          category.status.toLowerCase() !== filters.status.toLowerCase()) {
        return false;
      }
      
      // Parent filter
      if (filters.parentId !== 'all') {
        if (filters.parentId === 'root' && category.parentId) {
          return false;
        } else if (filters.parentId !== 'root' && 
                  category.parentId !== parseInt(filters.parentId)) {
          return false;
        }
      }
      
      // Search term
      if (searchTerm && 
          !category.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  };

  // Handle category deletion
  const handleDeleteCategory = (category) => {
    setCategoryToDelete(category);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteCategory = async () => {
    try {
      await apiService.delete(`/categories/${categoryToDelete.id}`);
      
      // Update local state to remove the category
      setCategories(categories.filter(c => c.id !== categoryToDelete.id));
      
      // Also refresh hierarchy
      fetchCategoryHierarchy();
      
      setShowDeleteConfirm(false);
      setCategoryToDelete(null);
    } catch (err) {
      console.error('Error deleting category:', err);
      setError('Failed to delete category. Please try again.');
    }
  };

  // Handle reordering categories
  const handleReorderCategories = () => {
    setShowReorderModal(true);
  };
  
  const saveNewCategoryOrder = async (reorderedCategories) => {
    try {
      // Prepare data for API - format depends on your backend
      const orderData = reorderedCategories.map((category, index) => ({
        id: category.id,
        order: index
      }));
      
      await apiService.put(`/categories/store/${storeId}/order`, orderData);
      
      // Update the local state with the new order
      setCategories(reorderedCategories);
      
      // Refresh hierarchy after reordering
      fetchCategoryHierarchy();
    } catch (err) {
      console.error('Error saving category order:', err);
      setError('Failed to save category order. Please try again.');
    }
  };

  // Handle adding a new category
  const handleAddCategory = () => {
    setShowAddModal(true);
  };
  
  const handleCategoryAdded = (newCategory) => {
    setCategories(prevCategories => [newCategory, ...prevCategories]);
    
    // Refresh hierarchy after adding
    fetchCategoryHierarchy();
  };

  // Handle editing a category
  const handleEditCategory = (category) => {
    setCategoryToEdit(category);
    setShowEditModal(true);
  };
  
  const handleCategoryUpdated = (updatedCategory) => {
    setCategories(prevCategories => 
      prevCategories.map(category => 
        category.id === updatedCategory.id ? updatedCategory : category
      )
    );
    
    // Refresh hierarchy after updating
    fetchCategoryHierarchy();
  };

  // Handle viewing category details
  const handleViewCategory = (category) => {
    setCategoryToView(category);
    setShowDetailsModal(true);
  };

  // Toggle expanded state for a category in hierarchy view
  const toggleCategoryExpanded = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  // Check if a category has children in the flat categories array
  const hasChildren = (categoryId) => {
    return categories.some(cat => cat.parentId === categoryId);
  };

  // Find all children of a category (recursive)
  const findAllChildren = (categoryId) => {
    const children = categories.filter(cat => cat.parentId === categoryId);
    let allChildren = [...children];
    
    children.forEach(child => {
      allChildren = [...allChildren, ...findAllChildren(child.id)];
    });
    
    return allChildren;
  };

  // Handle category selection
  const handleCategorySelection = (categoryId) => {
    const isSelected = selectedCategories.includes(categoryId);
    
    if (isSelected) {
      // Deselect this category and all its children
      const childrenIds = findAllChildren(categoryId).map(c => c.id);
      setSelectedCategories(prev => 
        prev.filter(id => id !== categoryId && !childrenIds.includes(id))
      );
    } else {
      // Select this category and all its children
      const childrenIds = findAllChildren(categoryId).map(c => c.id);
      setSelectedCategories(prev => [...prev, categoryId, ...childrenIds]);
    }
  };

  // Table Columns Definition
  const columns = [
    {
      key: 'select',
      title: '',
      render: (row) => (
        <input
          type="checkbox"
          checked={selectedCategories.includes(row.id)}
          onChange={() => {
            handleCategorySelection(row.id);
          }}
          className="h-4 w-4 text-primary-600 border-gray-300 rounded"
        />
      )
    },
    {
      key: 'name',
      title: 'Category',
      render: (row) => (
        <div className="flex items-center">
          {renderCategoryImage(row.image, row.name)}
          <div className="ml-3">
            <span className="font-medium">{row.name}</span>
            {row.parentId && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Parent: {categories.find(c => c.id === row.parentId)?.name || 'Unknown'}
              </div>
            )}
          </div>
        </div>
      )
    },
    {
      key: 'productCount',
      title: 'Products',
      render: (row) => {
        const colorInfo = getCategoryColor(row.name);
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorInfo.bg} ${colorInfo.text}`}>
            {row.productCount}
          </span>
        );
      }
    },
    {
      key: 'status',
      title: 'Status',
      render: (row) => (
        <div className="flex items-center">
          <span className={`relative inline-block h-3 w-3 rounded-full mr-2 ${
            row.status === 'Active' ? 'bg-green-400' : 'bg-red-400'
          }`}></span>
          <span>{row.status}</span>
        </div>
      )
    },
    {
      key: 'hasChildren',
      title: 'Type',
      render: (row) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {hasChildren(row.id) ? 'Parent' : 'Leaf'}
        </span>
      )
    },
    {
      key: 'actions',
      title: 'Action',
      render: (row) => (
        <div className="flex items-center space-x-2">
          <button 
            className="px-2 py-1 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-600"
            onClick={() => handleEditCategory(row)}
            title="Edit Category"
          >
            <FiEdit2 size={16} />
          </button>
          <button 
            className="px-2 py-1 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-600"
            onClick={() => handleViewCategory(row)}
            title="View Category Details"
          >
            <FiEye size={16} />
          </button>
          <button 
            className="px-2 py-1 bg-gray-100 text-red-600 dark:bg-gray-700 dark:text-red-400 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-600"
            onClick={() => handleDeleteCategory(row)}
            title="Delete Category"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  // Render a hierarchical category tree
  const renderCategoryTree = (categories) => {
    // Create a lookup map to efficiently find parents
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.id] = { ...cat, children: [] };
    });
    
    // Build the tree structure
    const rootCategories = [];
    categories.forEach(cat => {
      if (cat.parentId && categoryMap[cat.parentId]) {
        categoryMap[cat.parentId].children.push(categoryMap[cat.id]);
      } else {
        rootCategories.push(categoryMap[cat.id]);
      }
    });
    
    // Render the tree
    return (
      <div className="space-y-1">
        {renderCategoryNodes(rootCategories)}
      </div>
    );
  };

  // Recursively render category nodes
  const renderCategoryNodes = (nodes, level = 0) => {
    return nodes.map(node => {
      // Apply filters to this node
      if (filters.status !== 'all' && node.status.toLowerCase() !== filters.status.toLowerCase()) {
        return null;
      }
      
      if (searchTerm && !node.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return null;
      }
      
      const isExpanded = expandedCategories[node.id];
      const hasChildNodes = node.children && node.children.length > 0;
      const colorInfo = getCategoryColor(node.name);
      
      return (
        <div key={node.id} className="category-node">
          <div 
            className={`flex items-center p-3 ${
              level > 0 ? `ml-${level * 6}` : ''
            } hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-200 dark:border-gray-700`}
          >
            {/* Expand/collapse button for parents */}
            <div className="w-6 flex justify-center">
              <input
                type="checkbox"
                checked={selectedCategories.includes(node.id)}
                onChange={() => handleCategorySelection(node.id)}
                className="h-4 w-4 text-primary-600 border-gray-300 rounded"
              />
            </div>
            
            {/* Expand/collapse button */}
            <div className="w-6 flex justify-center">
              {hasChildNodes ? (
                <button
                  onClick={() => toggleCategoryExpanded(node.id)}
                  className="text-gray-500"
                >
                  {isExpanded ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />}
                </button>
              ) : (
                <span className="w-4"></span>
              )}
            </div>
            
            {/* Category image and name */}
            {renderCategoryImage(node.image, node.name, {
              className: "h-8 w-8 rounded-md mr-3"
            })}
            
            <span className="flex-grow font-medium text-gray-800 dark:text-white">
              {node.name}
            </span>
            
            {/* Product count */}
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorInfo.bg} ${colorInfo.text} mr-4`}>
              {node.productCount || 0}
            </span>
            
            {/* Status indicator */}
            <div className="flex items-center mr-4">
              <span className={`relative inline-block h-3 w-3 rounded-full mr-2 ${
                node.status === 'Active' ? 'bg-green-400' : 'bg-red-400'
              }`}></span>
              <span className="text-sm">{node.status}</span>
            </div>
            
            {/* Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleEditCategory(node)}
                className="p-1 text-gray-500 hover:text-primary-600 transition-colors"
                title="Edit Category"
              >
                <FiEdit2 size={16} />
              </button>
              <button
                onClick={() => handleViewCategory(node)}
                className="p-1 text-gray-500 hover:text-primary-600 transition-colors"
                title="View Category Details"
              >
                <FiEye size={16} />
              </button>
              <button
                onClick={() => handleDeleteCategory(node)}
                className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                title="Delete Category"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          </div>
          
          {/* Render children if expanded */}
          {hasChildNodes && isExpanded && renderCategoryNodes(node.children, level + 1)}
        </div>
      );
    }).filter(Boolean); // Filter out null nodes (non-matching filters)
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Categories</h1>
        <div className="flex space-x-2">
          <div className="flex rounded-md shadow-sm">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 text-sm font-medium ${
                viewMode === 'list'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              } rounded-l-md border border-gray-300 dark:border-gray-600 flex items-center`}
            >
              <FiList className="mr-1" /> List
            </button>
            <button
              onClick={() => setViewMode('hierarchy')}
              className={`px-3 py-2 text-sm font-medium ${
                viewMode === 'hierarchy'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              } rounded-r-md border border-gray-300 dark:border-gray-600 border-l-0 flex items-center`}
            >
              <FiGrid className="mr-1" /> Hierarchy
            </button>
          </div>
          <button 
            className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700"
            onClick={handleReorderCategories}
          >
            Reorder Categories
          </button>
          <button 
            className="px-4 py-2 bg-primary-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-primary-700"
            onClick={handleAddCategory}
          >
            <FiPlus className="mr-2 inline" /> Add New Category
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="relative flex-1 max-w-lg">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input 
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-3 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        <button 
          className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700"
          onClick={() => setFilterOpen(!filterOpen)}
        >
          <FiFilter className="mr-2 inline" /> Filter
        </button>
      </div>

      {filterOpen && (
        <div className="mb-6 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h3 className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">Filters</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              >
                <option value="all">All Categories</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Parent Category
              </label>
              <select
                value={filters.parentId}
                onChange={(e) => handleFilterChange('parentId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              >
                <option value="all">All Categories</option>
                <option value="root">Root Categories Only</option>
                {getParentCategories().map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex justify-end mt-4 space-x-2">
            <button
              onClick={() => {
                setFilters({ status: 'all', parentId: 'all' });
                setFilterOpen(false);
              }}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Clear
            </button>
            <button
              onClick={() => setFilterOpen(false)}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-md">
          <div className="flex items-center">
            <FiAlertCircle className="text-red-500 mr-2" size={20} />
            <span className="text-red-700 dark:text-red-400">{error}</span>
          </div>
        </div>
      )}

      {/* Main Content Area - Either Table or Hierarchy View */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            <span className="ml-3 text-lg text-gray-600 dark:text-gray-400">Loading categories...</span>
          </div>
        ) : viewMode === 'list' ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedCategories.length > 0 && selectedCategories.length === categories.length}
                      onChange={() => {
                        if (selectedCategories.length === categories.length) {
                          setSelectedCategories([]);
                        } else {
                          setSelectedCategories(categories.map(c => c.id));
                        }
                      }}
                      className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                    />
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Products</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {applyFilters(categories).map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.id)}
                        onChange={() => handleCategorySelection(category.id)}
                        className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {renderCategoryImage(category.image, category.name)}
                        <div className="ml-3">
                          <span className="font-medium">{category.name}</span>
                          {category.parentId && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Parent: {categories.find(c => c.id === category.parentId)?.name || 'Unknown'}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {category.productCount !== undefined && (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                          {category.productCount}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`inline-block h-3 w-3 rounded-full mr-2 ${
                          category.status === 'Active' ? 'bg-green-400' : 'bg-red-400'
                        }`}></span>
                        <span className="text-sm">{category.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {hasChildren(category.id) ? 'Parent' : 'Leaf'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditCategory(category)}
                          className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
                        >
                          <FiEdit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleViewCategory(category)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <FiEye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div>
          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Category Hierarchy</h3>
          </div>
          <div className="overflow-auto max-h-[calc(100vh-280px)]">
            {categories.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-gray-600 dark:text-gray-400">No categories found</p>
                <button 
                  onClick={handleAddCategory}
                  className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-primary-700"
                >
                  <FiPlus className="inline mr-2" /> Add Category
                </button>
              </div>
            ) : (
              renderCategoryTree(categories)
            )}
          </div>
          </div>
        )}
      </div>

      {/* Bulk actions - visible when categories are selected */}
      {selectedCategories.length > 0 && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg px-6 py-3 flex items-center space-x-4">
          <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
            {selectedCategories.length} {selectedCategories.length === 1 ? 'category' : 'categories'} selected
          </span>
          <div className="flex space-x-2">
            <button 
              className="px-4 py-2 bg-primary-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-primary-700"
              onClick={() => {
                // Bulk status update to active
                const updatedCategories = categories.map(category => 
                  selectedCategories.includes(category.id) 
                    ? { ...category, status: 'Active' } 
                    : category
                );
                setCategories(updatedCategories);
                setSelectedCategories([]);
              }}
            >
              Set Active
            </button>
            <button 
              className="px-4 py-2 bg-gray-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-gray-700"
              onClick={() => {
                // Bulk status update to inactive
                const updatedCategories = categories.map(category => 
                  selectedCategories.includes(category.id) 
                    ? { ...category, status: 'Inactive' } 
                    : category
                );
                setCategories(updatedCategories);
                setSelectedCategories([]);
              }}
            >
              Set Inactive
            </button>
            <button 
              className="px-4 py-2 bg-red-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-red-700"
              onClick={() => {
                // Confirm bulk delete
                setCategoryToDelete({
                  id: 'bulk',
                  name: `${selectedCategories.length} categories`
                });
                setShowDeleteConfirm(true);
              }}
            >
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      {/* Add Category Modal */}
      <AddCategoryModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleCategoryAdded}
        categories={categories}
        storeId={storeId}
      />
      
      {/* Edit Category Modal */}
      <EditCategoryModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        category={categoryToEdit}
        categories={categories}
        onUpdate={handleCategoryUpdated}
        storeId={storeId}
      />
      
      {/* Category Details Modal */}
      <CategoryDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        category={categoryToView}
        onEdit={handleEditCategory}
      />
      
      {/* Reorder Categories Modal */}
      <ReorderCategoriesModal
        isOpen={showReorderModal}
        onClose={() => setShowReorderModal(false)}
        categories={categories}
        onSave={saveNewCategoryOrder}
        storeId={storeId}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          if (categoryToDelete?.id === 'bulk') {
            // Bulk delete
            setCategories(categories.filter(c => !selectedCategories.includes(c.id)));
            setSelectedCategories([]);
          } else {
            // Single category delete
            confirmDeleteCategory();
          }
          setShowDeleteConfirm(false);
        }}
        title="Delete Category"
        message={
          categoryToDelete?.id === 'bulk'
            ? `Are you sure you want to delete ${selectedCategories.length} categories? This action cannot be undone.`
            : categoryToDelete && hasChildren(categoryToDelete.id)
              ? `Warning: "${categoryToDelete?.name}" has subcategories that will also be deleted. Are you sure you want to continue?`
              : `Are you sure you want to delete "${categoryToDelete?.name}"? This action cannot be undone.`
        }
        confirmText="Delete"
        confirmVariant="danger"
      />
    </div>
  );
};

export default CategoriesPage;