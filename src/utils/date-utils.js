/**
 * Utility functions for date formatting and manipulation
 */

/**
 * Format a date with various options
 * @param {string|Date} dateString - Date to format
 * @param {Object} [options] - Formatting options
 * @param {string} [options.type='default'] - Type of formatting (default, short, long, time)
 * @param {string} [options.locale] - Locale for formatting (defaults to browser locale)
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, options = {}) => {
    if (!dateString) return 'N/A';
  
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    
    const defaultOptions = {
      default: { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      },
      short: { 
        year: 'numeric', 
        month: 'numeric', 
        day: 'numeric' 
      },
      long: { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        weekday: 'long'
      },
      time: { 
        hour: '2-digit', 
        minute: '2-digit' 
      },
      datetime: {
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit'
      }
    };
  
    const type = options.type || 'default';
    const locale = options.locale || undefined;
  
    try {
      return date.toLocaleDateString(locale, defaultOptions[type]);
    } catch (error) {
      console.error('Date formatting error:', error);
      return date.toLocaleString();
    }
  };
  
  /**
   * Get time since a given date
   * @param {string|Date} dateString - Reference date
   * @returns {string} Relative time string
   */
  export const getTimeSince = (dateString) => {
    if (!dateString) return 'Unknown';
    
    const lastUpdate = new Date(dateString);
    const now = new Date();
    const diffMs = now - lastUpdate;
    
    // Convert to minutes
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins === 1) return '1 minute ago';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    
    // Convert to hours
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return '1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    // If more than 24 hours, return formatted date
    return formatDate(dateString);
  };
  
  /**
   * Check if a date is within a specific range
   * @param {string|Date} date - Date to check
   * @param {Object} range - Range parameters
   * @param {string|Date} [range.start] - Start of range
   * @param {string|Date} [range.end] - End of range
   * @returns {boolean} Whether date is within range
   */
  export const isDateInRange = (date, { start, end } = {}) => {
    const checkDate = new Date(date);
    const startDate = start ? new Date(start) : null;
    const endDate = end ? new Date(end) : null;
  
    if (startDate && checkDate < startDate) return false;
    if (endDate && checkDate > endDate) return false;
  
    return true;
  };