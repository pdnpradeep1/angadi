import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { 
  FiCalendar, 
  FiDollarSign, 
  FiShoppingBag, 
  FiUsers, 
  FiBarChart2, 
  FiArrowRight,
  FiAlertCircle,
  FiInfo
} from "react-icons/fi";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const StoreAnalytics = () => {
  const { storeId } = useParams();
  const [timeframe, setTimeframe] = useState("last30days");
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, [storeId, timeframe]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('jwtToken');
      
      // In a production environment, you would fetch real data:
      // const response = await axios.get(`http://localhost:8080/analytics/${storeId}?timeframe=${timeframe}`, {
      //   headers: { 'Authorization': `Bearer ${token}` }
      // });
      // setAnalyticsData(response.data);
      
      // For development, use mock data
      setTimeout(() => {
        const mockData = generateMockAnalyticsData();
        setAnalyticsData(mockData);
        setLoading(false);
      }, 800);
    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setError('Failed to load analytics data. Please try again.');
      setLoading(false);
    }
  };

  const generateMockAnalyticsData = () => {
    // Create date range for the past 30 days
    const dateRange = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      dateRange.push(date.toISOString().split('T')[0]);
    }

    // Generate mock sales data
    const salesData = dateRange.map(date => {
      const orderCount = Math.floor(Math.random() * 4); // 0 to 3 orders per day
      const orderValue = orderCount > 0 ? Math.floor(Math.random() * 2000) + 500 : 0; // ₹500 to ₹2500 per order
      
      return {
        date,
        orders: orderCount,
        sales: orderValue,
        visitors: Math.floor(Math.random() * 100) + 20, // 20 to 120 visitors
      };
    });

    // Simulate a spike for visual interest
    const spikeIndex = Math.floor(salesData.length / 2);
    salesData[spikeIndex].orders = 4;
    salesData[spikeIndex].sales = 1750;
    salesData[spikeIndex].visitors = 150;

    // Prepare summary metrics
    const totalOrders = salesData.reduce((sum, day) => sum + day.orders, 0);
    const totalSales = salesData.reduce((sum, day) => sum + day.sales, 0);
    const totalVisitors = salesData.reduce((sum, day) => sum + day.visitors, 0);
    const averageOrderValue = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;
    const averageOrdersPerDay = Math.round((totalOrders / salesData.length) * 10) / 10;
    const averageSalesPerDay = Math.round(totalSales / salesData.length);
    const conversionRate = totalVisitors > 0 ? (totalOrders / totalVisitors) * 100 : 0;
    
    return {
      summary: {
        totalOrders,
        totalSales,
        totalVisitors,
        averageOrderValue,
        averageOrdersPerDay,
        averageSalesPerDay,
        conversionRate,
        returningCustomers: 0 // Not enough data for this calculation
      },
      dailyData: salesData,
      topRegions: [
        { name: "Guntur", sales: totalSales, percentage: 100 }
      ],
      trafficSources: [] // Not enough data for this calculation
    };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${Math.round(value * 10) / 10}%`;
  };

  const handleTimeframeChange = (e) => {
    setTimeframe(e.target.value);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-md">
        <div className="flex items-center">
          <FiAlertCircle className="text-red-500 mr-2" size={20} />
          <span className="text-red-700 dark:text-red-400">{error}</span>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="text-center py-6">
        <FiInfo className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-gray-600 dark:text-gray-400">No analytics data available.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sales analytics</h1>
        
        <div className="mt-4 md:mt-0 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiCalendar className="text-gray-400" />
          </div>
          <select
            value={timeframe}
            onChange={handleTimeframeChange}
            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="last7days">Last 7 days</option>
            <option value="last30days">Last 30 days</option>
            <option value="thisMonth">This month</option>
            <option value="lastMonth">Last month</option>
            <option value="thisYear">This year</option>
          </select>
        </div>
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Average Orders Per Day */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
              Average orders per day
              <button className="ml-1 text-gray-400 hover:text-gray-500">
                <FiInfo size={16} />
              </button>
            </h3>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            {analyticsData.summary.averageOrdersPerDay}
          </p>
        </div>

        {/* Average Order Value */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
              Average order value
              <button className="ml-1 text-gray-400 hover:text-gray-500">
                <FiInfo size={16} />
              </button>
            </h3>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            ₹{analyticsData.summary.averageOrderValue}
          </p>
        </div>

        {/* Average Sales Per Day */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
              Average sales per day
              <button className="ml-1 text-gray-400 hover:text-gray-500">
                <FiInfo size={16} />
              </button>
            </h3>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            ₹{analyticsData.summary.averageSalesPerDay}
          </p>
        </div>

        {/* Returning Customers */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
              Returning customers
              <button className="ml-1 text-gray-400 hover:text-gray-500">
                <FiInfo size={16} />
              </button>
            </h3>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            {formatPercentage(analyticsData.summary.returningCustomers)}
          </p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Total Orders Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              Total orders
              <button className="ml-1 text-gray-400 hover:text-gray-500">
                <FiInfo size={16} />
              </button>
            </h3>
          </div>
          <div className="font-bold text-3xl text-gray-900 dark:text-white mb-4">
            {analyticsData.summary.totalOrders}
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={analyticsData.dailyData}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }} 
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`;
                  }}
                  interval={Math.floor(analyticsData.dailyData.length / 5)}
                />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value) => [`${value} orders`, 'Orders']}
                  labelFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString();
                  }}
                />
                <Line type="monotone" dataKey="orders" stroke="#6366f1" dot={{ r: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-center">
            <button className="text-primary-600 dark:text-primary-400 text-sm font-medium flex items-center mx-auto">
              View detailed report <FiArrowRight className="ml-1" />
            </button>
          </div>
        </div>

        {/* Gross Sales Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              Gross sales
              <button className="ml-1 text-gray-400 hover:text-gray-500">
                <FiInfo size={16} />
              </button>
            </h3>
            <button className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
              View breakdown
            </button>
          </div>
          <div className="font-bold text-3xl text-gray-900 dark:text-white mb-4">
            ₹{analyticsData.summary.totalSales}
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={analyticsData.dailyData}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }} 
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`;
                  }}
                  interval={Math.floor(analyticsData.dailyData.length / 5)}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip 
                  formatter={(value) => [formatCurrency(value), 'Sales']}
                  labelFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString();
                  }}
                />
                <Line type="monotone" dataKey="sales" stroke="#6366f1" dot={{ r: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-center">
            <button className="text-primary-600 dark:text-primary-400 text-sm font-medium flex items-center mx-auto">
              View detailed report <FiArrowRight className="ml-1" />
            </button>
          </div>
        </div>

        {/* Store Conversion Rate */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              STORE CONVERSION RATE
              <button className="ml-1 text-gray-400 hover:text-gray-500">
                <FiInfo size={16} />
              </button>
            </h3>
          </div>
          <div className="font-bold text-3xl text-gray-900 dark:text-white mb-4">
            {formatPercentage(analyticsData.summary.conversionRate)}
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={analyticsData.dailyData.map(item => ({
                  ...item,
                  conversionRate: item.visitors > 0 ? (item.orders / item.visitors) * 100 : 0
                }))}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }} 
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`;
                  }}
                  interval={Math.floor(analyticsData.dailyData.length / 5)}
                />
                <YAxis 
                  tickFormatter={(value) => `${value}%`}
                  domain={[0, 'dataMax + 1']}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value) => [`${Math.round(value * 10) / 10}%`, 'Conversion Rate']}
                  labelFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString();
                  }}
                />
                <Line type="monotone" dataKey="conversionRate" stroke="#6366f1" dot={{ r: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Sales by Region and Traffic Source */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              Sales by top region
              <button className="ml-1 text-gray-400 hover:text-gray-500">
                <FiInfo size={16} />
              </button>
            </h3>
          </div>
          
          {analyticsData.topRegions.length > 0 ? (
            <div className="space-y-4">
              {analyticsData.topRegions.map((region, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{index + 1}. {region.name}</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{region.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full" 
                      style={{ width: `${region.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500 dark:text-gray-400">Not enough data to show.</p>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              Sales by traffic source
              <button className="ml-1 text-gray-400 hover:text-gray-500">
                <FiInfo size={16} />
              </button>
            </h3>
          </div>
          
          <div className="text-center py-6">
            <p className="text-gray-500 dark:text-gray-400">Not enough data to show.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreAnalytics;