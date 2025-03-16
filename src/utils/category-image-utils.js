// src/utils/category-image-utils.js
import React from 'react';
import { FiImage, FiPackage, FiTag } from 'react-icons/fi';

/**
 * Renders a category image with fallback for missing images
 * @param {string} imageUrl - The image URL to render
 * @param {string} categoryName - Category name for the alt text and fallback display
 * @param {Object} options - Additional options
 * @param {string} options.className - Additional classes for the image
 * @param {boolean} options.asComponent - Whether to return JSX (true) or HTML string (false)
 * @returns {JSX.Element|string} The image or fallback component
 */
export const renderCategoryImage = (imageUrl, categoryName, options = {}) => {
  const { 
    className = "h-10 w-10 rounded-md object-cover", 
    asComponent = true,
    icon = <FiTag />
  } = options;
  
  if (asComponent) {
    if (!imageUrl) {
      return (
        <div className={`bg-gray-200 dark:bg-gray-700 flex items-center justify-center ${className}`}>
          {icon || <FiImage className="h-5 w-5 text-gray-400 dark:text-gray-500" />}
        </div>
      );
    }
    
    return (
      <img 
        src={imageUrl} 
        alt={categoryName || "Category"}
        className={className}
        onError={(e) => {
          e.target.onerror = null; // Prevent infinite loop
          // Replace with a div containing the icon
          const parent = e.target.parentNode;
          if (!parent) return;
          
          const div = document.createElement('div');
          div.className = `bg-gray-200 dark:bg-gray-700 flex items-center justify-center ${className}`;
          div.innerHTML = `
            <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" 
                 stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 text-gray-400 dark:text-gray-500" 
                 xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <path d="M3 9h18"></path>
              <path d="M9 21V9"></path>
            </svg>
          `;
          parent.replaceChild(div, e.target);
        }}
      />
    );
  } else {
    // For string-based HTML (less common use case)
    if (!imageUrl) {
      return `
        <div class="${className} bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" 
               stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 text-gray-400 dark:text-gray-500" 
               xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <path d="M3 9h18"></path>
            <path d="M9 21V9"></path>
          </svg>
        </div>
      `;
    }
    
    return `
      <img src="${imageUrl}" alt="${categoryName || 'Category'}" class="${className}"
           onerror="this.onerror=null; this.parentNode.innerHTML='<div class=\\'${className} bg-gray-200 dark:bg-gray-700 flex items-center justify-center\\'><svg stroke=\\'currentColor\\' fill=\\'none\\' stroke-width=\\'2\\' viewBox=\\'0 0 24 24\\' stroke-linecap=\\'round\\' stroke-linejoin=\\'round\\' class=\\'h-5 w-5 text-gray-400 dark:text-gray-500\\' xmlns=\\'http://www.w3.org/2000/svg\\'><rect x=\\'3\\' y=\\'3\\' width=\\'18\\' height=\\'18\\' rx=\\'2\\' ry=\\'2\\'></rect><path d=\\'M3 9h18\\'></path><path d=\\'M9 21V9\\'></path></svg></div>';" />
    `;
  }
};

/**
 * Get a default image URL for a category
 * @param {string} categoryName - The category name
 * @param {Object} options - Options for image generation
 * @param {string} options.bgColor - Background color (hex code)
 * @param {string} options.textColor - Text color (hex code)
 * @returns {string} - The generated image URL
 */
export const getDefaultCategoryImage = (categoryName, options = {}) => {
  const { bgColor = '5a67d8', textColor = 'ffffff' } = options;
  const firstLetter = categoryName && categoryName.length > 0 ? 
    encodeURIComponent(categoryName.charAt(0).toUpperCase()) : 'C';
    
  // For development with no actual API, use a placeholder service
  return `/api/placeholder/64/64?text=${firstLetter}&bgcolor=${bgColor}&color=${textColor}`;
  
  // For production, you could use a service like
  // return `https://ui-avatars.com/api/?name=${firstLetter}&background=${bgColor}&color=${textColor}&size=64`;
};

/**
 * Generate a color for a category based on its name
 * This ensures the same category always gets the same color
 * @param {string} categoryName - The category name
 * @returns {Object} - The generated color object with bg and text colors
 */
export const getCategoryColor = (categoryName) => {
  // Color palette for categories (background colors)
  const bgColors = [
    'bg-blue-100 dark:bg-blue-900/20',
    'bg-green-100 dark:bg-green-900/20',
    'bg-yellow-100 dark:bg-yellow-900/20',
    'bg-red-100 dark:bg-red-900/20',
    'bg-purple-100 dark:bg-purple-900/20',
    'bg-pink-100 dark:bg-pink-900/20',
    'bg-indigo-100 dark:bg-indigo-900/20',
  ];
  
  // Matching text colors
  const textColors = [
    'text-blue-800 dark:text-blue-300',
    'text-green-800 dark:text-green-300',
    'text-yellow-800 dark:text-yellow-300',
    'text-red-800 dark:text-red-300',
    'text-purple-800 dark:text-purple-300',
    'text-pink-800 dark:text-pink-300',
    'text-indigo-800 dark:text-indigo-300',
  ];
  
  // Generate a simple hash from the category name
  let hash = 0;
  if (!categoryName) return { bg: bgColors[0], text: textColors[0] };
  
  for (let i = 0; i < categoryName.length; i++) {
    hash = categoryName.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Get a positive index within the color array range
  const index = Math.abs(hash) % bgColors.length;
  
  return {
    bg: bgColors[index],
    text: textColors[index],
    // Also return hex versions for avatar generation
    bgHex: ['5a67d8', '48bb78', 'ecc94b', 'f56565', '9f7aea', 'ed64a6', '667eea'][index],
    textHex: 'ffffff'
  };
};

/**
 * Render a hierarchical list of categories with proper indentation and structure
 * @param {Array} categories - Array of category objects with children
 * @param {Object} options - Configuration options
 * @param {Function} options.onSelect - Handler for category selection
 * @param {Function} options.onToggle - Handler for toggling category expansion
 * @param {Object} options.expanded - Object mapping category IDs to expansion state
 * @param {Set} options.selected - Set of selected category IDs
 * @returns {Array} - Array of rendered category items
 */
export const renderCategoryHierarchy = (
  categories, 
  { onSelect, onToggle, expanded = {}, selected = new Set() } = {}
) => {
  if (!categories || !Array.isArray(categories) || categories.length === 0) {
    return [];
  }
  
  const renderCategory = (category, level = 0) => {
    const isExpanded = expanded[category.id];
    const isSelected = selected.has(category.id);
    const hasChildren = category.children && category.children.length > 0;
    const colorInfo = getCategoryColor(category.name);
    
    const indentClass = level > 0 ? `ml-${level * 4}` : '';
    const itemClass = `
      ${indentClass} flex items-center p-2 rounded-md my-1
      ${isSelected ? 'bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}
    `;
    
    const result = [
      <div key={category.id} className={itemClass}>
        {/* Toggle button for expandable categories */}
        <div className="w-6 flex justify-center">
          {hasChildren && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onToggle && onToggle(category.id);
              }}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            >
              <svg 
                className={`w-4 h-4 transition-transform ${isExpanded ? 'transform rotate-90' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
        
        {/* Category content */}
        <div 
          className="flex-grow flex items-center cursor-pointer py-1"
          onClick={() => onSelect && onSelect(category.id)}
        >
          {renderCategoryImage(category.image, category.name, {
            className: "h-8 w-8 rounded-md mr-3"
          })}
          <span className="font-medium">{category.name}</span>
          
          {category.productCount !== undefined && (
            <span className={`ml-auto text-xs rounded-full px-2 py-1 ${colorInfo.bg} ${colorInfo.text}`}>
              {category.productCount}
            </span>
          )}
        </div>
      </div>
    ];
    
    // Render children if there are any and the category is expanded
    if (hasChildren && isExpanded) {
      category.children.forEach(child => {
        result.push(...renderCategory(child, level + 1));
      });
    }
    
    return result;
  };
  
  // Render all top-level categories
  let result = [];
  categories.forEach(category => {
    result.push(...renderCategory(category));
  });
  
  return result;
};

/**
 * Get breadcrumb path for a category in a hierarchy
 * @param {Array} categories - Full category hierarchy
 * @param {number|string} categoryId - ID of the target category
 * @returns {Array} - Array of category objects forming the path
 */
export const getCategoryBreadcrumb = (categories, categoryId) => {
  const path = [];
  
  // Helper function to find category and build path
  const findCategory = (cats, id, currentPath = []) => {
    if (!cats || !Array.isArray(cats)) return false;
    
    for (const cat of cats) {
      // Create a new path including this category
      const newPath = [...currentPath, cat];
      
      // If this is the category we're looking for, return the path
      if (cat.id == id) {
        path.push(...newPath);
        return true;
      }
      
      // Otherwise check children
      if (cat.children && cat.children.length > 0) {
        if (findCategory(cat.children, id, newPath)) {
          return true;
        }
      }
    }
    
    return false;
  };
  
  findCategory(categories, categoryId);
  return path;
};