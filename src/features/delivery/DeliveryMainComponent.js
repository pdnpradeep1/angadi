import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { 
  FiSearch, 
  FiFilter, 
  FiDownload, 
  FiTruck,
  FiBox,
  FiShoppingBag
} from "react-icons/fi";
import { apiService } from '../../api/config';
import { formatDate, getTimeSince } from '../../utils/date-utils';
import { getStatusBadge } from '../../utils/status-badge-utils';
import { LoadingState, ErrorState, EmptyStates } from '../../utils/loading-error-states';
import Table from '../../components/ui/Table';
import FilterPanel from '../../components/ui/FilterPanel';
import { generateMockDeliveries } from '../../utils/mock-data-utils';

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

  const handleFilterChange = (key, value) => {
    setFilters({
      ...filters,
      [key]: value
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
    
  // Define columns for the Table component
  const columns = [
    {
      key: 'trackingNumber',
      title: 'Tracking #',
      render: (row) => (
        <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
          {row.trackingNumber}
        </span>
      )
    },
    {
      key: 'orderNumber',
      title: 'Order #',
      render: (row) => (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {row.orderNumber}
        </span>
      )
    },
    {
      key: 'customer',
      title: 'Customer',
      render: (row) => (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {row.customer?.name || 'Unknown'}
        </span>
      )
    },
    {
      key: 'createdAt',
      title: 'Shipping Date',
      render: (row) => (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {formatDate(row.createdAt)}
        </span>
      )
    },
    {
      key: 'estimatedDelivery',
      title: 'Estimated Delivery',
      render: (row) => (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {formatDate(row.estimatedDelivery)}
        </span>
      )
    },
    {
      key: 'status',
      title: 'Status',
      render: (row) => getStatusBadge(row.status)
    },
    {
      key: 'carrier',
      title: 'Carrier',
      render: (row) => (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {row.carrierName}
        </span>
      )
    },
    {
      key: 'lastUpdate',
      title: 'Last Update',
      render: (row) => (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {getTimeSince(row.currentLocation?.lastUpdated)}
        </span>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      cellClassName: 'text-right',
      render: (row) => (
        <button
          onClick={() => navigate(`/store-dashboard/${storeId}/delivery/view/${row.id}`)}
          className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
        >
          View
        </button>
      )
    }
  ];

  // Filter configuration
  const filterConfig = {
    dateRange: {
      type: 'date-range',
      label: 'Date Range',
      from: filters.dateFrom,
      to: filters.dateTo
    },
    customerEmail: {
      type: 'email',
      label: 'Customer Email',
      value: filters.customerEmail,
      placeholder: 'customer@example.com'
    },
    deliveryPartner: {
      type: 'select',
      label: 'Delivery Partner',
      value: filters.deliveryPartner,
      options: deliveryPartners.map(partner => ({ value: partner.id, label: partner.name })),
      placeholderOption: 'All Partners'
    }
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
        
        {/* Filter Panel */}
        <FilterPanel
          isOpen={filterOpen}
          filters={filterConfig}
          onFilterChange={handleFilterChange}
          onApply={fetchDeliveries}
          onClear={clearFilters}
        />
      </div>

      {/* Deliveries Content */}
      <div className="p-4">
        <Table
          columns={columns}
          data={filteredDeliveries}
          isLoading={loading}
          onRowClick={(delivery) => navigate(`/store-dashboard/${storeId}/delivery/view/${delivery.id}`)}
          emptyState={
            <EmptyStates.SearchResults />
          }
        />
      </div>
    </div>
  );
};

export default DeliveryMainComponent;