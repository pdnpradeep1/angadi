// src/features/common/SuccessAlert.js
import React, { useEffect, useState } from 'react';
import { FiCheckCircle, FiX } from 'react-icons/fi';

/**
 * Reusable success alert component with auto-dismiss
 */
const SuccessAlert = ({ message, duration = 3000, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto-dismiss the alert after the specified duration
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onDismiss) onDismiss();
    }, duration);

    // Clear timeout if component unmounts
    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  if (!isVisible) return null;

  return (
    <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-md border-l-4 border-green-500 dark:border-green-700 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <FiCheckCircle className="mr-2 text-green-500 flex-shrink-0" />
          <span className="text-green-700 dark:text-green-300 text-sm font-medium">
            {message}
          </span>
        </div>
        <button 
          onClick={() => {
            setIsVisible(false);
            if (onDismiss) onDismiss();
          }}
          className="text-green-500 hover:text-green-700 dark:hover:text-green-300 focus:outline-none"
          aria-label="Dismiss"
        >
          <FiX size={18} />
        </button>
      </div>
    </div>
  );
};

export default SuccessAlert;