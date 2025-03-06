// src/components/forms/WarehouseForm.js
import React from 'react';
import { FormField } from '../ui/FormField';
import { Button } from '../ui/Button';
import useForm from '../../hooks/useForm';
import { FiChevronDown } from 'react-icons/fi';
import { validateWarehouseForm } from '../../utils/form-validation-utils';

// Validation function
const validateWarehouseForm = (values) => {
  return validateWarehouseForm(values);
};

const WarehouseForm = ({ onSubmit, initialValues = {}, submitLabel = 'Save' }) => {
  const defaultValues = {
    name: '',
    contactPerson: '',
    mobile: '',
    address: '',
    area: '',
    pincode: '',
    city: '',
    state: '',
    gst: '',
    isPrimary: false,
    ...initialValues
  };
  
  const { 
    values, 
    errors, 
    touched, 
    handleChange, 
    handleBlur, 
    handleSubmit,
    isSubmitting
  } = useForm(defaultValues, validateWarehouseForm, onSubmit);

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Warehouse Information</h3>
        
        <div className="grid grid-cols-1 gap-6 mb-6">
          <FormField 
            label="Warehouse Name" 
            required={true}
            error={touched.name && errors.name}
          >
            <input 
              type="text"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter warehouse name" 
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </FormField>
        </div>
        
        <div className="grid grid-cols-2 gap-6 mb-6">
          <FormField 
            label="Contact Person" 
            required={true}
            error={touched.contactPerson && errors.contactPerson}
          >
            <input 
              type="text"
              name="contactPerson"
              value={values.contactPerson}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter full name" 
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </FormField>
          
          <FormField 
            label="Mobile Number" 
            required={true}
            error={touched.mobile && errors.mobile}
          >
            <input 
              type="text"
              name="mobile"
              value={values.mobile}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter mobile number" 
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </FormField>
        </div>
        
        <div className="grid grid-cols-2 gap-6 mb-6">
          <FormField 
            label="Flat, House no., Building, Company, Apartment" 
            required={true}
            error={touched.address && errors.address}
          >
            <input 
              type="text"
              name="address"
              value={values.address}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter flat, house no..." 
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </FormField>
          
          <FormField 
            label="Area, Colony, Street, Sector, Village"
          >
            <input 
              type="text"
              name="area"
              value={values.area}
              onChange={handleChange}
              placeholder="Enter area, colony..." 
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </FormField>
        </div>
        
        <div className="grid grid-cols-2 gap-6 mb-6">
          <FormField 
            label="Pin Code" 
            required={true}
            error={touched.pincode && errors.pincode}
          >
            <input 
              type="text"
              name="pincode"
              value={values.pincode}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter pin code" 
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </FormField>
          
          <FormField 
            label="City" 
            required={true}
            error={touched.city && errors.city}
          >
            <input 
              type="text"
              name="city"
              value={values.city}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter city" 
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </FormField>
        </div>
        
        <div className="grid grid-cols-2 gap-6 mb-6">
          <FormField 
            label="State" 
            required={true}
            error={touched.state && errors.state}
          >
            <div className="relative">
              <select
                name="state"
                value={values.state}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="" disabled>Select state</option>
                <option value="karnataka">Karnataka</option>
                <option value="tamil-nadu">Tamil Nadu</option>
                <option value="maharashtra">Maharashtra</option>
                {/* Add more states as needed */}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                <FiChevronDown className="h-4 w-4" />
              </div>
            </div>
          </FormField>
          
          <FormField 
            label={(
              <div className="flex justify-between">
                <span>GST Number</span>
                <a href="#" className="text-sm text-blue-600 dark:text-blue-400">Why GST?</a>
              </div>
            )}
          >
            <input 
              type="text"
              name="gst"
              value={values.gst}
              onChange={handleChange}
              placeholder="Enter GST number" 
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </FormField>
        </div>
        
        <div className="mb-6">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              name="isPrimary"
              checked={values.isPrimary}
              onChange={handleChange}
              className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded" 
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Set as primary warehouse</span>
          </label>
        </div>
        
        <div className="flex justify-end">
          <Button 
            type="button" 
            variant="secondary"
            onClick={() => window.history.back()}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : submitLabel}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default WarehouseForm;