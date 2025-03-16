import React, { useState, useEffect } from 'react';
import Modal from '../../components/ui/Modal';
import { FormField } from '../../components/ui/FormField';
import { Button } from '../../components/ui/Button';
import { FiImage, FiX, FiAlertCircle, FiInfo } from 'react-icons/fi';
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
  const [warning, setWarning] = useState('');
  const [hierarchyImpact, setHierarchyImpact] = useState({
    show: false,
    affectedCategories: []
  });

  // Initialize form data when category changes
  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
        status: category.status || 'Active',
        parentCategoryId: category.parentId ? category.parentId.toString() : ''
      });
      setImagePreview(category.image || '');
      setError('');
      setWarning('');
      setHierarchyImpact({ show: false, affectedCategories: [] });
    }
  }, [category]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // If changing parent category, perform validation
    if (name === 'parentCategoryId' && value) {
      validateParentChange(parseInt(value));
    } else {
      // Clear hierarchy impact warning if no parent selected
      if (name === 'parentCategoryId' && !value) {
        setHierarchyImpact({ show: false, affectedCategories: [] });
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Validate parent change to prevent circular references and identify affected subcategories
  const validateParentChange = (newParentId) => {
    // Clear previous warnings
    setWarning('');
    setHierarchyImpact({ show: false, affectedCategories: [] });
    
    // Self-reference check
    if (newParentId === category.id) {
      setError('A category cannot be its own parent');
      return false;
    }
    
    // Circular reference check
    const isCircular = checkCircularReference(newParentId, category.id, new Set());
    if (isCircular) {
      setError('This would create a circular reference in the category hierarchy');
      return false;
    }
    
    // Calculate impact on subcategories
    const childCategories = findAllChildren(category.id);
    if (childCategories.length > 0) {
      setWarning('Changing the parent will move all subcategories with this category');
      setHierarchyImpact({
        show: true,
        affectedCategories: childCategories
      });
    }
    
    setError(''); // Clear any previous errors
    return true;
  };

  // Check if setting newParentId as parent of categoryId would create a circular reference
  const checkCircularReference = (newParentId, categoryId, visited = new Set()) => {
    // If we've already checked this category, avoid infinite recursion
    if (visited.has(newParentId)) return false;
    visited.add(newParentId);
    
    // If the new parent is actually a child of the category, that's circular
    const parentCategory = categories.find(cat => cat.id === newParentId);
    if (!parentCategory) return false;
    
    // Direct circular reference
    if (parentCategory.parentId === categoryId) return true;
    
    // Check if any ancestor of the new parent is the category
    if (parentCategory.parentId) {
      return checkCircularReference(parentCategory.parentId, categoryId, visited);
    }
    
    return false;
  };

  // Find all children of a category (recursive)
  const findAllChildren = (categoryId) => {
    const directChildren = categories.filter(cat => cat.parentId === categoryId);
    
    let allChildren = [...directChildren];
    directChildren.forEach(child => {
      const grandchildren = findAllChildren(child.id);
      allChildren = [...allChildren, ...grandchildren];
    });
    
    return allChildren;
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size
      if (file.size > 5 * 1024 * 1024) { // 5 MB limit
        setError('Image size exceeds the 5MB limit');
        return;
      }
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setError('Please select a valid image file (JPEG, PNG, GIF, or WEBP)');
        return;
      }
      
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError(''); // Clear any previous errors
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
      // Track upload progress
      const onUploadProgress = (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log(`Upload progress: ${percentCompleted}%`);
      };
      
      const response = await apiService.uploadFile(
        '/categories/upload-image', 
        formData,
        onUploadProgress
      );
      
      return response.data; // URL of the uploaded image
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image. Please try again.');
    }
  };

  const handleSubmit = async () => {
    // Form validation
    if (!formData.name.trim()) {
      setError('Category name is required');
      return;
    }

    // Prevent selecting itself as parent
    if (formData.parentCategoryId === category.id.toString()) {
      setError('A category cannot be its own parent');
      return;
    }

    // Check for circular references in the hierarchy
    if (formData.parentCategoryId) {
      const isValid = validateParentChange(parseInt(formData.parentCategoryId));
      if (!isValid) return;
    }

    setLoading(true);
    setError('');

    try {
      // Upload image if selected
      let imageUrl = null;
      if (imageFile) {
        try {
          imageUrl = await uploadImage();
        } catch (err) {
          setError(err.message);
          setLoading(false);
          return;
        }
      }

      // Prepare category data
      const categoryData = {
        id: category.id,
        name: formData.name,
        description: formData.description,
        status: formData.status,
        parentId: formData.parentCategoryId ? parseInt(formData.parentCategoryId) : null,
        imageUrl: imageUrl || imagePreview || category.image
      };

      // Update category
      const response = await apiService.put(`/categories/${category.id}`, categoryData);
      
      const updatedCategory = {
        ...response.data,
        productCount: category.productCount, // Preserve the product count
        image: imageUrl || imagePreview || category.image,
        parentId: formData.parentCategoryId ? parseInt(formData.parentCategoryId) : null
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
  const flattenCategoriesExcluding = (cats) => {
    // Create a function to check if a category is the edited category or its descendant
    const isDescendant = (cat) => {
      if (cat.id === category?.id) return true;
      
      // Check if this category is a descendant of the category being edited
      const children = findAllChildren(category?.id || 0);
      return children.some(child => child.id === cat.id);
    };
    
    // Filter out the category being edited and all its descendants
    const validCategories = cats.filter(cat => !isDescendant(cat));
    
    // Sort by hierarchy
    const result = [];
    
    // First add all top-level categories
    const topLevel = validCategories.filter(cat => !cat.parentId);
    topLevel.forEach(cat => {
      result.push({
        id: cat.id,
        name: cat.name,
        level: 0
      });
      
      // Then recursively add children
      addChildrenRecursive(cat.id, validCategories, result, 1);
    });
    
    return result;
  };
  
  // Helper function to recursively add children to the flattened list
  const addChildrenRecursive = (parentId, allCats, result, level) => {
    const children = allCats.filter(cat => cat.parentId === parentId);
    
    children.forEach(child => {
      result.push({
        id: child.id,
        name: child.name,
        level
      });
      
      addChildrenRecursive(child.id, allCats, result, level + 1);
    });
  };

  const flatCategories = flattenCategoriesExcluding(categories);

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
            disabled={loading || !!error}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-md">
            <div className="flex items-center">
              <FiAlertCircle className="text-red-500 mr-2" size={20} />
              <span className="text-red-700 dark:text-red-400">{error}</span>
            </div>
          </div>
        )}
        
        {warning && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 rounded-md">
            <div className="flex items-center">
              <FiInfo className="text-yellow-500 mr-2" size={20} />
              <span className="text-yellow-700 dark:text-yellow-400">{warning}</span>
            </div>
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
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Recommended size: 512x512px. Max 5MB (JPEG, PNG, GIF, WEBP)
          </p>
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
        
        {/* Display affected subcategories when hierarchy change is detected */}
        {hierarchyImpact.show && hierarchyImpact.affectedCategories.length > 0 && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
            <h4 className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-2">
              These subcategories will move with this category:
            </h4>
            <ul className="list-disc pl-5 text-sm text-blue-600 dark:text-blue-300 space-y-1">
              {hierarchyImpact.affectedCategories.slice(0, 5).map(cat => (
                <li key={cat.id}>{cat.name}</li>
              ))}
              {hierarchyImpact.affectedCategories.length > 5 && (
                <li>...and {hierarchyImpact.affectedCategories.length - 5} more</li>
              )}
            </ul>
          </div>
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
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Setting a category to inactive will hide it and all its subcategories from customers
          </p>
        </FormField>
      </div>
    </Modal>
  );
};

export default EditCategoryModal;