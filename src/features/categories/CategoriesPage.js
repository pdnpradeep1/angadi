import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  FiEdit2, 
  FiEye, 
  FiTrash2,
  FiMoreVertical,
  FiPlus,
  FiChevronRight,
  FiChevronDown,
  FiList,
  FiGrid,
  FiSearch,
  FiFilter
} from 'react-icons/fi';
import Table from '../../components/ui/Table';
import FilterPanel from '../../components/ui/FilterPanel';
import { EmptyStates } from '../../utils/loading-error-states';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/Modal';
import AddCategoryModal from './AddCategoryModal';
import EditCategoryModal from './EditCategoryModal';
import CategoryDetailsModal from './CategoryDetailsModal';
import ReorderCategoriesModal from './ReorderCategoriesModal';
import { apiService } from '../../api/config';
import { 
  renderCategoryImage, 
  getCategoryColor,
  getCategoryBreadcrumb 
} from '../../utils/category-image-utils';

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
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => handleEditCategory(row)}
            title="Edit Category"
          >
            <FiEdit2 size={16} />
          </Button>
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => handleViewCategory(row)}
            title="View Category Details"
          >
            <FiEye size={16} />
          </Button>
          <Button 
            variant="danger" 
            size="sm"
            onClick={() => handleDeleteCategory(row)}
            title="Delete Category"
          >
            <FiTrash2 size={16} />
          </Button>
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
          <Button 
            variant="secondary" 
            onClick={handleReorderCategories}
          >
            Reorder Categories
          </Button>
          <Button 
            variant="primary" 
            onClick={handleAddCategory}
          >
            <FiPlus className="mr-2" /> Add New Category
          </Button>
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
        <Button 
          variant="secondary" 
          onClick={() => setFilterOpen(!filterOpen)}
        >
          <FiFilter className="mr-2" /> Filter
        </Button>
      </div>

      <FilterPanel
        isOpen={filterOpen}
        filters={filterConfig}
        onFilterChange={handleFilterChange}
        onApply={() => setFilterOpen(false)}
        onClear={() => {
          setFilters({
            status: 'all',
            parentId: 'all'
          });
          setFilterOpen(false);
        }}
      />

      {/* Main Content Area - Either Table or Hierarchy View */}
      {viewMode === 'list' ? (
        <Table
          columns={columns}
          data={applyFilters(categories)}
          isLoading={loading}
          emptyState={
            <EmptyStates.Products 
              onAction={handleAddCategory}
              title="No categories found"
              message="There are no categories matching your criteria. Try adjusting your filters or add a new category."
            />
          }
        />
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-3">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Category Hierarchy</h3>
          </div>
          
          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Loading categories...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">No categories found</p>
              <Button 
                variant="primary"
                className="mt-4"
                onClick={handleAddCategory}
              >
                <FiPlus className="mr-2" /> Add Category
              </Button>
            </div>
          ) : (
            <div className="overflow-auto max-h-[calc(100vh-280px)]">
              {renderCategoryTree(categories)}
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDeleteCategory}
        title="Delete Category"
        message={
          categoryToDelete && hasChildren(categoryToDelete.id)
            ? `Warning: "${categoryToDelete?.name}" has subcategories that will also be deleted. Are you sure you want to continue?`
            : `Are you sure you want to delete "${categoryToDelete?.name}"? This action cannot be undone.`
        }
        confirmText="Delete"
        confirmVariant="danger"
      />
      
      {/* Add Category Modal */}
      <AddCategoryModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleCategoryAdded}
        categories={categories} // Pass all categories for parent selection
        storeId={storeId}
      />
      
      {/* Edit Category Modal */}
      <EditCategoryModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        category={categoryToEdit}
        categories={categories} // Pass all categories for parent selection
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
    </div>
  );
};

export default CategoriesPage;