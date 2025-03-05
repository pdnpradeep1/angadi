import React from 'react';
import { FiChevronLeft, FiChevronDown } from 'react-icons/fi';

const AddWarehouseModal = ({ closeModal }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl">
        <div className="flex items-center mb-6">
          <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mr-2">
            <FiChevronLeft className="h-6 w-6" />
          </button>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Add warehouse</h2>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Warehouse Information</h3>
          
          <div className="grid grid-cols-1 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Warehouse Name <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                placeholder="Enter warehouse name" 
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Contact Person <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                placeholder="Enter full name" 
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                placeholder="Enter mobile number" 
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Flat, House no., Building, Company, Apartment <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                placeholder="Enter flat, house no..." 
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Area, Colony, Street, Sector, Village
              </label>
              <input 
                type="text" 
                placeholder="Enter area, colony..." 
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Pin Code <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                placeholder="Enter pin code" 
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                placeholder="Enter city" 
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                State <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="" disabled selected>Select state</option>
                  <option value="karnataka">Karnataka</option>
                  <option value="tamil-nadu">Tamil Nadu</option>
                  <option value="maharashtra">Maharashtra</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                  <FiChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>
            <div>
              <div className="flex justify-between">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  GST Number
                </label>
                <a href="#" className="text-sm text-blue-600 dark:text-blue-400">Why GST?</a>
              </div>
              <input 
                type="text" 
                placeholder="Enter GST number" 
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded" />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Set as primary warehouse</span>
            </label>
          </div>
          
          <div className="flex justify-end">
            <button 
              onClick={closeModal}
              className="mr-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button 
              type="button" 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add warehouse
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddWarehouseModal;