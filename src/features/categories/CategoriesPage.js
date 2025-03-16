import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FiEdit2, 
  FiEye, 
  FiTrash2,
  FiPlus,
  FiList,
  FiGrid,
  FiImage,
  FiTag,
  FiChevronDown,
  FiChevronRight,
  FiCheck,
  FiX
} from 'react-icons/fi';
import { apiService } from '../../api/config';
import { renderCategoryImage, getCategoryColor } from '../../utils/category-image-utils';
import GenericDataList from '../../components/common/GenericDataList';
import HierarchicalDataView from '../../components/common/HierarchicalDataView';
import AddCategoryModal from './AddCategoryModal';
import EditCategoryModal from './EditCategoryModal';
import CategoryDetailsModal from './CategoryDetailsModal';
import ReorderCategoriesModal from './ReorderCategoriesModal';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

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
        setLoading(false);
      }
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
  const handleDeleteCategory = async (category) => {
    try {
      if (category.id === 'bulk') {
        // Handle bulk delete
        for (const id of category.items) {
          await apiService.delete(`/categories/${id}`);
        }
        
        // Update local state
        setCategories(categories.filter(c => !category.items.includes(c.id)));
        setSelectedCategories([]);
      } else {
        // Single category delete
        await apiService.delete(`/categories/${category.id}`);
        
        // Update local state to remove the category
        setCategories(categories.filter(c => c.id !== category.id));
      }
      
      // Also refresh hierarchy
      fetchCategoryHierarchy();
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
          onChange={() => handleCategorySelection(row.id)}
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
            <FiEdit2 size={16} className="mr-1" /> Edit
          </Button>
          <Button 
            variant="secondary"
            size="sm"
            onClick={() => handleViewCategory(row)}
            title="View Category Details"
          >
            <FiEye size={16} className="mr-1" /> View
          </Button>
          <Button 
            variant="danger"
            size="sm"
            onClick={() => handleDeleteCategory(row)}
            title="Delete Category"
          >
            <FiTrash2 size={16} className="mr-1" /> Delete
          </Button>
        </div>
      )
    }
  ];

  // Render category item for hierarchical view
  const renderCategoryItem = (category, itemState) => {
    const { level, isExpanded, hasChildren, isSelected } = itemState;
    const colorInfo = getCategoryColor(category.name);
    
    return (
      <>
        {/* Category image and name */}
        {renderCategoryImage(category.image, category.name, {
          className: "h-8 w-8 rounded-md mr-3"
        })}
        
        <span className="flex-grow font-medium text-gray-800 dark:text-white">
          {category.name}
        </span>
        
        {/* Product count */}
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorInfo.bg} ${colorInfo.text} mr-4`}>
          {category.productCount || 0}
        </span>
        
        {/* Status indicator */}
        <div className="flex items-center mr-4">
          <span className={`relative inline-block h-3 w-3 rounded-full mr-2 ${
            category.status === 'Active' ? 'bg-green-400' : 'bg-red-400'
          }`}></span>
          <span className="text-sm">{category.status}</span>
        </div>
        
        {/* Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditCategory(category);
            }}
            className="p-1 text-gray-500 hover:text-primary-600 transition-colors"
            title="Edit Category"
          >
            <FiEdit2 size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleViewCategory(category);
            }}
            className="p-1 text-gray-500 hover:text-primary-600 transition-colors"
            title="View Category Details"
          >
            <FiEye size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteCategory(category);
            }}
            className="p-1 text-gray-500 hover:text-red-600 transition-colors"
            title="Delete Category"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </>
    );
  };

  // Filter function for hierarchical view
  const shouldShowCategory = (category) => {
    // Apply filters
    if (filters.status !== 'all' && 
        category.status.toLowerCase() !== filters.status.toLowerCase()) {
      return false;
    }
    
    // Search term
    if (searchTerm && 
        !category.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  };

  // Render hierarchical content
  const renderHierarchicalContent = () => {
    return (
      <HierarchicalDataView
        data={categoryHierarchy}
        expandedItems={expandedCategories}
        onToggleExpand={toggleCategoryExpanded}
        renderItem={renderCategoryItem}
        onSelect={handleCategorySelection}
        selectedIds={selectedCategories}
        shouldShowItem={shouldShowCategory}
      />
    );
  };

  // Additional action buttons for the header
  const actionButtons = [
    {
      label: 'Reorder Categories',
      variant: 'secondary',
      onClick: handleReorderCategories
    }
  ];

  // Bulk actions configuration
  const bulkActions = [
    {
      type: 'activate',
      label: 'Set Active',
      variant: 'secondary',
      icon: <FiCheck className="mr-1" size={14} />,
      handler: (selectedIds) => {
        // Bulk status update to active
        const updatedCategories = categories.map(category => 
          selectedIds.includes(category.id) 
            ? { ...category, status: 'Active' } 
            : category
        );
        setCategories(updatedCategories);
        setSelectedCategories([]);
      }
    },
    {
      type: 'deactivate',
      label: 'Set Inactive',
      variant: 'secondary',
      icon: <FiX className="mr-1" size={14} />,
      handler: (selectedIds) => {
        // Bulk status update to inactive
        const updatedCategories = categories.map(category => 
          selectedIds.includes(category.id) 
            ? { ...category, status: 'Inactive' } 
            : category
        );
        setCategories(updatedCategories);
        setSelectedCategories([]);
      }
    },
    {
      type: 'delete',
      label: 'Delete Selected',
      variant: 'danger',
      icon: <FiTrash2 className="mr-1" size={14} />
      // No handler needed, will use the confirmation dialog
    }
  ];

  return (
    <>
      <GenericDataList
        title="Categories"
        data={applyFilters(categories)}
        columns={columns}
        filters={filterConfig}
        onSearch={(term) => {
          setSearchTerm(term);
          fetchCategories();
        }}
        onFilterChange={handleFilterChange}
        onApplyFilters={() => {
          fetchCategories();
          setFilterOpen(false);
        }}
        onClearFilters={() => {
          setFilters({ status: 'all', parentId: 'all' });
          setSearchTerm('');
          setFilterOpen(false);
          fetchCategories();
        }}
        onDelete={handleDeleteCategory}
        onAdd={handleAddCategory}
        loading={loading}
        error={error}
        emptyState={{
          title: "No categories found",
          message: searchTerm 
            ? "Try adjusting your search or filters" 
            : "Get started by creating your first category",
          actionText: "Add Category",
          onAction: handleAddCategory
        }}
        actionButtons={actionButtons}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showViewModeToggle={true}
        renderGridView={viewMode === 'hierarchy' ? renderHierarchicalContent : null}
        bulkActions={bulkActions}
        selectedItems={selectedCategories}
        onItemSelect={handleCategorySelection}
        filterOpen={filterOpen}
        setFilterOpen={setFilterOpen}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        entityName="category"
      />

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
        hierarchy={categoryHierarchy}
        onSave={saveNewCategoryOrder}
        storeId={storeId}
      />
    </>
  );
};

export default CategoriesPage;