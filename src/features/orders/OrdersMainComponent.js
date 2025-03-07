import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  FiEye
} from "react-icons/fi";
import { apiService } from '../../api/config';
import { formatCurrency } from '../../utils/currencyUtils';
import { formatDate } from '../../utils/date-utils';
import { getStatusBadge } from '../../utils/status-badge-utils';
import { LoadingState, ErrorState, EmptyStates } from '../../utils/loading-error-states';
import Table from '../../components/ui/Table';
import Pagination from '../../components/ui/Pagination';
import { OrderStatusContext } from './OrdersHeader';

// Import for mock data generation
import { generateMockOrders } from '../../utils/mock-data-utils';

const OrdersMainComponent = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  
  // Get the current status from context
  const { currentStatus } = React.useContext(OrderStatusContext);
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sorting, setSorting] = useState({ field: 'createdAt', direction: 'desc' });

  // Reset page and fetch data when status or sorting changes
  useEffect(() => {
    setCurrentPage(1);
    fetchOrders();
  }, [storeId, currentStatus, sorting]);

  // Fetch data when page changes without resetting to page 1
  useEffect(() => {
    fetchOrders();
  }, [currentPage]);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // In a production environment, you would make a real API call:
      // const response = await apiService.get(`/orders/store/${storeId}?page=${currentPage-1}&status=${currentStatus}`);
      // setOrders(response.data.content);
      // setTotalPages(response.data.totalPages);
      
      // For development, use mock data
      setTimeout(() => {
        // Use the mock data utility if available, otherwise fallback to inline function
        let mockOrders;
        if (typeof generateMockOrders === 'function') {
          mockOrders = generateMockOrders(10, currentStatus);
        } else {
          mockOrders = createMockOrders(10, currentStatus);
        }
        
        setOrders(mockOrders);
        setTotalPages(5);
        setLoading(false);
      }, 300); // Short timeout for fast feedback in development
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders. Please try again.');
      setLoading(false);
    }
  };

  // Fallback mock data function if utils aren't available
  const createMockOrders = (count, statusFilter) => {
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

  // Define table columns with sorting and custom renders
  const columns = [
    {
      key: 'orderNumber',
      title: 'Order Number',
      sortable: true,
      isSorted: sorting.field === 'orderNumber',
      sortDirection: sorting.direction,
      onSort: () => handleSort('orderNumber'),
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
      onSort: () => handleSort('createdAt'),
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
      onSort: () => handleSort('totalAmount'),
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

  if (loading) {
    return <LoadingState message="Loading orders..." />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={fetchOrders} />;
  }

  return (
    <div className="h-screen overflow-auto bg-gray-50 dark:bg-gray-900">
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