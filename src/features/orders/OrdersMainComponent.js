import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { 
  FiSearch, 
  FiFilter, 
  FiDownload, 
  FiEye,
  FiPlus
} from "react-icons/fi";
import { apiService } from '../../api/config';
import { formatCurrency } from '../../utils/currencyUtils';
import { formatDate } from '../../utils/date-utils';
import { getStatusBadge } from '../../utils/status-badge-utils';
import { LoadingState, ErrorState, EmptyStates } from '../../utils/loading-error-states';
import Table from '../../components/ui/Table';
import FilterPanel from '../../components/ui/FilterPanel';
import Pagination from '../../components/ui/Pagination';

const OrdersMainComponent = () => {
  const { storeId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get the status from the URL path
  const path = location.pathname;
  const statusMatch = path.match(/\/orders\/([^/]+)/);
  const status = statusMatch ? statusMatch[1] : 'all';
  
  const [orders, setOrders] = useState([]);
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
    customerEmail: ''
  });

  useEffect(() => {
    fetchOrders();
  }, [storeId, status, currentPage, sorting, location.pathname]);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('jwtToken');
      
      // Build API URL with parameters
      let url = `/orders/store/${storeId}?`;
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

      const response = await apiService.get(url);
      
      setOrders(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders. Please try again.');
      
      // For development, use mock data if API fails
      if (process.env.NODE_ENV === 'development') {
        const mockOrders = generateMockOrders(10, status);
        setOrders(mockOrders);
        setTotalPages(5);
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper function to generate mock order data for development
  const generateMockOrders = (count, statusFilter) => {
    const statuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      orderNumber: `ORD-${1000 + i}`,
      customer: {
        name: `Customer ${i + 1}`,
        email: `customer${i + 1}@example.com`
      },
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
      totalAmount: Math.floor(Math.random() * 500) + 50,
      status: statusFilter !== 'all' ? statusFilter.toUpperCase() : statuses[Math.floor(Math.random() * statuses.length)],
      paymentStatus: Math.random() > 0.2 ? 'PAID' : 'PENDING',
      items: Math.floor(Math.random() * 5) + 1
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
    fetchOrders();
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      minAmount: '',
      maxAmount: '',
      customerEmail: ''
    });
    
    // Trigger a refetch
    fetchOrders();
  };

  // Define table columns with sorting and custom renders
  const columns = [
    {
      key: 'orderNumber',
      title: 'Order Number',
      sortable: true,
      isSorted: sorting.field === 'orderNumber',
      sortDirection: sorting.direction,
      onSort: handleSort,
      render: (row) => (
        <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
          {row.orderNumber}
        </span>
      )
    },
    {
      key: 'customer',
      title: 'Customer',
      render: (row) => (
        <div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {row.customer?.name || 'Unknown Customer'}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {row.customer?.email || 'No email provided'}
          </div>
        </div>
      )
    },
    {
      key: 'createdAt',
      title: 'Date',
      sortable: true,
      isSorted: sorting.field === 'createdAt',
      sortDirection: sorting.direction,
      onSort: handleSort,
      render: (row) => (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {formatDate(row.createdAt)}
        </span>
      )
    },
    {
      key: 'totalAmount',
      title: 'Total',
      sortable: true,
      isSorted: sorting.field === 'totalAmount',
      sortDirection: sorting.direction,
      onSort: handleSort,
      render: (row) => (
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {formatCurrency(row.totalAmount)}
        </span>
      )
    },
    {
      key: 'status',
      title: 'Status',
      render: (row) => getStatusBadge(row.status)
    },
    {
      key: 'items',
      title: 'Items',
      cellClassName: 'text-center',
      render: (row) => (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {row.items}
        </span>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      cellClassName: 'text-right',
      render: (row) => (
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent row click
            navigate(`/store-dashboard/${storeId}/orders/view/${row.id}`);
          }}
          className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 px-3 py-1 rounded hover:bg-primary-50 dark:hover:bg-primary-900/20 flex items-center justify-center"
        >
          <FiEye className="mr-1" /> View
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
    amountRange: {
      type: 'number-range',
      label: 'Amount Range',
      from: filters.minAmount,
      to: filters.maxAmount
    },
    customerEmail: {
      type: 'email',
      label: 'Customer Email',
      value: filters.customerEmail,
      placeholder: 'customer@example.com'
    }
  };

  if (loading) {
    return <LoadingState message="Loading orders..." />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={fetchOrders} />;
  }

  return (
    <div className="h-screen overflow-auto bg-gray-50 dark:bg-gray-900">
      {/* Top Bar with Search and Filters */}
      <div className="p-4 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            {status === 'all' ? 'All Orders' : status.charAt(0).toUpperCase() + status.slice(1) + ' Orders'}
          </h1>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <form onSubmit={handleSearch} className="relative flex-1 md:w-auto">
              <input
                type="text"
                placeholder="Search orders..."
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
              onClick={() => navigate(`/store-dashboard/${storeId}/orders/export`)}
              className="px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md flex items-center gap-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <FiDownload /> Export
            </button>
            
            <button
              onClick={() => navigate(`/store-dashboard/${storeId}/add-order`)}
              className="px-4 py-2 bg-primary-600 text-white rounded-md flex items-center gap-2 text-sm hover:bg-primary-700"
            >
              <FiPlus /> Create Order
            </button>
          </div>
        </div>
        
        {/* Filters Panel */}
        <FilterPanel
          isOpen={filterOpen}
          filters={filterConfig}
          onFilterChange={handleFilterChange}
          onApply={fetchOrders}
          onClear={clearFilters}
        />
      </div>

      {/* Orders Table */}
      <div className="p-4">
        <Table
          columns={columns}
          data={orders}
          isLoading={loading}
          emptyState={
            <EmptyStates.Orders 
              onAction={() => navigate(`/store-dashboard/${storeId}/add-order`)} 
            />
          }
          onRowClick={(order) => navigate(`/store-dashboard/${storeId}/orders/view/${order.id}`)}
        />
        
        {/* Pagination */}
        {orders.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default OrdersMainComponent;