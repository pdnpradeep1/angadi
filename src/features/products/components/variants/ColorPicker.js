import React from 'react';
import { FiX } from 'react-icons/fi';
import { getCommonColors, getColorNameFromHex } from './utils/variantHelpers';

/**
 * Reusable color picker component
 * 
 * @param {Object} props - Component properties
 * @param {Array} props.selectedColors - Array of selected color names
 * @param {Function} props.onColorAdd - Handler for adding a color
 * @param {Function} props.onColorRemove - Handler for removing a color
 */
const ColorPicker = ({ selectedColors = [], onColorAdd, onColorRemove }) => {
  const commonColors = getCommonColors();
  
  // Predefined color palette hex codes
  const colorPalette = [
    '#FF0000', '#0000FF', '#008000', '#000000', '#FFFFFF', 
    '#FFA500', '#FFFF00', '#800080', '#FFC0CB', '#A52A2A', 
    '#B22222', '#9ACD32'
  ];
  
  // Get background color for a color name
  const getColorBackground = (color) => {
    const lowerColor = color.toLowerCase();
    return commonColors[lowerColor] || '#cccccc';
  };
  
  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2.5 bg-white dark:bg-gray-700">
      {/* Selected colors */}
      <div className="flex flex-wrap gap-2 mb-3">
        {selectedColors.map((color, idx) => (
          <div
            key={idx}
            className="rounded-full px-3 py-1 flex items-center gap-1 bg-gray-100 dark:bg-gray-600"
          >
            <span 
              className="w-4 h-4 rounded-full inline-block border border-gray-300" 
              style={{ backgroundColor: getColorBackground(color) }}
            ></span>
            {color}
            <button
              type="button"
              onClick={() => onColorRemove(color, idx)}
              className="ml-1 text-gray-500 hover:text-gray-700"
              aria-label={`Remove ${color}`}
            >
              <FiX size={14} />
            </button>
          </div>
        ))}
      </div>
      
      {/* Color input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Choose color or type a custom one"
          className="w-full p-2 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.target.value.trim() !== '') {
              e.preventDefault();
              onColorAdd(e.target.value.trim());
              e.target.value = '';
            }
          }}
          aria-label="Enter custom color"
        />
      </div>
      
      {/* Color palette */}
      <div className="mt-3">
        <p className="text-xs text-gray-500 mb-2">Common colors:</p>
        <div className="flex flex-wrap gap-2">
          {colorPalette.map((color, idx) => (
            <button
              type="button"
              key={idx}
              className="w-6 h-6 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              style={{ backgroundColor: color }}
              onClick={() => {
                const colorName = getColorNameFromHex(color);
                if (!selectedColors.includes(colorName)) {
                  onColorAdd(colorName);
                }
              }}
              aria-label={getColorNameFromHex(color)}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;