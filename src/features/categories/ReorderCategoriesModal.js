import React, { useState, useEffect, useRef } from 'react';
import Modal from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { FiMenu, FiChevronRight, FiChevronDown, FiAlertCircle } from 'react-icons/fi';
import { renderCategoryImage } from '../../utils/category-image-utils';
import { apiService } from '../../api/config';

const ReorderCategoriesModal = ({ isOpen, onClose, categories, hierarchy = [], onSave, storeId }) => {
  const [orderedCategories, setOrderedCategories] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('flat'); // 'flat' or 'hierarchical'
  const [expandedParents, setExpandedParents] = useState({});
  const [error, setError] = useState(null);
  const [isDraggingOver, setIsDraggingOver] = useState(null);
  const dragNodeRef = useRef(null);
  const dragTimeoutRef = useRef(null);

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
      
      // Auto-expand all parent categories initially in hierarchical mode
      if (viewMode === 'hierarchical') {
        const expandedState = {};
        categories.forEach(cat => {
          if (hasChildren(cat.id)) {
            expandedState[cat.id] = true;
          }
        });
        setExpandedParents(expandedState);
      }
    }
  }, [isOpen, categories, hierarchy, viewMode]);

  // Check if a category has children
  const hasChildren = (categoryId) => {
    return categories.some(cat => cat.parentId === categoryId);
  };

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

  // Check if a category is a descendant of another category (recursive)
  const isDescendantOf = (targetCategoryId, potentialAncestorId) => {
    if (targetCategoryId === potentialAncestorId) return true;
    
    const targetCategory = orderedCategories.find(c => c.id === targetCategoryId);
    if (!targetCategory || !targetCategory.parentId) return false;
    
    return isDescendantOf(targetCategory.parentId, potentialAncestorId);
  };

  // Find all descendants of a category (recursive)
  const findAllDescendants = (categoryId) => {
    const directChildren = orderedCategories.filter(cat => cat.parentId === categoryId);
    
    let allDescendants = [...directChildren];
    directChildren.forEach(child => {
      const childDescendants = findAllDescendants(child.id);
      allDescendants = [...allDescendants, ...childDescendants];
    });
    
    return allDescendants;
  };

  const handleDragStart = (e, index, item) => {
    // Set the drag effect
    e.dataTransfer.effectAllowed = 'move';
    
    // Store some data about what's being dragged
    const data = JSON.stringify({ index, id: item.id });
    e.dataTransfer.setData('text/plain', data);
    
    // Highlight the dragged item
    setDraggedItem(index);
    
    // Save a reference to the dragged node
    dragNodeRef.current = { item, index };
    
    // Add a class to the body to indicate dragging is in progress
    document.body.classList.add('dragging-category');
    
    // Clear any existing error
    setError(null);
  };

  const handleDragOver = (e, index, item) => {
    e.preventDefault();
    
    // If we're already at this index or no drag has started, ignore
    if (draggedItem === index || draggedItem === null) {
      return;
    }
    
    // Get the dragged item data
    const draggedItemData = orderedCategories[draggedItem];
    
    // In hierarchical mode, validate the move
    if (viewMode === 'hierarchical') {
      // Prevent dragging a parent into any of its descendants
      if (isDescendantOf(item.id, draggedItemData.id)) {
        setError("Cannot move a category into its own subcategory");
        e.dataTransfer.dropEffect = 'none'; // Show not-allowed cursor
        return;
      }
      
      // Prevent dropping at the same level if nothing would change
      if (draggedItem === index - 1 || draggedItem === index) {
        e.dataTransfer.dropEffect = 'none';
        return;
      }
      
      // If trying to drop between items with different parents
      if (draggedItemData.parentId !== item.parentId) {
        // Allow only if dropping at top level or into a parent's children
        if (item.level !== draggedItemData.level) {
          // Only allow drops between same-level items
          e.dataTransfer.dropEffect = 'none';
          return;
        }
      }
    }
    
    // Set the drop effect to move
    e.dataTransfer.dropEffect = 'move';
    
    // Add a visual indicator for the drop target
    setIsDraggingOver(index);
    
    // Use a debounce to avoid too many state updates
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
    }
    
    dragTimeoutRef.current = setTimeout(() => {
      // Move the item
      const newItems = [...orderedCategories];
      newItems.splice(draggedItem, 1);
      newItems.splice(index, 0, draggedItemData);
      
      setOrderedCategories(newItems);
      setDraggedItem(index);
    }, 150);
  };

  const handleDragEnter = (e, index) => {
    e.preventDefault();
    setIsDraggingOver(index);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDraggingOver(null);
  };

  const handleDrop = (e, index, item) => {
    e.preventDefault();
    
    // Clear drag over state
    setIsDraggingOver(null);
    
    // Clear the timeout
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
      dragTimeoutRef.current = null;
    }
    
    // Get the dragged item data
    const draggedData = e.dataTransfer.getData('text/plain');
    if (!draggedData) return;
    
    const { id: draggedId } = JSON.parse(draggedData);
    const draggedItemData = orderedCategories.find(cat => cat.id === draggedId);
    
    // Perform the same validation as in dragOver
    if (viewMode === 'hierarchical') {
      if (isDescendantOf(item.id, draggedId)) {
        setError("Cannot move a category into its own subcategory");
        return;
      }
    }
    
    // Update the state to reflect the drop
    const newItems = [...orderedCategories];
    const oldIndex = newItems.findIndex(cat => cat.id === draggedId);
    
    if (oldIndex === -1) return;
    
    // Remove from old position
    const [removed] = newItems.splice(oldIndex, 1);
    
    // Insert at new position
    newItems.splice(index, 0, removed);
    
    // Update the parent-child relationships if needed
    if (viewMode === 'hierarchical') {
      // If dropped in a different level, update the parentId
      const targetLevel = item.level;
      const draggedLevel = draggedItemData.level;
      
      if (targetLevel !== draggedLevel) {
        // Find the new parent based on siblings at the target index
        const siblingIndex = index > 0 ? index - 1 : index + 1;
        const sibling = newItems[siblingIndex];
        
        if (sibling) {
          // Use the same parent as the sibling
          newItems[index].parentId = sibling.parentId;
          newItems[index].level = sibling.level;
        }
      }
    }
    
    setOrderedCategories(newItems);
    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    // Clean up
    setDraggedItem(null);
    setIsDraggingOver(null);
    document.body.classList.remove('dragging-category');
    
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
      dragTimeoutRef.current = null;
    }
  };

  const toggleParentExpanded = (categoryId) => {
    setExpandedParents(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  // Rebuild the hierarchy from the flat list
  const rebuildHierarchy = () => {
    // Create map of categories by parent ID
    const categoryMap = {};
    orderedCategories.forEach((cat, index) => {
      if (!categoryMap[cat.parentId || 'root']) {
        categoryMap[cat.parentId || 'root'] = [];
      }
      
      categoryMap[cat.parentId || 'root'].push({
        ...cat,
        order: index
      });
    });
    
    // Build the hierarchy
    const buildHierarchy = (parentId = 'root') => {
      const children = categoryMap[parentId] || [];
      return children.map(child => ({
        ...child,
        children: buildHierarchy(child.id)
      }));
    };
    
    return buildHierarchy();
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // In a hierarchical view, we need to rebuild the hierarchy before saving
      if (viewMode === 'hierarchical') {
        // Rebuild the hierarchy
        const hierarchyData = rebuildHierarchy();
        
        // Send the updated hierarchy to the server
        await apiService.put(`/categories/store/${storeId}/hierarchy`, {
          categories: orderedCategories.map((cat, index) => ({
            id: cat.id,
            parentId: cat.parentId,
            order: index
          }))
        });
      } else {
        // For flat view, just update the order
        await apiService.put(`/categories/store/${storeId}/order`, 
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
      setError("Failed to save category order. Please try again.");
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

  // Calculate indentation styles based on level
  const getIndentStyle = (level) => {
    const baseIndent = 16; // Base indentation in pixels
    const indent = level * baseIndent;
    return { marginLeft: `${indent}px` };
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
        
        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-md">
            <div className="flex items-center">
              <FiAlertCircle className="text-red-500 mr-2" size={16} />
              <span className="text-red-700 dark:text-red-400 text-sm">{error}</span>
            </div>
          </div>
        )}
        
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
        
        {/* Drag and drop container */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden max-h-96 overflow-y-auto">
          <ul className="bg-gray-50 dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
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
                      relative flex items-center p-3 
                      ${draggedItem === index ? 'bg-blue-50 dark:bg-blue-900/20 opacity-50' : 'bg-white dark:bg-gray-800'}
                      ${isDraggingOver === index ? 'border-2 border-primary-400 dark:border-primary-500' : ''}
                      hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors
                    `}
                    draggable="true"
                    onDragStart={(e) => handleDragStart(e, index, category)}
                    onDragOver={(e) => handleDragOver(e, index, category)}
                    onDragEnter={(e) => handleDragEnter(e, index)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, index, category)}
                    onDragEnd={handleDragEnd}
                  >
                    {/* Indentation and expand/collapse button */}
                    <div className="flex items-center" style={getIndentStyle(category.level)}>
                      {/* Expand/collapse button for parents in hierarchical view */}
                      {viewMode === 'hierarchical' && category.isParent && (
                        <button
                          onClick={() => toggleParentExpanded(category.id)}
                          className="mr-2 text-gray-500 focus:outline-none"
                          title={expandedParents[category.id] ? "Collapse" : "Expand"}
                        >
                          {expandedParents[category.id] ? (
                            <FiChevronDown size={16} />
                          ) : (
                            <FiChevronRight size={16} />
                          )}
                        </button>
                      )}
                      
                      {/* Drag handle */}
                      <div className="cursor-move mr-3 text-gray-400 touch-none">
                        <FiMenu size={18} />
                      </div>
                      
                      {/* Category image */}
                      {renderCategoryImage(category.image, category.name, {
                        className: "h-8 w-8 rounded-md mr-3 object-cover"
                      })}
                      
                      {/* Category name */}
                      <div className="flex-1">
                        <span className="font-medium text-gray-800 dark:text-white">
                          {category.name}
                        </span>
                        {category.isParent && (
                          <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                            ({category.productCount || 0} products)
                          </span>
                        )}
                      </div>
                      
                      {/* Level indicator (DEBUG) */}
                      {/* <span className="ml-auto text-xs text-gray-400 dark:text-gray-500 mr-2">
                        Level: {category.level}
                      </span> */}
                      
                      {/* Category type indicator */}
                      <span className="ml-auto text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                        {category.isParent ? 'Parent' : 'Leaf'}
                      </span>
                    </div>
                  </li>
                )
              ))
            )}
          </ul>
        </div>
        
        {/* Helper text */}
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {viewMode === 'hierarchical' 
            ? "In hierarchical view, categories maintain their parent-child relationships. Click the arrow icons to expand/collapse subcategories."
            : "In flat view, all categories are shown at the same level, ignoring parent-child relationships."}
        </p>
      </div>
      
      {/* CSS for drag and drop styling */}
      <style jsx global>{`
        body.dragging-category {
          cursor: grabbing !important;
        }
        
        body.dragging-category * {
          cursor: grabbing !important;
        }
      `}</style>
    </Modal>
  );
};

export default ReorderCategoriesModal;