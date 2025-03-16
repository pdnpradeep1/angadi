import React, { useState, useEffect } from 'react';
import Modal from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { FiMenu, FiChevronRight, FiChevronDown } from 'react-icons/fi';
import { renderCategoryImage } from '../../utils/category-image-utils';
import { apiService } from '../../api/config';

const ReorderCategoriesModal = ({ isOpen, onClose, categories, hierarchy = [], onSave, storeId }) => {
  const [orderedCategories, setOrderedCategories] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('flat'); // 'flat' or 'hierarchical'
  const [expandedParents, setExpandedParents] = useState({});

  useEffect(() => {
    // Initialize the ordered categories when the modal opens
    if (isOpen) {
      if (viewMode === 'flat') {
        setOrderedCategories([...categories]);
      } else {
        // For hierarchical view, we start with the top-level categories
        // This is a flattened version of the hierarchy for the drag and drop to work
        const flattened = flattenHierarchyForDnd(hierarchy);
        setOrderedCategories(flattened);
      }
    }
  }, [isOpen, categories, hierarchy, viewMode]);

  // Flatten hierarchical structure for drag and drop, preserving hierarchy info
  const flattenHierarchyForDnd = (items, parentId = null, level = 0, result = []) => {
    if (!items || !Array.isArray(items)) return result;
    
    items.forEach(item => {
      const flat = {
        ...item,
        parentId,
        level,
        isParent: item.children && item.children.length > 0
      };
      
      result.push(flat);
      
      if (item.children && item.children.length > 0) {
        flattenHierarchyForDnd(item.children, item.id, level + 1, result);
      }
    });
    
    return result;
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.effectAllowed = 'move';
    setDraggedItem(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    
    // If the item is dragged over itself, ignore
    if (draggedItem === index) {
      return;
    }
    
    const draggedItemData = orderedCategories[draggedItem];
    const targetItemData = orderedCategories[index];
    
    // In hierarchical mode, implement logic to prevent dragging a parent into its own child
    if (viewMode === 'hierarchical') {
      // Prevent dragging a parent into its own child (any level deep)
      if (isDescendantOf(targetItemData, draggedItemData.id)) {
        return;
      }
    }
    
    // Filter out the currently dragged item
    let newItems = orderedCategories.filter((item, idx) => idx !== draggedItem);
    
    // Add the dragged item at the new position
    newItems.splice(index, 0, draggedItemData);
    
    setOrderedCategories(newItems);
    setDraggedItem(index);
  };

  // Check if a category is a descendant of another category
  const isDescendantOf = (category, ancestorId, checked = new Set()) => {
    if (checked.has(category.id)) return false; // Avoid circular checks
    checked.add(category.id);
    
    if (category.parentId === ancestorId) return true;
    
    if (!category.parentId) return false;
    
    // Find the parent and check if it's a descendant
    const parent = orderedCategories.find(c => c.id === category.parentId);
    if (!parent) return false;
    
    return isDescendantOf(parent, ancestorId, checked);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const toggleParentExpanded = (categoryId) => {
    setExpandedParents(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    
    try {
      // In a hierarchical view, we need to rebuild the hierarchy before saving
      if (viewMode === 'hierarchical') {
        // This would depend on your API implementation
        // For example, you might need to send parent-child relationships
        
        // Create a map of categories by parent ID
        const categoryMap = {};
        orderedCategories.forEach((category, index) => {
          const catWithOrder = { ...category, order: index };
          
          if (!categoryMap[category.parentId || 'root']) {
            categoryMap[category.parentId || 'root'] = [];
          }
          
          categoryMap[category.parentId || 'root'].push(catWithOrder);
        });
        
        await apiService.put(`/store/${storeId}/hierarchy`, {
          categories: orderedCategories.map((cat, index) => ({
            id: cat.id,
            parentId: cat.parentId,
            order: index
          }))
        });
      } else {
        // For flat view, just update the order
        await apiService.put(`/store/${storeId}/categories/order`, 
          orderedCategories.map((category, index) => ({
            id: category.id,
            order: index
          }))
        );
      }
      
      // Call the onSave callback with the new order
      onSave(orderedCategories);
      onClose();
    } catch (error) {
      console.error('Error saving category order:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to determine if a category should be shown based on expanded parents
  const shouldShowCategory = (category) => {
    if (category.level === 0) return true;
    
    // Find the direct parent
    const parent = orderedCategories.find(c => c.id === category.parentId);
    if (!parent) return false;
    
    // If the parent is not expanded, don't show this category
    if (!expandedParents[parent.id]) return false;
    
    // Recursively check if all ancestors are expanded
    return shouldShowCategory(parent);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reorder Categories"
      size="md"
      footer={
        <>
          <Button 
            variant="secondary" 
            onClick={onClose} 
            className="mr-2"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Order'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Drag and drop to reorder categories. Categories will appear in this order on your store.
        </p>
        
        {/* View mode toggle */}
        {hierarchy.length > 0 && (
          <div className="flex rounded-md shadow-sm mb-4">
            <button
              onClick={() => setViewMode('flat')}
              className={`px-3 py-2 text-sm font-medium ${
                viewMode === 'flat'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              } rounded-l-md border border-gray-300 dark:border-gray-600`}
            >
              Flat View
            </button>
            <button
              onClick={() => setViewMode('hierarchical')}
              className={`px-3 py-2 text-sm font-medium ${
                viewMode === 'hierarchical'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              } rounded-r-md border border-gray-300 dark:border-gray-600 border-l-0`}
            >
              Hierarchical View
            </button>
          </div>
        )}
        
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden max-h-96 overflow-y-auto">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {orderedCategories.length === 0 ? (
              <li className="p-4 text-center text-gray-500 dark:text-gray-400">
                No categories found
              </li>
            ) : (
              orderedCategories.map((category, index) => (
                (viewMode !== 'hierarchical' || shouldShowCategory(category)) && (
                  <li 
                    key={category.id}
                    className={`
                      relative flex items-center p-4 
                      ${draggedItem === index ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-white dark:bg-gray-800'}
                      ${viewMode === 'hierarchical' && category.level > 0 ? `pl-${category.level * 4 + 4}` : ''}
                      hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors
                    `}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                  >
                    {/* Expand/collapse button for parents in hierarchical view */}
                    {viewMode === 'hierarchical' && category.isParent && (
                      <button
                        onClick={() => toggleParentExpanded(category.id)}
                        className="mr-2 text-gray-500"
                      >
                        {expandedParents[category.id] ? (
                          <FiChevronDown size={16} />
                        ) : (
                          <FiChevronRight size={16} />
                        )}
                      </button>
                    )}
                    
                    {/* Drag handle */}
                    <div className="cursor-move mr-3 text-gray-400">
                      <FiMenu size={18} />
                    </div>
                    
                    {/* Category image */}
                    {renderCategoryImage(category.image, category.name, {
                      className: "h-8 w-8 rounded-md mr-3"
                    })}
                    
                    {/* Category name */}
                    <span className="font-medium text-gray-800 dark:text-white">
                      {category.name}
                    </span>
                    
                    {/* Product count */}
                    <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">
                      {category.productCount || 0} products
                    </span>
                  </li>
                )
              ))
            )}
          </ul>
        </div>
      </div>
    </Modal>
  );
};

export default ReorderCategoriesModal;