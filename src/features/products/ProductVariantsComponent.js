import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiX, FiInfo } from 'react-icons/fi';

const ProductVariantsComponent = ({ initialVariants = [], onChange }) => {
  // State for options and their values
  const [optionTypes, setOptionTypes] = useState([
    { id: 1, name: '', values: [] }
  ]);
  
  // State for the modal display
  const [showModal, setShowModal] = useState(false);
  
  // State for generated variants
  const [variants, setVariants] = useState(initialVariants || []);
  
  // State for suggestions for common option types
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionField, setActiveSuggestionField] = useState(null);
  
  // Sample suggestions
  const suggestions = {
    optionTypes: [
      { id: 'size', name: 'size' },
      { id: 'color', name: 'color picker' },
      { id: 'material', name: 'material' },
      { id: 'style', name: 'style' }
    ],
    values: {
      size: ['S', 'M', 'L', 'XL', 'XXL'],
      color: ['Red', 'Blue', 'Green', 'Black', 'White', 'Fire Brick', 'Yellow Green', 'Pink', 'Brown']
    }
  };
  
  // Update parent component when variants change
  useEffect(() => {
    if (onChange) {
      onChange(variants);
    }
  }, [variants, onChange]);
  
  // Handle option name change
  const handleOptionNameChange = (id, value) => {
    setOptionTypes(prev => 
      prev.map(option => 
        option.id === id ? { ...option, name: value } : option
      )
    );
    
    // If typing in a field, show suggestions
    if (value.trim() !== '') {
      setShowSuggestions(true);
      setActiveSuggestionField(id);
    } else {
      setShowSuggestions(false);
    }
  };
  
  // Handle option value input
  const handleOptionValueInput = (id, values) => {
    // Parse comma-separated or Enter-separated values
    const valueArray = values
      .split(/[,\n]/)
      .map(v => v.trim())
      .filter(v => v !== '');
    
    setOptionTypes(prev => 
      prev.map(option => 
        option.id === id ? { ...option, values: valueArray } : option
      )
    );
  };
  
  // Handle Enter key press in size input to add values
  const handleSizeKeyDown = (e, optionId) => {
    if (e.key === 'Enter' && e.target.value.trim() !== '') {
      const newValue = e.target.value.trim();
      
      setOptionTypes(prev => 
        prev.map(option => 
          option.id === optionId ? 
            { ...option, values: [...option.values, newValue] } : 
            option
        )
      );
      
      e.target.value = '';
      e.preventDefault();
    }
  };
  
  // Handle selecting a suggestion
  const handleSelectSuggestion = (suggestion) => {
    if (activeSuggestionField) {
      setOptionTypes(prev => 
        prev.map(option => 
          option.id === activeSuggestionField ? 
          { ...option, name: suggestion.name } : option
        )
      );
      setShowSuggestions(false);
    }
  };
  
  // Generate all possible variant combinations
  // const generateVariants = (e) => {
  //   // Prevent form submission
  //   e && e.preventDefault();
    
  //   // Check if we have options and values
  //   const validOptions = optionTypes.filter(
  //     option => option.name && option.values.length > 0
  //   );
    
  //   if (validOptions.length === 0) {
  //     return;
  //   }
    
  //   const combinations = getCombinations(validOptions);
    
  //   // Create variant objects
  //   const newVariants = combinations.map(combo => ({
  //     id: Math.random().toString(36).substr(2, 9),
  //     options: combo,
  //     price: 'Eg. 99',
  //     discountedPrice: 'Eg. 99',
  //     sku: 'Eg. 1000000001',
  //     quantity: 'Unlimited',
  //     weight: '1.2',
  //     weightUnit: 'kg',
  //     gtin: 'Enter GTIN',
  //     googleCategory: 'Enter Category name',
  //     inStock: true
  //   }));
    
  //   // Update local state only, parent will handle saving to backend when appropriate
  //   setVariants(newVariants);
  //   setShowModal(false);
  // };

  const generateVariants = (e) => {
    // Prevent form submission
    e && e.preventDefault();
    
    // Check if we have options and values
    const validOptions = optionTypes.filter(
      option => option.name && option.values.length > 0
    );
    
    if (validOptions.length === 0) {
      return;
    }
    
    const combinations = getCombinations(validOptions);
    
    // Create variant objects
    const newVariants = combinations.map(combo => ({
      // Use a numeric ID (current timestamp + random number) instead of alphanumeric
      id: Date.now() + Math.floor(Math.random() * 1000),
      options: combo,
      price: 'Eg. 99',
      discountedPrice: 'Eg. 99',
      sku: 'Eg. 1000000001',
      quantity: 'Unlimited',
      weight: '1.2',
      weightUnit: 'kg',
      gtin: 'Enter GTIN',
      googleCategory: 'Enter Category name',
      inStock: true
    }));

        setVariants(newVariants);
    setShowModal(false);
  };
  
  // Helper to get all combinations of option values
  const getCombinations = (options) => {
    if (options.length === 0) return [[]];
    
    const [current, ...rest] = options;
    const restCombinations = getCombinations(rest);
    
    return current.values.flatMap(value => 
      restCombinations.map(combo => 
        [{ name: current.name, value }, ...combo]
      )
    );
  };
  
  // Remove a variant
  const removeVariant = (id) => {
    const updatedVariants = variants.filter(variant => variant.id !== id);
    setVariants(updatedVariants);
  };
  
  // Update variant details
  const updateVariant = (id, field, value) => {
    const updatedVariants = variants.map(variant => 
      variant.id === id ? { ...variant, [field]: value } : variant
    );
    setVariants(updatedVariants);
  };
  
  // Determine if variants can be generated
  const canGenerateVariants = optionTypes.every(
    option => option.name && option.values.length > 0
  );
  
  // For color display
  const getColorDisplay = (color) => {
    const commonColors = {
      'red': '#FF0000',
      'blue': '#0000FF',
      'green': '#008000',
      'black': '#000000',
      'white': '#FFFFFF',
      'yellow': '#FFFF00',
      'purple': '#800080',
      'orange': '#FFA500',
      'pink': '#FFC0CB',
      'brown': '#A52A2A',
      'gray': '#808080',
      'fire brick': '#B22222',
      'yellow green': '#9ACD32'
    };
    
    const lowerColor = color.toLowerCase();
    const bgColor = commonColors[lowerColor] || '#cccccc';
    
    return (
      <span className="flex items-center">
        <span 
          className="rounded-full w-4 h-4 mr-1 inline-block border border-gray-300" 
          style={{ backgroundColor: bgColor }}
        ></span>
        {color}
      </span>
    );
  };
  
  // Toggle modal display with preventing form submission
  const toggleModal = (e) => {
    e && e.preventDefault();
    setShowModal(!showModal);
  };
  
  return (
    <div className="max-w-5xl mx-auto">
      {/* Main Variants Section */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Variants</h2>
          <button 
            type="button"
            onClick={toggleModal}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md"
          >
            Add variants
          </button>
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Customize variants for size, color, and more to cater to all your customers' preferences.
        </p>
        
        {variants.length > 0 ? (
          <div>
            {/* Display selected option types as header */}
            <div className="flex flex-wrap gap-2 mb-4">
              {optionTypes
                .filter(opt => opt.name && opt.values.length > 0)
                .map(option => (
                  <div key={option.id} className="font-medium text-gray-700 dark:text-gray-300">
                    {option.name}:
                    <div className="flex flex-wrap gap-1 mt-2">
                      {option.values.map((value, idx) => (
                        <span 
                          key={idx} 
                          className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-sm"
                        >
                          {option.name.toLowerCase().includes('color') 
                            ? getColorDisplay(value) 
                            : value}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Variant
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Discounted price
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      SKU ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Weight
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      GTIN
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {variants.map((variant) => (
                    <tr key={variant.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <button type="button" className="mr-3">
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                          </button>
                          <div>
                            {variant.options.map((option, idx) => (
                              <span key={idx} className="flex items-center">
                                {option.name.toLowerCase().includes('color') 
                                  ? getColorDisplay(option.value) 
                                  : option.value}
                                {idx < variant.options.length - 1 && <span className="mx-1">|</span>}
                              </span>
                            ))}
                            <div className="text-sm text-green-500">In stock</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            ₹
                          </span>
                          <input
                            type="text"
                            className="pl-6 block w-full border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm py-2"
                            placeholder="Eg. 99"
                            value={variant.price}
                            onChange={(e) => updateVariant(variant.id, 'price', e.target.value)}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            ₹
                          </span>
                          <input
                            type="text"
                            className="pl-6 block w-full border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm py-2"
                            placeholder="Eg. 99"
                            value={variant.discountedPrice}
                            onChange={(e) => updateVariant(variant.id, 'discountedPrice', e.target.value)}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          className="block w-full border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm py-2"
                          placeholder="Eg. 1000000001"
                          value={variant.sku}
                          onChange={(e) => updateVariant(variant.id, 'sku', e.target.value)}
                        />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          className="block w-full border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm py-2"
                          placeholder="Unlimited"
                          value={variant.quantity}
                          onChange={(e) => updateVariant(variant.id, 'quantity', e.target.value)}
                        />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <input
                            type="text"
                            className="block w-full border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm py-2"
                            placeholder="Eg. 1.2"
                            value={variant.weight || ''}
                            onChange={(e) => updateVariant(variant.id, 'weight', e.target.value)}
                          />
                          <select 
                            className="ml-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm py-2"
                            onChange={(e) => updateVariant(variant.id, 'weightUnit', e.target.value)}
                            value={variant.weightUnit || 'kg'}
                          >
                            <option value="kg">kg</option>
                            <option value="g">g</option>
                            <option value="lb">lb</option>
                          </select>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          className="block w-full border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm py-2"
                          placeholder="Enter GTIN"
                          value={variant.gtin || ''}
                          onChange={(e) => updateVariant(variant.id, 'gtin', e.target.value)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4">
              <button
                type="button"
                onClick={toggleModal}
                className="text-primary-600 dark:text-primary-400 border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-md"
              >
                Edit or add variants
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <button
              type="button"
              onClick={toggleModal}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-md"
            >
              Add variants
            </button>
          </div>
        )}
      </div>
      
      {/* Variants Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-3xl overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Add variants</h3>
                <button 
                  type="button"
                  onClick={toggleModal}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <FiX size={24} />
                </button>
              </div>
              
              {/* Option Types and Values */}
              {optionTypes.map((option, index) => (
                <div key={option.id} className="mb-6">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Option name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={option.name}
                        onChange={(e) => handleOptionNameChange(option.id, e.target.value)}
                        onFocus={() => {
                          setShowSuggestions(true);
                          setActiveSuggestionField(option.id);
                        }}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        placeholder="E.g. Style, Material"
                        className="block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2.5"
                      />
                      
                      {/* Suggestions dropdown */}
                      {showSuggestions && activeSuggestionField === option.id && (
                        <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700">
                          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">SUGGESTIONS</p>
                          </div>
                          <div className="max-h-48 overflow-y-auto">
                            {suggestions.optionTypes.map((suggestion) => (
                              <div
                                key={suggestion.id}
                                className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                                onClick={() => handleSelectSuggestion(suggestion)}
                              >
                                <p className="text-sm text-gray-700 dark:text-gray-300">{suggestion.name}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Option values <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      {option.name.toLowerCase() === 'color picker' || option.name.toLowerCase() === 'color' ? (
                        <div className="border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2.5 bg-white dark:bg-gray-700">
                          <div className="flex flex-wrap gap-2 mb-3">
                            {option.values.map((color, idx) => (
                              <div
                                key={idx}
                                className="rounded-full px-3 py-1 flex items-center gap-1 bg-gray-100 dark:bg-gray-600"
                              >
                                <span 
                                  className="w-4 h-4 rounded-full inline-block border border-gray-300" 
                                  style={{ 
                                    backgroundColor: 
                                      color.toLowerCase() === 'fire brick' ? '#B22222' : 
                                      color.toLowerCase() === 'yellow green' ? '#9ACD32' : 
                                      color.toLowerCase() === 'pink' ? '#FFC0CB' : 
                                      color.toLowerCase() === 'brown' ? '#A52A2A' :
                                      color.toLowerCase() === 'red' ? '#FF0000' :
                                      color.toLowerCase() === 'blue' ? '#0000FF' :
                                      color.toLowerCase() === 'green' ? '#008000' :
                                      color.toLowerCase() === 'black' ? '#000000' :
                                      color.toLowerCase() === 'white' ? '#FFFFFF' :
                                      color
                                  }}
                                ></span>
                                {color}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    const newValues = [...option.values];
                                    newValues.splice(idx, 1);
                                    setOptionTypes(prev => 
                                      prev.map(opt => 
                                        opt.id === option.id ? { ...opt, values: newValues } : opt
                                      )
                                    );
                                  }}
                                  className="ml-1 text-gray-500 hover:text-gray-700"
                                >
                                  <FiX size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                          
                          {/* Modern Color picker input */}
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="Choose color"
                              className="w-full p-2 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && e.target.value.trim() !== '') {
                                  e.preventDefault();
                                  setOptionTypes(prev => 
                                    prev.map(opt => 
                                      opt.id === option.id ? 
                                      { ...opt, values: [...opt.values, e.target.value.trim()] } : 
                                      opt
                                    )
                                  );
                                  e.target.value = '';
                                }
                              }}
                            />
                          </div>
                          
                          {/* Color palette */}
                          <div className="mt-3 flex flex-wrap gap-2">
                            {['#FF0000', '#0000FF', '#008000', '#000000', '#FFFFFF', '#FFA500', '#FFFF00', '#800080', '#FFC0CB', '#A52A2A', '#B22222', '#9ACD32'].map((color, idx) => (
                              <button
                                type="button"
                                key={idx}
                                className="w-6 h-6 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                style={{ backgroundColor: color }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  // Map color code to name
                                  const colorNames = {
                                    '#FF0000': 'Red',
                                    '#0000FF': 'Blue',
                                    '#008000': 'Green',
                                    '#000000': 'Black',
                                    '#FFFFFF': 'White',
                                    '#FFA500': 'Orange',
                                    '#FFFF00': 'Yellow',
                                    '#800080': 'Purple',
                                    '#FFC0CB': 'Pink',
                                    '#A52A2A': 'Brown',
                                    '#B22222': 'Fire Brick',
                                    '#9ACD32': 'Yellow Green'
                                  };
                                  
                                  const colorName = colorNames[color] || 'Custom';
                                  
                                  // Add this color if it's not already included
                                  if (!option.values.includes(colorName)) {
                                    setOptionTypes(prev => 
                                      prev.map(opt => 
                                        opt.id === option.id ? 
                                        { ...opt, values: [...opt.values, colorName] } : 
                                        opt
                                      )
                                    );
                                  }
                                }}
                              ></button>
                            ))}
                          </div>
                        </div>
                      ) : option.name.toLowerCase() === 'size' ? (
                        <div className="border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2.5 bg-white dark:bg-gray-700">
                          <div className="flex flex-wrap gap-2 mb-3">
                            {option.values.map((size, idx) => (
                              <div
                                key={idx}
                                className="rounded-full px-3 py-1 flex items-center gap-1 bg-gray-100 dark:bg-gray-600"
                              >
                                {size}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    const newValues = [...option.values];
                                    newValues.splice(idx, 1);
                                    setOptionTypes(prev => 
                                      prev.map(opt => 
                                        opt.id === option.id ? { ...opt, values: newValues } : opt
                                      )
                                    );
                                  }}
                                  className="ml-1 text-gray-500 hover:text-gray-700"
                                >
                                  <FiX size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                          
                          {/* Size picker input */}
                          <input
                            type="text"
                            placeholder="Type size and press Enter"
                            className="w-full p-2 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md"
                            onKeyDown={(e) => handleSizeKeyDown(e, option.id)}
                          />
                          
                          {/* Common size suggestions */}
                          <div className="mt-3">
                            <p className="text-xs text-gray-500 mb-2">Common sizes:</p>
                            <div className="flex flex-wrap gap-2">
                              {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                                <button
                                  type="button"
                                  key={size}
                                  className="px-2 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    if (!option.values.includes(size)) {
                                      setOptionTypes(prev => 
                                        prev.map(opt => 
                                          opt.id === option.id ? 
                                          { ...opt, values: [...opt.values, size] } : 
                                          opt
                                        )
                                      );
                                    }
                                  }}
                                >
                                  {size}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <textarea
                          value={option.values.join(', ')}
                          onChange={(e) => handleOptionValueInput(option.id, e.target.value)}
                          placeholder="Separate values with commas or press enter"
                          className="block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2.5"
                          rows={2}
                        />
                      )}
                      
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          const trashIcon = document.getElementById(`trash-${option.id}`);
                          trashIcon.classList.add('text-red-500');
                          setTimeout(() => {
                            trashIcon.classList.remove('text-red-500');
                          }, 300);
                        }}
                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-500"
                      >
                        <FiTrash2 id={`trash-${option.id}`} size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Add another option button - only show if we have less than 2 options */}
              {optionTypes.length < 2 && (
                <button
                  type="button"
                  className="flex items-center text-primary-600 dark:text-primary-400 border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-md mb-6"
                  onClick={(e) => {
                    e.preventDefault();
                    if (optionTypes.length < 2) {
                      setOptionTypes(prev => [
                        ...prev,
                        { id: Date.now(), name: '', values: [] }
                      ]);
                    }
                  }}
                >
                  <FiPlus className="mr-2" /> Add another option
                </button>
              )}
              
              {/* Info text */}
              <div className="flex items-start mb-6 text-gray-500 dark:text-gray-400">
                <FiInfo className="flex-shrink-0 mt-0.5 mr-2" />
                <span>You can add prices, images, quantity, etc after this step.</span>
              </div>
              
              {/* Generate button */}
              <button
                type="button"
                onClick={generateVariants}
                className={`w-full py-3 rounded-md ${
                  canGenerateVariants 
                    ? 'bg-primary-600 hover:bg-primary-700 text-white' 
                    : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }`}
                disabled={!canGenerateVariants}
              >
                Add variants
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default ProductVariantsComponent;