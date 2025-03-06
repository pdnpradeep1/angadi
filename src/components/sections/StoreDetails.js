// src/components/sections/StoreDetails.js
import React, { useState } from 'react';
import BaseSection from '../ui/BaseSection';
import { FormField } from '../ui/FormField';
import { Button } from '../ui/Button';
import { ConfirmDialog } from '../ui/Modal';
import useForm from '../../hooks/useForm';

const StoreDetails = () => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Form validation function
  const validateStoreForm = (values) => {
    const errors = {};
    if (!values.name?.trim()) {
      errors.name = 'Store name is required';
    }
    return errors;
  };

  // Initial form values
  const initialValues = {
    storeUrl: 'harintiruchulu',
    name: 'Hari Inti Ruchulu',
    mobile: '0123456789',
    country: 'India (₹)',
    email: 'pdnpradeep1@gmail.com',
    address: ''
  };

  // Form handling
  const { 
    values, 
    errors, 
    touched, 
    handleChange, 
    handleBlur, 
    handleSubmit,
    isDirty,
    isSubmitting
  } = useForm(
    initialValues, 
    validateStoreForm, 
    (formData) => {
      console.log('Saving store details:', formData);
      // API call would go here
    }
  );

  const handleDeleteStore = () => {
    console.log('Deleting store...');
    // API call would go here
    setShowDeleteConfirm(false);
  };

  return (
    <BaseSection
      title="Store details"
      description="Update and customize your store's information."
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Store Link">
            <div className="flex">
              <span className="inline-flex items-center px-3 py-2 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 sm:text-sm">
                mydukaan.io/
              </span>
              <input
                type="text"
                name="storeUrl"
                value={values.storeUrl}
                onChange={handleChange}
                onBlur={handleBlur}
                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </FormField>

          <FormField 
            label="Store Name" 
            required={true}
            error={touched.name && errors.name}
          >
            <input
              type="text"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Mobile Number">
            <div className="flex">
              <span className="inline-flex items-center px-3 py-2 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 sm:text-sm">
                <div className="flex items-center">
                  <img src="/api/placeholder/20/15" alt="India flag" className="mr-1" />
                  <span>+91</span>
                </div>
              </span>
              <input
                type="text"
                name="mobile"
                value={values.mobile}
                onChange={handleChange}
                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none border border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <span className="inline-flex items-center px-3 py-2 rounded-r-md border border-l-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-primary-600 dark:text-primary-400 sm:text-sm">
                VERIFY
              </span>
            </div>
          </FormField>

          <FormField label="Country" required={true}>
            <input
              type="text"
              name="country"
              value={values.country}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              readOnly
            />
          </FormField>
        </div>

        <FormField label="Email Address">
          <input
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </FormField>

        <FormField label="Store Address">
          <textarea
            name="address"
            value={values.address}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </FormField>

        <div className="pt-4 flex justify-end">
          <Button 
            variant="danger" 
            onClick={() => setShowDeleteConfirm(true)}
            className="mr-4"
            size="sm"
          >
            Delete my store
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isDirty || isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Delete Store Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteStore}
        title="Delete Store"
        message="Are you sure you want to delete your store? This action cannot be undone."
        confirmText="Delete"
        confirmVariant="danger"
      />
    </BaseSection>
  );
};

export default StoreDetails;