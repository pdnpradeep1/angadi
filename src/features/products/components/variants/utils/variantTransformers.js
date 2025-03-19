/**
 * Utility functions for transforming variant data between UI and API formats
 */

/**
 * Normalize initial variants from API format to UI format
 * @param {Array} initialVariants - Variants from API
 * @param {number} productId - Optional product ID for new variants
 * @returns {Array} Normalized variants for UI
 */
export const normalizeVariantsForUI = (initialVariants = [], productId = null) => {
    if (!initialVariants || initialVariants.length === 0) {
      return [];
    }
    
    console.log('Normalizing variants for UI:', initialVariants);
    
    return initialVariants.map(variant => {
      // Make sure we're using a consistent ID field
      const variantId = variant.variantId || variant.id || Date.now() + Math.floor(Math.random() * 1000);
      
      // Make sure we're using consistent field names
      const stockQuantity = variant.stockQuantity === -1 ? 'Unlimited' : 
                            variant.stockQuantity || variant.quantity || 0;
      
      const price = variant.price ? variant.price.toString() : '';
      
      // Original price might be in either field
      const originalPrice = variant.originalPrice ? variant.originalPrice.toString() : 
                           variant.discountedPrice ? variant.discountedPrice.toString() : '';
      
      // Convert options to the format the UI expects
      let options = [];
      let name = variant.name || ''; // Use the name field if it exists
      
      if (variant.attributes) {
        if (Array.isArray(variant.attributes)) {
          options = [...variant.attributes];
        } else {
          // Convert object to array of {name, value} objects
          options = Object.entries(variant.attributes).map(([name, value]) => ({
            name,
            value
          }));
        }
      } else if (variant.options && Array.isArray(variant.options)) {
        options = [...variant.options];
      }
      
      // If there's no name but there are options, create a name from options
      if (!name && options.length > 0) {
        name = options.map(opt => opt.value).join(' / ');
      }
      
      return {
        ...variant,
        id: variant.id, // Preserve original ID if it exists
        variantId,      // Ensure variantId exists
        name,           // Ensure name field exists
        productId: productId || variant.productId,  // Use passed productId or existing one
        stockQuantity,  // Normalize stockQuantity
        quantity: stockQuantity, // Store in quantity field too for UI
        price,          // Ensure price is a string
        originalPrice,  // Ensure originalPrice is set
        discountedPrice: originalPrice, // Store in discountedPrice field too for UI
        options,        // Ensure options array exists
        attributes: options, // Store in attributes field too
      };
    });
  };
  
  /**
   * Prepare variants for API submission
   * @param {Array} variants - Variants from UI
   * @param {number} productId - Product ID for the variants
   * @returns {Array} Variants formatted for API
   */
  export const prepareVariantsForAPI = (variants = [], productId = null) => {
    return variants.map(variant => {
      console.log('Processing variant for API submission:', variant);
      
      // Extract attributes from the variant
      let attributes = {};
      
      // Create a name for the variant based on options
      let variantName = variant.name || '';
      
      // Handle different formats of attributes and options
      if (variant.attributes) {
        if (Array.isArray(variant.attributes)) {
          variant.attributes.forEach(attr => {
            if (attr.name && attr.value) {
              attributes[attr.name] = attr.value;
            }
          });
        } else if (typeof variant.attributes === 'object') {
          attributes = { ...variant.attributes };
        }
      }
      
      // Check options field and build variant name if not already set
      if (variant.options && Array.isArray(variant.options)) {
        if (!variantName) {
          variantName = variant.options.map(opt => opt.value).join(' / ');
        }
        
        variant.options.forEach(opt => {
          if (opt.name && opt.value) {
            attributes[opt.name] = opt.value;
          }
        });
      }
      
      // Parse numeric values safely
      const price = variant.price || '';
      const variantPrice = price ? parseFloat(price) : null;
      
      // Handle different field names for stock quantity
      let stockQuantity;
      if (variant.stockQuantity === 'Unlimited' || variant.quantity === 'Unlimited') {
        stockQuantity = -1;
      } else if (variant.stockQuantity) {
        stockQuantity = parseInt(variant.stockQuantity, 10);
      } else if (variant.quantity) {
        stockQuantity = parseInt(variant.quantity, 10);
      } else {
        stockQuantity = 0;
      }
      
      // Handle different field names for original price
      let originalPrice = null;
      if (variant.originalPrice) {
        // First, convert to string if it's not already a string
        const originalPriceStr = typeof variant.originalPrice === 'string' 
          ? variant.originalPrice 
          : String(variant.originalPrice);
        
        // Then check if it's not an empty string after trimming
        if (originalPriceStr.trim() !== '') {
          originalPrice = parseFloat(originalPriceStr);
        }
      } else if (variant.discountedPrice) {
        // First, convert to string if it's not already a string
        const discountedPriceStr = typeof variant.discountedPrice === 'string'
          ? variant.discountedPrice
          : String(variant.discountedPrice);
        
        // Then check if it's not an empty string after trimming
        if (discountedPriceStr.trim() !== '') {
          originalPrice = parseFloat(discountedPriceStr);
        }
      }
      
      // Create the variant request object
      return {
        // For existing variants in edit mode, include the ID
        id: variant.id,
        // Include variantId for reference
        variantId: variant.variantId || variant.id || Date.now() + Math.floor(Math.random() * 1000),
        // Include productId for existing products
        productId: productId || variant.productId,
        // Include variant name
        name: variantName || `Variant ${variant.variantId}`,
        // Use the variant's SKU or generate a new one
        sku: variant.sku || `SKU-${Date.now()}`,
        // Set price with fallback to product price
        price: variantPrice,
        // Set originalPrice if available
        originalPrice: originalPrice,
        // Format stock quantity
        stockQuantity: stockQuantity,
        // Use variant image or fallback to product image
        imageUrl: variant.imageUrl || '',
        // Add processed attributes
        attributes
      };
    });
  };
  
  /**
   * Extract options map from variants for product payload
   * @param {Array} variants - Variants array
   * @returns {Object} Map of option name -> array of values
   */
  export const extractOptionsMapForProduct = (variants = []) => {
    // Create a map of option name -> array of unique values
    const optionsMap = {};
    
    variants.forEach(variant => {
      if (variant.options && Array.isArray(variant.options)) {
        variant.options.forEach(opt => {
          if (opt.name && opt.value) {
            if (!optionsMap[opt.name]) {
              optionsMap[opt.name] = [];
            }
            if (!optionsMap[opt.name].includes(opt.value)) {
              optionsMap[opt.name].push(opt.value);
            }
          }
        });
      }
    });
    
    return optionsMap;
  };
  
  /**
   * Create a new base variant
   * @param {number} productId - Optional product ID
   * @returns {Object} New variant object
   */
  export const createEmptyVariant = (productId = null) => {
    const variantId = Date.now() + Math.floor(Math.random() * 1000);
    
    return {
      id: variantId,
      variantId: variantId,
      name: '',
      productId: productId,
      options: [],
      attributes: {},
      price: '',
      originalPrice: '',
      discountedPrice: '',
      sku: `SKU-${variantId}`,
      stockQuantity: 'Unlimited',
      quantity: 'Unlimited',
      weight: '',
      weightUnit: 'kg',
      gtin: '',
      inStock: true
    };
  };