/**
 * Enhanced utility functions for product variants to preserve data during updates
 */

/**
 * Get all possible combinations of option values
 * @param {Array} options - Array of option objects with values
 * @returns {Array} Array of combinations
 */
export const getCombinations = (options) => {
  if (options.length === 0) return [[]];
  
  const [current, ...rest] = options;
  const restCombinations = getCombinations(rest);
  
  return current.values.flatMap(value => 
    restCombinations.map(combo => 
      [{ name: current.name, value }, ...combo]
    )
  );
};

/**
 * Generate a unique ID for a variant
 * @returns {number} Unique ID
 */
export const generateVariantId = () => {
  return Date.now() + Math.floor(Math.random() * 1000);
};

/**
 * Get common color hex codes
 * @returns {Object} Map of color names to hex codes
 */
export const getCommonColors = () => {
  return {
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
};

/**
 * Get color name from hex code
 * @param {string} hexCode - Color hex code
 * @returns {string} Color name or "Custom"
 */
export const getColorNameFromHex = (hexCode) => {
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
  
  return colorNames[hexCode] || 'Custom';
};

/**
 * Get common size options
 * @returns {Array} Array of common size options
 */
export const getCommonSizes = () => {
  return ['S', 'M', 'L', 'XL', 'XXL'];
};

/**
 * Check if a variant configuration is valid
 * @param {Array} optionTypes - Array of option types
 * @returns {boolean} Whether variant can be generated
 */
export const canGenerateVariants = (optionTypes) => {
  return optionTypes.some(
    option => option.name && option.values.length > 0
  );
};

/**
 * Creates a unique signature for a variant's options
 * Used for comparing variants when updating
 * @param {Array} options - Options array for a variant
 * @returns {string} Unique signature string
 */
export const getVariantSignature = (options) => {
  if (!options || !Array.isArray(options) || options.length === 0) return '';
  
  return options
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(opt => `${opt.name}:${opt.value}`)
    .join('|');
};

/**
 * Determines which variants to keep, update, or remove when option types change
 * @param {Array} existingVariants - Current variants
 * @param {Array} newCombinations - New option combinations
 * @returns {Array} Updated variants with preserved data
 */
export const mergeVariantsIntelligently = (existingVariants, newCombinations) => {
  // Create map of existing variants by signature
  const existingVariantMap = {};
  existingVariants.forEach(variant => {
    if (variant.options && Array.isArray(variant.options)) {
      const signature = getVariantSignature(variant.options);
      existingVariantMap[signature] = variant;
    }
  });
  
  // Process new combinations while preserving existing data
  return newCombinations.map(combo => {
    const signature = getVariantSignature(combo);
    
    // Preserve existing variant data if available
    if (existingVariantMap[signature]) {
      const existingVariant = existingVariantMap[signature];
      return {
        ...existingVariant,
        options: combo, // Update options to ensure they match the latest structure
      };
    }
    
    // Create new variant for new combinations
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
};

/**
 * Compare option sets to determine if options have changed significantly
 * @param {Array} oldOptions - Previous option types
 * @param {Array} newOptions - New option types
 * @returns {boolean} Whether options have changed significantly
 */
export const haveOptionsChangedSignificantly = (oldOptions, newOptions) => {
  // Filter to only valid options
  const validOldOptions = oldOptions.filter(opt => opt.name && opt.values && opt.values.length > 0);
  const validNewOptions = newOptions.filter(opt => opt.name && opt.values && opt.values.length > 0);
  
  // If count is different, options have changed significantly
  if (validOldOptions.length !== validNewOptions.length) return true;
  
  // Check each option name to see if they match
  const oldNames = validOldOptions.map(opt => opt.name).sort();
  const newNames = validNewOptions.map(opt => opt.name).sort();
  
  if (oldNames.join(',') !== newNames.join(',')) return true;
  
  // Check if values have been added or removed for each option
  for (const newOpt of validNewOptions) {
    const oldOpt = validOldOptions.find(o => o.name === newOpt.name);
    if (!oldOpt) return true;
    
    // Check if all old values still exist
    const oldValues = new Set(oldOpt.values);
    const newValues = new Set(newOpt.values);
    
    // If sets are different sizes, values have been added or removed
    if (oldValues.size !== newValues.size) return true;
    
    // Check if all old values are still present
    for (const value of oldValues) {
      if (!newValues.has(value)) return true;
    }
  }
  
  return false;
}