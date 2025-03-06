// src/components/StoreSettings/SettingsSidebar.js
import React from 'react';
import { settingsNavItems } from './settingsConfig';
import SettingsSidebarItem from './SettingsSidebarItem';

const SettingsSidebar = ({ activeSetting, onSettingChange }) => {
  return (
    <div className="w-64 bg-white dark:bg-gray-800 shadow-sm border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Store settings</h2>
        <div className="space-y-1">
          {settingsNavItems.map((item) => (
            <SettingsSidebarItem
              key={item.id}
              item={item}
              isActive={activeSetting === item.id}
              onClick={() => onSettingChange(item.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsSidebar;