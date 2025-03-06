// src/components/sections/ExtraChargesSection.js
import React, { useState } from 'react';
import { FiMoreVertical, FiX } from 'react-icons/fi';
import BaseSection from '../ui/BaseSection';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import EmptyState from '../ui/EmptyState';
import Modal from '../ui/Modal';
import { FormField } from '../ui/FormField';
import { ConfirmDialog } from '../ui/Modal';
import useForm from '../../hooks/useForm';

const ExtraChargesSection = () => {
  const [showModal, setShowModal] = useState(false);
  const [charges, setCharges] = useState([]);
  const [selectedChargeId, setSelectedChargeId] = useState(null);
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Form handling for add/edit charge
  const { 
    values, 
    errors, 
    touched, 
    handleChange, 
    handleBlur, 
    handleSubmit,
    resetForm,
    setMultipleValues,
    isSubmitting 
  } = useForm(
    {
      name: '',
      type: 'percent',
      value: ''
    },
    (formValues) => {
      const validationErrors = {};
      if (!formValues.name.trim()) {
        validationErrors.name = 'Charge name is required';
      }
      if (!formValues.value.trim()) {
        validationErrors.value = 'Charge value is required';
      } else if (!/^\d*\.?\d*$/.test(formValues.value)) {
        validationErrors.value = 'Must be a valid number';
      }
      return validationErrors;
    },
    (formData) => {
      if (selectedChargeId) {
        // Edit existing charge
        setCharges(charges.map(charge => 
          charge.id === selectedChargeId 
            ? { ...charge, ...formData }
            : charge
        ));
      } else {
        // Add new charge
        const newCharge = {
          id: Math.max(0, ...charges.map(c => c.id), 0) + 1,
          ...formData
        };
        setCharges([...charges, newCharge]);
      }
      
      closeModal();
    }
  );

  const openModal = (type = 'add', chargeId = null) => {
    resetForm();
    
    if (type === 'edit' && chargeId) {
      const chargeToEdit = charges.find(c => c.id === chargeId);
      if (chargeToEdit) {
        setMultipleValues(chargeToEdit);
        setSelectedChargeId(chargeId);
      }
    } else {
      setSelectedChargeId(null);
    }
    
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedChargeId(null);
    resetForm();
  };

  const deleteCharge = () => {
    setCharges(charges.filter(charge => charge.id !== selectedChargeId));
    setShowDeleteConfirm(false);
    setSelectedChargeId(null);
  };

  const toggleActionMenu = (id) => {
    setShowActionMenu(showActionMenu === id ? null : id);
  };

  const handleShowDeleteConfirm = (id) => {
    setSelectedChargeId(id);
    setShowActionMenu(null);
    setShowDeleteConfirm(true);
  };

  // Render empty state when no charges exist
  if (charges.length === 0) {
    return (
      <BaseSection>
        <EmptyState
          title="Create extra charges"
          description="Set up either fixed or percentage-based additional fees on your orders."
          buttonText="Create extra charges"
          onButtonClick={() => openModal('add')}
          linkText="Learn more about extra charges"
          linkUrl="#"
        />
        
        {/* Create/Edit Charge Modal */}
        <ChargeFormModal 
          isOpen={showModal}
          onClose={closeModal}
          values={values}
          errors={errors}
          touched={touched}
          handleChange={handleChange}
          handleBlur={handleBlur}
          handleSubmit={handleSubmit}
          isEditing={!!selectedChargeId}
          isSubmitting={isSubmitting}
        />
      </BaseSection>
    );
  }

  // Render charges list if charges exist
  return (
    <BaseSection
      title="Extra charges"
      description="Set up either fixed or percentage-based additional fees on your orders."
      actions={
        <Button onClick={() => openModal('add')}>
          Create extra charges
        </Button>
      }
    >
      <div className="space-y-4">
        {charges.map(charge => (
          <Card key={charge.id} className="p-6 relative">
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
                    onClick={() => handleShowDeleteConfirm(charge.id)}
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
          </Card>
        ))}
      </div>
      
      <div className="flex justify-end mt-6">
        <Button>
          Save changes
        </Button>
      </div>

      {/* Create/Edit Charge Modal */}
      <ChargeFormModal 
        isOpen={showModal}
        onClose={closeModal}
        values={values}
        errors={errors}
        touched={touched}
        handleChange={handleChange}
        handleBlur={handleBlur}
        handleSubmit={handleSubmit}
        isEditing={!!selectedChargeId}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setSelectedChargeId(null);
        }}
        onConfirm={deleteCharge}
        title="Delete Charge"
        message="Are you sure you want to delete this charge? This action cannot be undone."
        confirmText="Delete"
        confirmVariant="danger"
      />
    </BaseSection>
  );
};

// Charge Form Modal Component
const ChargeFormModal = ({ 
  isOpen, 
  onClose, 
  values, 
  errors, 
  touched, 
  handleChange, 
  handleBlur, 
  handleSubmit,
  isEditing,
  isSubmitting
}) => {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit extra charges' : 'Create extra charges'}
      footer={
        <div className="flex justify-end">
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : isEditing ? 'Update' : 'Create'}
          </Button>
        </div>
      }
    >
      <div className="mb-4">
        <div className="flex items-center space-x-4 mb-6">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="type"
              value="percent"
              checked={values.type === 'percent'}
              onChange={handleChange}
              className="form-radio h-4 w-4 text-blue-600"
            />
            <span className="ml-2 text-gray-700 dark:text-gray-300">Percent</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="type"
              value="flat"
              checked={values.type === 'flat'}
              onChange={handleChange}
              className="form-radio h-4 w-4 text-blue-600"
            />
            <span className="ml-2 text-gray-700 dark:text-gray-300">Flat price</span>
          </label>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <FormField 
            label="Charge name" 
            required={true}
            error={touched.name && errors.name}
          >
            <input
              type="text"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter charge name"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </FormField>
          
          <FormField 
            label={`Charges in ${values.type === 'percent' ? 'percent' : 'amount'}`}
            required={true}
            error={touched.value && errors.value}
          >
            <div className="flex items-center">
              {values.type === 'flat' && (
                <span className="inline-flex items-center px-3 py-2 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 sm:text-sm">
                  ₹
                </span>
              )}
              <input
                type="text"
                name="value"
                value={values.value}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={values.type === 'percent' ? "Charge" : "Amount"}
                className={`${values.type === 'flat' ? 'rounded-l-none' : ''} w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
              />
              {values.type === 'percent' && (
                <span className="ml-2">%</span>
              )}
            </div>
          </FormField>
        </div>
      </div>
    </Modal>
  );
};

export default ExtraChargesSection;