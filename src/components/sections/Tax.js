import React, { useState } from 'react';
import { FiInfo } from 'react-icons/fi';

const Tax = () => {
  const [gstEnabled, setGstEnabled] = useState(false);
  const [taxType, setTaxType] = useState('inclusive');
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  return (
    <div className="p-6 relative">
      {unsavedChanges && (
        <div className="fixed top-0 left-0 w-full bg-white dark:bg-gray-800 shadow-md z-10 py-4 px-6 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Unsaved changes</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setUnsavedChanges(false)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Discard
            </button>
            <button
              onClick={() => setUnsavedChanges(false)}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      )}
      
      <div className="mt-0">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h2 className="text-xl font-medium text-gray-900 dark:text-white">GST</h2>
            <p className="text-gray-600 dark:text-gray-400">Ensure compliance and transparent pricing.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={gstEnabled} 
              onChange={() => {
                setGstEnabled(!gstEnabled);
                setUnsavedChanges(true);
              }} 
              className="sr-only peer" 
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
        
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
                    onChange={() => {
                      setTaxType('inclusive');
                      setUnsavedChanges(true);
                    }}
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
                    onChange={() => {
                      setTaxType('exclusive');
                      setUnsavedChanges(true);
                    }}
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
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  GST Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter GST number"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  onChange={() => setUnsavedChanges(true)}
                />
              </div>
              <div>
                <div className="flex items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    GST Percentage <span className="text-red-500">*</span>
                  </label>
                  <button className="ml-1 text-gray-400 dark:text-gray-500">
                    <FiInfo className="h-4 w-4" />
                  </button>
                </div>
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
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                To know more about GST calculation. <a href="#" className="text-blue-600 dark:text-blue-400">Click here</a>
              </p>
            </div>
            
            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setUnsavedChanges(false)}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tax;