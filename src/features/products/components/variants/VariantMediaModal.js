import React, { useState, useEffect } from 'react';
import { FiUploadCloud, FiImage, FiX, FiEdit, FiLink, FiCheck } from 'react-icons/fi';

/**
 * Modal for managing variant media images
 * Opens when clicking on variant images and allows uploading or linking
 * 
 * @param {Object} props - Component properties
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Close handler
 * @param {Object} props.variant - Current variant being edited
 * @param {Function} props.onImageUpdate - Handler for when image is updated
 * @param {string} props.currentImage - Current image URL
 */
const VariantMediaModal = ({ 
  isOpen, 
  onClose, 
  variant,
  onImageUpdate,
  currentImage = '' 
}) => {
  const [activeTab, setActiveTab] = useState('upload');
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState(currentImage);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Reset state when variant changes or modal opens
  useEffect(() => {
    if (isOpen && variant) {
      setPreviewUrl(currentImage || '');
      setImageUrl(currentImage || '');
      setSelectedFile(null);
      setError('');
      setSuccess('');
      setUploadProgress(0);
    }
  }, [isOpen, variant, currentImage]);

  if (!isOpen) return null;

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, GIF, WebP)');
      return;
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB limit');
      return;
    }
    
    setSelectedFile(file);
    setError('');
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle URL input
  const handleUrlChange = (e) => {
    setImageUrl(e.target.value);
    setPreviewUrl(e.target.value);
  };

  // Simulate upload progress
  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setSuccess('Image uploaded successfully');
          return 100;
        }
        return prev + 10;
      });
    }, 300);
    
    // Return the image preview URL as if it was uploaded
    return previewUrl;
  };

  // Save image changes
  const handleSave = () => {
    try {
      let finalImageUrl;
      
      if (activeTab === 'upload' && selectedFile) {
        // In a real implementation, you would upload the file to a server
        // and get back the URL. Here we'll simulate it.
        finalImageUrl = simulateUpload();
      } else if (activeTab === 'url' && imageUrl) {
        finalImageUrl = imageUrl;
        setSuccess('Image URL saved successfully');
      } else {
        setError('Please select an image or enter a URL');
        return;
      }
      
      // Call the parent component's update handler
      if (onImageUpdate && finalImageUrl) {
        onImageUpdate(variant.variantId || variant.id, finalImageUrl);
      }
      
      // Close modal after a short delay to show success message
      setTimeout(() => {
        onClose();
      }, 1500);
      
    } catch (err) {
      setError('Failed to update image. Please try again.');
      console.error('Error updating image:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          aria-hidden="true"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                    Update Variant Image
                  </h3>
                  <button 
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  >
                    <FiX size={20} />
                  </button>
                </div>
                
                {/* Variant info */}
                {variant && (
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {variant.name || 
                    (variant.options && 
                      variant.options.map(opt => `${opt.name}: ${opt.value}`).join(', '))}
                  </p>
                )}
                
                {/* Tab navigation */}
                <div className="mt-4 border-b border-gray-200 dark:border-gray-700">
                  <nav className="flex -mb-px" aria-label="Tabs">
                    <button
                      onClick={() => setActiveTab('upload')}
                      className={`py-2 px-4 text-sm font-medium border-b-2 ${
                        activeTab === 'upload'
                          ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                          : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                      }`}
                    >
                      Upload Image
                    </button>
                    <button
                      onClick={() => setActiveTab('url')}
                      className={`py-2 px-4 text-sm font-medium border-b-2 ${
                        activeTab === 'url'
                          ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                          : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                      }`}
                    >
                      Image URL
                    </button>
                  </nav>
                </div>
                
                {/* Content area */}
                <div className="mt-4">
                  {/* Upload tab */}
                  {activeTab === 'upload' && (
                    <div>
                      {previewUrl ? (
                        <div className="relative w-full h-48 mb-4">
                          <img 
                            src={previewUrl} 
                            alt="Preview" 
                            className="w-full h-full object-contain border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                          />
                          <button
                            onClick={() => {
                              setSelectedFile(null);
                              setPreviewUrl('');
                            }}
                            className="absolute top-2 right-2 bg-white dark:bg-gray-700 rounded-full p-1 shadow-md"
                          >
                            <FiX size={16} />
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => document.getElementById('fileInput').click()}
                          className="w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 dark:hover:border-primary-500 bg-gray-50 dark:bg-gray-800/50 transition-colors mb-4"
                        >
                          <FiUploadCloud size={40} className="text-gray-400" />
                          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            PNG, JPG, GIF up to 5MB
                          </p>
                        </div>
                      )}
                      
                      <input
                        type="file"
                        id="fileInput"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileSelect}
                      />
                      
                      {/* Upload progress bar */}
                      {isUploading && (
                        <div className="mt-3">
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
                  )}
                  
                  {/* URL tab */}
                  {activeTab === 'url' && (
                    <div>
                      <div className="mb-4">
                        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Image URL
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiLink className="text-gray-500 dark:text-gray-400" />
                          </div>
                          <input
                            type="url"
                            id="imageUrl"
                            value={imageUrl}
                            onChange={handleUrlChange}
                            className="block w-full pl-10 p-2.5 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>
                      </div>
                      
                      {previewUrl && (
                        <div className="relative w-full h-48 mb-4">
                          <img 
                            src={previewUrl} 
                            alt="Preview" 
                            className="w-full h-full object-contain border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/api/placeholder/400/300?text=Invalid+Image+URL';
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Error and success messages */}
                  {error && (
                    <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm rounded-md">
                      {error}
                    </div>
                  )}
                  
                  {success && (
                    <div className="mt-3 p-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm rounded-md flex items-center">
                      <FiCheck className="mr-1" /> {success}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleSave}
              disabled={isUploading}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Uploading...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VariantMediaModal;