import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiImage, FiTag, FiInfo, FiShoppingBag, FiPackage, FiX, FiSave } from 'react-icons/fi';
import VariantTable from './components/variants/VariantTable';
import VariantModal from './components/variants/VariantModal';
import VariantMediaModal from './components/variants/VariantMediaModal';
import { getCombinations, generateVariantId } from './components/variants/utils/variantHelpers';
import { extractOptionsMapFromOptionTypes } from './components/variants/utils/variantTransformers';

const EnhancedProductVariantsManagement = ({ 
  initialVariants = [], 
  onChange,
  productId,
  productName
}) => {
  // State for managing variants
  const [variants, setVariants] = useState([]);
  
  // State for managing the variant creation modal
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [optionTypes, setOptionTypes] = useState([
    { id: 1, name: '', values: [] }
  ]);
  
  // State for managing the media modal
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  
  // Load initial variants
  useEffect(() => {
    if (initialVariants && initialVariants.length > 0) {
      setVariants(initialVariants);
      
      // Extract option types from variants if they exist
      const extractedOptionTypes = {};
      
      initialVariants.forEach(variant => {
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
  }, [initialVariants]);
  
  // Open media modal for a variant
  const handleOpenMediaModal = (variant) => {
    setSelectedVariant(variant);
    setShowMediaModal(true);
  };
  
  // Update variant after media change
  const handleUpdateVariantImage = (variantId, imageUrl) => {
    const updatedVariants = variants.map(variant => 
      (variant.variantId === variantId || variant.id === variantId) 
        ? { ...variant, imageUrl } 
        : variant
    );
    
    setVariants(updatedVariants);
    
    // Notify parent component of changes
    if (onChange) {
      onChange(updatedVariants);
    }
  };
  
  // Open the variant creation modal
  const handleOpenVariantModal = (e) => {
    // Prevent any default form submission behavior
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    console.log("Opening variant modal");
    setShowVariantModal(true);
  };
  
  // Generate variants based on option combinations
  const generateVariants = (e) => {
    // Prevent any default form submission behavior
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    console.log('Generating variants...');
    
    // Filter out option types without values or names
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
    
    // Create variant objects for each combination
    const newVariants = combinations.map(combo => {
      // Generate a unique variant ID
      const variantId = generateVariantId();
      
      // Create name from option values
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
        productId,
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
    
    // Update local state first
    setVariants(newVariants);
    setShowVariantModal(false);
    
    // Notify parent component of changes - NO API CALLS should happen from this
    if (onChange) {
      console.log(`Notifying parent component of ${newVariants.length} variants`);
      // Extract options map for API
      const optionsMap = extractOptionsMapFromOptionTypes(validOptions);
      // Only update the parent component's state, don't trigger any API calls
      onChange(newVariants, optionsMap);
    }
  };
  
  // Update a variant field
  const handleUpdateVariant = (variantId, field, value) => {
    console.log(`Updating variant ${variantId}, field: ${field}`);
    
    const updatedVariants = variants.map(variant => {
      if (variant.variantId === variantId || variant.id === variantId) {
        // For certain fields, update both UI and API versions of the field
        if (field === 'price') {
          return { ...variant, price: value };
        } 
        else if (field === 'discountedPrice' || field === 'originalPrice') {
          return { 
            ...variant, 
            discountedPrice: value,
            originalPrice: value
          };
        }
        else if (field === 'quantity' || field === 'stockQuantity') {
          return { 
            ...variant, 
            quantity: value,
            stockQuantity: value
          };
        }
        else {
          return { ...variant, [field]: value };
        }
      }
      return variant;
    });
    
    // Update local state
    setVariants(updatedVariants);
    
    // Notify parent component of changes - NO API CALLS
    if (onChange) {
      console.log('Notifying parent of variant updates');
      // Just update the parent component's state
      onChange(updatedVariants);
    }
  };
  
  // Delete a variant
  const handleDeleteVariant = (variantId) => {
    console.log(`Attempting to delete variant ${variantId}`);
    
    const confirmDelete = window.confirm('Are you sure you want to delete this variant?');
    
    if (confirmDelete) {
      console.log('Deletion confirmed');
      const updatedVariants = variants.filter(variant => 
        variant.variantId !== variantId && variant.id !== variantId
      );
      
      // Update local state
      setVariants(updatedVariants);
      
      // Notify parent component of changes - NO API CALLS
      if (onChange) {
        console.log('Notifying parent of variant deletion');
        // Just update the parent component's state
        onChange(updatedVariants);
      }
    } else {
      console.log('Deletion cancelled');
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FiPackage className="text-primary-500" size={24} />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Product Variants
          </h2>
        </div>
        
        {variants.length === 0 ? (
          <button
            type="button" // Explicitly set type to button to prevent form submission
            onClick={(e) => {
              // Prevent any default form submission behavior
              e.preventDefault();
              e.stopPropagation();
              console.log("Create Variants button clicked");
              handleOpenVariantModal();
            }}
            className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md"
          >
            <FiPlus size={18} />
            <span>Create Variants</span>
          </button>
        ) : (
          <button
            type="button" // Explicitly set type to button to prevent form submission
            onClick={(e) => {
              // Prevent any default form submission behavior 
              e.preventDefault();
              e.stopPropagation();
              console.log("Edit Variants button clicked");
              handleOpenVariantModal();
            }}
            className="flex items-center space-x-2 border border-primary-500 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 px-4 py-2 rounded-md"
          >
            <FiEdit2 size={18} />
            <span>Edit Variants</span>
          </button>
        )}
      </div>
      
      {/* Info box for first-time users */}
      {variants.length === 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4">
          <div className="flex items-start">
            <FiInfo className="h-5 w-5 text-blue-400 mt-0.5 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                What are product variants?
              </h3>
              <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">
                Variants let you offer variations of your product, such as different sizes, colors, or materials.
                Each variant can have its own price, inventory, and images.
              </p>
              <p className="mt-2 text-sm text-blue-700 dark:text-blue-400">
                Examples: T-shirts in different sizes and colors, jewelry in gold or silver, shoes in various sizes.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Variants table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        {variants.length > 0 ? (
          <VariantTable 
            variants={variants}
            onVariantUpdate={handleUpdateVariant}
            onEditVariants={handleOpenVariantModal}
            onDeleteVariant={handleDeleteVariant}
          />
        ) : (
          <div className="p-8 text-center">
            <div className="mx-auto h-20 w-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <FiShoppingBag className="h-10 w-10 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No variants created yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
              Add variants to offer different options for your product like sizes, colors, or materials.
              Each variant can have its own price, inventory, and image.
            </p>
            <button
              type="button" // Explicitly set type to button to prevent form submission
              onClick={(e) => {
                // Prevent default form submission
                e.preventDefault();
                e.stopPropagation();
                console.log("Create Variants button (in empty state) clicked");
                handleOpenVariantModal();
              }}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Create Variants
            </button>
          </div>
        )}
      </div>
      
      {/* Variant creation modal */}
      <VariantModal 
        isOpen={showVariantModal}
        onClose={() => setShowVariantModal(false)}
        optionTypes={optionTypes}
        onOptionTypesChange={setOptionTypes}
        onGenerateVariants={generateVariants}
      />
      
      {/* Media modal */}
      <VariantMediaModal 
        isOpen={showMediaModal}
        onClose={() => setShowMediaModal(false)}
        variant={selectedVariant}
        onImageUpdate={handleUpdateVariantImage}
        currentImage={selectedVariant?.imageUrl || ''}
      />
    </div>
  );
};

export default EnhancedProductVariantsManagement;