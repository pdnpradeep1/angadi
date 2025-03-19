import React, { useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import ColorPicker from './ColorPicker';
import SizePicker from './SizePicker';

/**
 * Component for editing variant attributes (options)
 * 
 * @param {Object} props - Component properties
 * @param {Object} props.option - The option object with name and values
 * @param {Function} props.onNameChange - Handler for option name change
 * @param {Function} props.onValuesChange - Handler for option values change
 * @param {Function} props.onDelete - Handler for deleting the option
 * @param {Array} props.suggestions - Optional suggestions for option types
 * @param {boolean} props.showSuggestions - Whether to show suggestions dropdown
 * @param {Function} props.onSuggestionSelect - Handler for selecting a suggestion
 * @param {Function} props.onNameFocus - Handler for when name input is focused
 */
const VariantAttributeEditor = ({ 
  option, 
  onNameChange, 
  onValuesChange, 
  onDelete,
  suggestions = [],
  showSuggestions = false,
  onSuggestionSelect,
  onNameFocus
}) => {
  // Handle adding a color
  const handleColorAdd = (color) => {
    if (!option.values.includes(color)) {
      onValuesChange([...option.values, color]);
    }
  };
  
  // Handle removing a color
  const handleColorRemove = (color, index) => {
    const newValues = [...option.values];
    newValues.splice(index, 1);
    onValuesChange(newValues);
  };
  
  // Handle adding a size
  const handleSizeAdd = (size) => {
    if (!option.values.includes(size)) {
      onValuesChange([...option.values, size]);
    }
  };
  
  // Handle removing a size
  const handleSizeRemove = (size, index) => {
    const newValues = [...option.values];
    newValues.splice(index, 1);
    onValuesChange(newValues);
  };
  
  // Render appropriate editor based on option type
  const renderEditor = () => {
    const optionNameLower = option.name.toLowerCase();
    
    if (optionNameLower === 'color picker' || optionNameLower === 'color') {
      return (
        <ColorPicker 
          selectedColors={option.values}
          onColorAdd={handleColorAdd}
          onColorRemove={handleColorRemove}
        />
      );
    } else if (optionNameLower === 'size') {
      return (
        <SizePicker 
          selectedSizes={option.values}
          onSizeAdd={handleSizeAdd}
          onSizeRemove={handleSizeRemove}
        />
      );
    } else {
      // Default text input for other option types
      return (
        <textarea
          value={option.values.join(', ')}
          onChange={(e) => {
            // Parse comma-separated or Enter-separated values
            const valueArray = e.target.value
              .split(/[,\n]/)
              .map(v => v.trim())
              .filter(v => v !== '');
            
            onValuesChange(valueArray);
          }}
          placeholder="Separate values with commas or press enter"
          className="block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2.5"
          rows={2}
        />
      );
    }
  };
  
  return (
    <div className="mb-6">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Option name <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            value={option.name}
            onChange={(e) => onNameChange(e.target.value)}
            onFocus={() => onNameFocus && onNameFocus(option.id)}
            placeholder="E.g. Style, Material, Size, Color"
            className="block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2.5"
          />
          
          {/* Suggestions dropdown right below the input */}
          {showSuggestions && (
            <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700">
              <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">SUGGESTIONS</p>
              </div>
              <div className="max-h-48 overflow-y-auto">
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => onSuggestionSelect && onSuggestionSelect(suggestion)}
                  >
                    <p className="text-sm text-gray-700 dark:text-gray-300">{suggestion.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <button 
            type="button"
            onClick={onDelete}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-500"
            aria-label="Delete option"
          >
            <FiTrash2 id={`trash-${option.id}`} size={20} />
          </button>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Option values <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          {renderEditor()}
        </div>
      </div>
    </div>
  );
};

export default VariantAttributeEditor;