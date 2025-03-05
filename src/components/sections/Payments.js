import React from 'react';
import { FiCreditCard } from 'react-icons/fi';

const Payments = () => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <img src="/api/placeholder/120/40" alt="Razorpay" className="h-8" />
        <div className="mt-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="flex flex-col">
              <div className="flex items-center mb-2">
                <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-md">
                  <FiCreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Super-fast payments set-up</p>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center mb-2">
                <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-md">
                  <FiCreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">International & Domestic Payment modes like UPI, Cards, NetBanking, Wallets</p>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center mb-2">
                <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-md">
                  <FiCreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Best-in-industry success rates</p>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center mb-2">
                <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-md">
                  <FiCreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Prompt round-the-clock support</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">Receive payments via</p>
            <div className="flex space-x-4">
              <img src="/api/placeholder/50/30" alt="UPI" className="h-8" />
              <img src="/api/placeholder/50/30" alt="Google Pay" className="h-8" />
              <img src="/api/placeholder/50/30" alt="PayTM" className="h-8" />
              <img src="/api/placeholder/50/30" alt="NetBanking" className="h-8" />
              <img src="/api/placeholder/50/30" alt="Visa" className="h-8" />
              <img src="/api/placeholder/50/30" alt="Mastercard" className="h-8" />
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Set up</button>
          </div>
        </div>
      </div>

      <section className="mb-8">
        <h2 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">Payment providers</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Manage payment providers to accept payments from your customers.</p>

        <div className="flex justify-between items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg mb-4 bg-white dark:bg-gray-800">
          <div className="flex items-center">
            <img src="/api/placeholder/40/40" alt="Cashfree" className="h-10 w-10 mr-3" />
            <span className="font-medium text-gray-900 dark:text-white">Cashfree Payments</span>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Set up</button>
        </div>

        <div className="flex justify-between items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
          <div className="flex items-center">
            <div className="bg-orange-100 dark:bg-orange-900/30 h-10 w-10 flex items-center justify-center rounded-md mr-3">
              <span className="text-orange-600 dark:text-orange-400 font-bold">COD</span>
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Cash on delivery</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Receive payments in cash upon delivery.</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" defaultChecked={true} className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </section>
    </div>
  );
};

export default Payments;