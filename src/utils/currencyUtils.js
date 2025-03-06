// src/utils/currencyUtils.js

// Default currency is now INR
export const defaultCurrency = 'INR';

// Currency symbols and formatting options
export const currencyConfig = {
  USD: { symbol: '$', position: 'before', locale: 'en-US' },
  EUR: { symbol: '€', position: 'before', locale: 'de-DE' },
  GBP: { symbol: '£', position: 'before', locale: 'en-GB' },
  JPY: { symbol: '¥', position: 'before', locale: 'ja-JP' },
  CAD: { symbol: 'CA$', position: 'before', locale: 'en-CA' },
  AUD: { symbol: 'A$', position: 'before', locale: 'en-AU' },
  INR: { symbol: '₹', position: 'before', locale: 'en-IN' },
  CNY: { symbol: '¥', position: 'before', locale: 'zh-CN' },
  BRL: { symbol: 'R$', position: 'before', locale: 'pt-BR' },
  MXN: { symbol: 'MX$', position: 'before', locale: 'es-MX' },
  RUB: { symbol: '₽', position: 'after', locale: 'ru-RU' },
  ZAR: { symbol: 'R', position: 'before', locale: 'en-ZA' },
};

// API keys for exchange rate services
// Replace with your actual API key
const EXCHANGE_RATE_API_KEY = 'your_api_key_here';

// Cache for exchange rates to avoid excessive API calls
let exchangeRatesCache = {
  rates: null,
  timestamp: 0,
  expiryTime: 3600000, // 1 hour in milliseconds
};

// Function to fetch real-time exchange rates with INR as base
export const fetchExchangeRates = async (forceRefresh = false) => {
  const now = Date.now();

  // Return cached rates if they exist and haven't expired
  if (
    !forceRefresh &&
    exchangeRatesCache.rates && 
    now - exchangeRatesCache.timestamp < exchangeRatesCache.expiryTime
  ) {
    return exchangeRatesCache.rates;
  }

  try {
    // Fetch rates with INR as base currency
    const response = await fetch('https://api.exchangerate.host/latest?base=INR');
    const data = await response.json();

    if (!data.success && !data.rates) {
      throw new Error('Failed to fetch exchange rates');
    }

    // For exchangerate.host
    const rates = data.rates;
    
    // Cache the results
    exchangeRatesCache = {
      rates,
      timestamp: now,
      expiryTime: 3600000, // 1 hour
    };

    return rates;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    
    // Fallback to hardcoded rates if API fails
    return getFallbackRates();
  }
};

// Fallback exchange rates if API fails (relative to INR)
const getFallbackRates = () => {
  return {
    INR: 1,
    USD: 0.012,
    EUR: 0.011,
    GBP: 0.0094,
    JPY: 1.8,
    CAD: 0.016,
    AUD: 0.018,
    CNY: 0.087,
    BRL: 0.061,
    MXN: 0.2,
    RUB: 1.11,
    ZAR: 0.22,
  };
};

// Function to detect user's country and return currency code
export const detectUserCurrency = async () => {
  try {
    // First try to use the browser's navigator.language
    const browserLanguage = navigator.language || navigator.userLanguage;
    let currency = getCurrencyFromLanguage(browserLanguage);
    
    if (currency) return currency;
    
    // If browser language doesn't give us a currency, try IP-based geolocation
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    // Get currency from country code
    currency = data.currency || defaultCurrency;
    
    // Check if we support this currency
    const rates = await fetchExchangeRates();
    return rates[currency] ? currency : defaultCurrency;
  } catch (error) {
    console.error('Error detecting user currency:', error);
    return defaultCurrency;
  }
};

// Helper function to get currency from language code
function getCurrencyFromLanguage(language) {
  if (!language) return null;
  
  const countryCode = language.split('-')[1];
  if (!countryCode) return null;
  
  // Map of country codes to currencies
  const countryCurrencyMap = {
    'US': 'USD',
    'CA': 'CAD',
    'GB': 'GBP',
    'AU': 'AUD',
    'NZ': 'NZD',
    'IN': 'INR',
    'DE': 'EUR',
    'FR': 'EUR',
    'IT': 'EUR',
    'ES': 'EUR',
    'JP': 'JPY',
    'CN': 'CNY',
    'BR': 'BRL',
    'MX': 'MXN',
    'RU': 'RUB',
    'ZA': 'ZAR',
    // Add more mappings as needed
  };
  
  return countryCurrencyMap[countryCode] || null;
}

// Function to convert price from INR to target currency
export const convertPrice = async (priceINR, targetCurrency) => {
  if (targetCurrency === 'INR') {
    return priceINR; // No conversion needed
  }

  try {
    // Get current exchange rates
    const rates = await fetchExchangeRates();
    
    if (!rates[targetCurrency]) {
      return priceINR; // Return original price if currency not supported
    }
    
    const convertedPrice = priceINR * rates[targetCurrency];
    
    // Round appropriately based on currency
    if (targetCurrency === 'JPY') {
      return Math.round(convertedPrice); // No decimals for Yen
    }
    
    return Math.round(convertedPrice * 100) / 100; // Two decimal places for most currencies
  } catch (error) {
    console.error('Error converting price:', error);
    return priceINR; // Return original price if conversion fails
  }
};

// Function to format price according to currency conventions
export const formatPrice = (price, currencyCode) => {
  const config = currencyConfig[currencyCode] || currencyConfig[defaultCurrency];
  
  try {
    // Use Intl.NumberFormat for locale-aware formatting
    const formatter = new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: currencyCode === 'JPY' ? 0 : 2,
      maximumFractionDigits: currencyCode === 'JPY' ? 0 : 2,
    });
    
    return formatter.format(price);
  } catch (error) {
    // Fallback formatting if Intl.NumberFormat fails
    const formatted = currencyCode === 'JPY' ? 
      Math.round(price).toString() : 
      price.toFixed(2);
      
    return config.position === 'before' ? 
      `${config.symbol}${formatted}` : 
      `${formatted} ${config.symbol}`;
  }
};






/**
 * Format price according to currency conventions
 * @param {number} price - Price to format
 * @param {string} [currencyCode='INR'] - Currency code
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (price, currencyCode = 'INR') => {
  try {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: currencyCode,
      maximumFractionDigits: currencyCode === 'JPY' ? 0 : 2
    }).format(price);
  } catch (error) {
    // Fallback formatting
    const symbol = currencyCode === 'INR' ? '₹' : '$';
    return `${symbol}${price.toFixed(2)}`;
  }
};

/**
 * Convert price from one currency to another
 * @param {number} price - Price to convert
 * @param {string} [fromCurrency='INR'] - Source currency
 * @param {string} [toCurrency='INR'] - Target currency
 * @returns {Promise<number>} Converted price
 */
export const convertCurrency = async (price, fromCurrency = 'INR', toCurrency = 'INR') => {
  // In a real-world scenario, this would use an exchange rate API
  if (fromCurrency === toCurrency) return price;

  // Fallback exchange rates (for development)
  const fallbackRates = {
    INR: 1,
    USD: 0.012,
    EUR: 0.011,
    GBP: 0.0094,
    // Add more rates as needed
  };

  try {
    // In production, you'd fetch real-time rates
    const rate = fallbackRates[toCurrency] / fallbackRates[fromCurrency];
    return Math.round(price * rate * 100) / 100;
  } catch (error) {
    console.error('Currency conversion error:', error);
    return price;
  }
};

/**
 * Get currency symbol and formatting details
 * @param {string} [currencyCode='INR'] - Currency code
 * @returns {Object} Currency details
 */
export const getCurrencyDetails = (currencyCode = 'INR') => {
  return currencyConfig[currencyCode] || currencyConfig['INR'];
};