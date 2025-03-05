import React, { useState } from "react";
import { FiSearch, FiSettings, FiCalendar, FiChevronDown } from "react-icons/fi";

const AbandonedOrders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState("Last 30 days");
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);

  // Empty state to show when there are no abandoned orders
  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-10 mb-4">
        <div className="relative">
          <div className="w-24 h-24 bg-blue-500 rounded-md flex items-center justify-center">
            <div className="w-20 h-16 bg-blue-400 mx-auto flex flex-col justify-center">
              <div className="h-2 bg-white mx-3 mb-2 rounded-sm"></div>
              <div className="h-2 bg-white mx-3 mb-2 rounded-sm"></div>
              <div className="h-2 bg-white mx-3 mb-2 rounded-sm"></div>
              <div className="h-2 bg-white mx-3 mb-2 rounded-sm"></div>
              <div className="h-2 bg-white mx-3 rounded-sm"></div>
            </div>
          </div>
          <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
              <span className="text-blue-500 dark:text-blue-300 text-lg">×</span>
            </div>
          </div>
        </div>
      </div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Abandoned orders will appear here
      </h2>
      <p className="text-center text-gray-600 dark:text-gray-400 max-w-md mb-4">
        View your abandoned orders and send automatic recovery
        messages to regain your potential orders.
      </p>
      <a 
        href="#" 
        className="text-primary-600 dark:text-primary-400 hover:underline"
      >
        Learn more about abandoned orders
      </a>
    </div>
  );

  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-900 overflow-auto">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Abandoned Orders <span className="font-normal text-gray-500 dark:text-gray-400">last 30 days</span>
          </h1>
          
          <div className="flex mt-4 sm:mt-0 space-x-2">
            <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <FiSettings className="mr-2" /> Recovery settings
            </button>
            
            <button className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              Export
            </button>
            
            <div className="relative">
              <button
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
              >
                <FiCalendar className="mr-2" /> {dateRange} <FiChevronDown className="ml-2" />
              </button>
              
              {isDateDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
                  {["Today", "Yesterday", "Last 7 days", "Last 30 days", "Last 90 days", "Custom range"].map((range) => (
                    <button
                      key={range}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => {
                        setDateRange(range);
                        setIsDateDropdownOpen(false);
                      }}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Search bar */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Reference ID or a name..."
            />
          </div>
        </div>
        
        {/* Orders table */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Reference ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date <FiChevronDown className="inline ml-1" />
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Items
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {/* No rows for empty state */}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Empty state */}
        {renderEmptyState()}
      </div>
    </div>
  );
};

export default AbandonedOrders;