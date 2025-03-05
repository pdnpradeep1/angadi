import React from 'react';
import { FiSearch, FiMoreVertical } from 'react-icons/fi';

const Warehouse = ({ openModal }) => {
  return (
    <div className="p-6">
      <h2 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">Warehouses</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">Organize and oversee your inventory storage details.</p>

      <div className="flex justify-between items-center mb-6">
        <div className="relative w-full max-w-xs">
          <input
            type="text"
            placeholder="Search warehouse"
            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
        </div>
        <button 
          onClick={() => openModal('add-warehouse')}
          className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add warehouse
        </button>
      </div>

      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 relative bg-white dark:bg-gray-800">
        <div className="flex items-center mb-1">
          <h3 className="font-medium text-gray-900 dark:text-white">Vbc Oracle Ridge</h3>
          <span className="ml-2 text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-2 py-0.5 rounded-md">PRIMARY</span>
          <button className="absolute right-4 top-4 text-gray-500 dark:text-gray-400">
            <FiMoreVertical />
          </button>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">Block-A, AJANTHA ROYAL, Lavakusha Nagar, Konappana Agrahara,, Bangalore, Karnataka 560100</p>
      </div>
    </div>
  );
};

export default Warehouse;