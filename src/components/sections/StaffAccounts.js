// src/components/sections/StaffAccounts.js
import React, { useState } from 'react';
import BaseSection from './BaseSection';
import { Button } from '../ui/Button';
import EmptyState from '../ui/EmptyState';
import AddStaffModal from '../modals/AddStaffModal';
import { Card } from '../ui/Card';
import { SearchInput } from '../ui/SearchInput';
import { FiMoreVertical, FiUser, FiMail, FiPhone } from 'react-icons/fi';

const StaffAccounts = () => {
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [staffMembers, setStaffMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddStaff = (staffData) => {
    // In a real app, this would be an API call
    const newStaff = {
      id: Date.now(),
      ...staffData,
      dateAdded: new Date().toLocaleDateString()
    };
    
    setStaffMembers([...staffMembers, newStaff]);
    setShowAddStaffModal(false);
  };

  // Render the empty state if no staff members exist
  if (staffMembers.length === 0) {
    return (
      <BaseSection>
        <EmptyState
          imageUrl="/api/placeholder/80/80"
          title="Add your staff members"
          description="Start inviting your staff members to access and manage your store operations."
          buttonText="Add staff"
          onButtonClick={() => setShowAddStaffModal(true)}
          linkText="Learn more about staff accounts"
          linkUrl="#"
        />
        
        {/* Add Staff Modal */}
        <AddStaffModal 
          isOpen={showAddStaffModal} 
          closeModal={() => setShowAddStaffModal(false)}
          onSubmit={handleAddStaff}
        />
      </BaseSection>
    );
  }

  // Filter staff members based on search query
  const filteredStaff = staffMembers.filter(staff => 
    staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staff.contact.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Render staff list if staff members exist
  return (
    <BaseSection
      title="Staff Accounts"
      description="Manage staff access and permissions for your store."
      actions={
        <Button onClick={() => setShowAddStaffModal(true)}>
          Add staff
        </Button>
      }
    >
      <div className="mb-6">
        <SearchInput
          placeholder="Search staff by name or email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="space-y-4">
        {filteredStaff.map(staff => (
          <Card key={staff.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-gray-100 dark:bg-gray-700 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <FiUser className="text-gray-500 dark:text-gray-400 h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{staff.name}</h3>
                  <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
                    {staff.contact.includes('@') ? (
                      <>
                        <FiMail className="mr-1" />
                        <span>{staff.contact}</span>
                      </>
                    ) : (
                      <>
                        <FiPhone className="mr-1" />
                        <span>{staff.contact}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded text-xs font-medium mr-4">
                  {staff.role || 'Staff'}
                </span>
                <button className="text-gray-500 dark:text-gray-400">
                  <FiMoreVertical />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Staff Modal */}
      <AddStaffModal 
        isOpen={showAddStaffModal} 
        closeModal={() => setShowAddStaffModal(false)}
        onSubmit={handleAddStaff}
      />
    </BaseSection>
  );
};

export default StaffAccounts;