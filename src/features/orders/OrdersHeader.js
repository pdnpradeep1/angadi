import React, { useState, useEffect } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import { 
  FiSearch, 
  FiFilter, 
  FiDownload, 
  FiCalendar,
  FiChevronDown,
  FiPlus,
  FiTruck,
  FiClock,
  FiBarChart2
} from "react-icons/fi";
import axios from "axios";

const OrdersHeader = () => {
  const { storeId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
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
  const [searchTerm, setSearchTerm] = useState('');
  const [lifetimeDropdownOpen, setLifetimeDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('lifetime');
  const [selectedSortOption, setSelectedSortOption] = useState('Date (Newest first)');

  useEffect(() => {
    fetchOrderStats();
  }, [storeId]);

  const fetchOrderStats = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('jwtToken');
      
      // In a production environment, you would use:
      // const response = await axios.get(`http://localhost:8080/orders/stats/${storeId}`, {
      //   headers: { 'Authorization': `Bearer ${token}` }
      // });
      // setOrderStats(response.data);
      
      // For development, use mock data
      setTimeout(() => {
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
        setLoading(false);
      }, 600);
    } catch (err) {
      console.error('Error fetching order stats:', err);
      setLoading(false);
    }
  };

  // Get the status from the URL path
  const getStatusFromPath = () => {
    const path = location.pathname;
    const statusMatch = path.match(/\/orders\/([^/]+)/);
    return statusMatch ? statusMatch[1] : 'all';
  };
  
  const currentStatus = getStatusFromPath();

  // Order status tabs
  const statusTabs = [
    { id: 'all', name: "All", count: orderStats.total, path: `/store-dashboard/${storeId}/orders/all` },
    { id: 'pending', name: "Pending", count: orderStats.pending, path: `/store-dashboard/${storeId}/orders/pending` },
    { id: 'processing', name: "Accepted", count: orderStats.processing, path: `/store-dashboard/${storeId}/orders/processing` },
    { id: 'shipped', name: "Shipped", count: orderStats.shipped, path: `/store-dashboard/${storeId}/orders/shipped` },
    { id: 'delivered', name: "Delivered", count: orderStats.delivered, path: `/store-dashboard/${storeId}/orders/delivered` },
    { id: 'others', name: "Others", count: orderStats.cancelled + orderStats.refunded + orderStats.returned, path: `/store-dashboard/${storeId}/orders/cancelled` }
  ];

  // Time filter options
  const timeframeOptions = [
    { id: 'today', name: "Today" },
    { id: 'yesterday', name: "Yesterday" },
    { id: 'thisWeek', name: "This Week" },
    { id: 'last7days', name: "Last 7 days" },
    { id: 'lastWeek', name: "Last Week" },
    { id: 'thisMonth', name: "This Month" },
    { id: 'last30days', name: "Last 30 days" },
    { id: 'lastMonth', name: "Last Month" },
    { id: 'customRange', name: "Custom Range" }
  ];

  // Sort options
  const sortOptions = [
    { id: 'created_newest', name: "Order (Created date)" },
    { id: 'modified_newest', name: "Order (Modified date)" },
    { id: 'date_newest', name: "Date (Newest first)" },
    { id: 'date_oldest', name: "Date (Oldest first)" },
    { id: 'items_high', name: "Items (High to low)" },
    { id: 'items_low', name: "Items (Low to high)" },
    { id: 'amount_high', name: "Amount (High to low)" },
    { id: 'amount_low', name: "Amount (Low to high)" }
  ];

  // Filter options for payment
  const paymentFilters = [
    { id: 'paid', name: "Paid orders" },
    { id: 'unpaid', name: "Unpaid orders" },
    { id: 'cod', name: "COD orders" },
    { id: 'prepaid', name: "Prepaid orders" }
  ];

  // Filter options for channel
  const channelFilters = [
    { id: 'online', name: "Online orders" },
    { id: 'manual', name: "Manual orders" }
  ];

  // Filter options for others
  const otherFilters = [
    { id: 'dukaan_delivery', name: "Dukaan delivery orders" },
    { id: 'self_shipped', name: "Self shipped orders" },
    { id: 'returned', name: "Returned orders" }
  ];

  const handleTimeframeSelect = (timeframeId) => {
    setSelectedTimeframe(timeframeId);
    setLifetimeDropdownOpen(false);
  };

  const handleSortSelect = (sortOption) => {
    setSelectedSortOption(sortOption);
    setSortDropdownOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Implement search functionality
    console.log("Searching for:", searchTerm);
  };

  const toggleLifetimeDropdown = () => {
    setLifetimeDropdownOpen(!lifetimeDropdownOpen);
    setSortDropdownOpen(false);
    setFilterDropdownOpen(false);
  };

  const toggleSortDropdown = () => {
    setSortDropdownOpen(!sortDropdownOpen);
    setLifetimeDropdownOpen(false);
    setFilterDropdownOpen(false);
  };

  const toggleFilterDropdown = () => {
    setFilterDropdownOpen(!filterDropdownOpen);
    setLifetimeDropdownOpen(false);
    setSortDropdownOpen(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      {/* Title and action buttons */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">
          {currentStatus === 'all' ? 'All Orders' : currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1) + ' Orders'}
          <span className="text-gray-500 dark:text-gray-400 ml-2 text-base font-normal">{selectedTimeframe}</span>
        </h1>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Link
            to={`/store-dashboard/${storeId}/orders/export`}
            className="px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md flex items-center text-sm hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            <FiDownload className="mr-2" /> Bulk ship
          </Link>
          
          <Link
            to={`/store-dashboard/${storeId}/add-order`}
            className="px-4 py-2 bg-primary-600 text-white rounded-md flex items-center text-sm hover:bg-primary-700"
          >
            <FiPlus className="mr-2" /> Create order
          </Link>
        </div>
      </div>

      {/* Status tabs */}
      <div className="px-4 flex overflow-x-auto">
        {statusTabs.map((tab) => (
          <Link
            key={tab.id}
            to={tab.path}
            className={`px-4 py-2 whitespace-nowrap mb-0 ${
              currentStatus === tab.id 
                ? "bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300 font-medium border border-primary-200 dark:border-primary-800 rounded-t-md"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            {tab.name} {tab.count > 0 && <span className="ml-1 font-normal text-xs bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded-full">{tab.count}</span>}
          </Link>
        ))}
      </div>

      {/* Search, Filter, Sort Row */}
      <div className="p-4 flex flex-wrap gap-2 border-t border-gray-200 dark:border-gray-700">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Order ID, phone or a name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm pl-10"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
        </form>

        {/* Export Button */}
        <div className="relative">
          <button onClick={() => navigate(`/store-dashboard/${storeId}/orders/export`)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 flex items-center hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            <FiDownload className="mr-2" /> Export
          </button>
        </div>

        {/* Columns Button */}
        <div className="relative">
          <button
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 flex items-center hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            <FiBarChart2 className="mr-2" /> Columns
          </button>
        </div>

        {/* Sort By Dropdown */}
        <div className="relative">
          <button
            onClick={toggleSortDropdown}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 flex items-center hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            <FiFilter className="mr-2" /> Sort by
          </button>
          
          {sortDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700">
              <div className="py-1">
                {sortOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleSortSelect(option.name)}
                    className="w-full text-left px-4 py-2 flex items-center text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <span className="mr-3 inline-block w-4 h-4 rounded-full border border-gray-400 flex-shrink-0 flex items-center justify-center">
                      {selectedSortOption === option.name && (
                        <span className="w-2 h-2 rounded-full bg-primary-600"></span>
                      )}
                    </span>
                    {option.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Filter Dropdown */}
        <div className="relative">
          <button
            onClick={toggleFilterDropdown}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 flex items-center hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            <FiFilter className="mr-2" /> Filter
          </button>
          
          {filterDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700">
              <div className="p-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Payment</h4>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {paymentFilters.map((filter) => (
                    <div key={filter.id} className="flex items-center">
                      <input 
                        type="checkbox" 
                        id={filter.id} 
                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" 
                      />
                      <label htmlFor={filter.id} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        {filter.name}
                      </label>
                    </div>
                  ))}
                </div>

                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Amount</h4>
                <div className="mb-4">
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">Condition</p>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
                    <option>Select</option>
                  </select>
                </div>

                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Quantity</h4>
                <div className="mb-4">
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">Condition</p>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
                    <option>Select</option>
                  </select>
                </div>

                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Channel</h4>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {channelFilters.map((filter) => (
                    <div key={filter.id} className="flex items-center">
                      <input 
                        type="checkbox" 
                        id={filter.id} 
                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" 
                      />
                      <label htmlFor={filter.id} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        {filter.name}
                      </label>
                    </div>
                  ))}
                </div>

                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Others</h4>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {otherFilters.map((filter) => (
                    <div key={filter.id} className="flex items-center">
                      <input 
                        type="checkbox" 
                        id={filter.id} 
                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" 
                      />
                      <label htmlFor={filter.id} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        {filter.name}
                      </label>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    Reset
                  </button>
                  <button className="px-4 py-2 bg-primary-600 text-white rounded-md text-sm hover:bg-primary-700">
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Lifetime Dropdown */}
        <div className="relative">
          <button
            onClick={toggleLifetimeDropdown}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 flex items-center hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            <FiCalendar className="mr-2" /> Lifetime {lifetimeDropdownOpen ? <FiChevronDown className="ml-2" /> : <FiChevronDown className="ml-2" />}
          </button>
          
          {lifetimeDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700">
              <div className="py-1">
                {timeframeOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleTimeframeSelect(option.id)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {option.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersHeader;