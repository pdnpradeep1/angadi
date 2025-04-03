// src/features/products/components/sections/CategorizationSection.js
import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';
import CategorySelector from '../../../categories/CategorySelector';
import { apiService } from '../../../../api/config';
import { useStore } from '../../../../contexts/StoreContext'; // Import the StoreContext

/**
 * Categories & Tags section for product form
 */
const CategorizationSection = ({ 
  product,
  setProduct,
  categories,
  tags,
  selectedTags,
  setSelectedTags,
  loadingCategories,
  onPrevious,
  onNext,
  progress
}) => {
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newTag, setNewTag] = useState('');
  const { currentStore } = useStore(); // Get the current store from context

  // Helper function to render progress indicator
  const renderProgressIndicator = (progress) => (
    <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
      <div 
        className={`h-full rounded-full ${progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );

  // Handle creating a new category
  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      return;
    }
    
    try {
      // Get storeId from the StoreContext
      const storeId = currentStore?.id;
      
      if (!storeId) {
        console.error('Store ID is missing');
        alert('Store ID is missing. Please make sure you are in a valid store dashboard.');
        return;
      }
      
      console.log('Using store ID for category creation:', storeId);
      
      // Create category object similar to AddCategoryModal.js
      const newCategory = {
        name: newCategoryName,
        description: `Category for ${newCategoryName} products`,
        status: 'Active',
        parentCategoryId: product.categoryId || null,
        productCount: 0,
        image: `/api/placeholder/64/64?text=${newCategoryName.charAt(0).toUpperCase()}&bgcolor=5a67d8&color=ffffff`
      };
      
      // Use apiService.post with the correct endpoint
      const response = await apiService.post(
        `/categories/${storeId}`, 
        newCategory
      );
      
      console.log('Category created successfully:', response);
      
      // Create a new category object in the format expected by CategorySelector
      const createdCategory = {
        id: response.id,
        name: response.name,
        parentId: response.parentCategoryId,
        image: response.image,
        productCount: 0,
        status: 'Active'
      };
      
      // Add the new category to the categories list (this will update the CategorySelector)
      const updatedCategories = [...categories, createdCategory];
      
      // Force a re-render of the CategorySelector by creating a new array
      // This is needed to ensure the TreeView updates properly
      categories.length = 0;
      categories.push(...updatedCategories);
      
      // Update the product's category with the response data
      setProduct({
        ...product,
        storeId: storeId,
        categoryId: response.id,
        categoryName: response.name
      });
      
      // Reset the form
      setNewCategoryName('');
      setShowNewCategory(false);
      
    } catch (error) {
      console.error('Error creating category:', error);
      alert(`Failed to create category: ${error.message || 'Unknown error'}`);
    }
  };

  // Handle tag selection
  const handleTagSelect = (tagId) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter(id => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  // Handle adding a new tag
  const handleAddNewTag = async () => {
    if (!newTag.trim()) return;
    
    try {
      // For development
      const newTagObject = { id: tags.length + 1, name: newTag };
      // In a real implementation, you'd call an API to create the tag
      
      // Add the new tag to the list and select it
      setSelectedTags([...selectedTags, newTagObject.id]);
      setNewTag('');
    } catch (err) {
      console.error('Error creating tag:', err);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Categories & Tags</h2>
        <div className="w-24">
          {renderProgressIndicator(progress)}
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="p-5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="mb-4">
            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            
            {loadingCategories ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500"></div>
                <span className="text-gray-500 dark:text-gray-400">Loading categories...</span>
              </div>
            ) : (
              <>
                {showNewCategory ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        className="flex-1 block w-full p-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter new category name"
                      />
                      <button
                        type="button"
                        onClick={handleCreateCategory}
                        className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                        disabled={!newCategoryName.trim()}
                      >
                        Add
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowNewCategory(false)}
                      className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <CategorySelector
                      categories={categories}
                      selectedCategoryId={product.categoryId}
                      onChange={(id) => setProduct({ ...product, categoryId: id })}
                      onCreateNew={() => setShowNewCategory(true)}
                      className="w-full custom-scrollbar"
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        
        <div className="p-5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tags
            </label>
            <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
              Tags help customers find your products more easily
            </p>
            
            <div className="mb-4 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  onClick={() => handleTagSelect(tag.id)}
                  className={`px-3 py-1.5 rounded-full text-sm cursor-pointer transition-colors ${
                    selectedTags.includes(tag.id)
                      ? 'bg-primary-100 text-primary-800 border border-primary-300 dark:bg-primary-900/30 dark:text-primary-300 dark:border-primary-700'
                      : 'bg-gray-100 text-gray-800 border border-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {tag.name}
                </div>
              ))}
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="flex-1 block w-full p-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter new tag (e.g., featured, summer, discount)"
              />
              <button
                type="button"
                onClick={handleAddNewTag}
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                disabled={!newTag.trim()}
              >
                Add Tag
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={onPrevious}
          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Previous: Inventory
        </button>
        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Next: Product Variants
        </button>
      </div>
    </div>
  );
};

export default CategorizationSection;