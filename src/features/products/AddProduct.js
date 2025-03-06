import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  FiSave, 
  FiImage, 
  FiX, 
  FiAlertCircle, 
  FiCheckCircle,
  FiArrowLeft,
  FiTag,
  FiLayers
} from 'react-icons/fi';
import axios from 'axios';
import '../../styles/AddProduct.css';

const AddProduct = () => {
  const navigate = useNavigate();
  const { storeId } = useParams();
  const [activeSection, setActiveSection] = useState('product-info');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [newTag, setNewTag] = useState('');

  // Product form state
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    stockQuantity: 'Unlimited',
    categoryId: '',
    imageUrl: '',
    status: 'Active',
  });

  // Image upload state
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      navigate('/login');
      return;
    }

    // Fetch categories for this store
    fetchCategories();
    fetchTags();
  }, [storeId, navigate]);

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.get(`http://localhost:8080/categories/store/${storeId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories. Please try again.');
      
      // For development, provide some placeholder categories
      if (process.env.NODE_ENV === 'development') {
        setCategories([
          { id: 1, name: 'Sweets' },
          { id: 2, name: 'Snacks' },
          { id: 3, name: 'Spicy' },
          { id: 4, name: 'Dry Fruits' }
        ]);
      }
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchTags = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      // This endpoint might need to be created on the backend
      const response = await axios.get(`http://localhost:8080/tags`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTags(response.data);
    } catch (err) {
      console.error('Error fetching tags:', err);
      
      // For development, provide some placeholder tags
      if (process.env.NODE_ENV === 'development') {
        setTags([
          { id: 1, name: 'New' },
          { id: 2, name: 'Featured' },
          { id: 3, name: 'Sale' },
          { id: 4, name: 'Bestseller' }
        ]);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!selectedFile) return null;
    
    const formData = new FormData();
    formData.append('file', selectedFile);
    
    try {
      setUploadProgress(0);
      const token = localStorage.getItem('jwtToken');
      const response = await axios.post(
        'http://localhost:8080/products/upload-image',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          }
        }
      );
      
      return response.data; // Should return the image URL
    } catch (err) {
      console.error('Error uploading image:', err);
      throw new Error('Failed to upload image');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Form validation
      if (!product.name || !product.price || !product.categoryId) {
        throw new Error('Please fill in all required fields');
      }
      
      // Upload image if selected
      let imageUrl = product.imageUrl;
      if (selectedFile) {
        imageUrl = await uploadImage();
        if (!imageUrl) {
          throw new Error('Failed to upload image');
        }
      }
      
      // Create product object for API
      const productData = {
        ...product,
        imageUrl,
        price: parseFloat(product.price),
        originalPrice: product.originalPrice ? parseFloat(product.originalPrice) : parseFloat(product.price),
        stockQuantity: product.stockQuantity === 'Unlimited' ? -1 : parseInt(product.stockQuantity, 10)
      };
      
      // Send API request
      const token = localStorage.getItem('jwtToken');
      const response = await axios.post(
        `http://localhost:8080/products/${storeId}`,
        productData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Owner-Email': JSON.parse(atob(token.split('.')[1])).sub,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // If product has tags, add them
      if (selectedTags.length > 0 && response.data && response.data.id) {
        await axios.put(
          `http://localhost:8080/products/${response.data.id}/tags`,
          selectedTags,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Owner-Email': JSON.parse(atob(token.split('.')[1])).sub,
              'Content-Type': 'application/json'
            }
          }
        );
      }
      
      setSuccess(true);
      
      // Navigate back to products list after short delay
      setTimeout(() => {
        navigate(`/store-dashboard/${storeId}/all-products`);
      }, 2000);
      
    } catch (err) {
      console.error('Error creating product:', err);
      setError(err.message || 'Failed to create product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      return;
    }
    
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.post(
        `http://localhost:8080/categories/${storeId}`,
        { name: newCategoryName },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Owner-Email': JSON.parse(atob(token.split('.')[1])).sub,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setCategories([...categories, response.data]);
      setProduct({ ...product, categoryId: response.data.id });
      setNewCategoryName('');
      setShowNewCategory(false);
    } catch (err) {
      console.error('Error creating category:', err);
      setError('Failed to create category');
    }
  };

  const handleTagSelect = (tagId) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter(id => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  const handleAddNewTag = async () => {
    if (!newTag.trim()) return;
    
    try {
      const token = localStorage.getItem('jwtToken');
      // This endpoint might need to be created on the backend
      const response = await axios.post(
        'http://localhost:8080/tags',
        { name: newTag },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      const newTagObject = response.data;
      setTags([...tags, newTagObject]);
      setSelectedTags([...selectedTags, newTagObject.id]);
      setNewTag('');
    } catch (err) {
      console.error('Error creating tag:', err);
      
      // For development, create a mock tag
      if (process.env.NODE_ENV === 'development') {
        const mockTag = { id: Math.floor(Math.random() * 1000) + 10, name: newTag };
        setTags([...tags, mockTag]);
        setSelectedTags([...selectedTags, mockTag.id]);
        setNewTag('');
      }
    }
  };

  return (
    <div className="add-product-container">
      {/* Left Sidebar */}
      <div className="sidebar bg-white dark:bg-secondary-800 shadow-md">
        <h4 className="text-xl font-semibold mb-4 text-secondary-900 dark:text-white">Add New Product</h4>
        <ul>
          <li
            className={activeSection === 'product-info' ? 'active' : ''}
            onClick={() => setActiveSection('product-info')}
          >
            <span className="flex items-center">
              <FiLayers className="mr-2" />
              Basic Information
            </span>
          </li>
          <li
            className={activeSection === 'product-media' ? 'active' : ''}
            onClick={() => setActiveSection('product-media')}
          >
            <span className="flex items-center">
              <FiImage className="mr-2" />
              Product Media
            </span>
          </li>
          <li
            className={activeSection === 'inventory' ? 'active' : ''}
            onClick={() => setActiveSection('inventory')}
          >
            <span className="flex items-center">
              <FiLayers className="mr-2" />
              Inventory
            </span>
          </li>
          <li
            className={activeSection === 'categorization' ? 'active' : ''}
            onClick={() => setActiveSection('categorization')}
          >
            <span className="flex items-center">
              <FiTag className="mr-2" />
              Categories & Tags
            </span>
          </li>
        </ul>

        <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => navigate(`/store-dashboard/${storeId}/all-products`)}
            className="w-full flex items-center justify-center px-4 py-2 text-sm text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-md"
          >
            <FiArrowLeft className="mr-2" /> Back to Products
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="form-content bg-white dark:bg-secondary-800 shadow-md">
        {/* Error and Success Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-md">
            <div className="flex items-center">
              <FiAlertCircle className="text-red-500 mr-2" size={20} />
              <span className="text-red-700 dark:text-red-400">{error}</span>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded-md">
            <div className="flex items-center">
              <FiCheckCircle className="text-green-500 mr-2" size={20} />
              <span className="text-green-700 dark:text-green-400">
                Product created successfully! Redirecting...
              </span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Basic Information Section */}
          {activeSection === 'product-info' && (
            <div className="section">
              <h3 className="text-xl font-semibold mb-6 text-secondary-900 dark:text-white">Basic Information</h3>
              
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={product.name}
                  onChange={handleInputChange}
                  className="input w-full"
                  placeholder="Enter product name"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={product.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="input w-full"
                  placeholder="Enter product description"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label htmlFor="price" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-secondary-500 dark:text-secondary-400">₹</span>
                    </div>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={product.price}
                      onChange={handleInputChange}
                      className="input pl-7 w-full"
                      placeholder="Enter price"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="originalPrice" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                    Original Price (for discounts)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-secondary-500 dark:text-secondary-400">₹</span>
                    </div>
                    <input
                      type="number"
                      id="originalPrice"
                      name="originalPrice"
                      value={product.originalPrice}
                      onChange={handleInputChange}
                      className="input pl-7 w-full"
                      placeholder="Enter original price if on discount"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="status" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={product.status}
                  onChange={handleInputChange}
                  className="input w-full"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
              
              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={() => setActiveSection('product-media')}
                  className="btn btn-primary"
                >
                  Next: Product Media
                </button>
              </div>
            </div>
          )}

          {/* Product Media Section */}
          {activeSection === 'product-media' && (
            <div className="section">
              <h3 className="text-xl font-semibold mb-6 text-secondary-900 dark:text-white">Product Media</h3>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Product Image
                </label>
                
                <div className="flex flex-col items-center border-2 border-dashed border-secondary-300 dark:border-secondary-600 rounded-lg p-6 transition-all hover:border-primary-500 dark:hover:border-primary-500">
                  {previewUrl ? (
                    <div className="relative">
                      <img
                        src={previewUrl}
                        alt="Product preview"
                        className="max-h-64 rounded-lg mb-4"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null);
                          setPreviewUrl('');
                        }}
                        className="absolute top-2 right-2 bg-white dark:bg-secondary-800 rounded-full p-1 shadow-md hover:bg-secondary-100 dark:hover:bg-secondary-700"
                      >
                        <FiX className="text-secondary-700 dark:text-secondary-300" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <FiImage className="mx-auto h-12 w-12 text-secondary-400" />
                      <p className="mt-2 text-sm text-secondary-600 dark:text-secondary-400">
                        Drag and drop an image here, or click to select a file
                      </p>
                      <p className="text-xs text-secondary-500 dark:text-secondary-500">
                        PNG, JPG or JPEG up to 5MB
                      </p>
                    </div>
                  )}
                  
                  <input
                    type="file"
                    id="imageUpload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileSelect}
                  />
                  
                  {!previewUrl && (
                    <button
                      type="button"
                      onClick={() => document.getElementById('imageUpload').click()}
                      className="mt-4 px-4 py-2 border border-secondary-300 dark:border-secondary-600 rounded-md text-sm font-medium text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700"
                    >
                      Select Image
                    </button>
                  )}
                  
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="w-full mt-4">
                      <div className="h-2 bg-secondary-200 dark:bg-secondary-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-600"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1 text-center">
                        Uploading: {uploadProgress}%
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Image URL Input (alternative to upload) */}
                <div className="mt-4">
                  <label htmlFor="imageUrl" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                    Or enter image URL
                  </label>
                  <input
                    type="url"
                    id="imageUrl"
                    name="imageUrl"
                    value={product.imageUrl}
                    onChange={handleInputChange}
                    className="input w-full"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
              
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setActiveSection('product-info')}
                  className="btn btn-secondary"
                >
                  Previous: Basic Information
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSection('inventory')}
                  className="btn btn-primary"
                >
                  Next: Inventory
                </button>
              </div>
            </div>
          )}

          {/* Inventory Section */}
          {activeSection === 'inventory' && (
            <div className="section">
              <h3 className="text-xl font-semibold mb-6 text-secondary-900 dark:text-white">Inventory</h3>
              
              <div className="mb-6">
                <label htmlFor="stockQuantity" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                  Stock Quantity
                </label>
                <div className="flex items-center mb-2">
                  <div className="flex-1">
                    <select
                      id="stockType"
                      value={product.stockQuantity === 'Unlimited' ? 'Unlimited' : 'Limited'}
                      onChange={(e) => {
                        if (e.target.value === 'Unlimited') {
                          setProduct({ ...product, stockQuantity: 'Unlimited' });
                        } else {
                          setProduct({ ...product, stockQuantity: '' });
                        }
                      }}
                      className="input w-full"
                    >
                      <option value="Unlimited">Unlimited</option>
                      <option value="Limited">Limited</option>
                    </select>
                  </div>
                  
                  {product.stockQuantity !== 'Unlimited' && (
                    <div className="flex-1 ml-2">
                      <input
                        type="number"
                        id="stockQuantity"
                        name="stockQuantity"
                        value={product.stockQuantity}
                        onChange={handleInputChange}
                        className="input w-full"
                        placeholder="Enter quantity"
                        min="0"
                      />
                    </div>
                  )}
                </div>
                <p className="text-xs text-secondary-500 dark:text-secondary-400">
                  Select "Unlimited" if you don't want to track inventory
                </p>
              </div>
              
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setActiveSection('product-media')}
                  className="btn btn-secondary"
                >
                  Previous: Product Media
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSection('categorization')}
                  className="btn btn-primary"
                >
                  Next: Categories & Tags
                </button>
              </div>
            </div>
          )}

          {/* Categories & Tags Section */}
          {activeSection === 'categorization' && (
            <div className="section">
              <h3 className="text-xl font-semibold mb-6 text-secondary-900 dark:text-white">Categories & Tags</h3>
              
              <div className="mb-6">
                <label htmlFor="categoryId" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                
                {loadingCategories ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500"></div>
                    <span className="text-secondary-500 dark:text-secondary-400">Loading categories...</span>
                  </div>
                ) : (
                  <>
                    {showNewCategory ? (
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          className="input flex-1"
                          placeholder="Enter new category name"
                        />
                        <button
                          type="button"
                          onClick={handleCreateCategory}
                          className="ml-2 btn btn-primary"
                          disabled={!newCategoryName.trim()}
                        >
                          Add
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowNewCategory(false)}
                          className="ml-2 btn btn-secondary"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <select
                          id="categoryId"
                          name="categoryId"
                          value={product.categoryId}
                          onChange={handleInputChange}
                          className="input flex-1"
                          required
                        >
                          <option value="">Select a category</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => setShowNewCategory(true)}
                          className="ml-2 btn btn-secondary"
                        >
                          Create New
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Tags
                </label>
                <div className="mb-2 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <div
                      key={tag.id}
                      onClick={() => handleTagSelect(tag.id)}
                      className={`px-3 py-1 rounded-full text-sm cursor-pointer ${
                        selectedTags.includes(tag.id)
                          ? 'bg-primary-100 text-primary-800 border border-primary-300 dark:bg-primary-900/30 dark:text-primary-300 dark:border-primary-700'
                          : 'bg-secondary-100 text-secondary-800 border border-secondary-300 dark:bg-secondary-800 dark:text-secondary-200 dark:border-secondary-700'
                      }`}
                    >
                      {tag.name}
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center mt-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="input flex-1"
                    placeholder="Enter new tag"
                  />
                  <button
                    type="button"
                    onClick={handleAddNewTag}
                    className="ml-2 btn btn-secondary"
                    disabled={!newTag.trim()}
                  >
                    Add Tag
                  </button>
                </div>
              </div>
              
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setActiveSection('inventory')}
                  className="btn btn-secondary"
                >
                  Previous: Inventory
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex items-center"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave className="mr-2" /> Save Product
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
