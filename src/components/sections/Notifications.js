import React from 'react';
import { FiInfo, FiChevronRight } from 'react-icons/fi';

const Notifications = () => {
  return (
    <div className="p-6">
      <section className="mb-8">
        <h2 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">Auto accept orders</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Mark orders as Accepted automatically for the desired payment modes</p>
        <div className="flex justify-between items-center">
          <span className="text-gray-700 dark:text-gray-300">All (COD + Prepaid)</span>
          <button className="text-gray-600 dark:text-gray-400">
            <FiChevronRight className="h-5 w-5" />
          </button>
        </div>
      </section>
      
      <section className="mb-8">
        <h2 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">Notifications</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Send order notifications to the customers automatically.</p>
        
        <div className="flex justify-between items-center py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <span className="text-gray-700 dark:text-gray-300">Sender email (SMTP)</span>
            <button className="ml-1 text-gray-400 dark:text-gray-500">
              <FiInfo className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center">
            <span className="text-gray-600 dark:text-gray-400">no-reply@mydukaan.io</span>
            <button className="ml-2 text-gray-600 dark:text-gray-400">
              <FiChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <span className="text-gray-700 dark:text-gray-300">WhatsApp notifications</span>
            <button className="ml-1 text-gray-400 dark:text-gray-500">
              <FiInfo className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center">
            <span className="text-gray-600 dark:text-gray-400">None</span>
            <button className="ml-2 text-gray-600 dark:text-gray-400">
              <FiChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Notifications;