import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  FiEdit2, 
  FiEye, 
  FiMoreVertical,
  FiPlus
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

const CategoriesPage = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();

  // State Management
  const [categories, setCategories] = useState([]);
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

  // Fetch Categories
  useEffect(() => {
    fetchCategories();
  }, [storeId]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      // Placeholder for API call to fetch categories
      // In a real implementation, you would call your API
      
      // For development purposes, use mock data
      setTimeout(() => {
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
        setLoading(false);
      }, 500);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories. Please try again.');
      setLoading(false);
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
    // Update filters as needed
    console.log('Filter changed:', key, value);
  };

  // Handle category deletion
  const handleDeleteCategory = (category) => {
    setCategoryToDelete(category);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteCategory = async () => {
    try {
      // In a real implementation, call your API to delete the category
      console.log('Deleting category:', categoryToDelete);
      
      // Update local state to remove the category
      setCategories(categories.filter(c => c.id !== categoryToDelete.id));
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
  
  const saveNewCategoryOrder = (reorderedCategories) => {
    // In a real implementation, you would call your API to save the new order
    console.log('Saving new category order:', reorderedCategories);
    
    // Update the local state with the new order
    setCategories(reorderedCategories);
  };

  // Handle adding a new category
  const handleAddCategory = () => {
    setShowAddModal(true);
  };
  
  const handleCategoryAdded = (newCategory) => {
    setCategories(prevCategories => [newCategory, ...prevCategories]);
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
  };

  // Handle viewing category details
  const handleViewCategory = (category) => {
    setCategoryToView(category);
    setShowDetailsModal(true);
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
          <img 
            src={row.image} 
            alt={row.name} 
            className="h-10 w-10 rounded-md mr-3" 
          />
          <span>{row.name}</span>
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

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Categories</h1>
        <div className="flex space-x-2">
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
      />
      
      {/* Edit Category Modal */}
      <EditCategoryModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        category={categoryToEdit}
        onUpdate={handleCategoryUpdated}
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
      />
    </div>
  );
};

export default CategoriesPage;