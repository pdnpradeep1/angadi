// src/components/StoreSettings/SettingsContent.js
import React, { Suspense, lazy } from 'react';
import { settingsComponentMap } from './settingsConfig';

// Lazy load section components to improve performance
const lazyLoad = (componentName) => {
  return lazy(() => import(`../sections/${componentName}`));
};

// Create a mapping of lazy-loaded components
const LazyComponents = Object.entries(settingsComponentMap).reduce((acc, [key, componentName]) => {
  try {
    acc[key] = lazyLoad(componentName);
  } catch (error) {
    console.error(`Failed to load component: ${componentName}`, error);
  }
  return acc;
}, {});

const SettingsContent = ({ activeSetting, openModal }) => {
  // Get the component for the active setting
  const ActiveComponent = LazyComponents[activeSetting];

  return (
    <div className="flex-1 overflow-auto bg-white dark:bg-gray-900">
      <Suspense fallback={<div className="p-6 text-center">Loading...</div>}>
        {ActiveComponent ? (
          <ActiveComponent openModal={openModal} />
        ) : (
          <div className="flex items-center justify-center h-full p-6">
            Select a setting from the sidebar or this section is under development.
          </div>
        )}
      </Suspense>
    </div>
  );
};

export default SettingsContent;