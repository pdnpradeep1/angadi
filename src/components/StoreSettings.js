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
  FiX,
  FiChevronLeft,
  FiMoreVertical
} from 'react-icons/fi';

// Import all section components
import StoreTimings from './sections/StoreTimings';
import StoreDetails from './sections/StoreDetails';
import Domains from './sections/Domains';
import StaffAccounts from './sections/StaffAccounts';
import Notifications from './sections/Notifications';
import Payments from './sections/Payments';
import Checkout from './sections/Checkout';
import Warehouse from './sections/Warehouse';
import Delivery from './sections/Delivery';
import Returns from './sections/Returns';
import Tax from './sections/Tax';
import SupportSocial from './sections/SupportSocial';

// Import modals
import AddStaffModal from './modals/AddStaffModal';
import AddWarehouseModal from './modals/AddWarehouseModal';

const StoreSettings = () => {
  const [activeSetting, setActiveSetting] = useState('support-social'); // Set support-social as the default active tab
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
        return <StoreDetails />;
      case 'domains':
        return <Domains />;
      case 'staffs-accounts':
        return <StaffAccounts openModal={openModal} />;
      case 'notifications':
        return <Notifications />;
      case 'payments':
        return <Payments />;
      case 'checkout':
        return <Checkout />;
      case 'warehouse':
        return <Warehouse openModal={openModal} />;
      case 'delivery':
        return <Delivery />;
      case 'returns':
        return <Returns />;
      case 'tax':
        return <Tax />;
      case 'support-social':
        return <SupportSocial />;
      case 'store-timings':
        return <StoreTimings />;
      default:
        return <div className="flex items-center justify-center h-full">Select a setting from the sidebar</div>;
    }
  };

  // Render appropriate modal based on type
  const renderModal = () => {
    if (!showModal) return null;
    
    switch (modalType) {
      case 'add-staff':
        return <AddStaffModal closeModal={closeModal} />;
      case 'add-warehouse':
        return <AddWarehouseModal closeModal={closeModal} />;
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