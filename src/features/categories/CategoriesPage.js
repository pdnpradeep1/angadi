import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  FiEdit2, 
  FiEye, 
  FiMoreVertical,
  FiPlus,
  FiChevronRight,
  FiChevronDown,
  FiList,
  FiGrid
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
import { renderCategoryImage } from '../../utils/category-image-utils';

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
            productCount: 1,
            status: 'Active',
            image: '/api/placeholder/50/50?text=Spicy'
          },
          {
            id: 2,
            name: 'Sweets',
            productCount: 6,
            status: 'Active',
            image: '/api/placeholder/50/50?text=Sweets'
          },
          {
            id: 3,
            name: 'Make On Order',
            productCount: 8,
            status: 'Active',
            image: '/api/placeholder/50/50?text=OnOrder'
          }
        ];
        setCategories(mockCategories);
      }
      
      setLoading(false);
    }
  };

  const fetchCategoryHierarchy = async () => {
    try {
      const response = await apiService.get(`/store/${storeId}/hierarchy`);
      setCategoryHierarchy(response.data);
    } catch (err) {
      console.error('Error fetching category hierarchy:', err);
      
      // For development, create a mock hierarchy based on flat categories
      if (process.env.NODE_ENV === 'development') {
        // This will be called after fetchCategories sets the categories state
        setTimeout(() => {
          const mockHierarchy = [
            {
              id: 1,
              name: 'Spicy',
              productCount: 1,
              status: 'Active',
              image: '/api/placeholder/50/50?text=Spicy',
              children: []
            },
            {
              id: 2,
              name: 'Sweets',
              productCount: 6,
              status: 'Active',
              image: '/api/placeholder/50/50?text=Sweets',
              children: [
                {
                  id: 4,
                  name: 'Traditional',
                  productCount: 4,
                  status: 'Active',
                  image: '/api/placeholder/50/50?text=Trad',
                  children: []
                },
                {
                  id: 5,
                  name: 'Modern',
                  productCount: 2,
                  status: 'Active',
                  image: '/api/placeholder/50/50?text=Modern',
                  children: []
                }
              ]
            },
            {
              id: 3,
              name: 'Make On Order',
              productCount: 8,
              status: 'Active',
              image: '/api/placeholder/50/50?text=OnOrder',
              children: []
            }
          ];
          setCategoryHierarchy(mockHierarchy);
        }, 1000);
      }
    }
  };

  // Filter Configuration
  const filterConfig = {
    status: {
      type: 'select',
      label: 'Status',
      value: 'all',
      options: [
        { value: 'all', label: 'All Categories' },
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
      ]
    }
  };

  // Handle Filter Changes
  const handleFilterChange = (key, value) => {
    console.log('Filter changed:', key, value);
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
      
      await apiService.put(`/store/${storeId}/categories/order`, orderData);
      
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
            setSelectedCategories(prev => 
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
      title: 'Category',
      render: (row) => (
        <div className="flex items-center">
          {renderCategoryImage(row.image, row.name)}
          <span className="ml-3">{row.name}</span>
        </div>
      )
    },
    {
      key: 'productCount',
      title: 'Products',
      render: (row) => row.productCount
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
      key: 'actions',
      title: 'Action',
      render: (row) => (
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => handleEditCategory(row)}
            className="p-1 text-gray-500 hover:text-primary-600 transition-colors"
            title="Edit Category"
          >
            <FiEdit2 size={18} />
          </button>
          <button 
            onClick={() => handleViewCategory(row)}
            className="p-1 text-gray-500 hover:text-primary-600 transition-colors"
            title="View Category Details"
          >
            <FiEye size={18} />
          </button>
          <div className="relative group">
            <button 
              className="p-1 text-gray-500 hover:text-primary-600 transition-colors"
              title="More Options"
            >
              <FiMoreVertical size={18} />
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-20 hidden group-hover:block">
              <div className="py-1">
                <button 
                  onClick={() => handleDeleteCategory(row)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  // Render a hierarchical category tree
  const renderCategoryHierarchy = (categories, level = 0) => {
    return categories.map(category => (
      <React.Fragment key={category.id}>
        <div 
          className={`flex items-center p-3 ${
            level > 0 ? 'ml-' + (level * 6) : ''
          } hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-700`}
        >
          {category.children && category.children.length > 0 ? (
            <button 
              onClick={() => toggleCategoryExpanded(category.id)}
              className="mr-2 text-gray-500"
            >
              {expandedCategories[category.id] ? 
                <FiChevronDown size={16} /> : 
                <FiChevronRight size={16} />
              }
            </button>
          ) : (
            <span className="w-6 mr-2"></span>
          )}
          
          {renderCategoryImage(category.image, category.name, {
            className: "h-8 w-8 rounded-md mr-3"
          })}
          
          <span className="flex-grow font-medium text-gray-800 dark:text-white">
            {category.name}
          </span>
          
          <span className="text-sm text-gray-500 dark:text-gray-400 mr-4">
            {category.productCount || 0} products
          </span>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => handleEditCategory(category)}
              className="p-1 text-gray-500 hover:text-primary-600 transition-colors"
              title="Edit Category"
            >
              <FiEdit2 size={16} />
            </button>
            <button 
              onClick={() => handleViewCategory(category)}
              className="p-1 text-gray-500 hover:text-primary-600 transition-colors"
              title="View Category Details"
            >
              <FiEye size={16} />
            </button>
            <button 
              onClick={() => handleDeleteCategory(category)}
              className="p-1 text-gray-500 hover:text-red-600 transition-colors"
              title="Delete Category"
            >
              <FiMoreVertical size={16} />
            </button>
          </div>
        </div>
        
        {/* Render children if expanded */}
        {category.children && 
         category.children.length > 0 && 
         expandedCategories[category.id] && 
         renderCategoryHierarchy(category.children, level + 1)}
      </React.Fragment>
    ));
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
            Reorder categories
          </Button>
          <Button 
            variant="primary" 
            onClick={handleAddCategory}
          >
            <FiPlus className="mr-2" /> Add new category
          </Button>
        </div>
      </div>

      <div className="flex mb-4 space-x-2">
        <input 
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 input"
        />
        <Button 
          variant="secondary" 
          onClick={() => setFilterOpen(!filterOpen)}
        >
          Filter
        </Button>
      </div>

      <FilterPanel
        isOpen={filterOpen}
        filters={filterConfig}
        onFilterChange={handleFilterChange}
        onApply={() => {
          console.log('Applying filters');
          setFilterOpen(false);
        }}
        onClear={() => {
          console.log('Clearing filters');
          setFilterOpen(false);
        }}
      />

      {/* Main Content Area - Either Table or Hierarchy View */}
      {viewMode === 'list' ? (
        <Table
          columns={columns}
          data={categories.filter(category => 
            category.name.toLowerCase().includes(searchTerm.toLowerCase())
          )}
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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-3">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Category Hierarchy</h3>
          </div>
          
          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Loading categories...</p>
            </div>
          ) : categoryHierarchy.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">No categories found</p>
              <Button 
                variant="primary"
                className="mt-4"
                onClick={handleAddCategory}
              >
                <FiPlus className="mr-2" /> Add category
              </Button>
            </div>
          ) : (
            <div className="overflow-auto max-h-96">
              {renderCategoryHierarchy(categoryHierarchy)}
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
        message={`Are you sure you want to delete "${categoryToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        confirmVariant="danger"
      />
      
      {/* Add Category Modal */}
      <AddCategoryModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleCategoryAdded}
        categories={categoryHierarchy} // Pass all categories for parent selection
        storeId={storeId}
      />
      
      {/* Edit Category Modal */}
      <EditCategoryModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        category={categoryToEdit}
        categories={categoryHierarchy} // Pass all categories for parent selection
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
        hierarchy={categoryHierarchy}
        onSave={saveNewCategoryOrder}
        storeId={storeId}
      />
    </div>
  );
};

export default CategoriesPage;