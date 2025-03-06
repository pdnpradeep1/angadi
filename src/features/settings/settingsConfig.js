// src/components/StoreSettings/settingsConfig.js
import React from 'react';
import { 
  FiShoppingBag, FiGlobe, FiUsers, FiBell, FiCreditCard, FiShoppingCart, 
  FiHome, FiTruck, FiRefreshCw, FiPercent, FiDollarSign, FiSearch, 
  FiGlobe as FiLanguage, FiHelpCircle, FiFileText, FiClock 
} from 'react-icons/fi';

// Array of sidebar navigation items
export const settingsNavItems = [
  { id: 'store-details', name: 'Store details', icon: <FiShoppingBag className="h-5 w-5" /> },
  { id: 'domains', name: 'Domains', icon: <FiGlobe className="h-5 w-5" /> },
  { id: 'staffs-accounts', name: 'Staffs accounts', icon: <FiUsers className="h-5 w-5" /> },
  { id: 'notifications', name: 'Notifications', icon: <FiBell className="h-5 w-5" /> },
  { id: 'payments', name: 'Payments', icon: <FiCreditCard className="h-5 w-5" /> },
  { id: 'checkout', name: 'Checkout', icon: <FiShoppingCart className="h-5 w-5" /> },
  { id: 'warehouse', name: 'Warehouse', icon: <FiHome className="h-5 w-5" /> },
  { id: 'delivery', name: 'Delivery', icon: <FiTruck className="h-5 w-5" /> },
  { id: 'returns', name: 'Returns', icon: <FiRefreshCw className="h-5 w-5" /> },
  { id: 'tax', name: 'Tax', icon: <FiPercent className="h-5 w-5" /> },
  { id: 'extra-charges', name: 'Extra charges', icon: <FiDollarSign className="h-5 w-5" /> },
  { id: 'seo', name: 'SEO', icon: <FiSearch className="h-5 w-5" /> },
  { id: 'languages', name: 'Languages', icon: <FiLanguage className="h-5 w-5" /> },
  { id: 'support-social', name: 'Support & Social', icon: <FiHelpCircle className="h-5 w-5" /> },
  { id: 'policies', name: 'Policies', icon: <FiFileText className="h-5 w-5" /> },
  { id: 'store-timings', name: 'Store timings', icon: <FiClock className="h-5 w-5" /> },
];

// Map setting IDs to their components (will be imported as needed)
export const settingsComponentMap = {
  'store-details': 'StoreDetails',
  'domains': 'Domains',
  'staffs-accounts': 'StaffAccounts',
  'notifications': 'Notifications',
  'payments': 'Payments',
  'checkout': 'Checkout',
  'warehouse': 'Warehouse',
  'delivery': 'Delivery',
  'returns': 'ReturnsSection',
  'tax': 'Tax',
  'extra-charges': 'ExtraChargesSection',
  'support-social': 'SupportSocial',
  'store-timings': 'StoreTimings',
  // Add other mappings as components are created
};