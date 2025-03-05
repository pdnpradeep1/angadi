import React, { useState } from 'react';
import {
  FiShoppingBag,
  FiGlobe,
  FiUsers,
  FiBell,
  FiCreditCard,
  FiShoppingCart,
  FiHome,
  FiTruck,
  FiRefreshCw,
  FiPercent,
  FiDollarSign,
  FiSearch,
  FiGlobe as FiLanguage,
  FiHelpCircle,
  FiFileText,
  FiClock,
  FiInfo,
  FiX,
  FiPlus,
  FiCheck,
  FiChevronDown,
  FiChevronRight,
  FiMoreVertical,
  FiChevronLeft
} from 'react-icons/fi';

const StoreSettings = () => {
  const [activeSetting, setActiveSetting] = useState('staffs-accounts');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);

  // Open modal with specific type
  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setModalType(null);
  };

  // Function to handle setting click
  const handleSettingClick = (settingId) => {
    setActiveSetting(settingId);
  };

  // Array of sidebar navigation items
  const sidebarItems = [
    { id: 'store-details', name: 'Store details', icon: <FiShoppingBag className="h-5 w-5" /> },
    { id: 'domains', name: 'Domains', icon: <FiGlobe className="h-5 w-5" /> },
    { id: 'staffs-accounts', name: 'Staffs accounts', icon: <FiUsers className="h-5 w-5" /> },
    { id: 'notifications', name: 'Notifications', icon: <FiBell className="h-5 w-5" /> },
    { id: 'payments', name: 'Payments', icon: <FiCreditCard className="h-5 w-5" /> },
    { id: 'checkout', name: 'Checkout', icon: <FiShoppingCart className="h-5 w-5" /> },
    { id: 'warehouse', name: 'Warehouse', icon: <FiHome className="h-5 w-5" /> },
    { id: 'delivery', name: 'Delivery', icon: <FiTruck className="h-5 w-5" /> },
    { id: 'returns', name: 'Returns', icon: <FiRefreshCw className="h-5 w-5" /> },
    { id: 'tax', name: 'Tax', icon: <FiPercent className="h-5 w-5" /> },
    { id: 'extra-charges', name: 'Extra charges', icon: <FiDollarSign className="h-5 w-5" /> },
    { id: 'seo', name: 'SEO', icon: <FiSearch className="h-5 w-5" /> },
    { id: 'languages', name: 'Languages', icon: <FiLanguage className="h-5 w-5" /> },
    { id: 'support-social', name: 'Support & Social', icon: <FiHelpCircle className="h-5 w-5" /> },
    { id: 'policies', name: 'Policies', icon: <FiFileText className="h-5 w-5" /> },
    { id: 'store-timings', name: 'Store timings', icon: <FiClock className="h-5 w-5" /> },
  ];

  // Render content based on active setting
  const renderContent = () => {
    switch (activeSetting) {
      case 'store-details':
        return renderStoreDetails();
      case 'domains':
        return renderDomains();
      case 'staffs-accounts':
        return renderStaffAccounts();
      case 'notifications':
        return renderNotifications();
      case 'payments':
        return renderPayments();
      case 'checkout':
        return renderCheckout();
      case 'warehouse':
        return renderWarehouse();
      case 'delivery':
        return renderDelivery();
      case 'returns':
        return renderReturns();
      case 'tax':
        return renderTax();
      default:
        return <div className="flex items-center justify-center h-full">Select a setting from the sidebar</div>;
    }
  };

  // Tax content
  const [gstEnabled, setGstEnabled] = useState(false);
  const [taxType, setTaxType] = useState('inclusive');
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  
  const renderTax = () => (
    <div className="p-6 relative">
      {unsavedChanges && (
        <div className="fixed top-0 left-0 w-full bg-white dark:bg-gray-800 shadow-md z-10 py-4 px-6 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Unsaved changes</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setUnsavedChanges(false)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Discard
            </button>
            <button
              onClick={() => setUnsavedChanges(false)}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      )}
      
      <div className="mt-0">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h2 className="text-xl font-medium text-gray-900 dark:text-white">GST</h2>
            <p className="text-gray-600 dark:text-gray-400">Ensure compliance and transparent pricing.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={gstEnabled} 
              onChange={() => {
                setGstEnabled(!gstEnabled);
                setUnsavedChanges(true);
              }} 
              className="sr-only peer" 
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
        
        {gstEnabled && (
          <div className="mt-6 space-y-6 bg-white dark:bg-gray-800 p-4 rounded-lg">
            <div>
              <p className="text-gray-700 dark:text-gray-300 mb-2">All product prices are</p>
              <div className="flex items-center space-x-6">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="taxType"
                    checked={taxType === 'inclusive'}
                    onChange={() => {
                      setTaxType('inclusive');
                      setUnsavedChanges(true);
                    }}
                    className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">Inclusive of tax</span>
                  <button className="ml-1 text-gray-400 dark:text-gray-500">
                    <FiInfo className="h-4 w-4" />
                  </button>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="taxType"
                    checked={taxType === 'exclusive'}
                    onChange={() => {
                      setTaxType('exclusive');
                      setUnsavedChanges(true);
                    }}
                    className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">Exclusive of tax</span>
                  <button className="ml-1 text-gray-400 dark:text-gray-500">
                    <FiInfo className="h-4 w-4" />
                  </button>
                </label>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  GST Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter GST number"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  onChange={() => setUnsavedChanges(true)}
                />
              </div>
              <div>
                <div className="flex items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    GST Percentage <span className="text-red-500">*</span>
                  </label>
                  <button className="ml-1 text-gray-400 dark:text-gray-500">
                    <FiInfo className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Charge"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    onChange={() => setUnsavedChanges(true)}
                  />
                  <span className="inline-flex items-center px-3 py-2 rounded-r-md border border-l-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 sm:text-sm">
                    %
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                To know more about GST calculation. <a href="#" className="text-blue-600 dark:text-blue-400">Click here</a>
              </p>
            </div>
            
            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setUnsavedChanges(false)}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Domains content
  const [showConnectDomainSidebar, setShowConnectDomainSidebar] = useState(false);
  
  const renderDomains = () => (
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
                        
                        <h3 className="text-md font-medium text-gray-900 dark:text-white mb-2">DNS record propagation</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          Depending on your DNS provider, changes to DNS records can take several hours to propagate and take effect across the internet.
                        </p>
                        
                        <div className="mt-6">
                          <h3 className="text-md font-medium text-gray-900 dark:text-white mb-2">Need help?</h3>
                          <a href="#" className="text-blue-600 dark:text-blue-400 flex items-center text-sm">
                            How to link your third-party custom domain on Dukaan?
                            <svg className="ml-1 w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M18 13V19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M15 3H21V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </a>
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

  // Store details content
  const renderStoreDetails = () => (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Store details</h2>
        <p className="text-gray-600 dark:text-gray-400">Update and customize your store's information.</p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Store Link
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 py-2 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 sm:text-sm">
                mydukaan.io/
              </span>
              <input
                type="text"
                name="url"
                value="harintiruchulu"
                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Store Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value="Hari Inti Ruchulu"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Mobile Number
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 py-2 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 sm:text-sm">
                <div className="flex items-center">
                  <img src="/api/placeholder/20/15" alt="India flag" className="mr-1" />
                  <span>+91</span>
                </div>
              </span>
              <input
                type="text"
                name="phone"
                value="0123456789"
                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none border border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <span className="inline-flex items-center px-3 py-2 rounded-r-md border border-l-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-primary-600 dark:text-primary-400 sm:text-sm">
                VERIFY
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Country <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="country"
              value="India (₹)"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              readOnly
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value="pdnpradeep1@gmail.com"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Store Address
          </label>
          <textarea
            name="address"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div className="pt-4 flex justify-end">
          <button 
            className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm mr-4"
          >
            Delete my store
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );

  // Staff accounts content
  const renderStaffAccounts = () => (
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

  // Notifications content
  const renderNotifications = () => (
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

  // Payments content
  const renderPayments = () => (
    <div className="p-6">
      <div className="mb-8">
        <img src="/api/placeholder/120/40" alt="Razorpay" className="h-8" />
        <div className="mt-6 p-4 border border-gray-200 rounded-lg">
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="flex flex-col">
              <div className="flex items-center mb-2">
                <div className="bg-blue-100 p-2 rounded-md">
                  <FiCreditCard className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <p className="text-sm font-medium">Super-fast payments set-up</p>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center mb-2">
                <div className="bg-blue-100 p-2 rounded-md">
                  <FiCreditCard className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <p className="text-sm font-medium">International & Domestic Payment modes like UPI, Cards, NetBanking, Wallets</p>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center mb-2">
                <div className="bg-blue-100 p-2 rounded-md">
                  <FiCreditCard className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <p className="text-sm font-medium">Best-in-industry success rates</p>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center mb-2">
                <div className="bg-blue-100 p-2 rounded-md">
                  <FiCreditCard className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <p className="text-sm font-medium">Prompt round-the-clock support</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-3">Receive payments via</p>
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
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md">Set up</button>
          </div>
        </div>
      </div>

      <section className="mb-8">
        <h2 className="text-lg font-medium mb-2">Payment providers</h2>
        <p className="text-gray-600 mb-4">Manage payment providers to accept payments from your customers.</p>

        <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg mb-4">
          <div className="flex items-center">
            <img src="/api/placeholder/40/40" alt="Cashfree" className="h-10 w-10 mr-3" />
            <span className="font-medium">Cashfree Payments</span>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md">Set up</button>
        </div>

        <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center">
            <div className="bg-orange-100 h-10 w-10 flex items-center justify-center rounded-md mr-3">
              <span className="text-orange-600 font-bold">COD</span>
            </div>
            <div>
              <p className="font-medium">Cash on delivery</p>
              <p className="text-sm text-gray-600">Receive payments in cash upon delivery.</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={true} className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-medium">Manual payment methods</h2>
            <p className="text-sm text-gray-600">Enables offline payments like cash, check, or other custom methods.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </section>
    </div>
  );

  // Checkout content
  const renderCheckout = () => (
    <div className="p-6">
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-medium">Guest checkout</h2>
            <p className="text-sm text-gray-600">Customers will be able to check out as guests without verifying their mobile number.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={true} className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-medium mb-2">Checkout form</h2>
        <p className="text-gray-600 mb-6">Streamline the buying process, improve customer experience.</p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
            <div className="h-10 bg-gray-100 rounded-md"></div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number <span className="text-red-500">*</span></label>
            <div className="h-10 bg-gray-100 rounded-md"></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="flex justify-between">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address <span className="text-gray-400">(Optional)</span></label>
              <button className="text-blue-600 text-sm">EDIT</button>
            </div>
            <div className="h-10 bg-gray-100 rounded-md"></div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country <span className="text-red-500">*</span></label>
            <div className="h-10 bg-gray-100 rounded-md"></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address <span className="text-red-500">*</span></label>
            <div className="h-10 bg-gray-100 rounded-md"></div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pin Code <span className="text-red-500">*</span></label>
            <div className="h-10 bg-gray-100 rounded-md"></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City <span className="text-red-500">*</span></label>
            <div className="h-10 bg-gray-100 rounded-md"></div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State <span className="text-red-500">*</span></label>
            <div className="h-10 bg-gray-100 rounded-md"></div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center mb-2">
            <h3 className="text-md font-medium">Advanced fields</h3>
            <button className="ml-1 text-gray-400">
              <FiInfo className="h-4 w-4" />
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-4">Enhance your checkout experience with personalized form fields.</p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Locality / Area</label>
              <div className="h-10 bg-gray-100 rounded-md"></div>
              <div className="mt-2">
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" />
                  <span className="ml-2 text-sm text-gray-700">Required field</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Landmark</label>
              <div className="h-10 bg-gray-100 rounded-md"></div>
              <div className="mt-2">
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" />
                  <span className="ml-2 text-sm text-gray-700">Required field</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <div>
              <h3 className="text-md font-medium">Additional information</h3>
              <p className="text-sm text-gray-600">Create additional fields to collect extra information from your customers.</p>
            </div>
            <button className="px-3 py-1 border border-gray-200 rounded-md text-sm flex items-center">
              Add new field
            </button>
          </div>
        </div>
      </section>
    </div>
  );

  // Warehouse content
  const renderWarehouse = () => (
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

  // Delivery content
  const renderDelivery = () => (
    <div className="p-6">
      <section className="mb-8">
        <h2 className="text-lg font-medium mb-2">Shipping providers</h2>
        <p className="text-gray-600 mb-6">Connect and manage shipping providers to be used while shipping your orders.</p>

        <div className="border border-gray-200 rounded-lg p-4 mb-4 flex justify-between items-center">
          <div className="flex items-center">
            <img src="/api/placeholder/40/40" alt="Shiprocket" className="h-10 w-10 mr-3" />
            <div>
              <h3 className="font-medium">Shiprocket</h3>
              <p className="text-sm text-gray-600">Effortlessly ship your orders and enjoy a streamlined shipping process for your business.</p>
            </div>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md">
            Connect
          </button>
        </div>

        <div className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-blue-100 h-10 w-10 flex items-center justify-center rounded-md mr-3">
              <FiTruck className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium">Own shipping partner</h3>
              <p className="text-sm text-gray-600">Connect your partner account and set shipping priority.</p>
            </div>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md">
            Set up partner account
          </button>
        </div>
      </section>

      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-medium">Packages</h2>
            <p className="text-sm text-gray-600">Custom size shipping packages for your orders.</p>
          </div>
          <button 
            onClick={() => openModal('add-package')}
            className="flex items-center bg-blue-600 text-white px-3 py-1 rounded-md"
          >
            <FiPlus className="mr-1" /> Add package
          </button>
        </div>

        <div className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-yellow-100 h-10 w-10 flex items-center justify-center rounded-md mr-3">
              <span role="img" aria-label="package">📦</span>
            </div>
            <p>Test (100 x 100 x 15) - 10 grams</p>
          </div>
          <button>
            <FiMoreVertical />
          </button>
        </div>
      </section>

      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-medium">Delivery charge</h2>
            <p className="text-sm text-gray-600">Flexibility to set rates based on payment methods.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-medium mb-2">Average delivery time</h2>
        <p className="text-gray-600 mb-4">Manage expectations with clear, consistent timelines. This is shown on checkout page.</p>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Delivery happens within</label>
          <div className="relative">
            <select className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md">
              <option>5-10 days</option>
              <option>3-5 days</option>
              <option>1-3 days</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <FiChevronDown className="h-4 w-4" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  // Returns content
  const renderReturns = () => (
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

  // Add Staff Modal
  const renderAddStaffModal = () => (
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
  
  // Add Warehouse Modal
  const renderAddWarehouseModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl">
        <div className="flex items-center mb-6">
          <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 mr-2">
            <FiChevronLeft className="h-6 w-6" />
          </button>
          <h2 className="text-xl font-semibold">Add warehouse</h2>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Warehouse Information</h3>
          
          <div className="grid grid-cols-1 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Warehouse Name <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                placeholder="Enter warehouse name" 
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Person <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                placeholder="Enter full name" 
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                placeholder="Enter mobile number" 
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Flat, House no., Building, Company, Apartment <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                placeholder="Enter flat, house no..." 
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Area, Colony, Street, Sector, Village
              </label>
              <input 
                type="text" 
                placeholder="Enter area, colony..." 
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pin Code <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                placeholder="Enter pin code" 
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                placeholder="Enter city" 
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select className="w-full p-2 border border-gray-300 rounded-md appearance-none">
                  <option value="" disabled selected>Select state</option>
                  <option value="karnataka">Karnataka</option>
                  <option value="tamil-nadu">Tamil Nadu</option>
                  <option value="maharashtra">Maharashtra</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <FiChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>
            <div>
              <div className="flex justify-between">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GST Number
                </label>
                <a href="#" className="text-sm text-blue-600">Why GST?</a>
              </div>
              <input 
                type="text" 
                placeholder="Enter GST number" 
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" />
              <span className="ml-2 text-sm text-gray-700">I accept all <a href="#" className="text-blue-600">terms & conditions</a></span>
            </label>
          </div>
          
          <div className="flex justify-end">
            <button 
              type="button" 
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            >
              Add warehouse
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  
  // Add Package Modal
  const renderAddPackageModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Add new package</h2>
          <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
            <FiX className="h-6 w-6" />
          </button>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Package Name <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              placeholder="Enter package name" 
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Length in cm <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                placeholder="Eg. 20" 
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Width in cm <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                placeholder="Eg. 30" 
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Height in cm <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                placeholder="Eg. 16" 
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Weight of empty package in grams
            </label>
            <input 
              type="text" 
              placeholder="Eg. 70" 
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div className="pt-4">
            <button 
              type="button" 
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            >
              Add package
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  
  // Render appropriate modal based on type
  const renderModal = () => {
    if (!showModal) return null;
    
    switch (modalType) {
      case 'add-staff':
        return renderAddStaffModal();
      case 'add-warehouse':
        return renderAddWarehouseModal();
      case 'add-package':
        return renderAddPackageModal();
      default:
        return null;
    }
  };
  
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 shadow-sm border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
        <div className="p-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Store settings</h2>
          <div className="space-y-1">
            {sidebarItems.map((item) => (
              <div
                key={item.id}
                className={`flex items-center p-3 rounded-md cursor-pointer ${
                  activeSetting === item.id
                    ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border-l-4 border-primary-600 dark:border-primary-400 pl-2"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                onClick={() => handleSettingClick(item.id)}
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-white dark:bg-gray-900">
        {renderContent()}
      </div>
      
      {/* Modal */}
      {renderModal()}
    </div>
  );
};

export default StoreSettings;