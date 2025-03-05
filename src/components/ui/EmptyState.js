// src/components/ui/EmptyState.js
import React from 'react';
import { Button } from './Button';

/**
 * EmptyState component for displaying when a section has no data
 * 
 * @param {Object} props
 * @param {string} props.imageUrl - URL for the illustration image (optional)
 * @param {string} props.title - Main title text
 * @param {string} props.description - Description text
 * @param {string} props.buttonText - Text for the primary CTA button
 * @param {Function} props.onButtonClick - Click handler for the primary button
 * @param {string} props.linkText - Text for the optional help link
 * @param {string} props.linkUrl - URL for the optional help link
 * @param {boolean} props.vertical - Whether to display in vertical layout (default) or horizontal
 */
const EmptyState = ({ 
  imageUrl = '/api/placeholder/100/100',
  title, 
  description, 
  buttonText, 
  onButtonClick, 
  linkText,
  linkUrl = '#',
  vertical = true
}) => {
  const containerClass = vertical
    ? "flex flex-col items-center justify-center text-center py-12"
    : "flex items-center justify-between p-8";

  return (
    <div className={containerClass}>
      <div className={vertical ? "mb-6" : "mr-8"}>
        <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-8 inline-flex items-center justify-center">
          <img src={imageUrl} alt={title} className="h-24 w-24" />
        </div>
      </div>
      
      <div className={vertical ? "text-center" : "flex-1"}>
        <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">{title}</h2>
        <p className={`text-gray-600 dark:text-gray-400 ${vertical ? "max-w-lg mx-auto" : ""} mb-6`}>
          {description}
        </p>
        {buttonText && (
          <Button onClick={onButtonClick}>
            {buttonText}
          </Button>
        )}
        {linkText && (
          <a 
            href={linkUrl} 
            className="mt-4 block text-blue-600 dark:text-blue-400 hover:underline text-sm"
          >
            {linkText}
          </a>
        )}
      </div>
    </div>
  );
};

export default EmptyState;