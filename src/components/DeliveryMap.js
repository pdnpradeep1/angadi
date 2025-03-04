import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FiTruck, FiFilter, FiPackage, FiRefreshCw, FiSearch } from "react-icons/fi";
import axios from "axios";

const DeliveryMap = () => {
  const { storeId } = useParams();
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [filterStatus, setFilterStatus] = useState('INTRANSIT');
  const [searchTerm, setSearchTerm] = useState('');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    fetchActiveDeliveries();
    initializeMap();

    // Set up auto-refresh every 2 minutes
    const refreshInterval = setInterval(() => {
      fetchActiveDeliveries();
    }, 120000);

    return () => clearInterval(refreshInterval);
  }, [storeId, filterStatus]);

  const initializeMap = () => {
    // This would normally use Google Maps or Mapbox APIs
    // For this demo, we'll simulate map loading
    setTimeout(() => {
      setMapLoaded(true);
      // In a real implementation, you would initialize the map here
      // and store the map instance in state
      setMap({ centerLat: 12.9716, centerLng: 77.5946 }); // Bangalore coordinates
    }, 1000);
  };

  const fetchActiveDeliveries = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('jwtToken');
      
      const response = await axios.get(
        `http://localhost:8080/delivery/store/${storeId}/map?status=${filterStatus}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      setDeliveries(response.data);
      
      // If there's a selected delivery, update its info
      if (selectedDelivery) {
        const updated = response.data.find(d => d.id === selectedDelivery.id);
        if (updated) {
          setSelectedDelivery(updated);
        }
      }
      
      // Update map markers
      updateMapMarkers(response.data);
    } catch (err) {
      console.error('Error fetching active deliveries:', err);
      setError('Failed to load active deliveries. Please try again.');
      
      // For development, use mock data if API fails
      if (process.env.NODE_ENV === 'development') {
        const mockDeliveries = generateMockDeliveries(10);
        setDeliveries(mockDeliveries);
        updateMapMarkers(mockDeliveries);
      }
    } finally {
      setLoading(false);
    }
  };
  
  const updateMapMarkers = (deliveries) => {
    // In a real implementation, this would create map markers
    // For now, just simulate the markers
    const newMarkers = deliveries.map(delivery => ({
      id: delivery.id,
      lat: delivery.currentLocation?.latitude || (12.9716 + (Math.random() * 0.1 - 0.05)),
      lng: delivery.currentLocation?.longitude || (77.5946 + (Math.random() * 0.1 - 0.05)),
      status: delivery.status
    }));
    
    setMarkers(newMarkers);
  };
  
  // Helper function to generate mock delivery data for development
  const generateMockDeliveries = (count) => {
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      trackingNumber: `TRK${100000 + i}`,
      orderNumber: `ORD-${1000 + i}`,
      customerName: `Customer ${i + 1}`,
      status: filterStatus,
      carrierName: ['Express Logistics', 'Swift Delivery', 'Metro Couriers'][Math.floor(Math.random() * 3)],
      estimatedDelivery: new Date(Date.now() + Math.floor(Math.random() * 48) * 60 * 60 * 1000).toISOString(),
      driverName: `Driver ${i + 1}`,
      driverPhone: '+91 98765 4321' + i,
      currentLocation: {
        latitude: 12.9716 + (Math.random() * 0.1 - 0.05),
        longitude: 77.5946 + (Math.random() * 0.1 - 0.05),
        address: `${100 + i} Main St, Bangalore, Karnataka, India`,
        lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 30) * 60 * 1000).toISOString()
      },
      destination: {
        latitude: 12.9716 + (Math.random() * 0.2 - 0.1),
        longitude: 77.5946 + (Math.random() * 0.2 - 0.1),
        address: `${200 + i} Park Avenue, Bangalore, Karnataka, India`
      }
    }));
  };
  
  const handleRefresh = () => {
    fetchActiveDeliveries();
  };
  
  const handleStatusFilter = (status) => {
    setFilterStatus(status);
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    // Filter deliveries locally for now
    // In production, you would send the search term to the API
  };
  
  const handleSelectDelivery = (delivery) => {
    setSelectedDelivery(delivery);
    
    // In a real implementation, you would center the map on this delivery
    if (map) {
      // Center map on delivery location
      console.log(`Centering map on delivery ${delivery.id}`);
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const getTimeSinceUpdate = (dateString) => {
    if (!dateString) return 'Unknown';
    
    const lastUpdate = new Date(dateString);
    const now = new Date();
    const diffMs = now - lastUpdate;
    
    // Convert to minutes
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins === 1) return '1 minute ago';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    
    // Convert to hours
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return '1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    // If more than 24 hours, return formatted date
    return formatDate(dateString);
  };
  
  // Filter deliveries based on search term
  const filteredDeliveries = searchTerm
    ? deliveries.filter(
        delivery =>
          delivery.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          delivery.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          delivery.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          delivery.carrierName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : deliveries;

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <FiTruck className="mr-2" /> Live Delivery Tracking
          </h1>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <form onSubmit={handleSearch} className="relative flex-1 md:w-64">
              <input
                type="text"
                placeholder="Search deliveries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm pl-10"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <button type="submit" className="hidden">Search</button>
            </form>
            
            <div className="relative group">
              <button
                className="px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md flex items-center gap-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <FiFilter /> Status: {filterStatus.charAt(0) + filterStatus.slice(1).toLowerCase()}
              </button>
              <div className="hidden group-hover:block absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700">
                <div className="py-1">
                  <button
                    onClick={() => handleStatusFilter('INTRANSIT')}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      filterStatus === 'INTRANSIT'
                        ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    In Transit
                  </button>
                  <button
                    onClick={() => handleStatusFilter('PENDING')}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      filterStatus === 'PENDING'
                        ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => handleStatusFilter('ALL')}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      filterStatus === 'ALL'
                        ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    All Active
                  </button>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleRefresh}
              className="p-2 bg-primary-600 text-white rounded-md flex items-center justify-center hover:bg-primary-700"
              title="Refresh"
            >
              <FiRefreshCw />
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-3">
        {/* Deliveries List */}
        <div className="md:col-span-1 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Active Deliveries</h2>
            
            {loading ? (
              <div className="flex items-center justify-center h-20">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                <span className="ml-2 text-gray-600 dark:text-gray-400">Loading deliveries...</span>
              </div>
            ) : error ? (
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md text-sm text-red-700 dark:text-red-400">
                {error}
              </div>
            ) : filteredDeliveries.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 p-4 rounded-md text-center">
                <FiPackage className="h-8 w-8 mx-auto text-gray-400" />
                <p className="mt-2 text-gray-600 dark:text-gray-400">No active deliveries found.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredDeliveries.map((delivery) => (
                  <button
                    key={delivery.id}
                    onClick={() => handleSelectDelivery(delivery)}
                    className={`block w-full text-left p-3 rounded-md border ${
                      selectedDelivery?.id === delivery.id
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-500'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{delivery.trackingNumber}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Order: {delivery.orderNumber}</div>
                      </div>
                      <div className="flex items-center">
                        <span className="flex h-2 w-2 relative">
                          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                            delivery.status === 'INTRANSIT' ? 'bg-blue-500' : 'bg-yellow-500'
                          }`}></span>
                          <span className={`relative inline-flex rounded-full h-2 w-2 ${
                            delivery.status === 'INTRANSIT' ? 'bg-blue-500' : 'bg-yellow-500'
                          }`}></span>
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <FiTruck className="mr-1" /> {delivery.carrierName}
                    </div>
                    
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Last update: {getTimeSinceUpdate(delivery.currentLocation?.lastUpdated)}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Map View */}
        <div className="md:col-span-2 relative">
          {!mapLoaded ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              <span className="ml-3 text-gray-600 dark:text-gray-400">Loading map...</span>
            </div>
          ) : (
            <>
              {/* This would be replaced with an actual map component */}
              <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-600 dark:text-gray-400 mb-2">Map Placeholder</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {markers.length} delivery vehicles displayed
                  </p>
                </div>
              </div>
              
              {/* Map Overlay for Selected Delivery */}
              {selectedDelivery && (
                <div className="absolute bottom-4 left-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700 max-w-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">{selectedDelivery.trackingNumber}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Order: {selectedDelivery.orderNumber}</p>
                    </div>
                    <button 
                      onClick={() => setSelectedDelivery(null)}
                      className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                    >
                      ×
                    </button>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Current Location</p>
                      <p className="text-sm text-gray-900 dark:text-white mt-1">{selectedDelivery.currentLocation?.address || 'Unknown'}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Destination</p>
                      <p className="text-sm text-gray-900 dark:text-white mt-1">{selectedDelivery.destination?.address || 'Unknown'}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Driver</p>
                      <p className="text-sm text-gray-900 dark:text-white mt-1">{selectedDelivery.driverName || 'Not assigned'}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Estimated Delivery</p>
                      <p className="text-sm text-gray-900 dark:text-white mt-1">{formatDate(selectedDelivery.estimatedDelivery)}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center text-sm">
                    <div className="text-gray-500 dark:text-gray-400">
                      Last update: {getTimeSinceUpdate(selectedDelivery.currentLocation?.lastUpdated)}
                    </div>
                    
                    <a
                      href={`tel:${selectedDelivery.driverPhone}`}
                      className="text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      Contact Driver
                    </a>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveryMap;