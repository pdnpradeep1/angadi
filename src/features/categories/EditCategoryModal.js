import React, { useState, useEffect } from 'react';
import Modal from '../../components/ui/Modal';
import { FormField } from '../../components/ui/FormField';
import { Button } from '../../components/ui/Button';
import { FiImage, FiX } from 'react-icons/fi';
import { renderCategoryImage, getDefaultCategoryImage } from '../../utils/category-image-utils';

const EditCategoryModal = ({ isOpen, onClose, category, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'Active'
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
        status: category.status || 'Active'
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

  const handleSubmit = async () => {
    // Validate form
    if (!formData.name.trim()) {
      setError('Category name is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // In a real implementation, you would upload the image and update the category via API
      // For now, we'll just simulate a successful API call
      
      setTimeout(() => {
        const updatedCategory = {
          ...category,
          name: formData.name,
          description: formData.description,
          status: formData.status,
          image: imagePreview || category.image
        };
        
        onUpdate(updatedCategory);
        setLoading(false);
        onClose();
      }, 1000);
    } catch (err) {
      console.error('Error updating category:', err);
      setError('Failed to update category. Please try again.');
      setLoading(false);
    }
  };

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