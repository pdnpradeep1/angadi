// src/components/ui/ToggleSwitch.js
import React from 'react';

export const ToggleSwitch = ({ checked, onChange, label, description, labelPosition = 'left' }) => {
  return (
    <div className="flex justify-between items-center">
      {labelPosition === 'left' && label && (
        <div>
          {typeof label === 'string' ? <h3 className="text-sm font-medium text-gray-900 dark:text-white">{label}</h3> : label}
          {description && <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>}
        </div>
      )}
      <label className="relative inline-flex items-center cursor-pointer">
        <input 
          type="checkbox" 
          checked={checked} 
          onChange={onChange}
          className="sr-only peer" 
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
      </label>
      {labelPosition === 'right' && label && (
        <div>
          {typeof label === 'string' ? <h3 className="text-sm font-medium text-gray-900 dark:text-white">{label}</h3> : label}
          {description && <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>}
        </div>
      )}
    </div>
  );
};