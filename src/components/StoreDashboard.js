import React, { useState, useEffect } from "react";
import { useParams, Outlet, useNavigate, Link } from "react-router-dom";
import StoreSidebar from "./StoreSidebar";
import ProductList from "./ProductList";
import { FiPackage, FiTruck, FiBarChart2, FiUsers, FiSettings, FiLoader } from "react-icons/fi";
import axios from "axios";

const StoreDashboard = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      navigate('/login');
      return;
    }

    // Fetch store data
    const fetchStoreData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Make API request to get store details
        const response = await axios.get(`http://localhost:8080/api/stores/stores/${storeId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log('Store details:', response.data);
        setStore(response.data);
      } catch (error) {
        console.error('Error fetching store details:', error);
        setError('Failed to load store data. Please try again.');
        
        // For development: Use mock data if API fails
        if (process.env.NODE_ENV === 'development') {
          console.log('Using mock data for development');
          const mockStore = {
            id: storeId,
            name: "Store " + storeId,
            description: "This is a mock store description for development",
            address: "123 Mock Street",
            active: true,
            logo: "/api/placeholder/100/100",
            stats: {
              totalSales: "$15,345",
              totalOrders: 256,
              activeProducts: 32,
              customers: 189
            },
            recentOrders: [
              { id: "ORD-1023", customer: "Raj Sharma", amount: "$120", status: "Completed", date: "March 1, 2025" },
              { id: "ORD-1022", customer: "Priya Patel", amount: "$85", status: "Processing", date: "February 28, 2025" },
              { id: "ORD-1021", customer: "Amit Kumar", amount: "$210", status: "Shipped", date: "February 27, 2025" }
            ],
            topProducts: [
              { id: 1, name: "Product A", sales: 243, revenue: "$12,150" },
              { id: 2, name: "Product B", sales: 187, revenue: "$9,350" },
              { id: 3, name: "Product C", sales: 156, revenue: "$7,800" }
            ]
          };
          setStore(mockStore);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStoreData();
  }, [storeId, navigate]);

  // If outlet is rendered, show that instead of dashboard content
  const hasOutlet = window.location.pathname.includes('all-products') || 
  window.location.pathname.includes('inventory');

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
          <div className="flex items-center">
            <div className="flex-shrink-0 rounded-full p-3 bg-primary-100 dark:bg-primary-800">
              <FiPackage className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Total Sales</p>
              <p className="text-2xl font-bold text-primary-700 dark:text-primary-400">{store?.stats?.totalSales || "$0"}</p>
            </div>
          </div>
        </div>
        <div className="card bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
          <div className="flex items-center">
            <div className="flex-shrink-0 rounded-full p-3 bg-purple-100 dark:bg-purple-800">
              <FiBarChart2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Total Orders</p>
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">{store?.stats?.totalOrders || "0"}</p>
            </div>
          </div>
        </div>
        <div className="card bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
          <div className="flex items-center">
            <div className="flex-shrink-0 rounded-full p-3 bg-green-100 dark:bg-green-800">
              <FiPackage className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Active Products</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-400">{store?.stats?.activeProducts || "0"}</p>
            </div>
          </div>
        </div>
        <div className="card bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
          <div className="flex items-center">
            <div className="flex-shrink-0 rounded-full p-3 bg-amber-100 dark:bg-amber-800">
              <FiUsers className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Total Customers</p>
              <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">{store?.stats?.customers || "0"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders and Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Orders</h3>
            <Link to="/dashboard/orders" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Order ID</th>
                  <th className="px-4 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {store?.recentOrders?.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{order.id}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{order.customer}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{order.amount}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${order.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 
                          order.status === 'Processing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : 
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {(!store?.recentOrders || store.recentOrders.length === 0) && (
                  <tr>
                    <td colSpan="4" className="px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      No recent orders available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Top Products</h3>
            <Link to="all-products" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">View all products</Link>
          </div>
          <div className="space-y-4">
            {store?.topProducts?.map((product) => (
              <div key={product.id} className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-primary-100 dark:bg-primary-900 rounded-md flex items-center justify-center text-primary-600 dark:text-primary-400">
                    <FiPackage />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{product.sales} units sold</p>
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">{product.revenue}</div>
              </div>
            ))}
            {(!store?.topProducts || store.topProducts.length === 0) && (
              <div className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
                No top products available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <FiLoader className="animate-spin h-10 w-10 text-primary-600 mx-auto" />
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Loading store dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && !store) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-4">❌</div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Error Loading Dashboard</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <Link to="/stores" className="btn btn-primary">Return to Stores</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar with store data passed in */}
      <StoreSidebar store={store} />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <header className="bg-white dark:bg-gray-800 shadow-sm p-4 md:p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {store?.name || 'Store Dashboard'}
              {store?.active === false && (
                <span className="ml-2 text-sm font-medium text-red-500 dark:text-red-400">
                  (Inactive)
                </span>
              )}
            </h1>
            <Link 
              to="/store-dashboard/settings" 
              className="p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FiSettings size={20} />
            </Link>
          </div>
          
          {/* Store description if available */}
          {store?.description && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {store.description}
            </p>
          )}
          
          {/* Tabs for different dashboard views */}
          {!hasOutlet && (
            <div className="flex space-x-4 mt-4 border-b border-gray-200 dark:border-gray-700">
              <button
                className={`pb-2 px-1 text-sm font-medium ${
                  activeTab === 'overview'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button
                className={`pb-2 px-1 text-sm font-medium ${
                  activeTab === 'sales'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
                onClick={() => setActiveTab('sales')}
              >
                Sales
              </button>
              <button
                className={`pb-2 px-1 text-sm font-medium ${
                  activeTab === 'customers'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
                onClick={() => setActiveTab('customers')}
              >
                Customers
              </button>
            </div>
          )}
        </header>

        <div className="p-4 md:p-6">
          {/* Show outlet content if available, otherwise show dashboard overview */}
          {hasOutlet ? <Outlet /> : renderOverviewTab()}
        </div>
      </div>
    </div>
  );
};

export default StoreDashboard;