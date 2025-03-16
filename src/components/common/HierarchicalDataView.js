import React from 'react';
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';

/**
 * Reusable component for displaying hierarchical data with proper indentation and expand/collapse functionality
 * 
 * @param {Object} props
 * @param {Array} props.data - Array of hierarchical data items with children property
 * @param {Object} props.expandedItems - Object mapping item IDs to expanded state
 * @param {Function} props.onToggleExpand - Function to handle expand/collapse
 * @param {Function} props.renderItem - Function to render each item's content
 * @param {Function} props.onSelect - Function to handle item selection (optional)
 * @param {Array} props.selectedIds - Array of selected item IDs (optional)
 * @param {Function} props.shouldShowItem - Function to determine if an item should be shown (for filtering)
 * @param {boolean} props.showCheckboxes - Whether to show selection checkboxes
 */
const HierarchicalDataView = ({
  data = [],
  expandedItems = {},
  onToggleExpand,
  renderItem,
  onSelect,
  selectedIds = [],
  shouldShowItem = () => true,
  showCheckboxes = true,
}) => {
  // Helper function to recursively render items
  const renderItems = (items, level = 0) => {
    return items.map(item => {
      // Apply filters using shouldShowItem function
      if (!shouldShowItem(item)) {
        return null;
      }
      
      const isExpanded = expandedItems[item.id];
      const hasChildren = item.children && item.children.length > 0;
      const isSelected = selectedIds.includes(item.id);
      
      // Calculate indentation based on level
      const indentSize = level * 20; // 20px per level
      
      return (
        <div key={item.id} className="hierarchical-item">
          <div 
            className="flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
            style={{ paddingLeft: `${indentSize + 12}px` }}
          >
            {/* Checkbox if selection is enabled */}
            {showCheckboxes && onSelect && (
              <div className="w-6 flex justify-center mr-2">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onSelect(item.id)}
                  className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                />
              </div>
            )}
            
            {/* Expand/collapse button */}
            <div className="w-6 flex justify-center mr-2">
              {hasChildren ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onToggleExpand) onToggleExpand(item.id);
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
                  aria-label={isExpanded ? 'Collapse' : 'Expand'}
                >
                  {isExpanded ? 
                    <FiChevronDown size={16} /> : 
                    <FiChevronRight size={16} />
                  }
                </button>
              ) : (
                <span className="w-4"></span>
              )}
            </div>
            
            {/* Item content */}
            {renderItem && renderItem(item, {
              level,
              isExpanded,
              hasChildren,
              isSelected
            })}
          </div>
          
          {/* Render children if expanded */}
          {hasChildren && isExpanded && renderItems(item.children, level + 1)}
        </div>
      );
    }).filter(Boolean); // Filter out null items (filtered out by shouldShowItem)
  };

  return (
    <div className="hierarchical-data-view">
      {data.length > 0 ? (
        renderItems(data)
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No items available
        </div>
      )}
    </div>
  );
};

export default HierarchicalDataView;