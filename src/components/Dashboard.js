import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  FiHome, 
  FiShoppingBag, 
  FiUsers, 
  FiSettings, 
  FiUser, 
  FiLogOut, 
  FiMenu, 
  FiX, 
  FiBarChart2, 
  FiCreditCard,
  FiPackage,
  FiRefreshCw,
  FiAlertTriangle,
  FiDollarSign
} from "react-icons/fi";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "/api/placeholder/40/40",
    role: "CUSTOMER"
  });
  
  // Mock dashboard data
  const dashboardStats = [
    { 
      id: 1,
      title: "Total Revenue",
      value: "$12,345",
      change: "+12.5%",
      positive: true,
      icon: <FiDollarSign className="h-6 w-6 text-green-500" />,
      color: "bg-green-100 dark:bg-green-900/20"
    },
    { 
      id: 2,
      title: "New Orders",
      value: "156",
      change: "+8.2%",
      positive: true,
      icon: <FiShoppingBag className="h-6 w-6 text-primary-500" />,
      color: "bg-primary-100 dark:bg-primary-900/20"
    },
    { 
      id: 3,
      title: "New Customers",
      value: "32",
      change: "+5.1%",
      positive: true,
      icon: <FiUsers className="h-6 w-6 text-purple-500" />,
      color: "bg-purple-100 dark:bg-purple-900/20"
    },
    { 
      id: 4,
      title: "Refund Requests",
      value: "5",
      change: "-2.3%",
      positive: true,
      icon: <FiRefreshCw className="h-6 w-6 text-orange-500" />,
      color: "bg-orange-100 dark:bg-orange-900/20"
    }
  ];
  
  // Recent orders data
  const recentOrders = [
    {
      id: "#ORD-8976",
      customer: "Alice Johnson",
      amount: "$125.00",
      status: "Completed",
      statusColor: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      date: "March 1, 2025"
    },
    {
      id: "#ORD-8975",
      customer: "Bob Smith",
      amount: "$56.78",
      status: "Processing",
      statusColor: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      date: "February 28, 2025"
    },
    {
      id: "#ORD-8974",
      customer: "Carol Williams",
      amount: "$89.32",
      status: "Cancelled",
      statusColor: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      date: "February 27, 2025"
    },
    {
      id: "#ORD-8973",
      customer: "Dave Brown",
      amount: "$210.99",
      status: "Completed",
      statusColor: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      date: "February 27, 2025"
    },
    {
      id: "#ORD-8972",
      customer: "Eve Davis",
      amount: "$42.50",
      status: "Shipped",
      statusColor: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
      date: "February 26, 2025"
    }
  ];
  
  // Low stock alerts
  const lowStockAlerts = [
    {
      id: 1,
      product: "Wireless Headphones",
      stock: 3,
      image: "/api/placeholder/40/40"
    },
    {
      id: 2,
      product: "Premium T-Shirt",
      stock: 5,
      image: "/api/placeholder/40/40"
    },
    {
      id: 3,
      product: "Smart Watch",
      stock: 2,
      image: "/api/placeholder/40/40"
    }
  ];

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      navigate('/login');
    }
    
    // Fetch user data
    // This would normally be an API call
    // For now, we use mock data
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Sidebar navigation items
  const navigationItems = [
    { name: "Dashboard", icon: <FiHome />, path: "/dashboard" },
    { name: "Products", icon: <FiPackage />, path: "/dashboard/products" },
    { name: "Orders", icon: <FiShoppingBag />, path: "/dashboard/orders" },
    { name: "Customers", icon: <FiUsers />, path: "/dashboard/customers" },
    { name: "Analytics", icon: <FiBarChart2 />, path: "/dashboard/analytics" },
    { name: "Transactions", icon: <FiCreditCard />, path: "/dashboard/transactions" },
    { name: "Settings", icon: <FiSettings />, path: "/dashboard/settings" },
    { name: "Profile", icon: <FiUser />, path: "/dashboard/profile" }
  ];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div 
        className={`${
          isSidebarOpen ? "translate-x-0 w-64" : "-translate-x-full w-0 md:w-20 md:translate-x-0"
        } fixed md:sticky top-0 left-0 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-md transition-all duration-300 ease-in-out z-20`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <Link to="/" className={`flex items-center ${!isSidebarOpen && 'md:hidden'}`}>
              <FiShoppingBag className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-800 dark:text-white">MyShop</span>
            </Link>
            <button 
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none md:hidden"
            >
              {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
            <div className={`${isSidebarOpen ? 'hidden' : 'md:flex'} items-center justify-center`}>
              <FiShoppingBag className="h-8 w-8 text-primary-600" />
            </div>
          </div>

          {/* Sidebar Navigation */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="px-2 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="flex items-center px-2 py-3 text-base font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  <div className="flex items-center">
                    <span className="text-gray-500 dark:text-gray-400 mr-3">
                      {item.icon}
                    </span>
                    <span className={isSidebarOpen ? '' : 'md:hidden'}>{item.name}</span>
                  </div>
                </Link>
              ))}
            </nav>
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className={`flex items-center ${!isSidebarOpen && 'md:hidden'}`}>
              <img
                className="h-10 w-10 rounded-full"
                src={userData.avatar}
                alt={userData.name}
              />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-800 dark:text-white">
                  {userData.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {userData.role}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className={`mt-4 flex items-center px-2 py-2 text-base font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 w-full ${!isSidebarOpen && 'md:justify-center'}`}
            >
              <FiLogOut className="mr-3" />
              <span className={isSidebarOpen ? '' : 'md:hidden'}>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white dark:bg-gray-800 shadow-sm z-10">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none md:hidden"
            >
              <FiMenu size={24} />
            </button>
            <div className="flex-1 flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white ml-2 md:ml-0">Dashboard</h1>
              <div className="ml-4 flex items-center md:ml-6">
                {/* Notifications, user profile dropdown, etc. can go here */}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {dashboardStats.map((stat) => (
              <div key={stat.id} className={`card ${stat.color} border border-gray-200 dark:border-gray-700`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                  <div className="rounded-full p-3">
                    {stat.icon}
                  </div>
                </div>
                <div className="mt-4">
                  <span className={`text-sm ${stat.positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">from last month</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Orders */}
            <div className="lg:col-span-2">
              <div className="card">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Orders</h2>
                  <Link to="/dashboard/orders" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">View all</Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th className="px-4 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-4 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-4 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {order.id}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                            {order.customer}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                            {order.amount}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.statusColor}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                            {order.date}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Low Stock Alerts */}
            <div className="lg:col-span-1">
              <div className="card">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    <span className="flex items-center">
                      <FiAlertTriangle className="text-orange-500 mr-2" />
                      Low Stock Alerts
                    </span>
                  </h2>
                </div>
                <div className="space-y-4">
                  {lowStockAlerts.map((item) => (
                    <div key={item.id} className="flex items-center border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                      <img
                        src={item.image}
                        alt={item.product}
                        className="h-10 w-10 rounded-md object-cover"
                      />
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.product}
                        </p>
                        <p className="text-sm text-red-600 dark:text-red-400">
                          Only {item.stock} left in stock
                        </p>
                      </div>
                      <Link to={`/dashboard/products/${item.id}`} className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
                        Restock
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Upcoming Events Card */}
              <div className="card mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Upcoming Events</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-primary-100 dark:bg-primary-800 rounded-lg">
                      <span className="text-primary-800 dark:text-primary-200 font-bold">15</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Spring Sale Starts</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">March 15, 2025</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <span className="text-gray-800 dark:text-gray-200 font-bold">22</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Inventory Check</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">March 22, 2025</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;