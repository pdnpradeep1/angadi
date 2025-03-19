/**
 * Utility functions for product variants
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
    return optionTypes.every(
      option => option.name && option.values.length > 0
    );
  };