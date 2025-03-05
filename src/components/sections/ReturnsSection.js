import React, { useState } from 'react';
import { FiX, FiPlus, FiCheck } from 'react-icons/fi';

const ReturnsSection = () => {
  // State to track current view (empty, setup form, or configured view)
  const [currentView, setCurrentView] = useState('empty'); // 'empty', 'configured-returns', 'configured-replacement'
  
  // State for modals
  const [showAllowCustomersModal, setShowAllowCustomersModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showAddReasonModal, setShowAddReasonModal] = useState(false);
  
  // State for settings
  const [returnEnabled, setReturnEnabled] = useState(false);
  const [replacementEnabled, setReplacementEnabled] = useState(false);
  const [duration, setDuration] = useState('30');
  const [successMessage, setSuccessMessage] = useState('');
  const [newReason, setNewReason] = useState('');
  const [deactivateType, setDeactivateType] = useState('');
  
  // State for reasons
  const [returnReasons, setReturnReasons] = useState([
    { id: 1, text: 'Missing parts or pieces', selected: false },
    { id: 2, text: 'Damaged product', selected: false },
    { id: 3, text: 'Doesn\'t work/defective', selected: false },
    { id: 4, text: 'Ordered by mistake', selected: false },
    { id: 5, text: 'Wrong item sent', selected: false },
    { id: 6, text: 'Doesn\'t fit', selected: false },
    { id: 7, text: 'Changed my mind', selected: false }
  ]);
  
  // Handle initial setup button click
  const handleSetupClick = () => {
    setShowAllowCustomersModal(true);
  };
  
  // Handle return toggle in the modal
  const handleReturnToggle = () => {
    setReturnEnabled(!returnEnabled);
  };
  
  // Handle replacement toggle in the modal
  const handleReplacementToggle = () => {
    setReplacementEnabled(!replacementEnabled);
  };
  
  // Handle continue button in allow customers modal
  const handleAllowCustomersContinue = () => {
    setShowAllowCustomersModal(false);
    
    if (returnEnabled) {
      setSuccessMessage('Return & replacement enabled successfully!');
      setCurrentView('configured-returns');
    } else if (replacementEnabled) {
      setSuccessMessage('Replacement enabled successfully!');
      setCurrentView('configured-replacement');
    } else {
      setCurrentView('empty');
    }
    
    // Show success message and hide after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };
  
  // Handle deactivate confirmation
  const handleDeactivate = () => {
    if (deactivateType === 'returns') {
      setReturnEnabled(false);
    } else if (deactivateType === 'replacement') {
      setReplacementEnabled(false);
    }
    
    setShowDeactivateModal(false);
    setCurrentView('empty');
  };
  
  // Handle reason selection
  const handleReasonSelect = (id) => {
    setReturnReasons(
      returnReasons.map(reason => 
        reason.id === id 
          ? { ...reason, selected: !reason.selected }
          : reason
      )
    );
  };
  
  // Handle add new reason
  const handleAddReason = () => {
    if (newReason.trim()) {
      const newId = Math.max(...returnReasons.map(r => r.id)) + 1;
      setReturnReasons([
        ...returnReasons,
        { id: newId, text: newReason, selected: true }
      ]);
      setNewReason('');
      setShowAddReasonModal(false);
    }
  };

  // Show deactivate confirmation modal
  const handleShowDeactivate = (type) => {
    setDeactivateType(type);
    setShowDeactivateModal(true);
  };
  
  // Empty state view
  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-10 mb-4">
        <img src="/api/placeholder/100/100" alt="Returns & Replacement" className="h-24 w-24" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Set up Returns & Replacement
      </h2>
      <p className="text-gray-600 dark:text-gray-400 text-center max-w-lg mb-6">
        Set up returns and replacement for your delivered orders and manage them easily from your Dukaan dashboard.
      </p>
      <button 
        onClick={handleSetupClick}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Set up
      </button>
    </div>
  );
  
  // Configured returns view
  const renderConfiguredReturnsView = () => (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Returns</h2>
        <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800">
          Settings
        </button>
      </div>
      
      <div className="space-y-10">
        {/* Return & replacement duration */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Return & replacement duration
          </h3>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Return & Replacement Duration <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center">
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <span className="inline-flex items-center px-3 py-2 rounded-r-md border border-l-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 sm:text-sm">
                days
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Return & replacement will be allowed till {duration} days after delivery.
          </p>
        </div>
        
        {/* Reasons to display */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Reasons to display for return & replacement <span className="text-red-500">*</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {returnReasons.map(reason => (
              <div key={reason.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`reason-${reason.id}`}
                  checked={reason.selected}
                  onChange={() => handleReasonSelect(reason.id)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor={`reason-${reason.id}`} className="ml-2 text-gray-700 dark:text-gray-300">
                  {reason.text}
                </label>
              </div>
            ))}
          </div>
          
          <button
            onClick={() => setShowAddReasonModal(true)}
            className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            <span className="text-xl mr-1">+</span> ADD YOUR OWN
          </button>
        </div>
        
        {/* Refund mode */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Select mode of refund
          </h3>
          
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Mode of Refund <span className="text-red-500">*</span>
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none">
              <option value="">Select mode</option>
              <option value="original">Original payment method</option>
              <option value="wallet">Store credit/wallet</option>
              <option value="bank">Bank transfer</option>
            </select>
          </div>
        </div>
        
        {/* Update button */}
        <div className="flex justify-end">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Update
          </button>
        </div>
      </div>
    </div>
  );
  
  // Configured replacement view (similar to returns but with replacement specific text)
  const renderConfiguredReplacementView = () => (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Returns</h2>
        <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800">
          Settings
        </button>
      </div>
      
      <div className="space-y-10">
        {/* Replacement duration */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Replacement duration
          </h3>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Replacement Duration <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center">
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <span className="inline-flex items-center px-3 py-2 rounded-r-md border border-l-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 sm:text-sm">
                days
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Replacement will be allowed till {duration} days after delivery.
          </p>
        </div>
        
        {/* Reasons to display */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Reasons to display for replacement <span className="text-red-500">*</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {returnReasons.map(reason => (
              <div key={reason.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`reason-${reason.id}`}
                  checked={reason.selected}
                  onChange={() => handleReasonSelect(reason.id)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor={`reason-${reason.id}`} className="ml-2 text-gray-700 dark:text-gray-300">
                  {reason.text}
                </label>
              </div>
            ))}
          </div>
          
          <button
            onClick={() => setShowAddReasonModal(true)}
            className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            <span className="text-xl mr-1">+</span> ADD YOUR OWN
          </button>
        </div>
        
        {/* Refund mode */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Select mode of refund
          </h3>
          
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Mode of Refund <span className="text-red-500">*</span>
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none">
              <option value="">Select mode</option>
              <option value="original">Original payment method</option>
              <option value="wallet">Store credit/wallet</option>
              <option value="bank">Bank transfer</option>
            </select>
          </div>
        </div>
        
        {/* Save button */}
        <div className="flex justify-end">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Save
          </button>
        </div>
      </div>
    </div>
  );

  // Allow customers modal
  const renderAllowCustomersModal = () => {
    if (!showAllowCustomersModal) return null;
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Allow customers to...
            </h2>
            <button 
              onClick={() => setShowAllowCustomersModal(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Return order items</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Customers can return the delivered order items.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={returnEnabled} 
                  onChange={handleReturnToggle}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Replace order items</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Customers can replace the delivered order items with the same item or its variants.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={replacementEnabled} 
                  onChange={handleReplacementToggle}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
          
          <div className="flex justify-center">
            <button
              onClick={handleAllowCustomersContinue}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // Deactivate modal
  const renderDeactivateModal = () => {
    if (!showDeactivateModal) return null;
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Deactivate {deactivateType === 'returns' ? 'Returns' : 'Replacements'}?
            </h2>
            <button 
              onClick={() => setShowDeactivateModal(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-700 dark:text-gray-300">
              The buyers won't be able to {deactivateType === 'returns' ? 'return' : 'replace'} their delivered orders anymore.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Note: The current {deactivateType === 'returns' ? 'return' : 'replacement'} orders will remain unaffected.
            </p>
          </div>
          
          <div className="flex justify-start">
            <button
              onClick={handleDeactivate}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Yes, deactivate
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // Add reason modal
  const renderAddReasonModal = () => {
    if (!showAddReasonModal) return null;
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Add return reason
            </h2>
            <button 
              onClick={() => setShowAddReasonModal(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Reason <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={newReason}
              onChange={(e) => setNewReason(e.target.value)}
              placeholder="Enter a reason for return"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <div className="flex justify-center">
            <button
              onClick={handleAddReason}
              disabled={!newReason.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              Add reason
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // Success message notification
  const renderSuccessMessage = () => {
    if (!successMessage) return null;
    
    return (
      <div className="fixed top-0 left-0 right-0 z-50 mx-auto mt-4 max-w-md">
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded flex items-center justify-between">
          <div className="flex items-center">
            <FiCheck className="mr-2" />
            <span>{successMessage}</span>
          </div>
          <button 
            onClick={() => setSuccessMessage('')}
            className="text-green-700"
          >
            <FiX />
          </button>
        </div>
      </div>
    );
  };
  
  return (
    <>
      {/* Main content */}
      {currentView === 'empty' && renderEmptyState()}
      {currentView === 'configured-returns' && renderConfiguredReturnsView()}
      {currentView === 'configured-replacement' && renderConfiguredReplacementView()}
      
      {/* Modals */}
      {renderAllowCustomersModal()}
      {renderDeactivateModal()}
      {renderAddReasonModal()}
      
      {/* Success message notification */}
      {renderSuccessMessage()}
    </>
  );
};

export default ReturnsSection;