import React from 'react';

const StaffAccounts = ({ openModal }) => {
  return (
    <div className="p-6">
      <div className="flex items-center justify-center flex-col text-center mb-6">
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-4">
          <img src="/api/placeholder/80/80" alt="Staff illustration" className="h-20 w-20" />
        </div>
        <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">Add your staff members</h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md">
          Start inviting your staff members to access and manage your store operations.
        </p>
        <button 
          onClick={() => openModal('add-staff')} 
          className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add staff
        </button>
        <a href="#" className="mt-4 text-blue-600 dark:text-blue-400 hover:underline text-sm">
          Learn more about staff accounts
        </a>
      </div>
    </div>
  );
};

export default StaffAccounts;