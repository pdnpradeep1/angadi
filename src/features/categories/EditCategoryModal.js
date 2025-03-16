import React, { useState, useEffect } from 'react';
import Modal from '../../components/ui/Modal';
import { FormField } from '../../components/ui/FormField';
import { Button } from '../../components/ui/Button';
import { FiImage, FiX } from 'react-icons/fi';
import { apiService } from '../../api/config';
import { renderCategoryImage } from '../../utils/category-image-utils';

const EditCategoryModal = ({ isOpen, onClose, category, categories = [], onUpdate, storeId }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'Active',
    parentCategoryId: ''
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Initialize form data when category changes
  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
        status: category.status || 'Active',
        parentCategoryId: category.parentCategoryId || ''
      });
      setImagePreview(category.image || '');
    }
  }, [category]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
  };

  const uploadImage = async () => {
    if (!imageFile) return null;

    const formData = new FormData();
    formData.append('file', imageFile);

    try {
      const response = await apiService.uploadFile('/categories/upload-image', formData);
      return response.data; // URL of the uploaded image
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleSubmit = async () => {
    // Validate form
    if (!formData.name.trim()) {
      setError('Category name is required');
      return;
    }

    // Prevent selecting itself as parent
    if (formData.parentCategoryId === category.id) {
      setError('A category cannot be its own parent');
      return;
    }

    // Check for circular references in the hierarchy
    const checkCircularReference = (parentId, categoryId) => {
      if (!parentId) return false;
      
      const parent = categories.find(cat => cat.id === parentId);
      if (!parent) return false;
      
      // If the potential parent has this category as an ancestor, it's circular
      if (parent.parentCategoryId === categoryId) return true;
      
      // Recursively check up the hierarchy
      return checkCircularReference(parent.parentCategoryId, categoryId);
    };
    
    if (checkCircularReference(formData.parentCategoryId, category.id)) {
      setError('This would create a circular parent-child relationship');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Upload image if selected
      let imageUrl = null;
      if (imageFile) {
        imageUrl = await uploadImage();
      }

      // Prepare category data
      const categoryData = {
        id: category.id,
        name: formData.name,
        description: formData.description,
        status: formData.status,
        parentCategoryId: formData.parentCategoryId || null,
        imageUrl: imageUrl || imagePreview || category.image
      };

      // Update category
      const response = await apiService.put(`/categories/${category.id}`, categoryData);
      
      const updatedCategory = {
        ...response.data,
        productCount: category.productCount, // Preserve the product count
        image: imageUrl || imagePreview || category.image
      };
      
      onUpdate(updatedCategory);
      onClose();
    } catch (err) {
      console.error('Error updating category:', err);
      setError(err.response?.data?.message || 'Failed to update category. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Recursively flatten categories for select dropdown, excluding the current category and its children
  const flattenCategoriesExcluding = (cats, excludeId, level = 0, result = []) => {
    if (!cats || !Array.isArray(cats)) return result;
    
    cats.forEach(cat => {
      if (cat.id !== excludeId) {
        result.push({
          id: cat.id,
          name: cat.name,
          level
        });
        
        if (cat.children && cat.children.length > 0) {
          flattenCategoriesExcluding(cat.children, excludeId, level + 1, result);
        }
      }
    });
    
    return result;
  };

  const flatCategories = flattenCategoriesExcluding(categories, category?.id);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Category"
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
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400">
            {error}
          </div>
        )}
        
        {/* Category Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category Image
          </label>
          
          {imagePreview ? (
            <div className="relative inline-block">
              <img 
                src={imagePreview} 
                alt="Category preview" 
                className="w-24 h-24 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                onError={(e) => {
                  e.target.onerror = null; // Prevent infinite loop
                  removeImage(); // Remove broken image and show the add image placeholder
                }}
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-white dark:bg-gray-800 rounded-full p-1 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FiX className="text-gray-500" />
              </button>
            </div>
          ) : category && category.image ? (
            <div className="relative inline-block">
              {renderCategoryImage(category.image, category.name, { 
                className: "w-24 h-24 object-cover rounded-lg border border-gray-300 dark:border-gray-600" 
              })}
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-white dark:bg-gray-800 rounded-full p-1 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FiX className="text-gray-500" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => document.getElementById('category-image-edit').click()}
              className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-primary-500 dark:hover:border-primary-500"
            >
              <FiImage className="h-8 w-8 text-gray-400" />
              <span className="text-xs text-gray-500 mt-1">Add Image</span>
            </div>
          )}
          
          <input
            type="file"
            id="category-image-edit"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
        </div>
        
        {/* Category Name */}
        <FormField 
          label="Category Name" 
          required={true}
        >
          <input 
            type="text" 
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter category name" 
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </FormField>
        
        {/* Parent Category */}
        {flatCategories.length > 0 && (
          <FormField 
            label="Parent Category"
            helpText="Leave empty for a top-level category"
          >
            <select
              name="parentCategoryId"
              value={formData.parentCategoryId}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">None (Top Level)</option>
              {flatCategories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {/* Use non-breaking spaces for indentation */}
                  {Array(cat.level).fill('\u00A0\u00A0').join('')}
                  {cat.level > 0 ? '↳ ' : ''}{cat.name}
                </option>
              ))}
            </select>
          </FormField>
        )}
        
        {/* Description */}
        <FormField 
          label="Description"
        >
          <textarea 
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            placeholder="Enter category description (optional)" 
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </FormField>
        
        {/* Status */}
        <FormField 
          label="Status"
        >
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </FormField>
      </div>
    </Modal>
  );
};

export default EditCategoryModal;