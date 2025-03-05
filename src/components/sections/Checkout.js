import React from 'react';

const Checkout = () => {
  return (
    <div className="p-6">
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Guest checkout</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Customers will be able to check out as guests without verifying their mobile number.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" defaultChecked={true} className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">Checkout form</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Streamline the buying process, improve customer experience.</p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name <span className="text-red-500">*</span></label>
            <div className="h-10 bg-gray-100 dark:bg-gray-700 rounded-md"></div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mobile Number <span className="text-red-500">*</span></label>
            <div className="h-10 bg-gray-100 dark:bg-gray-700 rounded-md"></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="flex justify-between">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address <span className="text-gray-400">(Optional)</span></label>
              <button className="text-blue-600 dark:text-blue-400 text-sm">EDIT</button>
            </div>
            <div className="h-10 bg-gray-100 dark:bg-gray-700 rounded-md"></div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Country <span className="text-red-500">*</span></label>
            <div className="h-10 bg-gray-100 dark:bg-gray-700 rounded-md"></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Checkout;