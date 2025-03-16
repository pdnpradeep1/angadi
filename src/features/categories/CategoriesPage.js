import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  FiEdit2, 
  FiEye, 
  FiTrash2,
  FiPlus,
  FiList,
  FiGrid,
  FiAlertCircle,
  FiSearch,
  FiFilter,
  FiChevronDown,
  FiChevronRight
} from 'react-icons/fi';
import { apiService } from '../../api/config';
import { renderCategoryImage, getCategoryColor } from '../../utils/category-image-utils';
import AddCategoryModal from './AddCategoryModal';
import EditCategoryModal from './EditCategoryModal';
import CategoryDetailsModal from './CategoryDetailsModal';
import ReorderCategoriesModal from './ReorderCategoriesModal';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

const CategoriesPage = () => {
  const { storeId } = useParams();

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
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      // In a real app, you would fetch from your API
      const response = await apiService.get(`/categories/store/${storeId}`);
      setCategories(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories. Please try again.');
      
      // For this demo, we'll use mock data
      setTimeout(() => {
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
        setLoading(false);
      }, 500);
    }
  };

  const fetchCategoryHierarchy = async () => {
    try {
      // Build hierarchy from flat categories
      const buildHierarchy = (cats, parentId = null) => {
        const children = cats.filter(cat => cat.parentId === parentId);
        return children.map(child => ({
          ...child,
          children: buildHierarchy(cats, child.id)
        }));
      };
      
      setTimeout(() => {
        const mockHierarchy = buildHierarchy(categories);
        setCategoryHierarchy(mockHierarchy);
      }, 500);
    } catch (err) {
      console.error('Error fetching category hierarchy:', err);
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
            {/* Checkbox */}
            <div className="w-6 flex justify-center">
              <input
                type="checkbox"
                checked={selectedCategories.includes(node.id)}
                onChange={() => {
                  setSelectedCategories(prev => 
                    prev.includes(node.id) 
                      ? prev.filter(id => id !== node.id)
                      : [...prev, node.id]
                  );
                }}
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

  // Handle category deletion
  const handleDeleteCategory = (category) => {
    setCategoryToDelete(category);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteCategory = async () => {
    try {
      // Simulate API call
      console.log('Deleting category:', categoryToDelete);
      
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

  // Handle reordering categories
  const handleReorderCategories = () => {
    setShowReorderModal(true);
  };
  
  const saveNewCategoryOrder = (reorderedCategories) => {
    // Update the local state with the new order
    setCategories(reorderedCategories);
    
    // Refresh hierarchy after reordering
    fetchCategoryHierarchy();
  };

  // We no longer need these - we're properly importing from react-icons/fi

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Categories</h2>
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
            <FiPlus className="inline-block mr-1" /> Add Category
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <div className="relative flex-1 max-w-md">
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
          className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"
          onClick={() => setFilterOpen(!filterOpen)}
        >
          <FiFilter className="mr-2" /> Filter
        </button>
      </div>

      {/* Filter Panel */}
      {filterOpen && (
        <Card className="mb-6 p-4">
          <h3 className="text-lg font-medium mb-4">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Categories</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Parent Category</label>
              <select
                value={filters.parentId}
                onChange={(e) => handleFilterChange('parentId', e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Categories</option>
                <option value="root">Root Categories Only</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => {
                setFilters({ status: 'all', parentId: 'all' });
                setFilterOpen(false);
              }}
              className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 mr-2"
            >
              Clear
            </button>
            <button
              onClick={() => setFilterOpen(false)}
              className="px-4 py-2 bg-primary-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-primary-700"
            >
              Apply
            </button>
          </div>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-md">
          <div className="flex items-center">
            <FiAlertCircle className="text-red-500 mr-2" size={20} />
            <span className="text-red-700 dark:text-red-400">{error}</span>
          </div>
        </div>
      )}

      {/* Icons properly imported at the top of the file now */}

      {/* Main Content Area - Either Table or Hierarchy View */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary-500 rounded-full border-t-transparent"></div>
          </div>
        ) : viewMode === 'list' ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Products</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {applyFilters(categories).map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
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
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        {category.productCount}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`relative inline-block h-3 w-3 rounded-full mr-2 ${
                          category.status === 'Active' ? 'bg-green-400' : 'bg-red-400'
                        }`}></span>
                        <span>{category.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {hasChildren(category.id) ? 'Parent' : 'Leaf'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button 
                        onClick={() => handleEditCategory(category)}
                        className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 mr-3"
                      >
                        <FiEdit2 className="inline" /> Edit
                      </button>
                      <button 
                        onClick={() => handleViewCategory(category)}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 mr-3"
                      >
                        <FiEye className="inline" /> View
                      </button>
                      <button 
                        onClick={() => handleDeleteCategory(category)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <FiTrash2 className="inline" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-4 overflow-auto max-h-[calc(100vh-300px)]">
            {categories.length > 0 ? (
              renderCategoryTree(categories)
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No categories found
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Delete Category</h3>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              {categoryToDelete && hasChildren(categoryToDelete.id)
                ? `Warning: "${categoryToDelete?.name}" has subcategories that will also be deleted. Are you sure you want to continue?`
                : `Are you sure you want to delete "${categoryToDelete?.name}"? This action cannot be undone.`}
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 mr-2"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteCategory}
                className="px-4 py-2 bg-red-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showAddModal && (
        <AddCategoryModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdd={handleCategoryAdded}
          categories={categories}
          storeId={storeId}
        />
      )}
      
      {/* Edit Category Modal */}
      {showEditModal && (
        <EditCategoryModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          category={categoryToEdit}
          categories={categories}
          onUpdate={handleCategoryUpdated}
          storeId={storeId}
        />
      )}
      
      {/* Category Details Modal */}
      {showDetailsModal && (
        <CategoryDetailsModal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          category={categoryToView}
          onEdit={handleEditCategory}
        />
      )}
      
      {/* Reorder Categories Modal */}
      {showReorderModal && (
        <ReorderCategoriesModal
          isOpen={showReorderModal}
          onClose={() => setShowReorderModal(false)}
          categories={categories}
          hierarchy={categoryHierarchy}
          onSave={saveNewCategoryOrder}
          storeId={storeId}
        />
      )}
    </div>
  );
};

export default CategoriesPage;