// src/components/StoreSettings/index.js
import React, { useState } from 'react';
import SettingsSidebar from './SettingsSidebar';
import SettingsContent from './SettingsContent';
import ModalProvider from './ModalProvider';

const StoreSettings = () => {
  const [activeSetting, setActiveSetting] = useState('store-details');
  const [modalState, setModalState] = useState({ isOpen: false, type: null });

  // Open modal with specific type
  const openModal = (type) => {
    setModalState({ isOpen: true, type });
  };

  // Close modal
  const closeModal = () => {
    setModalState({ isOpen: false, type: null });
  };

  return (
    <ModalProvider modalState={modalState} closeModal={closeModal}>
      <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
        {/* Sidebar */}
        <SettingsSidebar 
          activeSetting={activeSetting} 
          onSettingChange={setActiveSetting} 
        />
        
        {/* Main Content */}
        <SettingsContent 
          activeSetting={activeSetting} 
          openModal={openModal} 
        />
      </div>
    </ModalProvider>
  );
};

export default StoreSettings;