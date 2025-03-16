import React, { useState, useEffect } from 'react';
import Modal from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { FiMenu } from 'react-icons/fi'; // Changed from FiGripVertical to FiMenu
import { renderCategoryImage } from '../../utils/category-image-utils';

const ReorderCategoriesModal = ({ isOpen, onClose, categories, onSave }) => {
  const [orderedCategories, setOrderedCategories] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initialize the ordered categories when the modal opens
    if (isOpen) {
      setOrderedCategories([...categories]);
    }
  }, [isOpen, categories]);

  const handleDragStart = (e, index) => {
    e.dataTransfer.effectAllowed = 'move';
    setDraggedItem(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    const draggedOverItem = orderedCategories[index];
    
    // If the item is dragged over itself, ignore
    if (draggedItem === index) {
      return;
    }
    
    // Filter out the currently dragged item
    let newItems = orderedCategories.filter((item, idx) => idx !== draggedItem);
    
    // Add the dragged item after the dragged over item
    newItems.splice(index, 0, orderedCategories[draggedItem]);
    
    setOrderedCategories(newItems);
    setDraggedItem(index);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleSave = async () => {
    setLoading(true);
    
    try {
      // In a real implementation, you would call your API to save the new order
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      // Call the onSave callback with the new order
      onSave(orderedCategories);
      onClose();
    } catch (error) {
      console.error('Error saving category order:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reorder Categories"
      size="md"
      footer={
        <>
          <Button 
            variant="secondary" 
            onClick={onClose} 
            className="mr-2"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Order'}
          </Button>
        </>
      }
    >
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Drag and drop to reorder categories. Categories will appear in this order on your store.
      </p>
      
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {orderedCategories.map((category, index) => (
            <li 
              key={category.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`flex items-center p-3 bg-white dark:bg-gray-800 cursor-move ${
                draggedItem === index ? 'opacity-50' : 'opacity-100'
              }`}
            >
              <span className="p-2 text-gray-400">
                <FiMenu /> {/* Changed from FiGripVertical to FiMenu */}
              </span>
              <div className="flex items-center">
                {renderCategoryImage(category.image, category.name, {
                  className: "w-10 h-10 rounded-md object-cover mr-3"
                })}
                <span className="text-gray-800 dark:text-gray-200">{category.name}</span>
              </div>
              {category.status === 'Inactive' && (
                <span className="ml-auto text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  Inactive
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  );
};

export default ReorderCategoriesModal;