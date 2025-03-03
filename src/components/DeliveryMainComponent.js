import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { 
  FiSearch, 
  FiFilter, 
  FiDownload, 
  FiChevronLeft, 
  FiChevronRight,
  FiEye,
  FiTruck,
  FiBox,
  FiCheck,
  FiXCircle,
  FiCalendar,
  FiMapPin,
  FiClock,
  FiRefreshCw
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
  
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sorting, setSorting] = useState({ field: 'createdAt', direction: 'desc' });
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    minAmount: '',
    maxAmount: '',
    customerEmail: '',
    deliveryPartner: ''
  });
  const [deliveryPartners, setDeliveryPartners] = useState([]);

  useEffect(() => {
    fetchDeliveries();
    fetchDeliveryPartners();
  }, [storeId, status, currentPage, sorting, location.pathname]);

  const fetchDeliveryPartners = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.get(`http://localhost:8080/delivery/partners/${storeId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setDeliveryPartners(response.data);
    } catch (err) {
      console.error('Error fetching delivery partners:', err);
      
      // For development, use mock data
      if (process.env.NODE_ENV === 'development') {
        setDeliveryPartners([
          { id: 1, name: "Express Logistics" },
          { id: 2, name: "Swift Delivery" },
          { id: 3, name: "Metro Couriers" },
          { id: 4, name: "City Express" },
        ]);
      }
    }
  };

  const fetchDeliveries = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('jwtToken');
      
      // Build API URL with parameters
      let url = `http://localhost:8080/delivery/store/${storeId}?`;
      url += `page=${currentPage - 1}&size=10`; // API uses 0-based indexing
      url += `&sort=${sorting.field},${sorting.direction}`;
      
      // Add status filter if not 'all'
      if (status !== 'all') {
        url += `&status=${status.toUpperCase()}`;
      }
      
      // Add search term if present
      if (searchTerm) {
        url += `&search=${searchTerm}`;
      }
      
      // Add date filters if present
      if (filters.dateFrom) {
        url += `&dateFrom=${filters.dateFrom}T00:00:00`;
      }
      
      if (filters.dateTo) {
        url += `&dateTo=${filters.dateTo}T23:59:59`;
      }
      
      // Add amount filters if present
      if (filters.minAmount) {
        url += `&minAmount=${filters.minAmount}`;
      }
      
      if (filters.maxAmount) {
        url += `&maxAmount=${filters.maxAmount}`;
      }
      
      // Add customer email filter if present
      if (filters.customerEmail) {
        url += `&customerEmail=${filters.customerEmail}`;
      }
      
      // Add delivery partner filter if present
      if (filters.deliveryPartner) {
        url += `&partnerId=${filters.deliveryPartner}`;
      }

      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setDeliveries(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error('Error fetching deliveries:', err);
      setError('Failed to load deliveries. Please try again.');
      
      // For development, use mock data if API fails
      if (process.env.NODE_ENV === 'development') {
        const mockDeliveries = generateMockDeliveries(10, status);
        setDeliveries(mockDeliveries);
        setTotalPages(5);
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper function to generate mock delivery data for development
  const generateMockDeliveries = (count, statusFilter) => {
    const statuses = ['PENDING', 'INTRANSIT', 'DELIVERED', 'CANCELLED', 'RETURNED'];
    const carriers = ["Express Logistics", "Swift Delivery", "Metro Couriers", "City Express"];
    
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
      status: statusFilter !== 'all' ? statusFilter.toUpperCase() : statuses[Math.floor(Math.random() * statuses.length)],
      carrierName: carriers[Math.floor(Math.random() * carriers.length)],
      deliveryAddress: `${123 + i} Main St, City, State, 10000`,
    }));
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSort = (field) => {
    if (sorting.field === field) {
      // Toggle direction if same field
      setSorting({
        ...sorting,
        direction: sorting.direction === 'asc' ? 'desc' : 'asc'
      });
    } else {
      // New field, default to desc
      setSorting({
        field,
        direction: 'desc'
      });
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDeliveries();
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
      minAmount: '',
      maxAmount: '',
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
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

  return (
    <div className="h-screen overflow-auto bg-gray-50 dark:bg-gray-900">
      {/* Top Bar with Search and Filters */}
      <div className="p-4 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            {status === 'all' ? 'All Deliveries' : status.charAt(0).toUpperCase() + status.slice(1) + ' Deliveries'}
          </h1>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <form onSubmit={handleSearch} className="relative flex-1 md:w-auto">
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
              <button type="submit" className="hidden">Search</button>
            </form>
            
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md flex items-center gap-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <FiFilter /> Filters
            </button>
            
            <button
              onClick={() => navigate(`/store-dashboard/${storeId}/delivery/export`)}
              className="px-4 py-2 bg-primary-600 text-white rounded-md flex items-center gap-2 text-sm hover:bg-primary-700"
            >
              <FiDownload /> Export
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
                      placeholder="From"
                    />
                  </div>
                  <span className="text-gray-500">to</span>
                  <input
                    type="date"
                    name="dateTo"
                    value={filters.dateTo}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    placeholder="To"
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
    </div>
  );
}
export default DeliveryMainComponent;;
        
    