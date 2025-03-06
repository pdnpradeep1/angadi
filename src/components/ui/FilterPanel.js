// src/components/ui/FilterPanel.js
import React from 'react';
import { FiCalendar, FiDollarSign } from 'react-icons/fi';

/**
 * Reusable filter panel component supporting various filter types
 * 
 * @param {Object} props - Component properties
 * @param {boolean} props.isOpen - Whether the filter panel is open
 * @param {Object} props.filters - Filter configuration object
 * @param {Function} props.onFilterChange - Function to call when a filter value changes
 * @param {Function} props.onApply - Function to call when apply button is clicked
 * @param {Function} props.onClear - Function to call when clear button is clicked
 * @param {string} props.className - Additional class names (optional)
 */
const FilterPanel = ({ 
  isOpen, 
  filters = {}, 
  onFilterChange, 
  onApply, 
  onClear,
  className = ''
}) => {
  if (!isOpen) return null;
  
  const handleFilterChange = (key, value) => {
    if (onFilterChange) {
      onFilterChange(key, value);
    }
  };
  
  // Render a date range filter
  const renderDateRangeFilter = (key, filter) => (
    <div className="flex gap-2 items-center">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiCalendar className="text-gray-400" size={14} />
        </div>
        <input
          type="date"
          name={`${key}From`}
          value={filter.from || ''}
          onChange={(e) => handleFilterChange(`${key}From`, e.target.value)}
          className="pl-8 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
        />
      </div>
      <span className="text-gray-500">to</span>
      <input
        type="date"
        name={`${key}To`}
        value={filter.to || ''}
        onChange={(e) => handleFilterChange(`${key}To`, e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
      />
    </div>
  );
  
  // Render a select dropdown filter
  const renderSelectFilter = (key, filter) => (
    <select
      name={key}
      value={filter.value || ''}
      onChange={(e) => handleFilterChange(key, e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
    >
      <option value="">{filter.placeholderOption || 'All'}</option>
      {filter.options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
  
  // Render a number range filter
  const renderNumberRangeFilter = (key, filter) => (
    <div className="flex gap-2 items-center">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiDollarSign className="text-gray-400" size={14} />
        </div>
        <input
          type="number"
          name={`${key}Min`}
          value={filter.from || ''}
          onChange={(e) => handleFilterChange(`${key}Min`, e.target.value)}
          placeholder="Min"
          className="pl-8 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
        />
      </div>
      <span className="text-gray-500">to</span>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiDollarSign className="text-gray-400" size={14} />
        </div>
        <input
          type="number"
          name={`${key}Max`}
          value={filter.to || ''}
          onChange={(e) => handleFilterChange(`${key}Max`, e.target.value)}
          placeholder="Max"
          className="pl-8 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
        />
      </div>
    </div>
  );
  
  // Render a text input filter
  const renderTextFilter = (key, filter) => (
    <input
      type={filter.type || 'text'}
      name={key}
      value={filter.value || ''}
      onChange={(e) => handleFilterChange(key, e.target.value)}
      placeholder={filter.placeholder || ''}
      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
    />
  );
  
  return (
    <div className={`mt-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 ${className}`}>
      <h3 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">Filters</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(filters).map(([key, filter]) => (
          <div key={key}>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              {filter.label}
            </label>
            
            {filter.type === 'date-range' && renderDateRangeFilter(key, filter)}
            {filter.type === 'select' && renderSelectFilter(key, filter)}
            {filter.type === 'number-range' && renderNumberRangeFilter(key, filter)}
            {!filter.type || (filter.type !== 'date-range' && filter.type !== 'select' && filter.type !== 'number-range') && renderTextFilter(key, filter)}
          </div>
        ))}
      </div>
      
      <div className="flex justify-end mt-4 gap-2">
        <button
          onClick={onClear}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          Clear Filters
        </button>
        <button
          onClick={onApply}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;