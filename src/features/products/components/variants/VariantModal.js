import React from 'react';
import { FiX, FiInfo } from 'react-icons/fi';
import VariantOptionTypes from './VariantOptionTypes';
import { getCombinations, generateVariantId } from './utils/variantHelpers';

/**
 * Modal component for adding and editing variants with update preservation
 * 
 * @param {Object} props - Component properties
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Handler for closing the modal
 * @param {Array} props.optionTypes - Current option types
 * @param {Function} props.onOptionTypesChange - Handler for option types changes
 * @param {Function} props.onGenerateVariants - Handler for generating variants
 * @param {Array} props.existingVariants - Existing variants to preserve
 */
const VariantModal = ({ 
  isOpen, 
  onClose, 
  optionTypes = [], 
  onOptionTypesChange,
  onGenerateVariants,
  existingVariants = []
}) => {
  if (!isOpen) return null;

  // Keep track of the current option set for comparison
  const currentOptionSet = JSON.stringify(
    optionTypes
      .filter(opt => opt.name && opt.values && opt.values.length > 0)
      .map(opt => ({ name: opt.name, values: [...opt.values] }))
  );

  // Enhanced generate variants handler that preserves existing variants
  const handleEnhancedGenerateVariants = (e) => {
    // Safely handle event prevention - check if e is an actual DOM event first
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation();
    }

    console.log("VariantModal: handleEnhancedGenerateVariants called");
    
    // Filter valid options 
    const validOptions = optionTypes.filter(
      option => option.name && option.values.length > 0
    );
    
    if (validOptions.length === 0) {
      console.log('No valid options to generate variants from');
      return;
    }
    
    // Generate all possible combinations of options
    const combinations = getCombinations(validOptions);
    console.log(`Generated ${combinations.length} combinations`);
    
    // If there are existing variants, we want to:
    // 1. Keep variants whose options still exist in the new option set
    // 2. Add new variants for new option combinations
    // 3. Remove variants whose options no longer exist
    
    // First, create a map of existing variants by their option signature
    const existingVariantMap = {};
    existingVariants.forEach(variant => {
      if (variant.options && Array.isArray(variant.options)) {
        // Create a signature based on the sorted options
        const signature = variant.options
          .slice()
          .sort((a, b) => a.name.localeCompare(b.name))
          .map(opt => `${opt.name}:${opt.value}`)
          .join('|');
        existingVariantMap[signature] = variant;
      }
    });
    
    // Create new variants array, preserving existing data where possible
    const newVariants = combinations.map(combo => {
      // Create signature for this combination
      const signature = combo
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(opt => `${opt.name}:${opt.value}`)
        .join('|');
      
      // If this variant already exists, preserve its data
      if (existingVariantMap[signature]) {
        const existingVariant = existingVariantMap[signature];
        // Mark this variant as processed
        existingVariantMap[signature] = { ...existingVariant, processed: true };
        // Return the existing variant with updated options array
        return {
          ...existingVariant,
          options: combo, // Update options to ensure they match the latest structure
        };
      }
      
      // Create a new variant for this combination
      const variantId = generateVariantId();
      const name = combo.map(option => option.value).join(' / ');
      
      // Build attributes object from options
      const attributes = combo.reduce((acc, opt) => {
        acc[opt.name] = opt.value;
        return acc;
      }, {});
      
      return {
        id: variantId,
        variantId: variantId,
        name,
        options: combo,
        attributes,
        price: '',
        originalPrice: '',
        discountedPrice: '',
        sku: `SKU-${variantId}`,
        stockQuantity: 'Unlimited',
        quantity: 'Unlimited',
        imageUrl: '',
        inStock: true
      };
    });
    
    console.log('Generated variants with preservation:', newVariants);
    
    // Call the parent onGenerateVariants with the updated variants
    if (onGenerateVariants) {
      onGenerateVariants(newVariants);
    }
    
    // Close the modal after handling
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-3xl overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Add variants</h3>
            <button 
              type="button"
              onClick={(e) => {
                if (e && typeof e.preventDefault === 'function') {
                  e.preventDefault();
                }
                if (e && typeof e.stopPropagation === 'function') {
                  e.stopPropagation();
                }
                onClose();
              }}
              className="text-gray-400 hover:text-gray-500"
              aria-label="Close modal"
            >
              <FiX size={24} />
            </button>
          </div>
          
          {/* Option Types and Values */}
          <VariantOptionTypes
            optionTypes={optionTypes}
            onOptionTypesChange={onOptionTypesChange}
            onGenerateVariants={handleEnhancedGenerateVariants} // Use our enhanced handler
            existingVariants={existingVariants}
          />
          
          {/* Info text */}
          <div className="flex items-start mt-4 mb-6 text-gray-500 dark:text-gray-400">
            <FiInfo className="flex-shrink-0 mt-0.5 mr-2" />
            <span>You can add prices, images, quantity, etc after this step.</span>
          </div>

          {existingVariants.length > 0 && (
            <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-md">
              <div className="flex items-center">
                <FiInfo className="flex-shrink-0 text-blue-500 mr-2" />
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Your existing variant data will be preserved when adding or updating options.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VariantModal;