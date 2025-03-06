import React, { useState } from "react";
import { FiUser, FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { validateUserForm } from '../../utils/form-validation-utils';
import Modal from '../ui/Modal';
import { FormField } from '../ui/FormField';
import { Button } from '../ui/Button';
import useForm from '../../hooks/useForm';

const AddCustomerModal = ({ isOpen, onClose, onAddCustomer }) => {
  // Initial form values
  const initialValues = {
    name: "",
    email: "",
    phone: "",
    city: "",
    address: ""
  };

  // Validation function
  const validate = (values) => {
    return validateUserForm(values);
  };

  // Form submission handler
  const handleSubmit = async (values) => {
    // Call the parent component's function to add the customer
    onAddCustomer(values);
    onClose();
  };

  // Use the useForm hook
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit: submitForm,
    isSubmitting
  } = useForm(initialValues, validate, handleSubmit);

  // Custom footer with action buttons
  const modalFooter = (
    <>
      <Button 
        variant="secondary" 
        onClick={onClose} 
        className="mr-2"
      >
        Cancel
      </Button>
      <Button 
        type="submit"
        onClick={submitForm}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Adding...
          </span>
        ) : (
          "Add Customer"
        )}
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Customer"
      footer={modalFooter}
      size="md"
    >
      <form onSubmit={submitForm}>
        <div className="space-y-4">
          {/* Name field */}
          <FormField
            label="Full Name"
            required={true}
            error={touched.name && errors.name}
          >
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="text-gray-400" />
              </div>
              <input
                type="text"
                id="name"
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`pl-10 w-full px-3 py-2 border ${touched.name && errors.name ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                placeholder="Enter customer name"
              />
            </div>
          </FormField>
          
          {/* Email field */}
          <FormField
            label="Email Address"
            error={touched.email && errors.email}
          >
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`pl-10 w-full px-3 py-2 border ${touched.email && errors.email ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                placeholder="Enter email address (optional)"
              />
            </div>
          </FormField>
          
          {/* Phone field */}
          <FormField
            label="Phone Number"
            required={true}
            error={touched.phone && errors.phone}
          >
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiPhone className="text-gray-400" />
              </div>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={values.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`pl-10 w-full px-3 py-2 border ${touched.phone && errors.phone ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                placeholder="Enter phone number (e.g., +91 1234567890)"
              />
            </div>
          </FormField>
          
          {/* City field */}
          <FormField
            label="City"
            required={true}
            error={touched.city && errors.city}
          >
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMapPin className="text-gray-400" />
              </div>
              <input
                type="text"
                id="city"
                name="city"
                value={values.city}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`pl-10 w-full px-3 py-2 border ${touched.city && errors.city ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                placeholder="Enter city"
              />
            </div>
          </FormField>
          
          {/* Address field */}
          <FormField
            label="Address"
            error={touched.address && errors.address}
          >
            <div className="relative">
              <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                <FiMapPin className="text-gray-400" />
              </div>
              <textarea
                id="address"
                name="address"
                value={values.address}
                onChange={handleChange}
                onBlur={handleBlur}
                rows="3"
                className="pl-10 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter address (optional)"
              ></textarea>
            </div>
          </FormField>
          
          {errors.submit && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400">
              {errors.submit}
            </div>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default AddCustomerModal;