// src/utils/form-validation-utils.js

/**
 * Common validation functions for form fields
 */

/**
 * Validates an email address
 * @param {string} email - The email to validate
 * @returns {boolean} Whether the email is valid
 */
export const validateEmail = (email) => {
    if (!email) return false;
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };
  
  /**
   * Validates a phone number
   * @param {string} phone - The phone number to validate
   * @returns {boolean} Whether the phone number is valid
   */
  export const validatePhone = (phone) => {
    if (!phone) return false;
    // Allow for various formats of phone numbers including international
    const re = /^(\+\d{1,3}[-\s]?)?(\d{10,12})$/;
    return re.test(String(phone).replace(/\s/g, ''));
  };
  
  /**
   * Validates if a string is not empty
   * @param {string} value - The string to validate
   * @returns {boolean} Whether the string is not empty
   */
  export const validateRequired = (value) => {
    return !!value && value.trim() !== '';
  };
  
  /**
   * Validates a number is within a range
   * @param {number} value - The number to validate
   * @param {number} min - Minimum allowed value
   * @param {number} max - Maximum allowed value
   * @returns {boolean} Whether the number is within range
   */
  export const validateNumberInRange = (value, min, max) => {
    const num = Number(value);
    if (isNaN(num)) return false;
    
    if (min !== undefined && num < min) return false;
    if (max !== undefined && num > max) return false;
    
    return true;
  };
  
  /**
   * Validates a password for strength
   * @param {string} password - The password to validate
   * @returns {Object} Validation result
   */
  export const validatePassword = (password) => {
    if (!password) return { valid: false, message: 'Password is required' };
    
    if (password.length < 8) {
      return { valid: false, message: 'Password must be at least 8 characters' };
    }
    
    // Check for at least one uppercase, one lowercase, one number
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      return { 
        valid: false, 
        message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' 
      };
    }
    
    return { valid: true, message: '' };
  };
  
  /**
   * Standard validation function for a user form
   * @param {Object} values - Form values object
   * @returns {Object} Validation errors object
   */
  export const validateUserForm = (values) => {
    const errors = {};
    
    if (!validateRequired(values.name)) {
      errors.name = 'Name is required';
    }
    
    if (values.email && !validateEmail(values.email)) {
      errors.email = 'Invalid email address';
    }
    

    // Phone validation
  if (!validateRequired(values.phone)) {
    errors.phone = 'Phone number is required';
  } else if (!validatePhone(values.phone)) {
    errors.phone = 'Invalid phone number format';
  }
  
  // City validation
  if (!validateRequired(values.city)) {
    errors.city = 'City is required';
  }
  
  // Address validation (optional, but can add length check if needed)
  if (values.address && values.address.trim().length > 0 && values.address.trim().length < 5) {
    errors.address = 'Address seems too short';
  }
    
    return errors;
  };
  
  /**
   * Standard validation function for a product form
   * @param {Object} values - Form values object
   * @returns {Object} Validation errors object
   */
  export const validateProductForm = (values) => {
    const errors = {};
    
    if (!validateRequired(values.name)) {
      errors.name = 'Product name is required';
    }
    
    if (!validateRequired(values.price) || isNaN(values.price) || Number(values.price) <= 0) {
      errors.price = 'Price must be a positive number';
    }
    
    if (values.originalPrice && (isNaN(values.originalPrice) || Number(values.originalPrice) < 0)) {
      errors.originalPrice = 'Original price must be a non-negative number';
    }
    
    if (!validateRequired(values.categoryId)) {
      errors.categoryId = 'Category is required';
    }
    
    if (values.stockQuantity !== 'Unlimited' && 
        (isNaN(values.stockQuantity) || Number(values.stockQuantity) < 0)) {
      errors.stockQuantity = 'Stock quantity must be a non-negative number';
    }
    
    return errors;
  };
  
  /**
   * Standard validation function for store form
   * @param {Object} values - Form values object
   * @returns {Object} Validation errors object
   */
  export const validateStoreForm = (values) => {
    const errors = {};
    
    if (!validateRequired(values.name)) {
      errors.name = 'Store name is required';
    }
    
    if (!validateRequired(values.description)) {
      errors.description = 'Description is required';
    }
    
    if (!validateRequired(values.address)) {
      errors.address = 'Address is required';
    }
    
    return errors;
  };
  
  /**
   * Standard validation for warehouse form
   * @param {Object} values - Form values object
   * @returns {Object} Validation errors object
   */
  export const validateWarehouseForm = (values) => {
    const errors = {};
    
    if (!validateRequired(values.name)) {
      errors.name = 'Warehouse name is required';
    }
    
    if (!validateRequired(values.contactPerson)) {
      errors.contactPerson = 'Contact person is required';
    }
    
    if (!validatePhone(values.mobile)) {
      errors.mobile = 'Invalid mobile number';
    }
    
    if (!validateRequired(values.address)) {
      errors.address = 'Address is required';
    }
    
    if (!validateRequired(values.pincode)) {
      errors.pincode = 'Pin code is required';
    }
    
    if (!validateRequired(values.city)) {
      errors.city = 'City is required';
    }
    
    if (!validateRequired(values.state)) {
      errors.state = 'State is required';
    }
    
    return errors;
  };