import React, { useState } from 'react';
import { FiSave } from 'react-icons/fi';

const StoreTimings = () => {
  // State for storing each day's settings
  const [days, setDays] = useState([
    { id: 'sunday', name: 'Sunday', isOpen: true, hours: '24 hours', isDropdownOpen: false },
    { id: 'monday', name: 'Monday', isOpen: true, hours: '24 hours', isDropdownOpen: false },
    { id: 'tuesday', name: 'Tuesday', isOpen: true, hours: '24 hours', isDropdownOpen: false },
    { id: 'wednesday', name: 'Wednesday', isOpen: true, hours: '24 hours', isDropdownOpen: false },
    { id: 'thursday', name: 'Thursday', isOpen: true, hours: '24 hours', isDropdownOpen: false },
    { id: 'friday', name: 'Friday', isOpen: true, hours: '24 hours', isDropdownOpen: false },
    { id: 'saturday', name: 'Saturday', isOpen: true, hours: '24 hours', isDropdownOpen: false }
  ]);

  // Time options for dropdown
  const timeOptions = [
    '24 hours',
    '01:30 AM',
    '02:00 AM',
    '02:30 AM',
    '03:00 AM',
    '03:30 AM',
    '04:00 AM',
    '04:30 AM',
    '05:00 AM',
    '05:30 AM',
    '06:00 AM',
    '06:30 AM',
    '07:00 AM',
    '07:30 AM',
    '08:00 AM',
    '08:30 AM',
    '09:00 AM',
    '09:30 AM',
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '11:30 AM',
    '12:00 PM',
    '12:30 PM',
    '01:00 PM',
    '01:30 PM',
    '02:00 PM',
    '02:30 PM',
    '03:00 PM',
    '03:30 PM',
    '04:00 PM',
    '04:30 PM',
    '05:00 PM',
    '05:30 PM',
    '06:00 PM',
    '06:30 PM',
    '07:00 PM',
    '07:30 PM',
    '08:00 PM',
    '08:30 PM',
    '09:00 PM',
    '09:30 PM',
    '10:00 PM',
    '10:30 PM',
    '11:00 PM',
    '11:30 PM'
  ];

  // Toggle a day's open/closed status
  const toggleDayStatus = (id) => {
    setDays(days.map(day => 
      day.id === id ? { ...day, isOpen: !day.isOpen } : day
    ));
  };

  // Toggle dropdown for a specific day
  const toggleDropdown = (id) => {
    setDays(days.map(day => 
      day.id === id 
        ? { ...day, isDropdownOpen: !day.isDropdownOpen } 
        : { ...day, isDropdownOpen: false }
    ));
  };

  // Set hours for a specific day
  const setHours = (id, hours) => {
    setDays(days.map(day => 
      day.id === id ? { ...day, hours, isDropdownOpen: false } : day
    ));
  };

  // Handle save button click
  const handleSave = () => {
    console.log('Saving store timings:', days);
    // In a real application, you would send this data to your backend
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Store timings</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Your store will be automatically switched online/offline based on the hours you choose.
        </p>
      </div>

      <div className="space-y-4">
        {days.map((day) => (
          <div key={day.id} className="flex items-center">
            <div className="w-32">
              <span className="text-gray-700 dark:text-gray-300">{day.name}</span>
            </div>
            
            <div className="mx-6">
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={day.isOpen} 
                  onChange={() => toggleDayStatus(day.id)} 
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-500"></div>
              </label>
            </div>
            
            <div className="flex-1">
              {day.isOpen && (
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown(day.id)}
                    className="px-4 py-2 w-36 border border-gray-300 dark:border-gray-600 rounded-md text-left text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 focus:outline-none"
                  >
                    {day.hours}
                  </button>
                  
                  {day.isDropdownOpen && (
                    <div className="absolute z-10 mt-1 w-36 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {timeOptions.map((time) => (
                        <button
                          key={time}
                          onClick={() => setHours(day.id, time)}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
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
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center"
        >
          <FiSave className="mr-2" /> Save
        </button>
      </div>
    </div>
  );
};

export default StoreTimings;