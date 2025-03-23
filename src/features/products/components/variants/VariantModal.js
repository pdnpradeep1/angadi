import React from 'react';
import { FiX, FiInfo } from 'react-icons/fi';
import VariantOptionTypes from './VariantOptionTypes';

/**
 * Modal component for adding and editing variants
 * 
 * @param {Object} props - Component properties
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Handler for closing the modal
 * @param {Array} props.optionTypes - Current option types
 * @param {Function} props.onOptionTypesChange - Handler for option types changes
 * @param {Function} props.onGenerateVariants - Handler for generating variants
 */
const VariantModal = ({ 
  isOpen, 
  onClose, 
  optionTypes = [], 
  onOptionTypesChange,
  onGenerateVariants
}) => {
  if (!isOpen) return null;

  // Wrapped handler to prevent form submission
  const handleGenerateVariants = (e) => {
    // Prevent any default form submission behavior
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    console.log("VariantModal: handleGenerateVariants called");
    
    // Call the parent handler but ensure no form submission occurs
    if (onGenerateVariants) {
      // Call with a new event to avoid bubbling the original
      onGenerateVariants({
        preventDefault: () => {},
        stopPropagation: () => {}
      });
    }
    
    // Close the modal after handling
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-3xl overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Add variants</h3>
            <button 
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              className="text-gray-400 hover:text-gray-500"
              aria-label="Close modal"
            >
              <FiX size={24} />
            </button>
          </div>
          
          {/* Option Types and Values */}
          <VariantOptionTypes
            optionTypes={optionTypes}
            onOptionTypesChange={onOptionTypesChange}
            onGenerateVariants={handleGenerateVariants} // Use our wrapped handler
          />
          
          {/* Info text */}
          <div className="flex items-start mt-4 mb-6 text-gray-500 dark:text-gray-400">
            <FiInfo className="flex-shrink-0 mt-0.5 mr-2" />
            <span>You can add prices, images, quantity, etc after this step.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VariantModal;