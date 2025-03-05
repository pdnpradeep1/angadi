import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';

const Domains = () => {
  const [showConnectDomainSidebar, setShowConnectDomainSidebar] = useState(false);

  return (
    <div className="p-6 relative">
      <div className="mb-6">
        <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-1">Domains</h2>
        <p className="text-gray-600 dark:text-gray-400">Set up and personalize your store's web address.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-700">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Domain name</div>
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</div>
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Date added</div>
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Provider</div>
        </div>
        <div className="grid grid-cols-4 gap-4 p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-blue-600 dark:text-blue-400">https://mydukaan.io/harintiruchulu</div>
          <div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300">
              LIVE
            </span>
          </div>
          <div className="text-gray-600 dark:text-gray-400">Oct 13, 2024</div>
          <div className="text-gray-600 dark:text-gray-400">Dukaan</div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Connect external domain</h3>
            <p className="text-gray-600 dark:text-gray-400">You can connect your existing domain to Dukaan in a few minutes.</p>
          </div>
          <button 
            onClick={() => setShowConnectDomainSidebar(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Connect
          </button>
        </div>
      </div>

      {/* Connect Domain Sidebar */}
      {showConnectDomainSidebar && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
            <section className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
              <div className="relative w-screen max-w-md">
                <div className="h-full flex flex-col bg-white dark:bg-gray-800 shadow-xl overflow-y-auto">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-medium text-gray-900 dark:text-white">Connect external domain</h2>
                      <div className="flex items-center">
                        <button className="flex items-center text-sm text-red-600 mr-4">
                          <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M8 12L12 16L16 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Watch video tutorial
                        </button>
                        <button 
                          onClick={() => setShowConnectDomainSidebar(false)}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <FiX className="h-6 w-6" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Domain
                        </label>
                        <input
                          type="text"
                          placeholder="example.com"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <h3 className="text-md font-medium text-gray-900 dark:text-white mb-2">DNS instructions</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          To point an apex domain such as mystore.com or a subdomain such as www.mystore.com to your store on Dukaan, you must create a A record with your DNS provider.
                        </p>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          To point a domain to your Dukaan store, create an A record with the IP address 103.181.194.5
                        </p>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          You can have only one A record associated with your primary domain. If your domain is already associated with an A record, amend it to the Dukaan IP address.
                        </p>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          Remove IPV6 AAAA record if exists
                        </p>
                        
                        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md mb-4">
                          <p className="text-sm text-gray-700 dark:text-gray-300">mystore.com A 103.181.194.5</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 p-4 mt-auto">
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => setShowConnectDomainSidebar(false)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                      <button
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Connect
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
};

export default Domains;