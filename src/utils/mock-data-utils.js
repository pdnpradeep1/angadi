// src/utils/mock-data-utils.js

/**
 * Utility functions for generating mock data for development
 * This centralizes all mock data generation to avoid duplication
 */

/**
 * Generate mock deliveries
 * @param {number} count - Number of deliveries to generate
 * @param {string} statusFilter - Optional status filter
 * @returns {Array} Array of mock delivery objects
 */
export const generateMockDeliveries = (count, statusFilter) => {
    const statuses = ['PENDING', 'INTRANSIT', 'DELIVERED', 'CANCELLED', 'RETURNED'];
    const carriers = ["Express Logistics", "Swift Delivery", "Metro Couriers", "City Express"];
    
    // If we have a specific status filter, use it
    const statusToUse = statusFilter && statusFilter !== 'all' 
      ? statusFilter.toUpperCase() 
      : null;
    
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      trackingNumber: `TRK${100000 + i}`,
      orderNumber: `ORD-${1000 + i}`,
      customer: {
        name: `Customer ${i + 1}`,
        email: `customer${i + 1}@example.com`
      },
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
      estimatedDelivery: new Date(Date.now() + Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000).toISOString(),
      amount: Math.floor(Math.random() * 500) + 50,
      status: statusToUse || statuses[Math.floor(Math.random() * statuses.length)],
      carrierName: carriers[Math.floor(Math.random() * carriers.length)],
      deliveryAddress: `${123 + i} Main St, City, State, 10000`,
      currentLocation: {
        latitude: 12.9716 + (Math.random() * 0.1 - 0.05),
        longitude: 77.5946 + (Math.random() * 0.1 - 0.05),
        address: `${100 + i} Main St, City, State`,
        lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 120) * 60 * 1000).toISOString()
      }
    }));
  };
  
  /**
   * Generate a mock delivery detail
   * @param {string|number} id - Delivery ID
   * @returns {Object} A mock delivery detail object
   */
  export const generateMockDelivery = (id) => {
    return {
      id: parseInt(id),
      trackingNumber: `TRK${100000 + parseInt(id)}`,
      orderNumber: `ORD-${1000 + parseInt(id)}`,
      orderLink: `/store-dashboard/${parseInt(id)}/orders/view/${1000 + parseInt(id)}`,
      customerName: 'John Doe',
      customerEmail: 'john.doe@example.com',
      customerPhone: '+91 98765 43210',
      carrierName: 'Express Logistics',
      carrierPhone: '+91 87654 32109',
      carrierWebsite: 'https://expresslogistics.com',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      actualDelivery: null,
      status: 'INTRANSIT',
      weight: '2.5 kg',
      dimensions: '30 x 20 x 10 cm',
      shippingMethod: 'Standard',
      signature: true,
      notes: 'Please handle with care. Fragile items inside.',
      shippingAddress: {
        name: 'John Doe',
        addressLine1: '123 Main Street',
        addressLine2: 'Apartment 4B',
        city: 'Bangalore',
        state: 'Karnataka',
        postalCode: '560001',
        country: 'India'
      },
      items: [
        {
          id: 1,
          productName: 'Premium Kaju Chikki',
          quantity: 2,
          weight: '0.5 kg',
          image: '/api/placeholder/50/50'
        },
        {
          id: 2,
          productName: 'Dry Fruits Mix',
          quantity: 1,
          weight: '1.5 kg',
          image: '/api/placeholder/50/50'
        }
      ]
    };
  };
  
  /**
   * Generate mock tracking history for a delivery
   * @param {string|number} id - Delivery ID
   * @returns {Array} Array of tracking history events
   */
  export const generateMockTrackingHistory = (id) => {
    return [
      {
        id: 1,
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Order Placed',
        location: 'Online',
        description: 'Order has been placed and payment received.'
      },
      {
        id: 2,
        timestamp: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Processing',
        location: 'Fulfillment Center, Bangalore',
        description: 'Order is being prepared for shipment.'
      },
      {
        id: 3,
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Shipped',
        location: 'Fulfillment Center, Bangalore',
        description: 'Package has been picked up by carrier.'
      },
      {
        id: 4,
        timestamp: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'In Transit',
        location: 'Bangalore Sorting Facility',
        description: 'Package is in transit to the next facility.'
      },
      {
        id: 5,
        timestamp: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Out for Delivery',
        location: 'Local Delivery Center',
        description: 'Package is out for delivery.'
      }
    ];
  };
  
  /**
   * Generate a mock order
   * @param {string|number} id - Order ID
   * @returns {Object} A mock order object
   */
  export const generateMockOrder = (id) => {
    return {
      id: parseInt(id),
      orderNumber: `ORD-${1000 + parseInt(id)}`,
      customerName: 'John Doe',
      customerEmail: 'john.doe@example.com',
      subtotal: 799.99,
      shippingCost: 10.00,
      tax: 8.00,
      discount: 0,
      totalAmount: 817.99,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      notes: 'Customer requested gift wrapping',
      paymentMethod: 'CASH_ON_DELIVERY',
      paymentStatus: 'PENDING',
      orderItems: [
        {
          id: 1,
          productName: 'iPhone 13',
          quantity: 1,
          price: 799.99,
          total: 799.99,
          productImageUrl: '/api/placeholder/50/50'
        }
      ],
      shippingAddressLine1: '123 Main Street',
      shippingAddressLine2: null,
      shippingCity: 'San Francisco',
      shippingState: 'CA',
      shippingPostalCode: '94105',
      shippingCountry: 'USA'
    };
  };
  
  /**
   * Generate mock analytics data
   * @returns {Object} Analytics data with summary metrics and daily data
   */
  export const generateMockAnalyticsData = () => {
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
  
  /**
   * Generate mock orders for order listing
   * @param {number} count - Number of orders to generate
   * @param {string} statusFilter - Optional status filter
   * @returns {Array} Array of mock order objects
   */
  export const generateMockOrders = (count, statusFilter) => {
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
  
  /**
   * Generate mock customers
   * @param {number} count - Number of customers to generate
   * @returns {Array} Array of mock customer objects
   */
  export const generateMockCustomers = (count) => {
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
  
    return customers;
  };

  /**
 * Generate mock products
 * @param {number} count - Number of products to generate
 * @returns {Array} Array of mock product objects
 */
export const generateMockProducts = (count) => {
    const categories = ['Sweets', 'Snacks', 'Dry Fruits'];
    const inventoryStatuses = ['Unlimited', 'Limited', 'Out of Stock'];
    const productStatuses = ['Active', 'Inactive'];
  
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: [
        'Karapu Boondi', 
        'Kaju Chikki', 
        'Sajja Buralu', 
        'Ghee Jaggery Laddu', 
        'Dry Fruits Bar', 
        'Cashew Mix', 
        'Almond Barfi'
      ][i % 7],
      price: Math.floor(Math.random() * 500) + 50,
      originalPrice: Math.floor(Math.random() * 600) + 100,
      category: categories[Math.floor(Math.random() * categories.length)],
      inventory: inventoryStatuses[Math.floor(Math.random() * inventoryStatuses.length)],
      status: productStatuses[Math.floor(Math.random() * productStatuses.length)],
      image: `/api/placeholder/50/50?text=${i + 1}`,
      description: 'A delicious traditional Indian sweet/snack',
      stockQuantity: Math.floor(Math.random() * 100) + 10
    }));
  };