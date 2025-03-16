import React, { useState, useEffect } from 'react';
import { FiChevronRight, FiChevronDown, FiPlus } from 'react-icons/fi';

const CategorySelector = ({ 
  categories = [], 
  selectedCategoryId = '', 
  onChange, 
  onCreateNew,
  className = ''
}) => {
  const [expandedCategories, setExpandedCategories] = useState({});
  const [viewMode, setViewMode] = useState('tree'); // 'tree' or 'dropdown'
  
  // Initialize with all parent categories expanded
  useEffect(() => {
    const expanded = {};
    categories.forEach(category => {
      if (hasChildren(category.id)) {
        expanded[category.id] = true;
      }
    });
    setExpandedCategories(expanded);
  }, [categories]);
  
  // Check if a category has children
  const hasChildren = (categoryId) => {
    return categories.some(cat => cat.parentId === categoryId);
  };
  
  // Toggle a parent category's expanded state
  const toggleExpanded = (categoryId, e) => {
    e.stopPropagation();
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  // Get the full path of a category (breadcrumb style)
  const getCategoryPath = (categoryId) => {
    if (!categoryId) return '';
    
    const path = [];
    let currentCategory = categories.find(c => c.id === parseInt(categoryId));
    
    while (currentCategory) {
      path.unshift(currentCategory.name);
      if (!currentCategory.parentId) break;
      currentCategory = categories.find(c => c.id === currentCategory.parentId);
    }
    
    return path.join(' > ');
  };
  
  // Build hierarchical category structure for tree view
  const buildCategoryTree = () => {
    // Find top-level categories
    const topLevelCategories = categories.filter(cat => !cat.parentId);
    
    // Build tree recursively
    const buildTree = (parentId = null, level = 0) => {
      const children = categories.filter(cat => cat.parentId === parentId);
      
      return children.map(category => {
        const hasChildNodes = hasChildren(category.id);
        const isExpanded = expandedCategories[category.id];
        
        return (
          <React.Fragment key={category.id}>
            <div 
              className={`flex items-center p-2 ${
                selectedCategoryId === category.id.toString() 
                  ? 'bg-primary-50 dark:bg-primary-900/20 border-l-2 border-primary-500' 
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              style={{ paddingLeft: `${(level * 16) + 12}px` }}
              onClick={() => onChange(category.id.toString())}
            >
              {hasChildNodes && (
                <button
                  onClick={(e) => toggleExpanded(category.id, e)}
                  className="p-1 mr-1 text-gray-500 focus:outline-none"
                >
                  {isExpanded ? (
                    <FiChevronDown size={14} />
                  ) : (
                    <FiChevronRight size={14} />
                  )}
                </button>
              )}
              
              {!hasChildNodes && <div className="w-6"></div>}
              
              <span className={level > 0 ? 'text-gray-700 dark:text-gray-300' : 'font-medium text-gray-900 dark:text-white'}>
                {category.name}
              </span>
            </div>
            
            {/* Render children if expanded */}
            {hasChildNodes && isExpanded && buildTree(category.id, level + 1)}
          </React.Fragment>
        );
      });
    };
    
    return buildTree();
  };
  
  // Render dropdown options with hierarchical indentation
  const renderDropdownOptions = () => {
    const renderOption = (category, level = 0) => {
      const indent = "\u00A0\u00A0".repeat(level); // Non-breaking spaces
      const prefix = level > 0 ? "↳ " : "";
      
      return (
        <option key={category.id} value={category.id}>
          {indent}{prefix}{category.name}
        </option>
      );
    };
    
    // Recursively build flattened hierarchical options
    const buildOptions = (parentId = null, level = 0, result = []) => {
      const children = categories.filter(cat => cat.parentId === parentId);
      
      children.forEach(category => {
        result.push(renderOption(category, level));
        if (hasChildren(category.id)) {
          buildOptions(category.id, level + 1, result);
        }
      });
      
      return result;
    };
    
    return buildOptions();
  };
  
  return (
    <div className={className}>
      <div className="flex mb-2">
        <button
          type="button"
          onClick={() => setViewMode('tree')}
          className={`px-3 py-1 text-xs rounded-l-md ${
            viewMode === 'tree' 
              ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300 font-medium' 
              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
          }`}
        >
          Tree View
        </button>
        <button
          type="button"
          onClick={() => setViewMode('dropdown')}
          className={`px-3 py-1 text-xs rounded-r-md ${
            viewMode === 'dropdown' 
              ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300 font-medium' 
              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
          }`}
        >
          Dropdown
        </button>
      </div>
      
      {/* Tree View */}
      {viewMode === 'tree' && (
        <div className="border border-gray-300 dark:border-gray-600 rounded-md max-h-60 overflow-y-auto">
          {categories.length === 0 ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              No categories available
            </div>
          ) : (
            buildCategoryTree()
          )}
        </div>
      )}
      
      {/* Dropdown View */}
      {viewMode === 'dropdown' && (
        <select
          value={selectedCategoryId}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">Select a category</option>
          {renderDropdownOptions()}
        </select>
      )}
      
      {/* Display selected category path */}
      {selectedCategoryId && (
        <div className="mt-2 text-sm text-secondary-600 dark:text-secondary-400">
          <span className="font-medium">Selected:</span> {getCategoryPath(selectedCategoryId)}
        </div>
      )}
      
      {/* Create New Category Button */}
      <button
        type="button"
        onClick={onCreateNew}
        className="mt-2 flex items-center text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
      >
        <FiPlus className="mr-1" /> Create New Category
      </button>
    </div>
  );
};

export default CategorySelector;