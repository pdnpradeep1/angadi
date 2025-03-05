import React from 'react';

const Delivery = () => {
  return (
    <div className="p-6">
      <section className="mb-8">
        <h2 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">Shipping providers</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Connect and manage shipping providers to be used while shipping your orders.</p>

        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4 flex justify-between items-center bg-white dark:bg-gray-800">
          <div className="flex items-center">
            <img src="/api/placeholder/40/40" alt="Shiprocket" className="h-10 w-10 mr-3" />
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Shiprocket</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Effortlessly ship your orders and enjoy a streamlined shipping process for your business.</p>
            </div>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Connect
          </button>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4 flex justify-between items-center bg-white dark:bg-gray-800">
          <div className="flex items-center">
            <img src="/api/placeholder/40/40" alt="Delhivery" className="h-10 w-10 mr-3" />
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Delhivery</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">India's largest and fastest-growing fully-integrated logistics provider.</p>
            </div>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Connect
          </button>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex justify-between items-center bg-white dark:bg-gray-800">
          <div className="flex items-center">
            <img src="/api/placeholder/40/40" alt="DTDC" className="h-10 w-10 mr-3" />
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">DTDC</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Reliable shipping service with extensive network coverage across India.</p>
            </div>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Connect
          </button>
        </div>
      </section>
    </div>
  );
};

export default Delivery;