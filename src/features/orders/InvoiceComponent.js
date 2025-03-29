import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { FiPrinter, FiDownload, FiMail, FiCalendar, FiMapPin, FiPhone, FiUser, FiPackage, FiCreditCard, FiShield } from 'react-icons/fi';
import { formatCurrency } from '../../utils/currencyUtils';
import { formatDate } from '../../utils/date-utils';

const InvoiceComponent = ({ 
  order, 
  storeInfo,
  onDownload,
  onEmail,
  isDownloading,
  isEmailing
}) => {
  const invoiceRef = useRef();

  // Function to handle printing
  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current,
    documentTitle: `Invoice-${order.orderNumber}`,
    onAfterPrint: () => console.log('Print successful')
  });

  // Calculate order subtotal
  const calculateSubtotal = () => {
    return order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  // Format order date
  const formattedDate = formatDate(order.orderDate, { type: 'datetime' });

  return (
    <div className="mb-6">
      {/* Action buttons for invoice */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={handlePrint}
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          <FiPrinter className="mr-2" />
          Print Invoice
        </button>
        <button
             onClick={onDownload}
              disabled={isDownloading} 
              className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50">
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
                            <FiMail className="mr-2" />
                            Email Invoice
                            </>
                            )}
          <FiDownload className="mr-2" />
          Download PDF
        </button>
        
        <button 
                onClick={onEmail}
                disabled={isEmailing}
                className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50">
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

      {/* Printable invoice content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        {/* Preview header - only visible on screen, not in print */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 print:hidden">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Invoice Preview
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            This is how your invoice will look when printed
          </p>
        </div>

        {/* Actual invoice content to be printed */}
        <div 
          ref={invoiceRef} 
          className="p-8 max-w-4xl mx-auto"
          style={{ fontFamily: 'Arial, sans-serif' }}
        >
          {/* Invoice Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">INVOICE</h1>
              <p className="text-gray-600">#{order.orderNumber}</p>
              <div className="flex items-center mt-2 text-gray-600">
                <FiCalendar className="mr-1" size={14} />
                <span>{formattedDate}</span>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold text-gray-900 mb-1">{storeInfo.name}</h2>
              <p className="text-gray-600">{storeInfo.address}</p>
              <p className="text-gray-600">{storeInfo.phone}</p>
              <p className="text-gray-600">{storeInfo.email}</p>
              {storeInfo.gst && (
                <p className="text-gray-600">GST: {storeInfo.gst}</p>
              )}
            </div>
          </div>

          {/* Customer & Order Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Customer Info */}
            <div className="border-t pt-4">
              <h3 className="text-md font-bold text-gray-800 mb-3 flex items-center">
                <FiUser className="mr-2" /> Customer Information
              </h3>
              <p className="font-medium text-gray-800">{order.customer.name}</p>
              <p className="text-gray-600">{order.customer.email}</p>
              <p className="text-gray-600">{order.customer.phone}</p>
            </div>

            {/* Shipping Address */}
            <div className="border-t pt-4">
              <h3 className="text-md font-bold text-gray-800 mb-3 flex items-center">
                <FiMapPin className="mr-2" /> Shipping Address
              </h3>
              <p className="font-medium text-gray-800">{order.shippingAddress.name}</p>
              <p className="text-gray-600">{order.shippingAddress.line1}</p>
              {order.shippingAddress.line2 && (
                <p className="text-gray-600">{order.shippingAddress.line2}</p>
              )}
              <p className="text-gray-600">
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
              </p>
              <p className="text-gray-600">{order.shippingAddress.country}</p>
              {order.shippingAddress.phone && (
                <p className="text-gray-600 flex items-center mt-1">
                  <FiPhone className="mr-1" size={14} />
                  {order.shippingAddress.phone}
                </p>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t pt-4 mb-8">
            <h3 className="text-md font-bold text-gray-800 mb-3 flex items-center">
              <FiPackage className="mr-2" /> Order Summary
            </h3>
            <div className="flex flex-wrap gap-4">
              <div className="bg-gray-50 rounded p-3 min-w-[150px]">
                <p className="text-sm text-gray-500">Order Number</p>
                <p className="font-medium text-gray-900">#{order.orderNumber}</p>
              </div>
              <div className="bg-gray-50 rounded p-3 min-w-[150px]">
                <p className="text-sm text-gray-500">Payment Method</p>
                <p className="font-medium text-gray-900 flex items-center">
                  <FiCreditCard className="mr-1" size={14} />
                  {order.paymentMethod}
                </p>
              </div>
              <div className="bg-gray-50 rounded p-3 min-w-[150px]">
                <p className="text-sm text-gray-500">Shipping Method</p>
                <p className="font-medium text-gray-900">{order.shippingMethod}</p>
              </div>
              <div className="bg-gray-50 rounded p-3 min-w-[150px]">
                <p className="text-sm text-gray-500">Order Status</p>
                <p className="font-medium text-gray-900">{order.status}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-8">
            <h3 className="text-md font-bold text-gray-800 mb-3">Order Items</h3>
            <div className="overflow-hidden border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center">
                          {/* Only show images in the screen preview, not in print */}
                          {item.imageUrl && (
                            <div className="h-12 w-12 flex-shrink-0 mr-4 print:hidden">
                              <img 
                                src={item.imageUrl} 
                                alt={item.name} 
                                className="h-12 w-12 rounded-md object-cover"
                              />
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-gray-900">{item.name}</div>
                            {item.sku && (
                              <div className="text-gray-500">SKU: {item.sku}</div>
                            )}
                            {item.variant && (
                              <div className="text-gray-500">{item.variant}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium text-right">
                        {formatCurrency(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Totals */}
          <div className="mb-8 flex justify-end">
            <div className="w-full max-w-xs">
              <div className="flex justify-between py-2 text-gray-600">
                <span>Subtotal</span>
                <span>{formatCurrency(calculateSubtotal())}</span>
              </div>
              <div className="flex justify-between py-2 text-gray-600">
                <span>Shipping</span>
                <span>{formatCurrency(order.shippingCost)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between py-2 text-gray-600">
                  <span>Discount</span>
                  <span>-{formatCurrency(order.discount)}</span>
                </div>
              )}
              {order.tax > 0 && (
                <div className="flex justify-between py-2 text-gray-600">
                  <span>Tax</span>
                  <span>{formatCurrency(order.tax)}</span>
                </div>
              )}
              <div className="flex justify-between py-3 text-lg font-bold border-t border-gray-200 mt-2">
                <span>Total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Terms and Notes */}
          <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-bold text-gray-800 mb-2">Terms & Conditions</h3>
              <p className="text-xs text-gray-600">
                Payment is due within 30 days. Late payments are subject to a 1.5% monthly finance charge.
                Products remain the property of {storeInfo.name} until payment is made in full.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-800 mb-2">Notes</h3>
              <p className="text-xs text-gray-600">
                {order.notes || 'Thank you for your business. We appreciate your trust in us.'}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-4 border-t text-center text-xs text-gray-500">
            <p className="mb-1">This is a computer-generated invoice and does not require a signature.</p>
            <p className="flex items-center justify-center">
              <FiShield className="mr-1" /> 
              Secure transaction verification code: {order.transactionId || `INV-${order.orderNumber}`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceComponent;