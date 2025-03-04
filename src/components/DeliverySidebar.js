import React, { useState, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { 
  FiTruck, 
  FiBox, 
  FiCheckCircle, 
  FiClock, 
  FiAlertCircle,
  FiChevronDown, 
  FiChevronRight,
  FiCalendar,
  FiMapPin,
  FiFilter,
  FiUsers,
  FiRefreshCw
} from "react-icons/fi";
import axios from "axios";

const DeliverySidebar = () => {
  const location = useLocation();
  const { storeId } = useParams();
  const [deliveryStats, setDeliveryStats] = useState({
    total: 0,
    pending: 0,
    intransit: 0,
    delivered: 0,
    cancelled: 0,
    returned: 0
  });
  const [loading, setLoading] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState({
    status: true,
    time: false,
    partners: false
  });
  const [dateRange, setDateRange] = useState('all');

  useEffect(() => {
    fetchDeliveryStats();
  }, [storeId, dateRange]);

  const fetchDeliveryStats = async () => {
    setLoading(true);
    try {
      // For development, use mock data
      setTimeout(() => {
        setDeliveryStats({
          total: 85,
          pending: 12,
          intransit: 28,
          delivered: 40,
          cancelled: 3,
          returned: 2
        });
        setLoading(false);
      }, 600);
      
      // In a production environment, you would use:
      // const token = localStorage.getItem('jwtToken');
      // const response = await axios.get(`http://localhost:8080/delivery/stats/${storeId}`, {
      //   headers: { 'Authorization': `Bearer ${token}` }
      // });
      // setDeliveryStats(response.data);
    } catch (err) {
      console.error('Error fetching delivery stats:', err);
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
    return location.pathname === path || 
           (path !== `/store-dashboard/${storeId}/delivery` && 
            location.pathname.startsWith(path));
  };

  // Delivery status menu items
  const statusMenuItems = [
    { 
      name: "All Deliveries", 
      path: `/store-dashboard/${storeId}/delivery/all`,
      icon: <FiTruck />,
      count: deliveryStats.total 
    },
    { 
      name: "Pending", 
      path: `/store-dashboard/${storeId}/delivery/pending`, 
      icon: <FiClock />,
      count: deliveryStats.pending 
    },
    { 
      name: "In Transit", 
      path: `/store-dashboard/${storeId}/delivery/intransit`,
      icon: <FiBox />,
      count: deliveryStats.intransit 
    },
    { 
      name: "Delivered", 
      path: `/store-dashboard/${storeId}/delivery/delivered`,
      icon: <FiCheckCircle />,
      count: deliveryStats.delivered 
    },
    { 
      name: "Cancelled", 
      path: `/store-dashboard/${storeId}/delivery/cancelled`,
      icon: <FiAlertCircle />,
      count: deliveryStats.cancelled 
    },
    { 
      name: "Returned", 
      path: `/store-dashboard/${storeId}/delivery/returned`,
      icon: <FiRefreshCw />,
      count: deliveryStats.returned
    }
  ];

  // Time-based filters
  const timeMenuItems = [
    { name: "Today", value: "today" },
    { name: "Yesterday", value: "yesterday" },
    { name: "Last 7 days", value: "7days" },
    { name: "Last 30 days", value: "30days" },
    { name: "This month", value: "thisMonth" },
    { name: "Last month", value: "lastMonth" }
  ];

  // Delivery partners menu items
  const deliveryPartnerItems = [
    { 
      name: "All Partners", 
      path: `/store-dashboard/${storeId}/delivery/partners/all`,
      icon: <FiUsers />
    },
    { 
      name: "Performance", 
      path: `/store-dashboard/${storeId}/delivery/partners/performance`,
      icon: <FiTruck />
    },
    { 
      name: "Settings", 
      path: `/store-dashboard/${storeId}/delivery/partners/settings`,
      icon: <FiFilter />
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
          <FiTruck className="mr-2" /> 
          Delivery Management
        </h2>
        <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1">
          {loading ? 'Loading stats...' : `${deliveryStats.total} Total Deliveries`}
        </p>
      </div>

      {/* Sidebar Navigation */}
      <div className="flex-1 overflow-y-auto p-2">
        {/* Delivery Status Section */}
        <div className="mb-4">
          <button 
            className="w-full flex items-center justify-between p-3 rounded-md text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700/50"
            onClick={() => toggleMenu('status')}
          >
            <div className="flex items-center">
              <FiFilter className="mr-2" />
              <span className="font-medium">Delivery Status</span>
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

        {/* Delivery Partners Section */}
        <div className="mb-4">
          <button 
            className="w-full flex items-center justify-between p-3 rounded-md text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700/50"
            onClick={() => toggleMenu('partners')}
          >
            <div className="flex items-center">
              <FiUsers className="mr-2" />
              <span className="font-medium">Delivery Partners</span>
            </div>
            {expandedMenus.partners ? <FiChevronDown /> : <FiChevronRight />}
          </button>

          {expandedMenus.partners && (
            <div className="ml-2 space-y-1 mt-1">
              {deliveryPartnerItems.map((item) => (
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
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-secondary-200 dark:border-secondary-700">
        <Link
          to={`/store-dashboard/${storeId}/delivery/map`}
          className="flex items-center justify-center w-full px-4 py-2 text-sm text-white bg-primary-600 hover:bg-primary-700 rounded-md"
        >
          <FiMapPin className="mr-2" />
          Live Tracking Map
        </Link>
      </div>
    </div>
  );
};

export default DeliverySidebar;