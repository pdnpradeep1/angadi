import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { 
  FiSearch, 
  FiFilter, 
  FiDownload, 
  FiTruck,
  FiBox,
  FiCheck,
  FiXCircle,
  FiCalendar,
  FiClock,
  FiRefreshCw,
  FiShoppingBag
} from "react-icons/fi";
import axios from "axios";

const DeliveryMainComponent = () => {
  const { storeId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get the status from the URL path
  const path = location.pathname;
  const statusMatch = path.match(/\/delivery\/([^/]+)/);
  const status = statusMatch ? statusMatch[1] : 'all';
  
  console.log("Current delivery status filter:", status);
  
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    customerEmail: '',
    deliveryPartner: ''
  });
  const [deliveryPartners, setDeliveryPartners] = useState([]);

  useEffect(() => {
    fetchDeliveries();
    fetchDeliveryPartners();
  }, [storeId, status, location.pathname]);

  const fetchDeliveryPartners = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      /* 
      // Real API call (commented out)
      const response = await axios.get(`http://localhost:8080/delivery/partners/${storeId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setDeliveryPartners(response.data);
      */
      
      // For development, use mock data
      setDeliveryPartners([
        { id: 1, name: "Express Logistics" },
        { id: 2, name: "Swift Delivery" },
        { id: 3, name: "Metro Couriers" },
        { id: 4, name: "City Express" },
      ]);
    } catch (err) {
      console.error('Error fetching delivery partners:', err);
    }
  };

  const fetchDeliveries = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('jwtToken');
      
      /* 
      // Real API call (commented out)
      // Build API URL with parameters
      let url = `http://localhost:8080/delivery/store/${storeId}?`;
      
      // Add status filter if not 'all'
      if (status !== 'all') {
        url += `&status=${status.toUpperCase()}`;
      }
      
      // Add search term if present
      if (searchTerm) {
        url += `&search=${searchTerm}`;
      }
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setDeliveries(response.data.content);
      */
      
      // For development, use mock data
      const mockDeliveries = generateMockDeliveries(10, status);
      setDeliveries(mockDeliveries);
      
    } catch (err) {
      console.error('Error fetching deliveries:', err);
      setError('Failed to load deliveries. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to generate mock delivery data for development
  const generateMockDeliveries = (count, statusFilter) => {
    const statuses = ['PENDING', 'INTRANSIT', 'DELIVERED', 'CANCELLED', 'RETURNED'];
    const carriers = ["Express Logistics", "Swift Delivery", "Metro Couriers", "City Express"];
    
    // If we have a specific status filter, use it
    const statusToUse = statusFilter && statusFilter !== 'all' 
      ? statusFilter.toUpperCase() 
      : null;
    
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      trackingNumber: `TRK${100000 + i}`,
      orderNumber: `ORD-${1000 + i}`,
      customer: {
        name: `Customer ${i + 1}`,
        email: `customer${i + 1}@example.com`
      },
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
      estimatedDelivery: new Date(Date.now() + Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000).toISOString(),
      amount: Math.floor(Math.random() * 500) + 50,
      status: statusToUse || statuses[Math.floor(Math.random() * statuses.length)],
      carrierName: carriers[Math.floor(Math.random() * carriers.length)],
      deliveryAddress: `${123 + i} Main St, City, State, 10000`,
      currentLocation: {
        latitude: 12.9716 + (Math.random() * 0.1 - 0.05),
        longitude: 77.5946 + (Math.random() * 0.1 - 0.05),
        address: `${100 + i} Main St, City, State`,
        lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 120) * 60 * 1000).toISOString()
      }
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const clearFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      customerEmail: '',
      deliveryPartner: ''
    });
    
    // Trigger a refetch
    fetchDeliveries();
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusBadge = (status) => {
    let bgColor, textColor, icon;
    
    switch (status) {
      case 'PENDING':
        bgColor = 'bg-yellow-100 dark:bg-yellow-900/30';
        textColor = 'text-yellow-800 dark:text-yellow-300';
        icon = <FiClock className="mr-1" />;
        break;
      case 'INTRANSIT':
        bgColor = 'bg-blue-100 dark:bg-blue-900/30';
        textColor = 'text-blue-800 dark:text-blue-300';
        icon = <FiTruck className="mr-1" />;
        break;
      case 'DELIVERED':
        bgColor = 'bg-green-100 dark:bg-green-900/30';
        textColor = 'text-green-800 dark:text-green-300';
        icon = <FiCheck className="mr-1" />;
        break;
      case 'CANCELLED':
        bgColor = 'bg-red-100 dark:bg-red-900/30';
        textColor = 'text-red-800 dark:text-red-300';
        icon = <FiXCircle className="mr-1" />;
        break;
      case 'RETURNED':
        bgColor = 'bg-purple-100 dark:bg-purple-900/30';
        textColor = 'text-purple-800 dark:text-purple-300';
        icon = <FiRefreshCw className="mr-1" />;
        break;
      default:
        bgColor = 'bg-gray-100 dark:bg-gray-900/30';
        textColor = 'text-gray-800 dark:text-gray-300';
        icon = <FiBox className="mr-1" />;
    }
    
    return (
      <div className={`flex items-center px-3 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
        {icon} {status.charAt(0) + status.slice(1).toLowerCase()}
      </div>
    );
  };

  const getTimeSinceUpdate = (dateString) => {
    if (!dateString) return 'Unknown';
    
    const lastUpdate = new Date(dateString);
    const now = new Date();
    const diffMs = now - lastUpdate;
    
    // Convert to minutes
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins === 1) return '1 minute ago';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    
    // Convert to hours
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return '1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    // If more than 24 hours, return formatted date
    return formatDate(dateString);
  };

  // Filter deliveries based on search term
  const filteredDeliveries = searchTerm
    ? deliveries.filter(
        delivery =>
          delivery.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          delivery.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          delivery.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          delivery.carrierName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : deliveries;

  return (
    <div className="h-screen overflow-auto bg-gray-50 dark:bg-gray-900">
      {/* Top Bar with Search and Filters */}
      <div className="p-4 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            {status === 'all' ? 'All Deliveries' : status.charAt(0).toUpperCase() + status.slice(1) + ' Deliveries'}
          </h1>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-auto">
              <input
                type="text"
                placeholder="Search deliveries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm pl-10"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
            </div>
            
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md flex items-center gap-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <FiFilter /> Filters
            </button>
            
            <button
              onClick={() => navigate(`/store-dashboard/${storeId}/delivery/map`)}
              className="px-4 py-2 bg-primary-600 text-white rounded-md flex items-center gap-2 text-sm hover:bg-primary-700"
            >
              <FiTruck /> Live Map
            </button>
          </div>
        </div>
        
        {/* Filters Panel */}
        {filterOpen && (
          <div className="mt-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
            <h3 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">Filter Deliveries</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date Range
                </label>
                <div className="flex gap-2 items-center">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiCalendar className="text-gray-400" size={14} />
                    </div>
                    <input
                      type="date"
                      name="dateFrom"
                      value={filters.dateFrom}
                      onChange={handleFilterChange}
                      className="pl-8 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                  <span className="text-gray-500">to</span>
                  <input
                    type="date"
                    name="dateTo"
                    value={filters.dateTo}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Customer Email
                </label>
                <input
                  type="email"
                  name="customerEmail"
                  value={filters.customerEmail}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  placeholder="customer@example.com"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Delivery Partner
                </label>
                <select
                  name="deliveryPartner"
                  value={filters.deliveryPartner}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                >
                  <option value="">All Partners</option>
                  {deliveryPartners.map(partner => (
                    <option key={partner.id} value={partner.id}>
                      {partner.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md text-sm hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                Clear Filters
              </button>
              <button
                onClick={fetchDeliveries}
                className="px-4 py-2 bg-primary-600 text-white rounded-md text-sm hover:bg-primary-700"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Deliveries Content */}
      <div className="p-4">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span className="ml-2 text-gray-600 dark:text-gray-400">Loading deliveries...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiXCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
              </div>
            </div>
          </div>
        ) : filteredDeliveries.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-8 text-center">
            <FiShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No deliveries found</h3>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              {searchTerm ? "Try a different search term or filter." : "There are no deliveries matching the current filters."}
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Tracking #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Order #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Shipping Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Estimated Delivery
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Carrier
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Last Update
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredDeliveries.map((delivery) => (
                    <tr key={delivery.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-600 dark:text-primary-400">
                        {delivery.trackingNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {delivery.carrierName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {getTimeSinceUpdate(delivery.currentLocation?.lastUpdated)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => navigate(`/store-dashboard/${storeId}/delivery/view/${delivery.id}`)}
                          className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryMainComponent; 