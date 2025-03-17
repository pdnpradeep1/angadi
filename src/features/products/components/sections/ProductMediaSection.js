// src/features/products/components/sections/ProductMediaSection.js
import React from 'react';
import { 
  FiLink, 
  FiX, 
  FiInfo,
  FiUploadCloud
} from 'react-icons/fi';

/**
 * Product Media section for handling product images
 */
const ProductMediaSection = ({ 
  product,
  handleInputChange,
  previewUrl,
  selectedFile,
  handleFileSelect,
  uploadProgress,
  onPrevious,
  onNext,
  setSelectedFile,
  setPreviewUrl,
  setProduct,
  progress
}) => {
  // Helper function to render progress indicator
  const renderProgressIndicator = (progress) => (
    <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
      <div 
        className={`h-full rounded-full ${progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Product Media</h2>
        <div className="w-24">
          {renderProgressIndicator(progress)}
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
          onClick={onPrevious}
          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Previous: Basic Information
        </button>
        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Next: Inventory
        </button>
      </div>
    </div>
  );
};

export default ProductMediaSection;