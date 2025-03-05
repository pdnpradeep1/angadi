// src/components/modals/AddStaffModal.js
import React, { useState } from 'react';
import Modal from '../ui/Modal';
import { FormField } from '../ui/FormField';
import { Button } from '../ui/Button';
import { FiChevronDown } from 'react-icons/fi';

const AddStaffModal = ({ isOpen, closeModal }) => {
  const [formData, setFormData] = useState({
    contact: '',
    name: '',
    role: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    // Validation and API call would go here
    console.log('Sending invite to:', formData);
    closeModal();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      title="Add staff"
      size="md"
    >
      <div className="space-y-4">
        <FormField 
          label="Email or mobile number" 
          required={true}
        >
          <input 
            type="text" 
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            placeholder="Enter email or mobile number" 
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </FormField>
        
        <FormField 
          label="Name" 
          required={true}
        >
          <input 
            type="text" 
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter name of the staff member" 
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </FormField>
        
        <FormField 
          label="Role" 
          required={true}
        >
          <div className="relative">
            <select 
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="" disabled selected>Select role</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager - Store</option>
              <option value="staff">Staff - Store</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
              <FiChevronDown className="h-4 w-4" />
            </div>
          </div>
        </FormField>
        
        <div className="pt-4">
          <Button 
            onClick={handleSubmit}
            className="w-full"
          >
            Send invite
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddStaffModal;