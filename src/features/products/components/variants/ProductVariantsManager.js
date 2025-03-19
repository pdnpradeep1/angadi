import React, { useState, useEffect } from 'react';
import VariantTable from './VariantTable';
import VariantModal from './VariantModal';
import { getCombinations, generateVariantId } from './utils/variantHelpers';
import { 
  normalizeVariantsForUI, 
  prepareVariantsForAPI, 
  extractOptionsMapForProduct,
  extractOptionsMapFromOptionTypes, 
  createEmptyVariant 
} from './utils/variantTransformers';

/**
 * Main component for managing product variants
 * Handles state management and coordinates between sub-components
 * 
 * @param {Object} props - Component properties
 * @param {Array} props.initialVariants - Initial variants from API
 * @param {Function} props.onChange - Handler for variants changes
 * @param {number} props.productId - Product ID for variants
 */
const ProductVariantsManager = ({ initialVariants = [], onChange, productId }) => {
  // State for options and their values
  const [optionTypes, setOptionTypes] = useState([
    { id: 1, name: '', values: [] }
  ]);
  
  // State for the modal display
  const [showModal, setShowModal] = useState(false);
  
  // State for generated variants
  const [variants, setVariants] = useState([]);
  
  // Initialize variants from props
  useEffect(() => {
    if (initialVariants && initialVariants.length > 0) {
      const normalizedVariants = normalizeVariantsForUI(initialVariants, productId);
      setVariants(normalizedVariants);
      
      // Extract option types from variants if they exist
      if (normalizedVariants.length > 0 && normalizedVariants[0].options) {
        // Group all unique option types and their values
        const extractedOptionTypes = {};
        
        normalizedVariants.forEach(variant => {
          if (variant.options && Array.isArray(variant.options)) {
            variant.options.forEach(option => {
              if (!extractedOptionTypes[option.name]) {
                extractedOptionTypes[option.name] = {
                  id: generateVariantId(),
                  name: option.name,
                  values: []
                };
              }
              
              if (!extractedOptionTypes[option.name].values.includes(option.value)) {
                extractedOptionTypes[option.name].values.push(option.value);
              }
            });
          }
        });
        
        // Convert to array and set if we found any option types
        const optionTypesArray = Object.values(extractedOptionTypes);
        if (optionTypesArray.length > 0) {
          setOptionTypes(optionTypesArray);
        }
      }
    }
  }, [initialVariants, productId]);
  
  // Generate all possible variant combinations
  const generateVariants = () => {
    // Check if we have options and values
    const validOptions = optionTypes.filter(
      option => option.name && option.values.length > 0
    );
    
    if (validOptions.length === 0) {
      return;
    }
    
    const combinations = getCombinations(validOptions);
    
    // Create variant objects with consistent field structure
    const newVariants = combinations.map(combo => {
      // Generate a unique variantId
      const variantId = generateVariantId();
      
      // Convert options array to attributes format
      const attributes = combo.reduce((acc, option) => {
        acc[option.name] = option.value;
        return acc;
      }, {});
      
      // Generate name from option values
      const name = combo.map(option => option.value).join(' / ');
      
      return {
        id: variantId,              // Include id field for backend API
        variantId: variantId,       // Include variantId for UI components
        name: name,                 // Generate name from option values
        productId: productId,       // Use the productId passed as prop
        options: combo,             // Keep the options array for UI
        attributes: attributes,     // Include formatted attributes for API
        price: '',                  // Empty price field
        originalPrice: '',          // Empty originalPrice field
        discountedPrice: '',        // Empty discountedPrice field for UI compatibility
        sku: `SKU-${variantId}`,    // Generate a SKU
        stockQuantity: 'Unlimited', // Default to unlimited stock
        quantity: 'Unlimited',      // Duplicate field for UI compatibility
        weight: '',
        weightUnit: 'kg',
        gtin: '',
        inStock: true
      };
    });
    
    console.log('Generated variants:', newVariants);
    setVariants(newVariants);
    
    // Notify parent of the new variants
    if (onChange) {
      // Extract options map directly from option types
      const optionsMap = extractOptionsMapFromOptionTypes(validOptions);
      console.log('Generated optionsMap:', optionsMap);
      
      // Prepare variants for API
      const variantsForAPI = prepareVariantsForAPI(newVariants, productId);
      onChange(variantsForAPI, optionsMap);
    }
  };
  
  // Update variant details
  const updateVariant = (variantId, field, value) => {
    console.log(`Updating variant ${variantId}, field: ${field}, value: ${value}`);
    
    const updatedVariants = variants.map(variant => {
      if (variant.variantId === variantId || variant.id === variantId) {
        // For certain fields, update both the UI and API versions of the field
        if (field === 'price') {
          return { ...variant, price: value };
        } 
        else if (field === 'discountedPrice' || field === 'originalPrice') {
          return { 
            ...variant, 
            discountedPrice: value,
            originalPrice: value  // Store in both fields
          };
        }
        else if (field === 'quantity' || field === 'stockQuantity') {
          return { 
            ...variant, 
            quantity: value,
            stockQuantity: value  // Store in both fields
          };
        }
        else if (field === 'name') {
          // Handle name field separately
          return { ...variant, name: value };
        }
        // Default case
        return { ...variant, [field]: value };
      }
      return variant;
    });
    
    console.log('Updated variants array:', updatedVariants);
    setVariants(updatedVariants);
    
    // Notify parent of changes
    if (onChange) {
      // Extract options map from variants or from option types
      const optionsMap = optionTypes.length > 0 
        ? extractOptionsMapFromOptionTypes(optionTypes) 
        : extractOptionsMapForProduct(updatedVariants);
      
      console.log('Updated optionsMap:', optionsMap);
      
      // Prepare variants for API
      const variantsForAPI = prepareVariantsForAPI(updatedVariants, productId);
      onChange(variantsForAPI, optionsMap);
    }
  };
  
  // Delete a variant by ID
  const deleteVariant = (variantId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this variant?");
    
    if (confirmDelete) {
      const updatedVariants = variants.filter(variant => 
        variant.variantId !== variantId && variant.id !== variantId
      );
      
      console.log('Variants after deletion:', updatedVariants);
      setVariants(updatedVariants);
      
      // Notify parent of changes
      if (onChange) {
        // Extract options map from option types or from variants
        const optionsMap = optionTypes.length > 0 
          ? extractOptionsMapFromOptionTypes(optionTypes) 
          : extractOptionsMapForProduct(updatedVariants);
        
        console.log('Deleted variant optionsMap:', optionsMap);
        
        // Prepare variants for API
        const variantsForAPI = prepareVariantsForAPI(updatedVariants, productId);
        onChange(variantsForAPI, optionsMap);
      }
    }
  };
  
  // Toggle modal display
  const toggleModal = (e) => {
    e && e.preventDefault();
    
    // When opening the modal, ensure we have at least one option type
    if (!showModal && optionTypes.length === 0) {
      setOptionTypes([{ id: 1, name: '', values: [] }]);
    }
    
    setShowModal(!showModal);
  };
  
  // Render product variants component
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
        
        {/* Variants Table */}
        {variants.length > 0 ? (
          <VariantTable 
            variants={variants} 
            onVariantUpdate={updateVariant}
            onEditVariants={toggleModal}
            onDeleteVariant={deleteVariant}
          />
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
      <VariantModal 
        isOpen={showModal}
        onClose={toggleModal}
        optionTypes={optionTypes}
        onOptionTypesChange={setOptionTypes}
        onGenerateVariants={generateVariants}
      />
    </div>
  );
};

export default ProductVariantsManager;