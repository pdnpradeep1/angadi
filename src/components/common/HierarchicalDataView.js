// src/components/common/HierarchicalDataView.js
import React, { useState } from 'react';
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';

/**
 * Component for displaying hierarchical data like categories with expand/collapse functionality
 * 
 * @param {Object} props
 * @param {Array} props.data - Array of hierarchical data items
 * @param {Object} props.expandedItems - Object mapping item IDs to expanded state
 * @param {Function} props.onToggleExpand - Function to handle expand/collapse
 * @param {Function} props.renderItem - Function to render each item
 * @param {Function} props.onSelect - Function to handle item selection
 * @param {Array} props.selectedIds - Array of selected item IDs
 * @param {Function} props.shouldShowItem - Function to determine if an item should be shown (for filtering)
 */
const HierarchicalDataView = ({
  data = [],
  expandedItems = {},
  onToggleExpand,
  renderItem,
  onSelect,
  selectedIds = [],
  shouldShowItem = () => true,
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
      
      return (
        <div key={item.id} className="category-node">
          <div 
            className={`flex items-center p-3 ${
              level > 0 ? `ml-${level * 6}` : ''
            } hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-200 dark:border-gray-700`}
          >
            {/* Checkbox if selection is enabled */}
            {onSelect && (
              <div className="w-6 flex justify-center">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onSelect(item.id)}
                  className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                />
              </div>
            )}
            
            {/* Expand/collapse button */}
            <div className="w-6 flex justify-center">
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
    <div className="space-y-1">
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