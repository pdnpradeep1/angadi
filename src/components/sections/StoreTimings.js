// src/components/sections/StoreTimings.js
import React, { useState } from 'react';
import { FiSave, FiChevronDown } from 'react-icons/fi';
import BaseSection from '../ui/BaseSection';
import { Button } from '../ui/Button';
import { ToggleSwitch } from '../ui/ToggleSwitch';
import useForm from '../../hooks/useForm';

const StoreTimings = () => {
  const [showDropdown, setShowDropdown] = useState(null);
  
  // Time options for dropdown
  const timeOptions = [
    '24 hours',
    '01:30 AM', '02:00 AM', '02:30 AM', '03:00 AM', '03:30 AM',
    '04:00 AM', '04:30 AM', '05:00 AM', '05:30 AM', '06:00 AM',
    '06:30 AM', '07:00 AM', '07:30 AM', '08:00 AM', '08:30 AM',
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM',
    '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM',
    '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM',
    '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM', '09:00 PM',
    '09:30 PM', '10:00 PM', '10:30 PM', '11:00 PM', '11:30 PM'
  ];

  // Initial days data
  const initialValues = {
    sunday: { isOpen: true, hours: '24 hours' },
    monday: { isOpen: true, hours: '24 hours' },
    tuesday: { isOpen: true, hours: '24 hours' },
    wednesday: { isOpen: true, hours: '24 hours' },
    thursday: { isOpen: true, hours: '24 hours' },
    friday: { isOpen: true, hours: '24 hours' },
    saturday: { isOpen: true, hours: '24 hours' }
  };

  // Form handling
  const { 
    values, 
    setValue, 
    handleSubmit,
    isDirty,
    isSubmitting 
  } = useForm(
    initialValues, 
    null,
    (formData) => {
      console.log('Saving store timings:', formData);
      // API call would go here
    }
  );

  // Toggle day open/closed status
  const toggleDayStatus = (day) => {
    setValue(day, {
      ...values[day],
      isOpen: !values[day].isOpen
    });
  };

  // Toggle dropdown for a specific day
  const toggleDropdown = (day) => {
    setShowDropdown(showDropdown === day ? null : day);
  };

  // Set hours for a specific day
  const setHours = (day, hours) => {
    setValue(day, {
      ...values[day],
      hours
    });
    setShowDropdown(null);
  };

  // Day names mapping for display
  const dayNames = {
    sunday: 'Sunday',
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday'
  };

  return (
    <BaseSection
      title="Store timings"
      description="Your store will be automatically switched online/offline based on the hours you choose."
    >
      <div className="space-y-4">
        {Object.keys(values).map((day) => (
          <div key={day} className="flex items-center">
            <div className="w-32">
              <span className="text-gray-700 dark:text-gray-300">{dayNames[day]}</span>
            </div>
            
            <div className="mx-6">
              <ToggleSwitch 
                checked={values[day].isOpen} 
                onChange={() => toggleDayStatus(day)}
                labelPosition="none"
              />
            </div>
            
            <div className="flex-1">
              {values[day].isOpen && (
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown(day)}
                    className="px-4 py-2 w-36 border border-gray-300 dark:border-gray-600 rounded-md text-left text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 focus:outline-none flex justify-between items-center"
                  >
                    <span>{values[day].hours}</span>
                    <FiChevronDown className="h-4 w-4 ml-2" />
                  </button>
                  
                  {showDropdown === day && (
                    <div className="absolute z-10 mt-1 w-36 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {timeOptions.map((time) => (
                        <button
                          key={time}
                          onClick={() => setHours(day, time)}
                          className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                            values[day].hours === time 
                              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                              : 'text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={!isDirty || isSubmitting}
          leftIcon={<FiSave className="mr-2" />}
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </BaseSection>
  );
};

export default StoreTimings;