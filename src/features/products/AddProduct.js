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
  FiLayers,
  FiDollarSign,
  FiPackage,
  FiBox,
  FiGrid,
  FiUploadCloud,
  FiInfo,
  FiLink
} from 'react-icons/fi';
import { apiService } from '../../api/config';
import { isAuthenticated } from '../../utils/jwtUtils';
import CategorySelector from '../categories/CategorySelector';

const AddProduct = () => {
  const navigate = useNavigate();
  const { storeId, productId } = useParams();
  const [activeSection, setActiveSection] = useState('product-info');
  const [loading, setLoading] = useState(false);
  const [fetchingProduct, setFetchingProduct] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [isEditing, setIsEditing] = useState(false);

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

  // Section progress tracking
  const [sectionProgress, setSectionProgress] = useState({
    'product-info': 0,
    'product-media': 0,
    'inventory': 0,
    'categorization': 0
  });

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      navigate('/login');
      return;
    }

    // Check if we're in edit mode
    if (productId) {
      setIsEditing(true);
      fetchProductData(storeId, productId);
    }

    // Fetch categories and tags
    fetchCategories();
    fetchTags();
  }, [storeId, productId, navigate]);

  useEffect(() => {
    // Calculate section progress
    updateSectionProgress();
  }, [product, selectedFile, selectedTags]);

  const updateSectionProgress = () => {
    // Basic info section progress
    const basicInfoFields = ['name', 'price', 'status'];
    const basicInfoComplete = basicInfoFields.filter(field => !!product[field]).length;
    const basicInfoProgress = Math.round((basicInfoComplete / basicInfoFields.length) * 100);

    // Media section progress
    const mediaProgress = (selectedFile || previewUrl || product.imageUrl) ? 100 : 0;

    // Inventory section progress
    const inventoryProgress = product.stockQuantity ? 100 : 0;

    // Categorization progress
    const categorizationProgress = product.categoryId ? 100 : 0;

    setSectionProgress({
      'product-info': basicInfoProgress,
      'product-media': mediaProgress,
      'inventory': inventoryProgress,
      'categorization': categorizationProgress
    });
  };

  const fetchProductData = async (storeId, id) => {
    setFetchingProduct(true);
    setError(null);
    
    try {
      // For real implementation, fetch from API
      const response = await apiService.get(`/products/${storeId}/${id}`);
      const productData = response.data;

      setProduct(productData);
      setSelectedTags(productData.tags || []);
      if (productData.imageUrl) {
        setPreviewUrl(productData.imageUrl);
      }
      setFetchingProduct(false);
    } catch (err) {
      console.error('Error fetching product data:', err);
      setError('Failed to load product data. Please try again.');
      setFetchingProduct(false);
    }
  };

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const response = await apiService.get(`/categories/store/${storeId}`);
      setCategories(response.data);
      setLoadingCategories(false);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories. Please try again.');
      
      // For development, provide some placeholder categories
      setTimeout(() => {
        setCategories([
          { id: 1, name: 'Sweets' },
          { id: 2, name: 'Snacks' },
          { id: 3, name: 'Spicy' },
          { id: 4, name: 'Dry Fruits' }
        ]);
        setLoadingCategories(false);
      }, 300);
    }
  };

  const fetchTags = async () => {
    try {
      // For development, provide some placeholder tags
      setTimeout(() => {
        setTags([
          { id: 1, name: 'New' },
          { id: 2, name: 'Featured' },
          { id: 3, name: 'Sale' },
          { id: 4, name: 'Bestseller' }
        ]);
      }, 300);
    } catch (err) {
      console.error('Error fetching tags:', err);
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
      // In production, use actual API call
      const response = await apiService.uploadFile(
        '/products/upload-image',
        formData,
        (percentCompleted) => setUploadProgress(percentCompleted)
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
      
      // Send API request - different endpoints for create vs update
      if (isEditing) {
        // Update existing product
        await apiService.put(`/products/${productId}`, productData);
      } else {
        // Create new product
        const response = await apiService.post(`/products/${storeId}`, productData);
      }
      
      setSuccess(true);
      
      // Navigate back to products list after short delay
      setTimeout(() => {
        navigate(`/store-dashboard/${storeId}/all-products`);
      }, 2000);
      
    } catch (err) {
      console.error('Error saving product:', err);
      setError(err.message || 'Failed to save product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      return;
    }
    
    try {
      // For development
      const newCategory = { id: categories.length + 1, name: newCategoryName };
      setCategories([...categories, newCategory]);
      setProduct({ ...product, categoryId: newCategory.id });
      
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
      // For development
      const newTagObject = { id: tags.length + 1, name: newTag };
      
      setTags([...tags, newTagObject]);
      setSelectedTags([...selectedTags, newTagObject.id]);
      setNewTag('');
    } catch (err) {
      console.error('Error creating tag:', err);
    }
  };

  // Show loading state while fetching product data
  if (fetchingProduct) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-3 border-b-3 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Loading product data...</p>
        </div>
      </div>
    );
  }

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
      default: return <FiInfo />;
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(`/store-dashboard/${storeId}/all-products`)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Back to products"
            >
              <FiArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEditing ? 'Edit Product' : 'Add New Product'}
            </h1>
          </div>
          
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isEditing ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <FiSave className="mr-2 -ml-1" />
                {isEditing ? 'Update Product' : 'Save Product'}
              </>
            )}
          </button>
        </div>

        {/* Error and Success Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-lg shadow-sm">
            <div className="flex items-center">
              <FiAlertCircle className="flex-shrink-0 h-5 w-5 text-red-500 mr-3" />
              <span className="text-red-700 dark:text-red-400">{error}</span>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded-lg shadow-sm">
            <div className="flex items-center">
              <FiCheckCircle className="flex-shrink-0 h-5 w-5 text-green-500 mr-3" />
              <span className="text-green-700 dark:text-green-400">
                Product {isEditing ? 'updated' : 'created'} successfully! Redirecting...
              </span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                  Product Setup
                </h2>
                
                <nav className="space-y-2">
                  {[
                    { id: 'product-info', name: 'Basic Information', icon: <FiLayers /> },
                    { id: 'product-media', name: 'Product Media', icon: <FiImage /> },
                    { id: 'inventory', name: 'Inventory', icon: <FiBox /> },
                    { id: 'categorization', name: 'Categories & Tags', icon: <FiTag /> },
                  ].map((section) => (
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
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              <form onSubmit={handleSubmit}>
                {/* Basic Information Section */}
                {activeSection === 'product-info' && (
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-lg font-medium text-gray-900 dark:text-white">Basic Information</h2>
                      <div className="w-24">
                        {renderProgressIndicator(sectionProgress['product-info'])}
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Product Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={product.name}
                          onChange={handleInputChange}
                          className="block w-full p-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Enter product name"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Description
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          value={product.description}
                          onChange={handleInputChange}
                          rows="4"
                          className="block w-full p-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Enter product description"
                        />
                        <p className="mt-1 text-sm text-gray-500">
                          Provide a detailed description that helps customers understand your product.
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Price <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FiDollarSign className="text-gray-500 dark:text-gray-400" />
                            </div>
                            <input
                              type="number"
                              id="price"
                              name="price"
                              value={product.price}
                              onChange={handleInputChange}
                              className="block w-full pl-10 p-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
                              placeholder="0.00"
                              min="0"
                              step="0.01"
                              required
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Original Price (for discounts)
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FiDollarSign className="text-gray-500 dark:text-gray-400" />
                            </div>
                            <input
                              type="number"
                              id="originalPrice"
                              name="originalPrice"
                              value={product.originalPrice}
                              onChange={handleInputChange}
                              className="block w-full pl-10 p-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
                              placeholder="0.00"
                              min="0"
                              step="0.01"
                            />
                          </div>
                          <p className="mt-1 text-sm text-gray-500">
                            Leave blank if not offering a discount
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Status
                        </label>
                        <select
                          id="status"
                          name="status"
                          value={product.status}
                          onChange={handleInputChange}
                          className="block w-full p-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                          <option value="Draft">Draft</option>
                        </select>
                        <p className="mt-1 text-sm text-gray-500">
                          Set to "Active" to make the product visible to customers
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-8 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setActiveSection('product-media')}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Next: Product Media
                      </button>
                    </div>
                  </div>
                )}

                {/* Product Media Section */}
                {activeSection === 'product-media' && (
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-lg font-medium text-gray-900 dark:text-white">Product Media</h2>
                      <div className="w-24">
                        {renderProgressIndicator(sectionProgress['product-media'])}
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Product Image
                        </label>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="flex flex-col items-center justify-center">
                            {previewUrl ? (
                              <div className="relative w-full max-w-xs">
                                <img
                                  src={previewUrl}
                                  alt="Product preview"
                                  className="w-full h-60 object-contain rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-2"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedFile(null);
                                    setPreviewUrl('');
                                    setProduct({...product, imageUrl: ''});
                                  }}
                                  className="absolute top-2 right-2 bg-white dark:bg-gray-800 rounded-full p-1 shadow-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                  aria-label="Remove image"
                                >
                                  <FiX className="text-gray-700 dark:text-gray-300" />
                                </button>
                              </div>
                            ) : (
                              <div
                                onClick={() => document.getElementById('imageUpload').click()}
                                className="w-full h-60 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-primary-500 dark:hover:border-primary-500 bg-gray-50 dark:bg-gray-800/50 transition-colors"
                              >
                                <FiUploadCloud className="h-12 w-12 text-gray-400 mb-3" />
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Drag and drop an image here, or click to select
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
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
                            
                            {uploadProgress > 0 && uploadProgress < 100 && (
                              <div className="w-full mt-4">
                                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-primary-600"
                                    style={{ width: `${uploadProgress}%` }}
                                  ></div>
                                </div>
                                <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-1">
                                  Uploading: {uploadProgress}%
                                </p>
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Or enter image URL
                              </label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <FiLink className="text-gray-500 dark:text-gray-400" />
                                </div>
                                <input
                                  type="url"
                                  id="imageUrl"
                                  name="imageUrl"
                                  value={product.imageUrl}
                                  onChange={(e) => {
                                    handleInputChange(e);
                                    if (e.target.value && !previewUrl) {
                                      setPreviewUrl(e.target.value);
                                    }
                                  }}
                                  className="block w-full pl-10 p-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
                                  placeholder="https://example.com/image.jpg"
                                />
                              </div>
                            </div>
                            
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 flex items-center">
                                <FiInfo className="mr-2" /> Image Tips
                              </h4>
                              <ul className="mt-2 text-sm text-blue-700 dark:text-blue-400 space-y-1">
                                <li>• Use a clean, well-lit image</li>
                                <li>• Square images work best (1:1 ratio)</li>
                                <li>• Recommended size: 1000x1000 pixels</li>
                                <li>• Show the product from its best angle</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8 flex justify-between">
                      <button
                        type="button"
                        onClick={() => setActiveSection('product-info')}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                      >
                        Previous: Basic Information
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveSection('inventory')}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Next: Inventory
                      </button>
                    </div>
                  </div>
                )}

                {/* Inventory Section */}
                {activeSection === 'inventory' && (
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-lg font-medium text-gray-900 dark:text-white">Inventory</h2>
                      <div className="w-24">
                        {renderProgressIndicator(sectionProgress['inventory'])}
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="p-5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <label htmlFor="stockType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Track Inventory
                            </label>
                          </div>
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
                            className="block w-full p-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
                          >
                            <option value="Unlimited">Don't track inventory</option>
                            <option value="Limited">Track inventory</option>
                          </select>
                          <p className="mt-1 text-sm text-gray-500">
                            Select "Don't track inventory" for digital products or unlimited stock
                          </p>
                        </div>
                        
                        {product.stockQuantity !== 'Unlimited' && (
                          <div className="mb-4">
                            <label htmlFor="stockQuantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Stock Quantity
                            </label>
                            <div className="flex items-center">
                              <div className="relative flex-grow">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <FiPackage className="text-gray-500 dark:text-gray-400" />
                                </div>
                                <input
                                  type="number"
                                  id="stockQuantity"
                                  name="stockQuantity"
                                  value={product.stockQuantity}
                                  onChange={handleInputChange}
                                  className="block w-full pl-10 p-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
                                  placeholder="Enter quantity"
                                  min="0"
                                />
                              </div>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">
                              Current available inventory
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="p-5 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/30">
                        <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-300 flex items-center">
                          <FiInfo className="mr-2" /> Inventory Management Tips
                        </h4>
                        <ul className="mt-2 text-sm text-yellow-700 dark:text-yellow-400 space-y-1">
                          <li>• Set up low stock alerts in inventory settings</li>
                          <li>• Regular inventory audits help maintain accuracy</li>
                          <li>• Consider setting a reorder point for popular items</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-8 flex justify-between">
                      <button
                        type="button"
                        onClick={() => setActiveSection('product-media')}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                      >
                        Previous: Product Media
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveSection('categorization')}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Next: Categories & Tags
                      </button>
                    </div>
                  </div>
                )}

                {/* Categories & Tags Section */}
                {activeSection === 'categorization' && (
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-lg font-medium text-gray-900 dark:text-white">Categories & Tags</h2>
                      <div className="w-24">
                        {renderProgressIndicator(sectionProgress['categorization'])}
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
                                    className="w-full"
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
                        onClick={() => setActiveSection('inventory')}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                      >
                        Previous: Inventory
                      </button>
                      <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {isEditing ? 'Updating...' : 'Saving...'}
                          </>
                        ) : (
                          <>
                            <FiSave className="mr-2 -ml-1" />
                            {isEditing ? 'Update Product' : 'Save Product'}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;