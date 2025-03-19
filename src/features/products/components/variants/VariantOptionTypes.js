import React, { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import VariantAttributeEditor from './VariantAttributeEditor';
import { canGenerateVariants } from './utils/variantHelpers';

/**
 * Component for managing variant option types like size, color, etc.
 * 
 * @param {Object} props - Component properties
 * @param {Array} props.optionTypes - Array of option type objects
 * @param {Function} props.onOptionTypesChange - Handler for option types changes
 * @param {Function} props.onGenerateVariants - Handler for generating variants
 * @param {Array} props.suggestions - Optional suggestions for option types
 */
const VariantOptionTypes = ({ 
  optionTypes = [],
  onOptionTypesChange,
  onGenerateVariants,
  suggestions = []
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionField, setActiveSuggestionField] = useState(null);
  
  // Sample suggestions if not provided
  const defaultSuggestions = {
    optionTypes: [
      { id: 'size', name: 'size' },
      { id: 'color', name: 'color picker' },
      { id: 'material', name: 'material' },
      { id: 'style', name: 'style' }
    ]
  };
  
  const typeSuggestions = suggestions.optionTypes || defaultSuggestions.optionTypes;
  
  // Handle option name change
  const handleOptionNameChange = (id, value) => {
    const updatedOptions = optionTypes.map(option => 
      option.id === id ? { ...option, name: value } : option
    );
    
    onOptionTypesChange(updatedOptions);
    
    // If typing in a field, show suggestions
    if (value.trim() !== '') {
      setShowSuggestions(true);
      setActiveSuggestionField(id);
    } else {
      setShowSuggestions(false);
    }
  };
  
  // Handle option values change
  const handleOptionValuesChange = (id, values) => {
    const updatedOptions = optionTypes.map(option => 
      option.id === id ? { ...option, values } : option
    );
    
    onOptionTypesChange(updatedOptions);
  };
  
  // Handle selecting a suggestion
  const handleSelectSuggestion = (suggestion) => {
    if (activeSuggestionField) {
      const updatedOptions = optionTypes.map(option => 
        option.id === activeSuggestionField ? 
          { ...option, name: suggestion.name } : option
      );
      
      onOptionTypesChange(updatedOptions);
      setShowSuggestions(false);
      setActiveSuggestionField(null);
    }
  };
  
  // Handle input field focus
  const handleInputFocus = (optionId) => {
    setActiveSuggestionField(optionId);
    setShowSuggestions(true);
  };
  
  // Handle deleting an option
  const handleDeleteOption = (id) => {
    const updatedOptions = optionTypes.filter(option => option.id !== id);
    onOptionTypesChange(updatedOptions);
  };
  
  // Handle adding a new option
  const handleAddOption = () => {
    if (optionTypes.length < 2) {
      const newOption = { 
        id: Date.now(), 
        name: '', 
        values: [] 
      };
      
      onOptionTypesChange([...optionTypes, newOption]);
    }
  };
  
  // Check if variants can be generated
  const canGenerate = canGenerateVariants(optionTypes);
  
  return (
    <div>
      {/* Option types editors */}
      {optionTypes.map((option) => (
        <VariantAttributeEditor
          key={option.id}
          option={option}
          onNameChange={(value) => handleOptionNameChange(option.id, value)}
          onValuesChange={(values) => handleOptionValuesChange(option.id, values)}
          onDelete={() => handleDeleteOption(option.id)}
          suggestions={typeSuggestions}
          showSuggestions={showSuggestions && activeSuggestionField === option.id}
          onSuggestionSelect={handleSelectSuggestion}
          onNameFocus={handleInputFocus}
        />
      ))}
      
      {/* Add another option button - only show if less than 2 options */}
      {optionTypes.length < 2 && (
        <button
          type="button"
          className="flex items-center text-primary-600 dark:text-primary-400 border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-md mb-6"
          onClick={handleAddOption}
        >
          <FiPlus className="mr-2" /> Add another option
        </button>
      )}
      
      {/* Generate variants button */}
      <button
        type="button"
        onClick={onGenerateVariants}
        className={`w-full py-3 rounded-md ${
          canGenerate 
            ? 'bg-primary-600 hover:bg-primary-700 text-white' 
            : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
        }`}
        disabled={!canGenerate}
      >
        Add variants
      </button>
    </div>
  );
};

export default VariantOptionTypes;
