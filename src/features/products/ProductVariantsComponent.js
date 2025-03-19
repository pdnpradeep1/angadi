import React, { useState, useEffect } from 'react';
import ProductVariantsManager from './components/variants';
import { normalizeVariantsForUI, prepareVariantsForAPI } from './components/variants/utils/variantTransformers';

/**
 * ProductVariantsComponent - Main entry point for product variants functionality
 * This component serves as a wrapper for the more modular variant components
 * 
 * @param {Object} props - Component properties
 * @param {Array} props.initialVariants - Initial variants from API
 * @param {Function} props.onChange - Handler for variants changes
 * @param {number} props.productId - Product ID for variants
 */
const ProductVariantsComponent = ({ initialVariants = [], onChange, productId }) => {
  // Normalize initial variants if they're provided
  const [normalizedInitialVariants, setNormalizedInitialVariants] = useState([]);
  
  useEffect(() => {
    if (initialVariants && initialVariants.length > 0) {
      // Normalize the variants from API format to UI format
      const normalized = normalizeVariantsForUI(initialVariants, productId);
      setNormalizedInitialVariants(normalized);
    }
  }, [initialVariants, productId]);
  
  // Handle variant changes and transform for API when notifying parent
  const handleVariantsChange = (updatedVariants) => {
    if (onChange) {
      // Format for API consistency
      const apiReadyVariants = prepareVariantsForAPI(updatedVariants, productId);
      onChange(apiReadyVariants);
    }
  };

  return (
    <ProductVariantsManager
      initialVariants={normalizedInitialVariants.length > 0 ? normalizedInitialVariants : initialVariants}
      onChange={handleVariantsChange}
      productId={productId}
    />
  );
};

export default ProductVariantsComponent;