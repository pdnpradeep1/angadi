import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  FiSave, 
  FiAlertCircle, 
  FiCheckCircle,
  FiArrowLeft,
} from 'react-icons/fi';

// Components
import ProductSidebar from './components/ProductSidebar';
import BasicInfoSection from './components/sections/BasicInfoSection';
import ProductMediaSection from './components/sections/ProductMediaSection';
import InventorySection from './components/sections/InventorySection';
import CategorizationSection from './components/sections/CategorizationSection';
import ProductVariantsSection from './components/sections/ProductVariantsSection';

// Utilities and services
import { apiService } from '../../api/config';
import { isAuthenticated } from '../../utils/jwtUtils';

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
  const [selectedTags, setSelectedTags] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [variants, setVariants] = useState([]);

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
    'categorization': 0,
    'variants': 0
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
      fetchProductData(productId);
    }

    // Fetch categories and tags
    fetchCategories();
    fetchTags();
  }, [productId, navigate]);

  useEffect(() => {
    // Calculate section progress
    updateSectionProgress();
  }, [product, selectedFile, selectedTags, variants]);

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
    
    // Variants progress - consider complete if any variants exist or if deliberately left empty
    const variantsProgress = 100; // Always consider complete, as variants are optional

    setSectionProgress({
      'product-info': basicInfoProgress,
      'product-media': mediaProgress,
      'inventory': inventoryProgress,
      'categorization': categorizationProgress,
      'variants': variantsProgress
    });
  };

  const fetchProductData = async (id) => {
    setFetchingProduct(true);
    setError(null);
    
    try {
      const response = await apiService.get(`/products/${storeId}/${id}`);
      const productData = response.data;
      console.log('Product data from API:', productData); // Debug log

      // Normalize product data
      const normalizedProduct = {
        ...productData,
        stockQuantity: productData.stockQuantity === -1 ? 'Unlimited' : productData.stockQuantity
      };

      setProduct(normalizedProduct);
      
      // Set tags if available
      if (productData.tags && productData.tags.length > 0) {
        setSelectedTags(productData.tags.map(tag => tag.id));
      }
      
      // Set variants if available
      if (productData.variants && productData.variants.length > 0) {
        // Transform variants from the backend format to the format expected by the component
        const transformedVariants = productData.variants.map(variant => {
          // Extract attributes from the variant
          let attributes = [];
          if (variant.attributes) {
            // Convert attributes from object to array format expected by the UI
            attributes = Object.entries(variant.attributes).map(([name, value]) => ({
              name,
              value
            }));
          }
          
          return {
            ...variant,
            id: variant.id || variant.variantId, // Make sure we have an ID
            attributes,
            stockQuantity: variant.stockQuantity === -1 ? 'Unlimited' : variant.stockQuantity,
            price: variant.price ? variant.price.toString() : '',
            originalPrice: variant.originalPrice ? variant.originalPrice.toString() : '',
            // Add any other necessary transformations here
          };
        });
        
        console.log('Transformed variants:', transformedVariants); // Debug log
        setVariants(transformedVariants);
      }
      
      // Set image preview
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

  // const fetchProductData = async (id) => {
  //   setFetchingProduct(true);
  //   setError(null);
    
  //   try {
  //     const response = await apiService.get(`/products/${storeId}/${id}`);
  //     const productData = response.data;
  //     console.log('Product data from API:', productData); // Debug log

  //     // Normalize product data
  //     const normalizedProduct = {
  //       ...productData,
  //       stockQuantity: productData.stockQuantity === -1 ? 'Unlimited' : productData.stockQuantity
  //     };

  //     setProduct(normalizedProduct);
      
  //     // Set tags if available
  //     if (productData.tags && productData.tags.length > 0) {
  //       setSelectedTags(productData.tags.map(tag => tag.id));
  //     }
      
  //     // Set variants if available
  //     if (productData.variants && productData.variants.length > 0) {
  //       // Transform variants from the backend format to the format expected by the component
  //       const transformedVariants = productData.variants.map(variant => {
  //         // Extract attributes from the variant
  //         let attributes = [];
  //         if (variant.attributes) {
  //           // Convert attributes from object to array format expected by the UI
  //           attributes = Object.entries(variant.attributes).map(([name, value]) => ({
  //             name,
  //             value
  //           }));
  //         }
          
  //         return {
  //           ...variant,
  //           id: variant.id || variant.variantId, // Make sure we have an ID
  //           attributes,
  //           stockQuantity: variant.stockQuantity === -1 ? 'Unlimited' : variant.stockQuantity,
  //           price: variant.price ? variant.price.toString() : '',
  //           originalPrice: variant.originalPrice ? variant.originalPrice.toString() : '',
  //           // Add any other necessary transformations here
  //         };
  //       });
        
  //       console.log('Transformed variants:', transformedVariants); // Debug log
  //       setVariants(transformedVariants);
  //     }
      
  //     // Set image preview
  //     if (productData.imageUrl) {
  //       setPreviewUrl(productData.imageUrl);
  //     }
      
  //     setFetchingProduct(false);
  //   } catch (err) {
  //     console.error('Error fetching product data:', err);
  //     setError('Failed to load product data. Please try again.');
  //     setFetchingProduct(false);
  //   }
  // };

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
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Form validation
      if (!product.name || !product.price) {
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
      
      // FIXED: Transform variants data for API
      const transformedVariants = variants.map(variant => {
        console.log('Processing variant for API submission:', variant);
        
        // Convert attributes from array to map if needed
        let attributes = {};
        
        // Handle different formats of attributes and options
        if (variant.attributes) {
          if (Array.isArray(variant.attributes)) {
            variant.attributes.forEach(attr => {
              if (attr.name && attr.value) {
                attributes[attr.name] = attr.value;
              }
            });
          } else if (typeof variant.attributes === 'object') {
            attributes = { ...variant.attributes };
          }
        }
        
        // Also check options field which might contain attribute data
        if (variant.options && Array.isArray(variant.options)) {
          variant.options.forEach(opt => {
            if (opt.name && opt.value) {
              attributes[opt.name] = opt.value;
            }
          });
        }
        
        // Parse numeric values safely
        const price = variant.price || product.price;
        const variantPrice = price ? parseFloat(price) : parseFloat(product.price);
        
        // Handle different field names for stock quantity
        let stockQuantity;
        if (variant.stockQuantity === 'Unlimited' || variant.quantity === 'Unlimited') {
          stockQuantity = -1;
        } else if (variant.stockQuantity) {
          stockQuantity = parseInt(variant.stockQuantity, 10);
        } else if (variant.quantity) {
          stockQuantity = parseInt(variant.quantity, 10);
        } else {
          stockQuantity = 0;
        }
        
        // Handle different field names for original price
        let originalPrice = null;
        if (variant.originalPrice && variant.originalPrice.trim() !== '') {
          originalPrice = parseFloat(variant.originalPrice);
        } else if (variant.discountedPrice && variant.discountedPrice.trim() !== '') {
          originalPrice = parseFloat(variant.discountedPrice);
        }
        
        // Create the variant request object
        const apiVariant = {
          // For existing variants in edit mode, include the ID
          id: isEditing && variant.id ? variant.id : undefined,
          // Include variantId for reference
          variantId: variant.variantId || variant.id || Date.now() + Math.floor(Math.random() * 1000),
          // Include productId for existing products
          productId: isEditing ? parseInt(productId) : null,
          // Use the variant's SKU or generate a new one
          sku: variant.sku || `SKU-${Date.now()}`,
          // Set price with fallback to product price
          price: variantPrice,
          // Set originalPrice if available
          originalPrice: originalPrice,
          // Format stock quantity
          stockQuantity: stockQuantity,
          // Use variant image or fallback to product image
          imageUrl: variant.imageUrl || product.imageUrl,
          // Add processed attributes
          attributes
        };
        
        console.log('Final variant data for API:', apiVariant);
        return apiVariant;
      });
      
      // Create product object for API
      const productData = {
        ...product,
        imageUrl,
        price: parseFloat(product.price),
        originalPrice: product.originalPrice ? parseFloat(product.originalPrice) : null,
        stockQuantity: product.stockQuantity === 'Unlimited' ? -1 : parseInt(product.stockQuantity, 10),
        tagIds: selectedTags, // Simply use the IDs directly
        variants: transformedVariants // Include transformed variants
      };
      
      console.log('FINAL PRODUCT DATA FOR API:', JSON.stringify(productData, null, 2));
      
      // Send API request - different endpoints for create vs update
      if (isEditing) {
        // Update existing product
        const response = await apiService.put(`/products/${productId}`, productData);
        console.log('Update product response:', response);
      } else {
        // Create new product
        const response = await apiService.post(`/products/${storeId}`, productData);
        console.log('Create product response:', response);
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
  
  const handleVariantsChange = (updatedVariants) => {
    // Ensure all variants have productId set
    const processedVariants = updatedVariants.map(variant => {
      // If editing a product, make sure productId is set
      if (isEditing && productId) {
        return {
          ...variant,
          productId: parseInt(productId),
          // Ensure variantId exists (use existing or create new)
          variantId: variant.variantId || variant.id || Date.now() + Math.floor(Math.random() * 1000)
        };
      }
      // For new products, we'll set the productId after the product is created
      return {
        ...variant,
        // Just ensure variantId exists
        variantId: variant.variantId || variant.id || Date.now() + Math.floor(Math.random() * 1000)
      };
    });
    
    setVariants(processedVariants);
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
          <ProductSidebar 
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            sectionProgress={sectionProgress}
          />

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              <form onSubmit={handleSubmit}>
                {/* Basic Information Section */}
                {activeSection === 'product-info' && (
                  <BasicInfoSection 
                    product={product}
                    handleInputChange={handleInputChange}
                    progress={sectionProgress['product-info']}
                    onNext={() => setActiveSection('product-media')}
                  />
                )}

                {/* Product Media Section */}
                {activeSection === 'product-media' && (
                  <ProductMediaSection 
                    product={product}
                    handleInputChange={handleInputChange}
                    previewUrl={previewUrl}
                    selectedFile={selectedFile}
                    handleFileSelect={handleFileSelect}
                    uploadProgress={uploadProgress}
                    onPrevious={() => setActiveSection('product-info')}
                    onNext={() => setActiveSection('inventory')}
                    setSelectedFile={setSelectedFile}
                    setPreviewUrl={setPreviewUrl}
                    setProduct={setProduct}
                    progress={sectionProgress['product-media']}
                  />
                )}

                {/* Inventory Section */}
                {activeSection === 'inventory' && (
                  <InventorySection 
                    product={product}
                    setProduct={setProduct}
                    onPrevious={() => setActiveSection('product-media')}
                    onNext={() => setActiveSection('categorization')}
                    progress={sectionProgress['inventory']}
                  />
                )}

                {/* Categories & Tags Section */}
                {activeSection === 'categorization' && (
                  <CategorizationSection 
                    product={product}
                    setProduct={setProduct}
                    categories={categories}
                    tags={tags}
                    selectedTags={selectedTags}
                    setSelectedTags={setSelectedTags}
                    loadingCategories={loadingCategories}
                    onPrevious={() => setActiveSection('inventory')}
                    onNext={() => setActiveSection('variants')}
                    progress={sectionProgress['categorization']}
                  />
                )}
                
                {/* Product Variants Section */}
                {activeSection === 'variants' && (
                  <ProductVariantsSection
                    variants={variants}
                    onVariantsChange={handleVariantsChange}
                    onPrevious={() => setActiveSection('categorization')}
                    progress={sectionProgress['variants']}
                    loading={loading}
                    isEditing={isEditing}
                    handleSubmit={handleSubmit}
                    productId={isEditing ? parseInt(productId) : null} // Pass product ID for editing mode
                  />
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