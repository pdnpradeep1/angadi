import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  FiArrowLeft, 
  FiPackage, 
  FiUser, 
  FiMapPin, 
  FiCreditCard, 
  FiCalendar,
  FiTruck,
  FiCheckCircle,
  FiAlertCircle,
  FiRotateCw,
  FiPrinter,
  FiDownload,
  FiSend,
  FiEye
} from "react-icons/fi";
import { apiService } from '../../api/config';
import { formatCurrency } from '../../utils/currencyUtils';
import { formatDate } from '../../utils/date-utils';
import { getStatusBadge } from '../../utils/status-badge-utils';

const OrderDetail = () => {
  const { storeId, orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateStatus, setUpdateStatus] = useState('');
  
  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);
  
  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const response = await apiService.get(`/orders/${orderId}`);
      setOrder(response.data);
    } catch (err) {
      console.error('Error fetching order details:', err);
      setError('Failed to load order details. Please try again.');
      
      // For development, use mock data if API fails
      if (process.env.NODE_ENV === 'development') {
        setOrder(generateMockOrder(orderId));
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function to generate mock order data for development
  const generateMockOrder = (id) => {
    return {
      id: parseInt(id),
      orderNumber: `ORD-${1000 + parseInt(id)}`,
      customerName: 'John Doe',
      customerEmail: 'john.doe@example.com',
      subtotal: 799.99,
      shippingCost: 10.00,
      tax: 8.00,
      discount: 0,
      totalAmount: 817.99,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      notes: 'Customer requested gift wrapping',
      paymentMethod: 'CASH_ON_DELIVERY',
      paymentStatus: 'PENDING',
      orderItems: [
        {
          id: 1,
          productName: 'iPhone 13',
          quantity: 1,
          price: 799.99,
          total: 799.99,
          productImageUrl: '/api/placeholder/50/50'
        }
      ],
      shippingAddressLine1: '123 Main Street',
      shippingAddressLine2: null,
      shippingCity: 'San Francisco',
      shippingState: 'CA',
      shippingPostalCode: '94105',
      shippingCountry: 'USA'
    };
  };
  
  const handleUpdateStatus = async (newStatus) => {
    setUpdateLoading(true);
    setUpdateStatus('');
    
    try {
      const token = localStorage.getItem('jwtToken');
      await axios.put(`http://localhost:8080/orders/${orderId}/status`, 
        { status: newStatus },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Update local state to reflect the change
      setOrder({
        ...order,
        status: newStatus
      });
      
      setUpdateStatus('success');
    } catch (err) {
      console.error('Error updating order status:', err);
      setUpdateStatus('error');
    } finally {
      setUpdateLoading(false);
      
      // Clear status message after 3 seconds
      setTimeout(() => {
        setUpdateStatus('');
      }, 3000);
    }
  };
  
  const handlePrintOrder = () => {
    window.print();
  };
  
  const handleDownloadInvoice = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.get(`http://localhost:8080/orders/${orderId}/invoice`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Invoice-${order.orderNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Error downloading invoice:', err);
      alert('Failed to download invoice. Please try again.');
    }
  };
  
  const handleSendEmail = async (type) => {
    try {
      const token = localStorage.getItem('jwtToken');
      await axios.post(`http://localhost:8080/orders/${orderId}/send-email`, 
        { type },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      alert(`${type} email sent to customer.`);
    } catch (err) {
      console.error('Error sending email:', err);
      alert('Failed to send email. Please try again.');
    }
  };
  
  const getPaymentStatusBadge = (status) => {
    let bgColor, textColor;
    
    switch (status) {
      case 'PAID':
        bgColor = 'bg-green-100 dark:bg-green-900/30';
        textColor = 'text-green-800 dark:text-green-300';
        break;
      case 'PENDING':
        bgColor = 'bg-yellow-100 dark:bg-yellow-900/30';
        textColor = 'text-yellow-800 dark:text-yellow-300';
        break;
      case 'FAILED':
        bgColor = 'bg-red-100 dark:bg-red-900/30';
        textColor = 'text-red-800 dark:text-red-300';
        break;
      case 'REFUNDED':
        bgColor = 'bg-purple-100 dark:bg-purple-900/30';
        textColor = 'text-purple-800 dark:text-purple-300';
        break;
      default:
        bgColor = 'bg-gray-100 dark:bg-gray-900/30';
        textColor = 'text-gray-800 dark:text-gray-300';
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
        {status}
      </span>
    );
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (error || !order) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-md">
          <FiAlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-2">Error Loading Order</h3>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-6">{error || 'Order not found'}</p>
          <button
            onClick={() => navigate(`/store-dashboard/${storeId}/orders/all`)}
            className="btn btn-primary w-full"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 p-4">
      {/* Order Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <button
              onClick={() => navigate(`/store-dashboard/${storeId}/orders/all`)}
              className="mr-4 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FiArrowLeft className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Order #{order.orderNumber}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 flex items-center text-sm mt-1">
                <FiCalendar className="mr-1" /> {formatDate(order.createdAt)}
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handlePrintOrder}
              className="btn btn-secondary flex items-center"
            >
              <FiPrinter className="mr-2" /> Print
            </button>
            <button
              onClick={handleDownloadInvoice}
              className="btn btn-secondary flex items-center"
            >
              <FiDownload className="mr-2" /> Invoice
            </button>
            <div className="relative">
              <button
                onClick={() => document.getElementById('emailDropdown').classList.toggle('hidden')}
                className="btn btn-secondary flex items-center"
              >
                <FiSend className="mr-2" /> Send Email
              </button>
              <div 
                id="emailDropdown" 
                className="hidden absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-10"
              >
                <div className="py-1" role="menu" aria-orientation="vertical">
                  <button
                    onClick={() => handleSendEmail('order_confirmation')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                    role="menuitem"
                  >
                    Order Confirmation
                  </button>
                  <button
                    onClick={() => handleSendEmail('shipping_confirmation')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                    role="menuitem"
                  >
                    Shipping Confirmation
                  </button>
                  <button
                    onClick={() => handleSendEmail('invoice')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                    role="menuitem"
                  >
                    Invoice
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Order Status and Actions */}
        <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Status</div>
            {getStatusBadge(order.status)}
          </div>
          
          <div className="flex flex-wrap gap-2">
            {order.status === 'PENDING' && (
              <button
                onClick={() => handleUpdateStatus('PROCESSING')}
                disabled={updateLoading}
                className="btn btn-primary flex items-center"
              >
                Process Order
              </button>
            )}
            {order.status === 'PROCESSING' && (
              <button
                onClick={() => handleUpdateStatus('SHIPPED')}
                disabled={updateLoading}
                className="btn btn-primary flex items-center"
              >
                Mark as Shipped
              </button>
            )}
            {order.status === 'SHIPPED' && (
              <button
                onClick={() => handleUpdateStatus('DELIVERED')}
                disabled={updateLoading}
                className="btn btn-primary flex items-center"
              >
                Mark as Delivered
              </button>
            )}
            {(order.status === 'PENDING' || order.status === 'PROCESSING') && (
              <button
                onClick={() => handleUpdateStatus('CANCELLED')}
                disabled={updateLoading}
                className="btn btn-secondary flex items-center"
              >
                Cancel Order
              </button>
            )}
            {updateStatus === 'success' && (
              <span className="text-green-600 dark:text-green-400 flex items-center">
                <FiCheckCircle className="mr-1" /> Updated
              </span>
            )}
            {updateStatus === 'error' && (
              <span className="text-red-600 dark:text-red-400 flex items-center">
                <FiAlertCircle className="mr-1" /> Failed
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Order Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Order Details & Items */}
        <div className="md:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Order Items
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {order.orderItems.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {item.productImageUrl ? (
                              <img 
                                className="h-10 w-10 rounded-md object-cover" 
                                src={item.productImageUrl} 
                                alt={item.productName} 
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                <FiPackage className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {item.productName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {formatCurrency(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Order Summary */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col items-end">
                <div className="text-sm text-gray-600 dark:text-gray-300 grid grid-cols-2 gap-x-4 gap-y-2 w-64">
                  <span>Subtotal:</span>
                  <span className="text-right">{formatCurrency(order.subtotal)}</span>
                  
                  <span>Shipping:</span>
                  <span className="text-right">{formatCurrency(order.shippingCost)}</span>
                  
                  <span>Tax:</span>
                  <span className="text-right">{formatCurrency(order.tax)}</span>
                  
                  {order.discount > 0 && (
                    <>
                      <span>Discount:</span>
                      <span className="text-right text-green-600 dark:text-green-400">
                        -{formatCurrency(order.discount)}
                      </span>
                    </>
                  )}
                  
                  <span className="font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-600">
                    Total:
                  </span>
                  <span className="text-right font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-600">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Notes Section */}
          {order.notes && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Order Notes
              </h2>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md border-l-4 border-yellow-400">
                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                  {order.notes}
                </p>
              </div>
            </div>
          )}
        </div>
        
        {/* Customer & Payment Info */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <FiUser className="mr-2 text-gray-500" /> Customer Information
            </h2>
            <div className="text-sm">
              <p className="font-medium text-gray-900 dark:text-white">{order.customerName}</p>
              <p className="text-gray-500 dark:text-gray-400 mt-1">{order.customerEmail}</p>
              <a
                href={`/store-dashboard/${storeId}/customers/${order.customerId}`}
                className="mt-4 inline-flex items-center text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500"
              >
                <FiEye className="mr-1" /> View Customer Profile
              </a>
            </div>
          </div>
          
          {/* Shipping Address */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <FiMapPin className="mr-2 text-gray-500" /> Shipping Address
            </h2>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <p>{order.shippingAddressLine1}</p>
              {order.shippingAddressLine2 && <p>{order.shippingAddressLine2}</p>}
              <p>
                {order.shippingCity}, {order.shippingState} {order.shippingPostalCode}
              </p>
              <p>{order.shippingCountry}</p>
            </div>
          </div>
          
          {/* Payment Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <FiCreditCard className="mr-2 text-gray-500" /> Payment Information
            </h2>
            <div className="text-sm">
              <p className="text-gray-500 dark:text-gray-400">Payment Method</p>
              <p className="font-medium text-gray-900 dark:text-white mb-4">{order.paymentMethod}</p>
              
              <p className="text-gray-500 dark:text-gray-400">Payment Status</p>
              <div className="mt-1">{getPaymentStatusBadge(order.paymentStatus)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;