// src/features/orders/OrderDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  FiArrowLeft, 
  FiPackage, 
  FiMapPin, 
  FiCreditCard, 
  FiUser, 
  FiCalendar,
  FiTruck,
  FiEdit,
  FiInfo
} from 'react-icons/fi';
import { formatCurrency } from '../../utils/currencyUtils';
import { formatDate } from '../../utils/date-utils';
import { getStatusBadge } from '../../utils/status-badge-utils';
import OrderInvoiceContainer from './OrderInvoiceContainer';

const OrderDetail = () => {
  const { storeId, orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Store information - In a real app, this would come from a store context or API
  const storeInfo = {
    name: "MyShop Store",
    address: "123 Commerce St, Business City, 12345",
    phone: "+1 (555) 123-4567", 
    email: "support@myshop.com",
    website: "www.myshop.com",
    gst: "GST1234567890" // Optional GST number
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // In a real application, you would fetch from an API
        // const response = await api.get(`/api/orders/${orderId}`);
        // setOrder(response.data);
        
        // Mock data for demonstration
        setTimeout(() => {
          setOrder(getMockOrderData(orderId));
          setLoading(false);
        }, 800);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError('Failed to load order details. Please try again.');
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        <span className="ml-3 text-lg text-gray-600 dark:text-gray-400">Loading order details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="mb-4 text-red-500">
          <FiInfo size={48} className="mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Error Loading Order</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
        <button
          onClick={() => navigate(`/store-dashboard/${storeId}/orders/all`)}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6 text-center">
        <div className="mb-4 text-gray-400">
          <FiPackage size={48} className="mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Order Not Found</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          The requested order could not be found or you may not have permission to view it.
        </p>
        <button
          onClick={() => navigate(`/store-dashboard/${storeId}/orders/all`)}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header with back button */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate(`/store-dashboard/${storeId}/orders/all`)}
            className="mr-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <FiArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Order #{order.orderNumber}
          </h1>
        </div>
        <div className="flex items-center">
          {getStatusBadge(order.status, { type: 'default' })}
          <button
            className="ml-4 inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <FiEdit className="mr-2 -ml-1" size={16} />
            Edit Order
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content - order details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Summary Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Order Summary
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Order Date</p>
                <p className="font-medium text-gray-900 dark:text-white flex items-center">
                  <FiCalendar className="mr-1" size={14} />
                  {formatDate(order.orderDate, { type: 'datetime' })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Payment Method</p>
                <p className="font-medium text-gray-900 dark:text-white flex items-center">
                  <FiCreditCard className="mr-1" size={14} />
                  {order.paymentMethod}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Customer</p>
                <p className="font-medium text-gray-900 dark:text-white flex items-center">
                  <FiUser className="mr-1" size={14} />
                  {order.customer.name}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Shipping Method</p>
                <p className="font-medium text-gray-900 dark:text-white flex items-center">
                  <FiTruck className="mr-1" size={14} />
                  {order.shippingMethod}
                </p>
              </div>
            </div>
            
            {/* Add the Invoice Component */}
            <OrderInvoiceContainer 
              order={order} 
              storeInfo={storeInfo}
            />
          </div>

          {/* Order Items Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Order Items
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Product
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {order.items.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {item.imageUrl ? (
                            <img 
                              src={item.imageUrl} 
                              alt={item.name} 
                              className="h-10 w-10 rounded-md object-cover mr-4" 
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-4">
                              <FiPackage className="text-gray-500 dark:text-gray-400" />
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">{item.name}</div>
                            {item.variant && (
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {item.variant}
                              </div>
                            )}
                            {item.sku && (
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                SKU: {item.sku}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600 dark:text-gray-400">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600 dark:text-gray-400">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900 dark:text-white">
                        {formatCurrency(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Order Summary */}
            <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4">
              <div className="flex flex-col items-end">
                <div className="w-full max-w-xs">
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="text-gray-900 dark:text-white">{formatCurrency(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                    <span className="text-gray-900 dark:text-white">{formatCurrency(order.shippingCost)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600 dark:text-gray-400">Discount</span>
                      <span className="text-green-600 dark:text-green-400">-{formatCurrency(order.discount)}</span>
                    </div>
                  )}
                  {order.tax > 0 && (
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600 dark:text-gray-400">Tax</span>
                      <span className="text-gray-900 dark:text-white">{formatCurrency(order.tax)}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 border-t border-gray-200 dark:border-gray-700 mt-2">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(order.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - shipping, customer info, notes */}
        <div className="lg:col-span-1 space-y-6">
          {/* Customer Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <FiUser className="mr-2" /> Customer
            </h2>
            <div className="space-y-4">
              <p className="font-medium text-gray-900 dark:text-white">
                {order.customer.name}
              </p>
              <p className="text-gray-600 dark:text-gray-400 flex items-center">
                <FiMapPin className="mr-2" size={14} />
                {order.customer.email}
              </p>
              {order.customer.phone && (
                <p className="text-gray-600 dark:text-gray-400">
                  {order.customer.phone}
                </p>
              )}
              <Link 
                to={`/store-dashboard/${storeId}/audience?email=${encodeURIComponent(order.customer.email)}`}
                className="text-primary-600 dark:text-primary-400 hover:underline text-sm"
              >
                View Customer Profile
              </Link>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <FiMapPin className="mr-2" /> Shipping Address
            </h2>
            <div className="space-y-2">
              <p className="font-medium text-gray-900 dark:text-white">
                {order.shippingAddress.name}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                {order.shippingAddress.line1}
              </p>
              {order.shippingAddress.line2 && (
                <p className="text-gray-600 dark:text-gray-400">
                  {order.shippingAddress.line2}
                </p>
              )}
              <p className="text-gray-600 dark:text-gray-400">
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                {order.shippingAddress.country}
              </p>
              {order.shippingAddress.phone && (
                <p className="text-gray-600 dark:text-gray-400">
                  {order.shippingAddress.phone}
                </p>
              )}
            </div>
          </div>

          {/* Order Notes */}
          {order.notes && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <FiInfo className="mr-2" /> Notes
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {order.notes}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Mock data function
const getMockOrderData = (orderId) => {
  return {
    id: orderId,
    orderNumber: "ORD-" + orderId,
    status: "Processing",
    orderDate: "2025-03-15T10:30:00",
    customer: {
      id: 123,
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567"
    },
    shippingAddress: {
      name: "John Doe",
      line1: "123 Main Street",
      line2: "Apt 4B",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "United States",
      phone: "+1 (555) 123-4567"
    },
    paymentMethod: "Credit Card",
    shippingMethod: "Standard Shipping",
    items: [
      {
        id: 1,
        name: "Premium T-Shirt",
        price: 24.99,
        quantity: 2,
        imageUrl: "https://via.placeholder.com/150?text=T-Shirt",
        variant: "Large / Blue",
        sku: "TS-001-LB"
      },
      {
        id: 2,
        name: "Classic Jeans",
        price: 59.99,
        quantity: 1,
        imageUrl: "https://via.placeholder.com/150?text=Jeans",
        variant: "32 / Black",
        sku: "CJ-002-32B"
      },
      {
        id: 3,
        name: "Running Shoes",
        price: 89.99,
        quantity: 1,
        imageUrl: "https://via.placeholder.com/150?text=Shoes",
        variant: "10 / White",
        sku: "RS-003-10W"
      }
    ],
    subtotal: 199.96,
    shippingCost: 9.99,
    tax: 16.00,
    discount: 20.00,
    total: 205.95,
    notes: "Customer requested gift wrapping and delivery before March 20.",
    transactionId: "TXN-12345678"
  };
};

export default OrderDetail;