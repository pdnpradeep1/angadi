// src/components/sections/Tax.js
import React, { useState } from 'react';
import BaseSection from './BaseSection';
import { ToggleSwitch } from '../ui/ToggleSwitch';
import { FormField } from '../ui/FormField';
import { Button } from '../ui/Button';
import { FiInfo } from 'react-icons/fi';

const Tax = () => {
  const [gstEnabled, setGstEnabled] = useState(false);
  const [taxType, setTaxType] = useState('inclusive');
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const handleTaxTypeChange = (type) => {
    setTaxType(type);
    setUnsavedChanges(true);
  };

  const handleSave = () => {
    setUnsavedChanges(false);
    // Save logic here
  };

  const handleDiscard = () => {
    setUnsavedChanges(false);
    // Reset form logic here
  };

  // Unsaved changes notification banner
  const UnsavedChangesBanner = () => (
    <div className="fixed top-0 left-0 w-full bg-white dark:bg-gray-800 shadow-md z-10 py-4 px-6 flex justify-between items-center">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Unsaved changes</h3>
      <div className="flex space-x-2">
        <Button variant="secondary" onClick={handleDiscard}>
          Discard
        </Button>
        <Button onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );

  const toggleGST = () => {
    setGstEnabled(!gstEnabled);
    setUnsavedChanges(true);
  };

  return (
    <BaseSection
      title="GST"
      description="Ensure compliance and transparent pricing."
      actions={
        <ToggleSwitch 
          checked={gstEnabled} 
          onChange={toggleGST} 
          labelPosition="none" 
        />
      }
    >
      {unsavedChanges && <UnsavedChangesBanner />}
      
      {gstEnabled && (
        <div className="mt-6 space-y-6 bg-white dark:bg-gray-800 p-4 rounded-lg">
          <div>
            <p className="text-gray-700 dark:text-gray-300 mb-2">All product prices are</p>
            <div className="flex items-center space-x-6">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="taxType"
                  checked={taxType === 'inclusive'}
                  onChange={() => handleTaxTypeChange('inclusive')}
                  className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">Inclusive of tax</span>
                <button className="ml-1 text-gray-400 dark:text-gray-500">
                  <FiInfo className="h-4 w-4" />
                </button>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="taxType"
                  checked={taxType === 'exclusive'}
                  onChange={() => handleTaxTypeChange('exclusive')}
                  className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">Exclusive of tax</span>
                <button className="ml-1 text-gray-400 dark:text-gray-500">
                  <FiInfo className="h-4 w-4" />
                </button>
              </label>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <FormField 
              label="GST Number" 
              required={true}
            >
              <input
                type="text"
                placeholder="Enter GST number"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                onChange={() => setUnsavedChanges(true)}
              />
            </FormField>

            <FormField 
              label={(
                <div className="flex items-center">
                  <span>GST Percentage</span>
                  <button className="ml-1 text-gray-400 dark:text-gray-500">
                    <FiInfo className="h-4 w-4" />
                  </button>
                </div>
              )}
              required={true}
            >
              <div className="flex">
                <input
                  type="text"
                  placeholder="Charge"
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  onChange={() => setUnsavedChanges(true)}
                />
                <span className="inline-flex items-center px-3 py-2 rounded-r-md border border-l-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 sm:text-sm">
                  %
                </span>
              </div>
            </FormField>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              To know more about GST calculation. <a href="#" className="text-blue-600 dark:text-blue-400">Click here</a>
            </p>
          </div>
          
          <div className="pt-4 flex justify-end">
            <Button onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      )}
    </BaseSection>
  );
};

export default Tax;