import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { 
  FiShoppingBag, 
  FiTruck, 
  FiPackage, 
  FiClock, 
  FiRotateCw, 
  FiAlertCircle, 
  FiCheckCircle,
  FiChevronDown,
  FiChevronRight,
  FiFilter,
  FiCalendar
} from "react-icons/fi";
import axios from "axios";

const OrdersSidebar = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [orderStats, setOrderStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    refunded: 0,
    returned: 0
  });
  const [loading, setLoading] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState({
    status: true,
    time: false,
    returns: false
  });
  const [dateRange, setDateRange] = useState('all');

  useEffect(() => {
    fetchOrderStats();
  }, [storeId, dateRange]);

  const fetchOrderStats = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('jwtToken');
      
      // Use query params for time filtering
      let timeFilter = '';
      if (dateRange !== 'all') {
        timeFilter = `&timeRange=${dateRange}`;
      }
      
      const response = await axios.get(`http://localhost:8080/orders/stats/${storeId}?${timeFilter}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setOrderStats(response.data);
    } catch (err) {
      console.error('Error fetching order stats:', err);
      
      // For development, use mock data
      if (process.env.NODE_ENV === 'development') {
        setOrderStats({
          total: 128,
          pending: 15,
          processing: 22,
          shipped: 38,
          delivered: 43,
          cancelled: 5,
          refunded: 3,
          returned: 2
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleMenu = (menu) => {
    setExpandedMenus({
      ...expandedMenus,
      [menu]: !expandedMenus[menu]
    });
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Order status menu items
  const statusMenuItems = [
    { 
      name: "All Orders", 
      path: `/store-dashboard/${storeId}/orders/all`,
      icon: <FiShoppingBag />,
      count: orderStats.total 
    },
    { 
      name: "Pending", 
      path: `/store-dashboard/${storeId}/orders/pending`, 
      icon: <FiClock />,
      count: orderStats.pending 
    },
    { 
      name: "Processing", 
      path: `/store-dashboard/${storeId}/orders/processing`,
      icon: <FiPackage />,
      count: orderStats.processing 
    },
    { 
      name: "Shipped", 
      path: `/store-dashboard/${storeId}/orders/shipped`,
      icon: <FiTruck />,
      count: orderStats.shipped 
    },
    { 
      name: "Delivered", 
      path: `/store-dashboard/${storeId}/orders/delivered`,
      icon: <FiCheckCircle />,
      count: orderStats.delivered 
    },
    { 
      name: "Cancelled", 
      path: `/store-dashboard/${storeId}/orders/cancelled`,
      icon: <FiAlertCircle />,
      count: orderStats.cancelled 
    }
  ];

  // Time-based filters
  const timeMenuItems = [
    { name: "Today", value: "today" },
    { name: "Yesterday", value: "yesterday" },
    { name: "Last 7 days", value: "7days" },
    { name: "Last 30 days", value: "30days" },
    { name: "This month", value: "thisMonth" },
    { name: "Last month", value: "lastMonth" },
    { name: "Custom range", value: "custom" }
  ];

  // Return and refund menu items
  const returnMenuItems = [
    { 
      name: "Refund Requests", 
      path: `/store-dashboard/${storeId}/orders/refunds`,
      icon: <FiRotateCw />,
      count: orderStats.refunded 
    },
    { 
      name: "Return Requests", 
      path: `/store-dashboard/${storeId}/orders/returns`,
      icon: <FiRotateCw />,
      count: orderStats.returned 
    }
  ];

  // Generate status badge based on count
  const getStatusBadge = (count) => {
    if (!count) return null;
    
    return (
      <span className="ml-auto bg-secondary-100 dark:bg-secondary-800 text-secondary-800 dark:text-secondary-200 px-2 py-1 text-xs rounded-full">
        {count}
      </span>
    );
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-secondary-800 shadow-sm border-r border-secondary-200 dark:border-secondary-700">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-secondary-200 dark:border-secondary-700">
        <h2 className="text-lg font-bold text-secondary-900 dark:text-white flex items-center">
          <FiShoppingBag className="mr-2" /> 
          Orders Management
        </h2>
        <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1">
          {loading ? 'Loading stats...' : `${orderStats.total} Total Orders`}
        </p>
      </div>

      {/* Sidebar Navigation */}
      <div className="flex-1 overflow-y-auto p-2">
        {/* Order Status Section */}
        <div className="mb-4">
          <button 
            className="w-full flex items-center justify-between p-3 rounded-md text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700/50"
            onClick={() => toggleMenu('status')}
          >
            <div className="flex items-center">
              <FiFilter className="mr-2" />
              <span className="font-medium">Order Status</span>
            </div>
            {expandedMenus.status ? <FiChevronDown /> : <FiChevronRight />}
          </button>

          {expandedMenus.status && (
            <div className="ml-2 space-y-1 mt-1">
              {statusMenuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center justify-between px-3 py-2 rounded-md text-sm ${
                    isActive(item.path)
                      ? "bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 font-medium"
                      : "text-secondary-600 dark:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-700/50"
                  }`}
                >
                  <div className="flex items-center">
                    <span className="w-5 h-5 mr-2 flex items-center justify-center">
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                  </div>
                  {getStatusBadge(item.count)}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Time Period Filter */}
        <div className="mb-4">
          <button 
            className="w-full flex items-center justify-between p-3 rounded-md text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700/50"
            onClick={() => toggleMenu('time')}
          >
            <div className="flex items-center">
              <FiCalendar className="mr-2" />
              <span className="font-medium">Time Period</span>
            </div>
            {expandedMenus.time ? <FiChevronDown /> : <FiChevronRight />}
          </button>

          {expandedMenus.time && (
            <div className="ml-2 space-y-1 mt-1">
              {timeMenuItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setDateRange(item.value)}
                  className={`flex items-center w-full px-3 py-2 rounded-md text-sm text-left ${
                    dateRange === item.value
                      ? "bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 font-medium"
                      : "text-secondary-600 dark:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-700/50"
                  }`}
                >
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Returns & Refunds Section */}
        <div className="mb-4">
          <button 
            className="w-full flex items-center justify-between p-3 rounded-md text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700/50"
            onClick={() => toggleMenu('returns')}
          >
            <div className="flex items-center">
              <FiRotateCw className="mr-2" />
              <span className="font-medium">Returns & Refunds</span>
            </div>
            {expandedMenus.returns ? <FiChevronDown /> : <FiChevronRight />}
          </button>

          {expandedMenus.returns && (
            <div className="ml-2 space-y-1 mt-1">
              {returnMenuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center justify-between px-3 py-2 rounded-md text-sm ${
                    isActive(item.path)
                      ? "bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 font-medium"
                      : "text-secondary-600 dark:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-700/50"
                  }`}
                >
                  <div className="flex items-center">
                    <span className="w-5 h-5 mr-2 flex items-center justify-center">
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                  </div>
                  {getStatusBadge(item.count)}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-secondary-200 dark:border-secondary-700">
        <Link
          to={`/store-dashboard/${storeId}/orders/export`}
          className="flex items-center justify-center w-full px-4 py-2 text-sm text-white bg-primary-600 rounded-md hover:bg-primary-700"
        >
          Export Orders
        </Link>
      </div>
    </div>
  );
};

export default OrdersSidebar;