// src/components/StoreSettings/SettingsSidebarItem.js
import React from 'react';

const SettingsSidebarItem = ({ item, isActive, onClick }) => {
  return (
    <div
      className={`flex items-center p-3 rounded-md cursor-pointer ${
        isActive
          ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border-l-4 border-primary-600 dark:border-primary-400 pl-2"
          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
      }`}
      onClick={onClick}
    >
      {item.icon}
      <span className="ml-3">{item.name}</span>
    </div>
  );
};

export default SettingsSidebarItem;