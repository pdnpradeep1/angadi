// src/components/sections/BaseSection.js
import React from 'react';

/**
 * BaseSection provides a consistent structure for all settings sections
 * 
 * @param {Object} props
 * @param {string} props.title - The section title
 * @param {string} props.description - Optional description text
 * @param {React.ReactNode} props.children - Section content
 * @param {React.ReactNode} props.actions - Optional action buttons for the header
 * @param {string} props.className - Additional classes for the container
 */
const BaseSection = ({ 
  title, 
  description, 
  children, 
  actions,
  className = ''
}) => {
  return (
    <div className={`p-6 ${className}`}>
      {(title || actions) && (
        <div className="flex justify-between items-center mb-6">
          {title && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{title}</h2>
              {description && <p className="text-gray-600 dark:text-gray-400">{description}</p>}
            </div>
          )}
          {actions && <div>{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default BaseSection;