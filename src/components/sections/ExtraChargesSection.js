import React, { useState } from 'react';
import { FiMoreVertical, FiX } from 'react-icons/fi';

const ExtraChargesSection = () => {
  const [showModal, setShowModal] = useState(false);
  const [charges, setCharges] = useState([
    { id: 1, name: '1', type: 'percent', value: '1' },
    { id: 2, name: 'test', type: 'flat', value: '1' }
  ]);
  const [chargeType, setChargeType] = useState('percent');
  const [chargeName, setChargeName] = useState('');
  const [chargeValue, setChargeValue] = useState('');
  const [selectedChargeId, setSelectedChargeId] = useState(null);
  const [showActionMenu, setShowActionMenu] = useState(null);

  const openModal = (type = 'add', chargeId = null) => {
    setChargeType('percent');
    setChargeName('');
    setChargeValue('');
    
    if (type === 'edit' && chargeId) {
      const chargeToEdit = charges.find(c => c.id === chargeId);
      if (chargeToEdit) {
        setChargeType(chargeToEdit.type);
        setChargeName(chargeToEdit.name);
        setChargeValue(chargeToEdit.value);
        setSelectedChargeId(chargeId);
      }
    }
    
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedChargeId(null);
  };

  const handleCreateCharge = () => {
    if (!chargeName.trim() || !chargeValue.trim()) return;
    
    if (selectedChargeId) {
      // Edit existing charge
      setCharges(charges.map(charge => 
        charge.id === selectedChargeId 
          ? { ...charge, name: chargeName, type: chargeType, value: chargeValue }
          : charge
      ));
    } else {
      // Add new charge
      const newCharge = {
        id: Math.max(0, ...charges.map(c => c.id)) + 1,
        name: chargeName,
        type: chargeType,
        value: chargeValue
      };
      setCharges([...charges, newCharge]);
    }
    
    closeModal();
  };

  const deleteCharge = (id) => {
    setCharges(charges.filter(charge => charge.id !== id));
    setShowActionMenu(null);
  };

  const toggleActionMenu = (id) => {
    setShowActionMenu(showActionMenu === id ? null : id);
  };

  // Render empty state when no charges exist
  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center p-12">
      <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-6">
        <img src="/api/placeholder/100/100" alt="Extra charges icon" className="h-24 w-24" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Create extra charges</h2>
      <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-6">
        Set up either fixed or percentage-based additional fees on your orders.
      </p>
      <button 
        onClick={() => openModal('add')}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Create extra charges
      </button>
      <a href="#" className="mt-4 text-blue-600 dark:text-blue-400 hover:underline text-sm">
        Learn more about extra charges
      </a>
    </div>
  );

  // Render charges list
  const renderChargesList = () => (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Extra charges</h2>
          <p className="text-gray-600 dark:text-gray-400">Set up either fixed or percentage-based additional fees on your orders.</p>
        </div>
        <button 
          onClick={() => openModal('add')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Create extra charges
        </button>
      </div>

      {charges.map(charge => (
        <div key={charge.id} className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-sm mb-4 relative">
          <div className="absolute top-4 right-4">
            <button 
              onClick={() => toggleActionMenu(charge.id)} 
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <FiMoreVertical />
            </button>
            
            {showActionMenu === charge.id && (
              <div className="absolute right-0 mt-2 w-36 rounded-md shadow-lg py-1 bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-10">
                <button
                  onClick={() => {
                    toggleActionMenu(null);
                    openModal('edit', charge.id);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  Edit charge
                </button>
                <button
                  onClick={() => deleteCharge(charge.id)}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  Delete charge
                </button>
              </div>
            )}
          </div>
          
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{charge.name}</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Charge in {charge.type === 'percent' ? 'percent' : 'rupees'} <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center">
              <input
                type="text"
                value={charge.value}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              {charge.type === 'percent' && (
                <span className="ml-2">%</span>
              )}
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {charge.type === 'percent' 
                ? `${charge.value}% will be added as ${charge.name} on the bill`
                : `₹${charge.value} will be added as ${charge.name} on the bill`
              }
            </p>
          </div>
        </div>
      ))}
      
      <div className="flex justify-end mt-6">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Save changes
        </button>
      </div>
    </div>
  );

  return (
    <>
      {charges.length === 0 ? renderEmptyState() : renderChargesList()}
      
      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Create extra charges
                  </h3>
                  <button 
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <FiX className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center space-x-4 mb-6">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        checked={chargeType === 'percent'}
                        onChange={() => setChargeType('percent')}
                        className="form-radio h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2 text-gray-700 dark:text-gray-300">Percent</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        checked={chargeType === 'flat'}
                        onChange={() => setChargeType('flat')}
                        className="form-radio h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2 text-gray-700 dark:text-gray-300">Flat price</span>
                    </label>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Charge name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter charge name"
                        value={chargeName}
                        onChange={(e) => setChargeName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {chargeType === 'percent' ? 'Charges in percent' : 'Charges amount'} <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center">
                        {chargeType === 'flat' && (
                          <span className="inline-flex items-center px-3 py-2 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 sm:text-sm">
                            ₹
                          </span>
                        )}
                        <input
                          type="text"
                          placeholder={chargeType === 'percent' ? "Charge" : "Amount"}
                          value={chargeValue}
                          onChange={(e) => setChargeValue(e.target.value)}
                          className={`${chargeType === 'flat' ? 'rounded-l-none' : ''} w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                        />
                        {chargeType === 'percent' && (
                          <span className="ml-2">%</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleCreateCharge}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExtraChargesSection;