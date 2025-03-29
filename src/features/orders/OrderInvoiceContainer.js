// src/features/orders/components/OrderInvoiceContainer.js
import React, { useState } from 'react';
import { FiPrinter, FiX, FiCheck, FiDownload, FiMail } from 'react-icons/fi';
import InvoiceComponent from './InvoiceComponent';

/**
 * Default store information if none provided
 */
const DEFAULT_STORE_INFO = {
  name: 'MyShop Store',
  address: '123 Commerce St, Business City, 12345',
  phone: '+1 (555) 123-4567',
  email: 'support@myshop.com',
  website: 'www.myshop.com'
};

/**
 * Container component for order invoice functionality
 * Manages the visibility of the invoice and handles invoice actions
 */
const OrderInvoiceContainer = ({ order, storeInfo = DEFAULT_STORE_INFO }) => {
  const [showInvoice, setShowInvoice] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isEmailing, setIsEmailing] = useState(false);
  
  // Function to handle downloading invoice as PDF
  const handleDownloadPDF = () => {
    setIsDownloading(true);
    
    // Simulate download process
    setTimeout(() => {
      setIsDownloading(false);
      // In a real implementation, you would call a PDF generation service
      console.log('Downloading PDF for order:', order.orderNumber);
    }, 2000);
  };
  
  // Function to handle sending invoice via email
  const handleEmailInvoice = () => {
    setIsEmailing(true);
    
    // Simulate email sending process
    setTimeout(() => {
      setIsEmailing(false);
      setEmailSent(true);
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setEmailSent(false);
      }, 5000);
      
      // In a real implementation, you would call an email service
      console.log('Emailing invoice for order:', order.orderNumber, 'to:', order.customer.email);
    }, 2000);
  };
  
  return (
    <div className="mt-6">
      {!showInvoice ? (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowInvoice(true)}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            <FiPrinter className="mr-2" />
            View & Print Invoice
          </button>
          
          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            {isDownloading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Downloading...
              </>
            ) : (
              <>
                <FiDownload className="mr-2" />
                Download Invoice
              </>
            )}
          </button>
          
          <button
            onClick={handleEmailInvoice}
            disabled={isEmailing}
            className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            {isEmailing ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </>
            ) : (
              <>
                <FiMail className="mr-2" />
                Email Invoice
              </>
            )}
          </button>
        </div>
      ) : (
        <div>
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Invoice for Order #{order.orderNumber}
            </h3>
            <button
              onClick={() => setShowInvoice(false)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <FiX size={20} />
            </button>
          </div>
          
          <InvoiceComponent 
            order={order} 
            storeInfo={storeInfo} 
            onDownload={handleDownloadPDF}
            onEmail={handleEmailInvoice}
            isDownloading={isDownloading}
            isEmailing={isEmailing}
          />
        </div>
      )}
      
      {/* Success message for email sent */}
      {emailSent && (
        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded-md">
          <div className="flex items-center">
            <FiCheck className="text-green-500 mr-2" />
            <span className="text-green-700 dark:text-green-300">
              Invoice successfully sent to {order.customer.email}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
  export default OrderInvoiceContainer;