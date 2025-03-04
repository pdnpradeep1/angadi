;import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  FiArrowLeft, 
  FiPackage, 
  FiUser, 
  FiMapPin, 
  FiCalendar,
  FiTruck,
  FiCheckCircle,
  FiAlertCircle,
  FiRefreshCw,
  FiClock,
  FiSend,
  FiPrinter,
  FiDownload
} from "react-icons/fi";
import axios from "axios";

const DeliveryDetail = () => {
  const { storeId, deliveryId } = useParams();
  const navigate = useNavigate();
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateStatus, setUpdateStatus] = useState('');
  const [trackingHistory, setTrackingHistory] = useState([]);
  
  useEffect(() => {
    fetchDeliveryDetails();
  }, [deliveryId]);
  
  const fetchDeliveryDetails = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.get(`http://localhost:8080/delivery/${deliveryId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setDelivery(response.data);
      
      // Fetch tracking history
      const historyResponse = await axios.get(`http://localhost:8080/delivery/${deliveryId}/history`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setTrackingHistory(historyResponse.data);
    } catch (err) {
      console.error('Error fetching delivery details:', err);
      setError('Failed to load delivery details. Please try again.');
      
      // For development, use mock data if API fails
      if (process.env.NODE_ENV === 'development') {
        const mockDelivery = generateMockDelivery(deliveryId);
        setDelivery(mockDelivery);
        setTrackingHistory(generateMockTrackingHistory(deliveryId));
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function to generate mock delivery data for development
  const generateMockDelivery = (id) => {
    return {
      id: parseInt(id),
      trackingNumber: `TRK${100000 + parseInt(id)}`,
      orderNumber: `ORD-${1000 + parseInt(id)}`,
      orderLink: `/store-dashboard/${storeId}/orders/view/${1000 + parseInt(id)}`,
      customerName: 'John Doe',
      customerEmail: 'john.doe@example.com',
      customerPhone: '+91 98765 43210',
      carrierName: 'Express Logistics',
      carrierPhone: '+91 87654 32109',
      carrierWebsite: 'https://expresslogistics.com',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      actualDelivery: null,
      status: 'INTRANSIT',
      weight: '2.5 kg',
      dimensions: '30 x 20 x 10 cm',
      shippingMethod: 'Standard',
      signature: true,
      notes: 'Please handle with care. Fragile items inside.',
      shippingAddress: {
        name: 'John Doe',
        addressLine1: '123 Main Street',
        addressLine2: 'Apartment 4B',
        city: 'Bangalore',
        state: 'Karnataka',
        postalCode: '560001',
        country: 'India'
      },
      items: [
        {
          id: 1,
          productName: 'Premium Kaju Chikki',
          quantity: 2,
          weight: '0.5 kg',
          image: '/api/placeholder/50/50'
        },
        {
          id: 2,
          productName: 'Dry Fruits Mix',
          quantity: 1,
          weight: '1.5 kg',
          image: '/api/placeholder/50/50'
        }
      ]
    };
  };
  
  const generateMockTrackingHistory = (id) => {
    return [
      {
        id: 1,
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Order Placed',
        location: 'Online',
        description: 'Order has been placed and payment received.'
      },
      {
        id: 2,
        timestamp: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Processing',
        location: 'Fulfillment Center, Bangalore',
        description: 'Order is being prepared for shipment.'
      },
      {
        id: 3,
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Shipped',
        location: 'Fulfillment Center, Bangalore',
        description: 'Package has been picked up by carrier.'
      },
      {
        id: 4,
        timestamp: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'In Transit',
        location: 'Bangalore Sorting Facility',
        description: 'Package is in transit to the next facility.'
      },
      {
        id: 5,
        timestamp: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Out for Delivery',
        location: 'Local Delivery Center',
        description: 'Package is out for delivery.'
      }
    ];
  };
  
  const handleUpdateStatus = async (newStatus) => {
    setUpdateLoading(true);
    setUpdateStatus('');
    
    try {
      const token = localStorage.getItem('jwtToken');
      await axios.put(`http://localhost:8080/delivery/${deliveryId}/status`, 
        { status: newStatus },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Update local state to reflect the change
      setDelivery({
        ...delivery,
        status: newStatus
      });
      
      // If status is DELIVERED, set actual delivery date
      if (newStatus === 'DELIVERED') {
        setDelivery({
          ...delivery,
          status: newStatus,
          actualDelivery: new Date().toISOString()
        });
      }
      
      // Refresh tracking history
      fetchDeliveryDetails();
      
      setUpdateStatus('success');
    } catch (err) {
      console.error('Error updating delivery status:', err);
      setUpdateStatus('error');
    } finally {
      setUpdateLoading(false);
      
      // Clear status message after 3 seconds
      setTimeout(() => {
        setUpdateStatus('');
      }, 3000);
    }
  };
  
  const handlePrintDetails = () => {
    window.print();
  };
  
  const handleSendUpdate = async (type) => {
    try {
      const token = localStorage.getItem('jwtToken');
      await axios.post(`http://localhost:8080/delivery/${deliveryId}/notify`, 
        { notificationType: type },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      alert(`${type.charAt(0).toUpperCase() + type.slice(1)} notification sent to customer.`);
    } catch (err) {
      console.error('Error sending notification:', err);
      alert('Failed to send notification. Please try again.');
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const getStatusBadge = (status) => {
    let bgColor, textColor, icon;
    
    switch (status) {
      case 'PENDING':
        bgColor = 'bg-yellow-100 dark:bg-yellow-900/30';
        textColor = 'text-yellow-800 dark:text-yellow-300';
        icon = <FiClock className="mr-2" />;
        break;
      case 'INTRANSIT':
        bgColor = 'bg-blue-100 dark:bg-blue-900/30';
        textColor = 'text-blue-800 dark:text-blue-300';
        icon = <FiTruck className="mr-2" />;
        break;
      case 'DELIVERED':
        bgColor = 'bg-green-100 dark:bg-green-900/30';
        textColor = 'text-green-800 dark:text-green-300';
        icon = <FiCheckCircle className="mr-2" />;
        break;
      case 'CANCELLED':
        bgColor = 'bg-red-100 dark:bg-red-900/30';
        textColor = 'text-red-800 dark:text-red-300';
        icon = <FiAlertCircle className="mr-2" />;
        break;
      case 'RETURNED':
        bgColor = 'bg-purple-100 dark:bg-purple-900/30';
        textColor = 'text-purple-800 dark:text-purple-300';
        icon = <FiRefreshCw className="mr-2" />;
        break;
      default:
        bgColor = 'bg-gray-100 dark:bg-gray-900/30';
        textColor = 'text-gray-800 dark:text-gray-300';
        icon = <FiPackage className="mr-2" />;
    }
    
    return (
      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${bgColor} ${textColor}`}>
        {icon} {status.charAt(0) + status.slice(1).toLowerCase()}
      </div>
    );
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (error || !delivery) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-8 text-center max-w-lg mx-auto">
          <FiAlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">Error Loading Delivery Details</h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">{error || "The delivery information could not be found."}</p>
          <div className="mt-6">
            <button
              onClick={() => navigate(`/store-dashboard/${storeId}/delivery/all`)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none"
            >
              <FiArrowLeft className="mr-2" /> Back to All Deliveries
            </button>
          </div>
        </div></div>
    );
  }
  
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-4 py-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center">
            <button
              onClick={() => navigate(`/store-dashboard/${storeId}/delivery/all`)}
              className="mr-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <FiArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                Tracking #{delivery.trackingNumber}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Order #{delivery.orderNumber} | {formatDate(delivery.createdAt)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {getStatusBadge(delivery.status)}
            
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrintDetails}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <FiPrinter className="mr-1" /> Print
              </button>
              
              <div className="relative group">
                <button
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <FiSend className="mr-1" /> Send Update
                </button>
                <div className="hidden group-hover:block absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700">
                  <div className="py-1">
                    <button
                      onClick={() => handleSendUpdate('email')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Send Email Update
                    </button>
                    <button
                      onClick={() => handleSendUpdate('sms')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Send SMS Update
                    </button>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => window.open(`${delivery.orderLink}`, '_blank')}
                className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-sm text-white bg-primary-600 hover:bg-primary-700"
              >
                View Order
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tracking History - Left Column */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                <FiTruck className="mr-2" /> Tracking History
              </h2>
            </div>
            
            {/* Status Timeline */}
            <div className="p-6">
              <div className="flow-root">
                <ul className="-mb-8">
                  {trackingHistory.map((event, eventIdx) => (
                    <li key={event.id}>
                      <div className="relative pb-8">
                        {eventIdx !== trackingHistory.length - 1 ? (
                          <span
                            className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"
                            aria-hidden="true"
                          />
                        ) : null}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center ring-8 ring-white dark:ring-gray-800">
                              <FiPackage className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-sm text-gray-900 dark:text-white font-medium">{event.status}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{event.description}</p>
                            </div>
                            <div className="text-right text-sm whitespace-nowrap">
                              <div className="text-gray-900 dark:text-white font-medium">
                                {formatDate(event.timestamp).split(',')[0]}
                              </div>
                              <div className="text-gray-500 dark:text-gray-400">
                                {formatDate(event.timestamp).split(',')[1]}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {event.location}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Update Status Section */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Update Delivery Status</h3>
              <div className="flex flex-wrap gap-2">
                {delivery.status !== 'PENDING' && (
                  <button
                    onClick={() => handleUpdateStatus('PENDING')}
                    disabled={updateLoading || delivery.status === 'PENDING'}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiClock className="mr-1" /> Mark as Pending
                  </button>
                )}
                
                {delivery.status !== 'INTRANSIT' && (
                  <button
                    onClick={() => handleUpdateStatus('INTRANSIT')}
                    disabled={updateLoading || delivery.status === 'INTRANSIT'}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiTruck className="mr-1" /> Mark as In Transit
                  </button>
                )}
                
                {delivery.status !== 'DELIVERED' && (
                  <button
                    onClick={() => handleUpdateStatus('DELIVERED')}
                    disabled={updateLoading || delivery.status === 'DELIVERED'}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-xs text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiCheckCircle className="mr-1" /> Mark as Delivered
                  </button>
                )}
                
                {delivery.status !== 'CANCELLED' && (
                  <button
                    onClick={() => handleUpdateStatus('CANCELLED')}
                    disabled={updateLoading || delivery.status === 'CANCELLED'}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-xs text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiAlertCircle className="mr-1" /> Mark as Cancelled
                  </button>
                )}
                
                {delivery.status !== 'RETURNED' && (
                  <button
                    onClick={() => handleUpdateStatus('RETURNED')}
                    disabled={updateLoading || delivery.status === 'RETURNED'}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-xs text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiRefreshCw className="mr-1" /> Mark as Returned
                  </button>
                )}
              </div>
              
              {updateLoading && (
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary-600 mr-2"></div>
                  Updating status...
                </div>
              )}
              
              {updateStatus === 'success' && (
                <div className="mt-2 text-xs text-green-600 dark:text-green-400">
                  Status updated successfully!
                </div>
              )}
              
              {updateStatus === 'error' && (
                <div className="mt-2 text-xs text-red-600 dark:text-red-400">
                  Failed to update status. Please try again.
                </div>
              )}
            </div>
          </div>
          
          {/* Package Contents */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden mt-6">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                <FiPackage className="mr-2" /> Package Contents
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Item
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Weight
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {delivery.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded">
                            {item.image && (
                              <img className="h-10 w-10 rounded" src={item.image} alt={item.productName} />
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{item.productName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{item.quantity}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{item.weight}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">Total Items: {delivery.items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">Total Weight: {delivery.weight}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Info Cards - Right Column */}
        <div className="space-y-6">
          {/* Delivery Info */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                <FiTruck className="mr-2" /> Delivery Information
              </h2>
            </div>
            
            <div className="px-6 py-4">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                    {getStatusBadge(delivery.status)}
                  </dd>
                </div>
                
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Shipping Method</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{delivery.shippingMethod}</dd>
                </div>
                
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Carrier</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{delivery.carrierName}</dd>
                </div>
                
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Carrier Contact</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{delivery.carrierPhone}</dd>
                </div>
                
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Shipping Date</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{formatDate(delivery.createdAt)}</dd>
                </div>
                
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Estimated Delivery</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{formatDate(delivery.estimatedDelivery)}</dd>
                </div>
                
                {delivery.actualDelivery && (
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Actual Delivery</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">{formatDate(delivery.actualDelivery)}</dd>
                  </div>
                )}
                
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Signature Required</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{delivery.signature ? 'Yes' : 'No'}</dd>
                </div>
                
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Package Dimensions</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{delivery.dimensions}</dd>
                </div>
                
                {delivery.notes && (
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Delivery Notes</dt>
                    <dd className="mt-1 text-sm text-gray-900 dark:text-white">{delivery.notes}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
          
          {/* Customer Info */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                <FiUser className="mr-2" /> Customer Information
              </h2>
            </div>
            
            <div className="px-6 py-4">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6">
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{delivery.customerName}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{delivery.customerEmail}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{delivery.customerPhone}</dd>
                </div>
              </dl>
            </div>
          </div>
          
          {/* Shipping Address */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                <FiMapPin className="mr-2" /> Shipping Address
              </h2>
            </div>
            
            <div className="px-6 py-4">
              <div className="text-sm text-gray-900 dark:text-white">
                <p className="font-medium">{delivery.shippingAddress.name}</p>
                <p className="mt-1">{delivery.shippingAddress.addressLine1}</p>
                {delivery.shippingAddress.addressLine2 && (
                  <p>{delivery.shippingAddress.addressLine2}</p>
                )}
                <p>{delivery.shippingAddress.city}, {delivery.shippingAddress.state} {delivery.shippingAddress.postalCode}</p>
                <p>{delivery.shippingAddress.country}</p>
              </div>
              
              <div className="mt-4">
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(
                    `${delivery.shippingAddress.addressLine1}, ${delivery.shippingAddress.city}, ${delivery.shippingAddress.state} ${delivery.shippingAddress.postalCode}, ${delivery.shippingAddress.country}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <FiMapPin className="mr-1" /> View on Map
                </a>
              </div>
            </div>
          </div>
          
          {/* Download Labels/Documents */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                <FiDownload className="mr-2" /> Documents
              </h2>
            </div>
            
            <div className="px-6 py-4">
              <div className="space-y-2">
                <button
                  className="w-full inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <FiDownload className="mr-2" /> Download Shipping Label
                </button>
                
                <button
                  className="w-full inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <FiDownload className="mr-2" /> Download Invoice
                </button>
                
                <button
                  className="w-full inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <FiDownload className="mr-2" /> Download Packing Slip
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeliveryDetail;