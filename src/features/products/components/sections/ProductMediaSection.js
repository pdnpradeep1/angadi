// src/features/products/components/sections/ProductMediaSection.js
import React, { useState } from 'react';
import { 
  FiLink, 
  FiX, 
  FiInfo,
  FiUploadCloud,
  FiEdit,
  FiCrop,
  FiSliders,
  FiRotateCw,
  FiImage,
  FiMaximize,
  FiZoomIn
} from 'react-icons/fi';

/**
 * Enhanced Product Media section for handling product images with editing capabilities
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
  // Image editing states
  const [isEditing, setIsEditing] = useState(false);
  const [editedImage, setEditedImage] = useState(null);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [cropping, setCropping] = useState(false);
  const [zoom, setZoom] = useState(100);

  // Helper function to render progress indicator
  const renderProgressIndicator = (progress) => (
    <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
      <div 
        className={`h-full rounded-full ${progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );

  // Toggle image editing mode
  const toggleEditing = () => {
    if (!previewUrl) return;
    
    if (!isEditing) {
      // Initialize edited image when entering edit mode
      setEditedImage(previewUrl);
    } else {
      // Apply edits when exiting edit mode
      setPreviewUrl(editedImage);
    }
    
    setIsEditing(!isEditing);
  };

  // Apply image filter based on current settings
  const applyImageFilter = () => {
    if (!editedImage) return;
    
    // Create a temporary image element to apply filters
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = previewUrl;
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Set canvas dimensions
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Apply rotation if needed
      if (rotation !== 0) {
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);
      }
      
      // Draw the image with current zoom
      const zoomFactor = zoom / 100;
      const zoomOffsetX = (canvas.width - (canvas.width * zoomFactor)) / 2;
      const zoomOffsetY = (canvas.height - (canvas.height * zoomFactor)) / 2;
      
      ctx.drawImage(
        img, 
        zoomOffsetX, 
        zoomOffsetY, 
        canvas.width * zoomFactor, 
        canvas.height * zoomFactor
      );
      
      // Apply filters
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
      ctx.drawImage(canvas, 0, 0);
      
      // Get the processed image data
      const processedImage = canvas.toDataURL('image/jpeg', 0.9);
      setEditedImage(processedImage);
    };
  };

  // Reset image edits
  const resetEdits = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setRotation(0);
    setZoom(100);
    setEditedImage(previewUrl);
  };

  // Apply current edits and exit editing mode
  const applyEdits = () => {
    setPreviewUrl(editedImage);
    setProduct({...product, imageUrl: editedImage});
    setIsEditing(false);
  };

  // Rotate image by 90 degrees
  const rotateImage = () => {
    setRotation((prev) => {
      const newRotation = (prev + 90) % 360;
      setTimeout(applyImageFilter, 0); // Apply filter after state update
      return newRotation;
    });
  };

  // Update filter property and apply changes
  const updateFilter = (type, value) => {
    switch (type) {
      case 'brightness':
        setBrightness(value);
        break;
      case 'contrast':
        setContrast(value);
        break;
      case 'saturation':
        setSaturation(value);
        break;
      case 'zoom':
        setZoom(value);
        break;
      default:
        break;
    }

    // Apply filter after a short delay to prevent too many redraws
    setTimeout(applyImageFilter, 100);
  };

  // Toggle cropping mode
  const toggleCropping = () => {
    setCropping(!cropping);
  };

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
                  {isEditing ? (
                    <div className="w-full">
                      <div className="relative w-full h-60 overflow-hidden border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-2 rounded-lg">
                        <img
                          src={editedImage || previewUrl}
                          alt="Product preview"
                          className="w-full h-full object-contain"
                          style={{ 
                            filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`,
                            transform: `rotate(${rotation}deg) scale(${zoom/100})`,
                            transformOrigin: 'center'
                          }}
                        />
                        {cropping && (
                          <div className="absolute inset-0 border-2 border-dashed border-primary-500 bg-black bg-opacity-20 cursor-move">
                            <div className="absolute top-0 left-0 w-2 h-2 bg-white border border-primary-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 cursor-nw-resize"></div>
                            <div className="absolute top-0 right-0 w-2 h-2 bg-white border border-primary-500 rounded-full transform translate-x-1/2 -translate-y-1/2 cursor-ne-resize"></div>
                            <div className="absolute bottom-0 left-0 w-2 h-2 bg-white border border-primary-500 rounded-full transform -translate-x-1/2 translate-y-1/2 cursor-sw-resize"></div>
                            <div className="absolute bottom-0 right-0 w-2 h-2 bg-white border border-primary-500 rounded-full transform translate-x-1/2 translate-y-1/2 cursor-se-resize"></div>
                          </div>
                        )}
                      </div>
                      
                      {/* Editing controls */}
                      <div className="mt-3 space-y-3">
                        <div className="flex flex-wrap gap-2 justify-center">
                          <button
                            type="button"
                            onClick={rotateImage}
                            className="p-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center"
                          >
                            <FiRotateCw className="mr-1" /> Rotate
                          </button>
                          <button
                            type="button"
                            onClick={toggleCropping}
                            className={`p-2 ${cropping ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'} rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center`}
                          >
                            <FiCrop className="mr-1" /> Crop
                          </button>
                          <button
                            type="button"
                            onClick={resetEdits}
                            className="p-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center"
                          >
                            <FiX className="mr-1" /> Reset
                          </button>
                        </div>
                        
                        {/* Filter sliders */}
                        <div className="space-y-2 px-2">
                          <div>
                            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                              <span>Brightness</span>
                              <span>{brightness}%</span>
                            </div>
                            <input
                              type="range"
                              min="50"
                              max="150"
                              value={brightness}
                              onChange={(e) => updateFilter('brightness', e.target.value)}
                              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            />
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                              <span>Contrast</span>
                              <span>{contrast}%</span>
                            </div>
                            <input
                              type="range"
                              min="50"
                              max="150"
                              value={contrast}
                              onChange={(e) => updateFilter('contrast', e.target.value)}
                              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            />
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                              <span>Saturation</span>
                              <span>{saturation}%</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="200"
                              value={saturation}
                              onChange={(e) => updateFilter('saturation', e.target.value)}
                              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            />
                          </div>
                          
                          <div>
                            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                              <span>Zoom</span>
                              <span>{zoom}%</span>
                            </div>
                            <input
                              type="range"
                              min="100"
                              max="200"
                              value={zoom}
                              onChange={(e) => updateFilter('zoom', e.target.value)}
                              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            />
                          </div>
                        </div>
                        
                        <div className="flex justify-center mt-3">
                          <button
                            type="button"
                            onClick={applyEdits}
                            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                          >
                            Apply Changes
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <img
                        src={previewUrl}
                        alt="Product preview"
                        className="w-full h-60 object-contain rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-2"
                        onClick={toggleEditing}
                      />
                      <div className="absolute top-2 right-2 flex gap-2">
                        <button
                          type="button"
                          onClick={toggleEditing}
                          className="bg-white dark:bg-gray-800 rounded-full p-1 shadow-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                          aria-label="Edit image"
                        >
                          <FiEdit className="text-gray-700 dark:text-gray-300" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFile(null);
                            setPreviewUrl('');
                            setProduct({...product, imageUrl: ''});
                          }}
                          className="bg-white dark:bg-gray-800 rounded-full p-1 shadow-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                          aria-label="Remove image"
                        >
                          <FiX className="text-gray-700 dark:text-gray-300" />
                        </button>
                      </div>
                    </>
                  )}
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
                    value={product.imageUrl || ''}
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
                  <li>• Use our built-in editor to enhance your photos</li>
                </ul>
              </div>
              
              {previewUrl && !isEditing && (
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-green-800 dark:text-green-300 flex items-center">
                    <FiSliders className="mr-2" /> Image Editor Options
                  </h4>
                  <ul className="mt-2 text-sm text-green-700 dark:text-green-400 space-y-1">
                    <li>• Click the edit button to enhance your image</li>
                    <li>• Adjust brightness, contrast, and saturation</li>
                    <li>• Rotate or crop your image as needed</li>
                    <li>• Zoom in to focus on important details</li>
                  </ul>
                  <button
                    type="button"
                    onClick={toggleEditing}
                    className="mt-3 text-sm text-green-700 dark:text-green-400 font-medium hover:text-green-800 dark:hover:text-green-300 flex items-center"
                  >
                    <FiEdit className="mr-1" /> Edit Image
                  </button>
                </div>
              )}
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