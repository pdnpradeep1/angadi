import React, { useState } from 'react';
import Modal from '../../components/ui/Modal';
import { FormField } from '../../components/ui/FormField';
import { Button } from '../../components/ui/Button';
import { FiImage, FiX } from 'react-icons/fi';
import { getDefaultCategoryImage } from '../../utils/category-image-utils';
import { apiService } from '../../api/config';

const AddCategoryModal = ({ isOpen, onClose, onAdd, categories = [], storeId }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'Active',
    parentCategoryId: '' // Added parentCategoryId field
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  const handleSubmit = async () => {
    // Validate form
    if (!formData.name.trim()) {
      setError('Category name is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // In a real implementation, you would upload the image and create the category
      // For now, we'll just simulate a successful API call
      
      // setTimeout(() => {
      //   const newCategory = {
      //     id: Date.now(), // Temporary ID
      //     name: formData.name,
      //     description: formData.description,
      //     status: formData.status,
      //     parentCategoryId: formData.parentCategoryId ? parseInt(formData.parentCategoryId) : null,
      //     productCount: 0,
      //     image: imagePreview || getDefaultCategoryImage(formData.name)
      //   };

      //   const response =  apiService.get('/api/stores/my-stores');
      //   console.log(response.data);
        
      //   // await apiService.post(`/categories/${storeId}`, newCategory);

      //   onAdd(newCategory);
      //   setLoading(false);
        
      //   // Reset form
      //   setFormData({
      //     name: '',
      //     description: '',
      //     status: 'Active',
      //     parentCategoryId: ''
      //   });
      //   setImageFile(null);
      //   setImagePreview('');
        
      //   onClose();
      // }, 1000);

      const newCategory = {
        id: Date.now(), // Temporary ID
        name: formData.name,
        description: formData.description,
        status: formData.status,
        parentCategoryId: formData.parentCategoryId ? parseInt(formData.parentCategoryId) : null,
        productCount: 0,
        image: imagePreview || getDefaultCategoryImage(formData.name)
      };

      const response =  await apiService.post(`/categories/${storeId}`, newCategory);
      console.log(response.data);
      
      // await apiService.post(`/categories/${storeId}`, newCategory);

      onAdd(newCategory);
      setLoading(false);
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        status: 'Active',
        parentCategoryId: ''
      });
      setImageFile(null);
      setImagePreview('');
      
      onClose();
    } catch (err) {
      console.error('Error adding category:', err);
      setError('Failed to add category. Please try again.');
      setLoading(false);
    }
  };

  // Recursively flatten categories for select dropdown
  const flattenCategories = (cats, level = 0, result = []) => {
    if (!cats || !Array.isArray(cats)) return result;
    
    cats.forEach(cat => {
      result.push({
        id: cat.id,
        name: cat.name,
        level,
        parentId: cat.parentId
      });
      
      if (cat.children && cat.children.length > 0) {
        flattenCategories(cat.children, level + 1, result);
      }
    });
    
    return result;
  };

  const flatCategories = flattenCategories(categories);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Category"
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
            {loading ? 'Adding...' : 'Add Category'}
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
          ) : (
            <div
              onClick={() => document.getElementById('category-image').click()}
              className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-primary-500 dark:hover:border-primary-500"
            >
              <FiImage className="h-8 w-8 text-gray-400" />
              <span className="text-xs text-gray-500 mt-1">Add Image</span>
            </div>
          )}
          
          <input
            type="file"
            id="category-image"
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
        
        {/* Parent Category - New Field */}
        {categories.length > 0 && (
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

export default AddCategoryModal;