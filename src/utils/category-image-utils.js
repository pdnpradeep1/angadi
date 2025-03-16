// src/utils/category-image-utils.js

/**
 * Renders a category image with fallback for missing images that matches product image style
 * @param {string} imageUrl - The image URL to render
 * @param {string} categoryName - Category name for the alt text and fallback display
 * @param {Object} options - Additional options
 * @param {string} options.className - Additional classes for the image
 * @param {boolean} options.asComponent - Whether to return JSX (true) or HTML string (false)
 * @returns {JSX.Element|string} The image or fallback component
 */
import { FiImage } from 'react-icons/fi';
import React from 'react';

export const renderCategoryImage = (imageUrl, categoryName, options = {}) => {
  const { className = "h-10 w-10 rounded-md object-cover", asComponent = true } = options;
  
  if (asComponent) {
    if (!imageUrl) {
      return (
        <div className={`bg-gray-200 dark:bg-gray-700 flex items-center justify-center ${className}`}>
          <FiImage className="h-5 w-5 text-gray-400 dark:text-gray-500" />
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
          const div = document.createElement('div');
          div.className = `bg-gray-200 dark:bg-gray-700 flex items-center justify-center ${className}`;
          div.innerHTML = `
            <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" 
                 stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 text-gray-400 dark:text-gray-500" 
                 xmlns="http://www.w3.org/2000/svg">
              <path d="M20 4h-16c-1.1 0-2 0.9-2 2v12c0 1.1 0.9 2 2 2h16c1.1 0 2-0.9 2-2v-12c0-1.1-0.9-2-2-2z"></path>
              <path d="M4 4v16"></path>
              <path d="M20 4v16"></path>
              <path d="M7 4h.01"></path>
              <path d="M7 8h.01"></path>
              <path d="M7 12h.01"></path>
              <path d="M7 16h.01"></path>
            </svg>
          `;
          if (parent) {
            parent.replaceChild(div, e.target);
          }
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
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
            <path d="M3 9h18"></path>
            <path d="M9 21V9"></path>
          </svg>
        </div>
      `;
    }
    
    return `
      <img src="${imageUrl}" alt="${categoryName || 'Category'}" class="${className}"
           onerror="this.onerror=null; this.parentNode.innerHTML='<div class=\\'${className} bg-gray-200 dark:bg-gray-700 flex items-center justify-center\\'><svg stroke=\\'currentColor\\' fill=\\'none\\' stroke-width=\\'2\\' viewBox=\\'0 0 24 24\\' stroke-linecap=\\'round\\' stroke-linejoin=\\'round\\' class=\\'h-5 w-5 text-gray-400 dark:text-gray-500\\' xmlns=\\'http://www.w3.org/2000/svg\\'><rect width=\\'18\\' height=\\'18\\' x=\\'3\\' y=\\'3\\' rx=\\'2\\' ry=\\'2\\'></rect><path d=\\'M3 9h18\\'></path><path d=\\'M9 21V9\\'></path></svg></div>';" />
    `;
  }
};

// Function to get a default image URL for a category
export const getDefaultCategoryImage = (categoryName) => {
  return `/api/placeholder/50/50?text=${categoryName ? categoryName.charAt(0) : 'C'}`;
};