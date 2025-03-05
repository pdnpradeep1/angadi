import React from 'react';

const Returns = () => {
  return (
    <div className="p-6 flex flex-col items-center justify-center text-center">
      <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-8 mb-6">
        <img src="/api/placeholder/100/100" alt="Returns illustration" className="h-24 w-24" />
      </div>
      <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">Set up Returns & Replacement</h2>
      <p className="text-gray-600 dark:text-gray-400 max-w-lg mb-6">
        Set up returns and replacement for your delivered orders and manage them easily from your Dukaan dashboard.
      </p>
      <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
        Set up
      </button>
    </div>
  );
};

export default Returns;