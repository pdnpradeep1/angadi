import React from 'react';
import { FiX, FiChevronDown } from 'react-icons/fi';

const AddStaffModal = ({ closeModal }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Add staff</h2>
          <button onClick={closeModal} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
            <FiX className="h-6 w-6" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email or mobile number <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              placeholder="Enter email or mobile number" 
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              placeholder="Enter name of the staff member" 
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Role <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option value="" disabled selected>Select role</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager - Store</option>
                <option value="staff">Staff - Store</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                <FiChevronDown className="h-4 w-4" />
              </div>
            </div>
          </div>
          
          <div className="pt-4">
            <button 
              type="button" 
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            >
              Send invite
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStaffModal;