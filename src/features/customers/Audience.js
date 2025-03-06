import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  FiUsers, 
  FiSearch, 
  FiFilter, 
  FiDownload, 
  FiPlus
} from "react-icons/fi";
import { apiService } from '../../api/config';
import { isAuthenticated } from '../../utils/jwtUtils';
import AddCustomerModal from "../../components/modals/AddCustomerModal";
import { formatCurrency } from '../../utils/currencyUtils';
import { formatDate } from '../../utils/date-utils';
import { LoadingState, ErrorState, EmptyStates } from '../../utils/loading-error-states';
import Table from '../../components/ui/Table';
import FilterPanel from '../../components/ui/FilterPanel';

const Audience = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [activeTab, setActiveTab] = useState("all");
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    minOrders: "",
    maxOrders: "",
    minSpent: "",
    maxSpent: "",
    city: ""
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Fetch customers data
  useEffect(() => {
    fetchCustomers();
  }, [storeId, activeTab]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      if (!isAuthenticated()) {
        navigate("/login");
        return;
      }

      // For development, use mock data
      // In production, you would make an API call
      setTimeout(() => {
        const mockCustomers = generateMockCustomers(20);
        setCustomers(mockCustomers);
        setLoading(false);
      }, 800);
    } catch (err) {
      console.error("Error fetching customers:", err);
      setError("Failed to load customers. Please try again.");
      setLoading(false);
    }
  };

  // Generate mock customer data for development
  const generateMockCustomers = (count) => {
    const cities = ["Guntur", "Hyderabad", "Bangalore", "Mumbai", "Delhi", "Chennai", "Kolkata"];
    const customers = [];

    for (let i = 1; i <= count; i++) {
      const isNew = Math.random() > 0.7;
      const isReturning = !isNew && Math.random() > 0.5;
      const orderCount = isNew ? 1 : Math.floor(Math.random() * 10) + 1;
      const totalSpent = orderCount * (Math.floor(Math.random() * 1000) + 500);

      customers.push({
        id: i,
        name: `Customer ${i}`,
        email: i % 3 === 0 ? `customer${i}@example.com` : "-",
        phone: `+91-${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        city: cities[Math.floor(Math.random() * cities.length)],
        totalOrders: orderCount,
        totalSales: totalSpent,
        lastOrder: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
        firstOrder: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString(),
        status: isNew ? "new" : isReturning ? "returning" : "imported"
      });
    }

    // Add one customer with test data similar to your image
    customers.push({
      id: count + 1,
      name: "Test User",
      email: "-",
      phone: "+91-9743637823",
      city: "Guntur",
      totalOrders: 1,
      totalSales: 0,
      lastOrder: new Date().toISOString(),
      firstOrder: new Date().toISOString(),
      status: "new"
    });

    return customers;
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    // The search is already implemented in the filteredCustomers computation
  };

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [key]: value
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      dateFrom: "",
      dateTo: "",
      minOrders: "",
      maxOrders: "",
      minSpent: "",
      maxSpent: "",
      city: ""
    });
    setSearchTerm("");
  };

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // New field, default to ascending
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Handle customer selection
  const handleSelectCustomer = (id) => {
    setSelectedCustomers((prev) => 
      prev.includes(id) 
        ? prev.filter(customerId => customerId !== id) 
        : [...prev, id]
    );
  };

  // Handle select all customers
  const handleSelectAll = () => {
    if (selectedCustomers.length === filteredCustomers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(filteredCustomers.map(customer => customer.id));
    }
  };

  // Filter customers based on active tab, search term, and filters
  const getFilteredCustomers = () => {
    return customers.filter(customer => {
      // Filter by tab
      if (activeTab === "new" && customer.status !== "new") return false;
      if (activeTab === "returning" && customer.status !== "returning") return false;
      if (activeTab === "imported" && customer.status !== "imported") return false;

      // Filter by search term
      if (searchTerm && !customer.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !customer.email.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !customer.phone.includes(searchTerm) &&
          !customer.city.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Filter by date range
      if (filters.dateFrom && new Date(customer.firstOrder) < new Date(filters.dateFrom)) return false;
      if (filters.dateTo && new Date(customer.firstOrder) > new Date(filters.dateTo)) return false;

      // Filter by order count
      if (filters.minOrders && customer.totalOrders < parseInt(filters.minOrders)) return false;
      if (filters.maxOrders && customer.totalOrders > parseInt(filters.maxOrders)) return false;

      // Filter by amount spent
      if (filters.minSpent && customer.totalSales < parseInt(filters.minSpent)) return false;
      if (filters.maxSpent && customer.totalSales > parseInt(filters.maxSpent)) return false;

      // Filter by city
      if (filters.city && !customer.city.toLowerCase().includes(filters.city.toLowerCase())) return false;

      return true;
    });
  };

  // Sort the filtered customers
  const getSortedCustomers = (filteredCustomers) => {
    return [...filteredCustomers].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle special case for name (case-insensitive)
      if (sortField === "name") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      // Handle numeric fields
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      // Handle string fields
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  };

  // Apply filters and sorting
  const filteredCustomers = getFilteredCustomers();
  const sortedCustomers = getSortedCustomers(filteredCustomers);

  // Get tab counts
  const tabCounts = {
    all: customers.length,
    new: customers.filter(c => c.status === "new").length,
    returning: customers.filter(c => c.status === "returning").length,
    imported: customers.filter(c => c.status === "imported").length
  };
  
  // Handle adding a new customer
  const handleAddCustomer = (customerData) => {
    // Create a new customer object with needed properties
    const newCustomer = {
      id: customers.length + 1,
      name: customerData.name,
      email: customerData.email || "-",
      phone: customerData.phone,
      city: customerData.city,
      totalOrders: 0,
      totalSales: 0,
      lastOrder: null,
      firstOrder: new Date().toISOString(),
      status: "new"
    };
    
    // Add to customers list
    setCustomers([newCustomer, ...customers]);
    
    // Show success message (in a real app, you'd want to show a toast notification)
    console.log("Customer added successfully");
  };

  // Define table columns
  const columns = [
    {
      key: 'select',
      title: '',
      render: (row) => (
        <input
          type="checkbox"
          className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
          checked={selectedCustomers.includes(row.id)}
          onChange={(e) => {
            e.stopPropagation(); // Prevent row click
            handleSelectCustomer(row.id);
          }}
        />
      )
    },
    {
      key: 'name',
      title: 'Customer Name',
      sortable: true,
      isSorted: sortField === 'name',
      sortDirection: sortDirection,
      onSort: () => handleSort('name'),
      render: (row) => (
        <div className="text-sm font-medium text-gray-900 dark:text-white">
          {row.name}
        </div>
      )
    },
    {
      key: 'phone',
      title: 'Mobile Number',
      render: (row) => (
        <div className="text-sm text-gray-900 dark:text-white">
          {row.phone}
        </div>
      )
    },
    {
      key: 'email',
      title: 'Email',
      render: (row) => (
        <div className="text-sm text-gray-900 dark:text-white">
          {row.email}
        </div>
      )
    },
    {
      key: 'city',
      title: 'City',
      render: (row) => (
        <div className="text-sm text-gray-900 dark:text-white">
          {row.city}
        </div>
      )
    },
    {
      key: 'totalOrders',
      title: 'Total Orders',
      sortable: true,
      isSorted: sortField === 'totalOrders',
      sortDirection: sortDirection,
      onSort: () => handleSort('totalOrders'),
      render: (row) => (
        <div className="text-sm text-gray-900 dark:text-white">
          {row.totalOrders}
        </div>
      )
    },
    {
      key: 'totalSales',
      title: 'Total Sales',
      sortable: true,
      isSorted: sortField === 'totalSales',
      sortDirection: sortDirection,
      onSort: () => handleSort('totalSales'),
      render: (row) => (
        <div className="text-sm text-gray-900 dark:text-white">
          {formatCurrency(row.totalSales)}
        </div>
      )
    }
  ];

  // Filter configuration
  const filterConfig = {
    dateRange: {
      type: 'date-range',
      label: 'Registration Date',
      from: filters.dateFrom,
      to: filters.dateTo
    },
    orderCount: {
      type: 'number-range',
      label: 'Order Count',
      from: filters.minOrders,
      to: filters.maxOrders
    },
    amountSpent: {
      type: 'number-range',
      label: 'Amount Spent (₹)',
      from: filters.minSpent,
      to: filters.maxSpent
    },
    city: {
      type: 'text',
      label: 'City',
      value: filters.city,
      placeholder: 'Filter by city'
    }
  };

  if (loading) {
    return <LoadingState message="Loading customers..." />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={fetchCustomers} />;
  }

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <FiUsers className="mr-2" /> Audience
          </h1>
          <div className="flex items-center mt-4 md:mt-0 space-x-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Name, mobile, or a city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
            </div>
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <FiFilter className="mr-2" /> Filter
            </button>
            <button
              onClick={() => {}}
              className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <FiDownload className="mr-2" /> Export
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
            >
              <FiPlus className="mr-2" /> Add customer
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab("all")}
            className={`py-4 px-6 text-sm font-medium ${
              activeTab === "all"
                ? "border-b-2 border-primary-500 text-primary-600 dark:text-primary-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            All ({tabCounts.all})
          </button>
          <button
            onClick={() => setActiveTab("new")}
            className={`py-4 px-6 text-sm font-medium ${
              activeTab === "new"
                ? "border-b-2 border-primary-500 text-primary-600 dark:text-primary-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            New ({tabCounts.new})
          </button>
          <button
            onClick={() => setActiveTab("returning")}
            className={`py-4 px-6 text-sm font-medium ${
              activeTab === "returning"
                ? "border-b-2 border-primary-500 text-primary-600 dark:text-primary-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Returning ({tabCounts.returning})
          </button>
          <button
            onClick={() => setActiveTab("imported")}
            className={`py-4 px-6 text-sm font-medium ${
              activeTab === "imported"
                ? "border-b-2 border-primary-500 text-primary-600 dark:text-primary-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Imported ({tabCounts.imported})
          </button>
        </div>
        
        {/* Filter Panel */}
        <FilterPanel
          isOpen={filterOpen}
          filters={filterConfig}
          onFilterChange={handleFilterChange}
          onApply={() => {}}
          onClear={clearFilters}
        />
      </div>

      {/* Customers Table */}
      <div className="p-4">
        <Table
          columns={columns}
          data={sortedCustomers}
          isLoading={loading}
          emptyState={
            <EmptyStates.Customers 
              onAction={() => setIsAddModalOpen(true)} 
            />
          }
        />
      </div>
      
      {/* Add Customer Modal */}
      <AddCustomerModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddCustomer={handleAddCustomer}
      />
    </div>
  );
};

export default Audience;