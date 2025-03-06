// src/components/StoreSettings/ModalProvider.js
import React, { Suspense, lazy } from 'react';

// Lazy load modal components
const AddWarehouseModal = lazy(() => import('../../components/modals/AddWarehouseModal'));
const AddStaffModal = lazy(() => import('../../components/modals/AddStaffModal'));
// Import other modals as needed

const ModalProvider = ({ children, modalState, closeModal }) => {
  const { isOpen, type } = modalState;

  // Render the appropriate modal based on type
  const renderModal = () => {
    if (!isOpen) return null;

    switch (type) {
      case 'add-warehouse':
        return (
          <Suspense fallback={<div>Loading...</div>}>
            <AddWarehouseModal closeModal={closeModal} />
          </Suspense>
        );
      case 'add-staff':
        return (
          <Suspense fallback={<div>Loading...</div>}>
            <AddStaffModal closeModal={closeModal} />
          </Suspense>
        );
      // Add cases for other modal types
      default:
        return null;
    }
  };

  return (
    <>
      {children}
      {renderModal()}
    </>
  );
};

export default ModalProvider;