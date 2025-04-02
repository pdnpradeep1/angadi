// src/components/sections/StoreDetails.js
import React, { useState, useEffect } from 'react';
import { FiSave, FiEdit2, FiShoppingBag, FiMail, FiPhone, FiMap, FiInfo } from 'react-icons/fi';
import BaseSection from '../../components/ui/BaseSection';
import { FormField } from '../../components/ui/FormField';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useStore } from '../../contexts/StoreContext';
import { apiService } from '../../api/config';

const StoreDetails = () => {
  const { currentStore, fetchStoreData } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    logo: '',
    websiteUrl: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // When the current store changes, update the form data
  useEffect(() => {
    if (currentStore) {
      setFormData({
        name: currentStore.name || '',
        description: currentStore.description || '',
        email: currentStore.email || '',
        phone: currentStore.phone || '',
        address: currentStore.address || '',
        city: currentStore.city || '',
        state: currentStore.state || '',
        pincode: currentStore.pincode || '',
        logo: currentStore.logo || '',
        websiteUrl: currentStore.websiteUrl || ''
      });
    }
  }, [currentStore]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Toggle editing mode
  const toggleEditing = () => {
    setIsEditing(!isEditing);
    // Reset form data when canceling edit
    if (isEditing && currentStore) {
      setFormData({
        name: currentStore.name || '',
        description: currentStore.description || '',
        email: currentStore.email || '',
        phone: currentStore.phone || '',
        address: currentStore.address || '',
        city: currentStore.city || '',
        state: currentStore.state || '',
        pincode: currentStore.pincode || '',
        logo: currentStore.logo || '',
        websiteUrl: currentStore.websiteUrl || ''
      });
    }
    // Clear any previous messages
    setError(null);
    setSuccess(null);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Validation
      if (!formData.name.trim()) {
        throw new Error('Store name is required');
      }

      // For development, simulate API call
      if (process.env.NODE_ENV === 'development') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In production, this would be an actual API call
        // const response = await apiService.put(`/api/stores/update/${currentStore.id}`, formData);
        
        setSuccess('Store details updated successfully');
        setIsEditing(false);
        
        // Refresh store data
        if (currentStore && currentStore.id) {
          fetchStoreData(currentStore.id);
        }
      } else {
        // In production environment
        const response = await apiService.put(`/api/stores/update/${currentStore.id}`, formData);
        
        setSuccess('Store details updated successfully');
        setIsEditing(false);
        
        // Refresh store data
        if (currentStore && currentStore.id) {
          fetchStoreData(currentStore.id);
        }
      }
    } catch (err) {
      console.error('Error updating store details:', err);
      setError(err.message || 'Failed to update store details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Render section actions (Edit/Save buttons)
  const renderActions = () => (
    <>
      {isEditing ? (
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            onClick={toggleEditing}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : (
              <span className="flex items-center">
                <FiSave className="mr-2" />
                Save Changes
              </span>
            )}
          </Button>
        </div>
      ) : (
        <Button
          variant="secondary"
          onClick={toggleEditing}
        >
          <span className="flex items-center">
            <FiEdit2 className="mr-2" />
            Edit
          </span>
        </Button>
      )}
    </>
  );

  return (
    <BaseSection
      title="Store Details"
      description="Manage your store's basic information"
      actions={renderActions()}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* Logo and Basic Info Card */}
        <div className="md:col-span-1">
          <Card className="h-full">
            <div className="flex flex-col items-center p-4">
              <div className="relative mb-4">
                {formData.logo ? (
                  <img 
                    src={formData.logo} 
                    alt="Store Logo" 
                    className="h-32 w-32 object-contain bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 p-2"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/api/placeholder/128/128?text=Logo';
                    }}
                  />
                ) : (
                  <div className="h-32 w-32 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700">
                    <FiShoppingBag className="h-16 w-16 text-gray-400" />
                  </div>
                )}
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-2 text-center">
                {formData.name || 'Your Store Name'}
              </h3>
              
              {!isEditing && (
                <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
                  <p className="italic">
                    {formData.description || 'No description available'}
                  </p>
                </div>
              )}

              {isEditing && (
                <div className="w-full mt-4">
                  <FormField
                    label="Store Logo URL"
                    helpText="Enter a URL for your store logo"
                  >
                    <input
                      type="text"
                      name="logo"
                      value={formData.logo}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
                    />
                  </FormField>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Main Form Card */}
        <div className="md:col-span-2">
          <Card className="h-full">
            {error && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded">
                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded">
                <p className="text-sm text-green-700 dark:text-green-400">{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <FiInfo className="mr-2 text-primary-500" />
                  Basic Information
                </h3>
                
                <div className="space-y-4">
                  <FormField
                    label="Store Name"
                    required={true}
                  >
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full p-2 border rounded-md ${
                        isEditing
                          ? 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500'
                          : 'border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                    />
                  </FormField>

                  <FormField
                    label="Description"
                    helpText="A short description of your store"
                  >
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      disabled={!isEditing}
                      rows={3}
                      className={`w-full p-2 border rounded-md ${
                        isEditing
                          ? 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500'
                          : 'border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                    />
                  </FormField>
                  
                  <FormField
                    label="Website URL"
                    helpText="Your store's website address"
                  >
                    <input
                      type="url"
                      name="websiteUrl"
                      value={formData.websiteUrl}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full p-2 border rounded-md ${
                        isEditing
                          ? 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500'
                          : 'border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                    />
                  </FormField>
                </div>
              </div>
              
              {/* Contact Information Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <FiPhone className="mr-2 text-primary-500" />
                  Contact Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Email Address"
                  >
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMail className="text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`w-full pl-10 p-2 border rounded-md ${
                          isEditing
                            ? 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500'
                            : 'border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                        }`}
                      />
                    </div>
                  </FormField>

                  <FormField
                    label="Phone Number"
                  >
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiPhone className="text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`w-full pl-10 p-2 border rounded-md ${
                          isEditing
                            ? 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500'
                            : 'border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                        }`}
                      />
                    </div>
                  </FormField>
                </div>
              </div>
              
              {/* Address Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <FiMap className="mr-2 text-primary-500" />
                  Address Information
                </h3>
                
                <div className="space-y-4">
                  <FormField
                    label="Street Address"
                  >
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      disabled={!isEditing}
                      rows={2}
                      className={`w-full p-2 border rounded-md ${
                        isEditing
                          ? 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500'
                          : 'border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                    />
                  </FormField>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      label="City"
                    >
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`w-full p-2 border rounded-md ${
                          isEditing
                            ? 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500'
                            : 'border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                        }`}
                      />
                    </FormField>
                    
                    <FormField
                      label="State"
                    >
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`w-full p-2 border rounded-md ${
                          isEditing
                            ? 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500'
                            : 'border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                        }`}
                      />
                    </FormField>
                    
                    <FormField
                      label="Pin Code"
                    >
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`w-full p-2 border rounded-md ${
                          isEditing
                            ? 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500'
                            : 'border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                        }`}
                      />
                    </FormField>
                  </div>
                </div>
              </div>
            </form>
            
            {!isEditing && (
              <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Store Info</h3>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={toggleEditing}
                  >
                    <FiEdit2 className="mr-1" size={14} />
                    Edit
                  </Button>
                </div>
                
                <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Contact Email</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white flex items-center">
                      <FiMail className="mr-1 text-gray-400" size={14} />
                      {formData.email || 'Not specified'}
                    </dd>
                  </div>
                  
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white flex items-center">
                      <FiPhone className="mr-1 text-gray-400" size={14} />
                      {formData.phone || 'Not specified'}
                    </dd>
                  </div>
                  
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                      {formData.address ? (
                        <address className="not-italic">
                          {formData.address}<br />
                          {[formData.city, formData.state, formData.pincode].filter(Boolean).join(', ')}
                        </address>
                      ) : (
                        'No address specified'
                      )}
                    </dd>
                  </div>
                  
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Website</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                      {formData.websiteUrl ? (
                        <a 
                          href={formData.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 dark:text-primary-400 hover:underline"
                        >
                          {formData.websiteUrl}
                        </a>
                      ) : (
                        'Not specified'
                      )}
                    </dd>
                  </div>
                </dl>
              </div>
            )}
          </Card>
        </div>
      </div>
    </BaseSection>
  );
};

export default StoreDetails;