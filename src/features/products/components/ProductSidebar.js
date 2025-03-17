// src/features/products/components/ProductSidebar.js
import React from 'react';
import { 
  FiLayers, 
  FiImage, 
  FiBox, 
  FiTag, 
  FiGrid,
  FiCheckCircle,
  FiInfo
} from 'react-icons/fi';

/**
 * Sidebar navigation component for product add/edit form
 */
const ProductSidebar = ({ activeSection, setActiveSection, sectionProgress }) => {
  // Function to render progress indicator
  const renderProgressIndicator = (progress) => (
    <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
      <div 
        className={`h-full rounded-full ${progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );

  // Get icon for section based on status
  const getSectionIcon = (section) => {
    const progress = sectionProgress[section];
    if (progress === 100) {
      return <FiCheckCircle className="text-green-500" />;
    }
    
    switch(section) {
      case 'product-info': return <FiLayers />;
      case 'product-media': return <FiImage />;
      case 'inventory': return <FiBox />;
      case 'categorization': return <FiTag />;
      case 'variants': return <FiGrid />;
      default: return <FiInfo />;
    }
  };

  // Section definitions
  const sections = [
    { id: 'product-info', name: 'Basic Information', icon: <FiLayers /> },
    { id: 'product-media', name: 'Product Media', icon: <FiImage /> },
    { id: 'inventory', name: 'Inventory', icon: <FiBox /> },
    { id: 'categorization', name: 'Categories & Tags', icon: <FiTag /> },
    { id: 'variants', name: 'Product Variants', icon: <FiGrid /> },
  ];

  return (
    <div className="lg:col-span-1">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
            Product Setup
          </h2>
          
          <nav className="space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                className={`w-full flex items-center justify-between p-3 rounded-md transition-colors ${
                  activeSection === section.id
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/30'
                }`}
                onClick={() => setActiveSection(section.id)}
              >
                <div className="flex items-center">
                  <span className={`mr-3 text-lg ${activeSection === section.id ? 'text-primary-500' : ''}`}>
                    {getSectionIcon(section.id)}
                  </span>
                  <span className="font-medium">{section.name}</span>
                </div>
                <div className="w-5 h-5 flex items-center justify-center">
                  {sectionProgress[section.id] === 100 && (
                    <span className="flex items-center justify-center w-5 h-5 bg-green-100 dark:bg-green-900/30 rounded-full text-green-500">
                      <FiCheckCircle size={12} />
                    </span>
                  )}
                </div>
              </button>
            ))}
          </nav>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Progress
            </h3>
            <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary-600"
                style={{ 
                  width: `${(Object.values(sectionProgress).reduce((a, b) => a + b, 0) / (Object.keys(sectionProgress).length * 100)) * 100}%` 
                }}
              ></div>
            </div>
            
            <div className="text-sm text-gray-500 dark:text-gray-400 pt-3 flex flex-col space-y-1.5">
              <p className="text-gray-700 dark:text-gray-300 font-medium">Tips:</p>
              <p>• Complete all required fields</p>
              <p>• Add a high-quality product image</p>
              <p>• Use descriptive category and tags</p>
              <p>• Consider adding variants for different options</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSidebar;