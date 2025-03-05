import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  FiSave, 
  FiShoppingBag, 
  FiGlobe, 
  FiUsers, 
  FiBell, 
  FiCreditCard, 
  FiShoppingCart, 
  FiPackage, 
  FiTruck, 
  FiRefreshCw, 
  FiPercent, 
  FiDollarSign, 
  FiSearch, 
  FiGlobe as FiLanguage,
  FiHelpCircle,
  FiFileText,
  FiClock
} from "react-icons/fi";
import axios from "axios";

const StoreSettings = () => {
  const { storeId } = useParams();
  const [loading, setLoading] = useState(true);
  const [store, setStore] = useState({
    name: "",
    url: "",
    email: "",
    phone: "",
    country: "",
    address: ""
  });
  const [activeSetting, setActiveSetting] = useState("store-details");

  useEffect(() => {
    const fetchStoreData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('jwtToken');
        if (!token) throw new Error("No authentication token found");

        // For development, use mock data
        setTimeout(() => {
          setStore({
            name: "Hari Inti Ruchulu",
            url: "harintiruchulu",
            email: "pdnpradeep1@gmail.com",
            phone: "0123456789",
            country: "India (₹)",
            address: ""
          });
          setLoading(false);
        }, 500);

        // In production, you would use:
        /*
        const response = await axios.get(`http://localhost:8080/api/stores/${storeId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setStore(response.data);
        */
      } catch (error) {
        console.error("Error fetching store data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreData();
  }, [storeId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStore(prevStore => ({
      ...prevStore,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) throw new Error("No authentication token found");

      // For demonstration, log the data that would be saved
      console.log("Saving store data:", store);

      // In production, you would use:
      /*
      await axios.put(`http://localhost:8080/api/stores/${storeId}`, store, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      */

      // Show success notification or feedback
      alert("Store settings saved successfully!");
    } catch (error) {
      console.error("Error saving store data:", error);
      alert("Failed to save store settings. Please try again.");
    }
  };

  const handleDeleteStore = () => {
    if (window.confirm("Are you sure you want to delete this store? This action cannot be undone.")) {
      // Delete store logic
      console.log("Deleting store:", storeId);
      
      // In production, you would use:
      /*
      const token = localStorage.getItem('jwtToken');
      await axios.delete(`http://localhost:8080/api/stores/${storeId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      */
    }
  };

  const handleViewAuthToken = () => {
    // Logic to view API auth token
    console.log("Viewing auth token");
    
    // In production, this would show a modal with the token
    alert("Auth Token: YOUR_API_TOKEN_HERE");
  };

  const renderNavItem = (id, label, icon) => {
    return (
      <div 
        className={`flex items-center p-3 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
          activeSetting === id 
            ? "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400" 
            : "text-gray-700 dark:text-gray-300"
        }`}
        onClick={() => setActiveSetting(id)}
      >
        {icon}
        <span className="ml-3">{label}</span>
      </div>
    );
  };

  const renderStoreDetails = () => {
    return (
      <div>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Store details</h2>
          <p className="text-gray-600 dark:text-gray-400">Update and customize your store's information.</p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Store Link
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 py-2 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 sm:text-sm">
                  mydukaan.io/
                </span>
                <input
                  type="text"
                  name="url"
                  value={store.url}
                  onChange={handleInputChange}
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Store Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={store.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Mobile Number
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 py-2 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 sm:text-sm">
                  <div className="flex items-center">
                    <img src="/api/placeholder/20/15" alt="India flag" className="mr-1" />
                    <span>+91</span>
                  </div>
                </span>
                <input
                  type="text"
                  name="phone"
                  value={store.phone}
                  onChange={handleInputChange}
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none border border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <span className="inline-flex items-center px-3 py-2 rounded-r-md border border-l-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-primary-600 dark:text-primary-400 sm:text-sm">
                  VERIFY
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Country <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="country"
                value={store.country}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                readOnly
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={store.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Store Address
            </label>
            <textarea
              name="address"
              value={store.address}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="text-right">
            <button 
              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm mr-4"
              onClick={handleDeleteStore}
            >
              Delete my store
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderDeveloperTools = () => {
    return (
      <div>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Developer tools</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Use the Dukaan APIs to integrate dukaan services in your apps. 
            <a href="#" className="text-primary-600 dark:text-primary-400 ml-1">View API docs</a>
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleViewAuthToken}
            className="px-4 py-2 bg-primary-600 text-white rounded-md text-sm hover:bg-primary-700"
          >
            View auth token
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 shadow-sm border-r border-gray-200 dark:border-gray-700 overflow-y-auto hidden md:block">
        <div className="p-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Store settings</h2>
          <div className="space-y-1">
            {renderNavItem("store-details", "Store details", <FiShoppingBag className="h-5 w-5" />)}
            {renderNavItem("domains", "Domains", <FiGlobe className="h-5 w-5" />)}
            {renderNavItem("staffs-accounts", "Staffs accounts", <FiUsers className="h-5 w-5" />)}
            {renderNavItem("notifications", "Notifications", <FiBell className="h-5 w-5" />)}
            {renderNavItem("payments", "Payments", <FiCreditCard className="h-5 w-5" />)}
            {renderNavItem("checkout", "Checkout", <FiShoppingCart className="h-5 w-5" />)}
            {renderNavItem("warehouse", "Warehouse", <FiPackage className="h-5 w-5" />)}
            {renderNavItem("delivery", "Delivery", <FiTruck className="h-5 w-5" />)}
            {renderNavItem("returns", "Returns", <FiRefreshCw className="h-5 w-5" />)}
            {renderNavItem("tax", "Tax", <FiPercent className="h-5 w-5" />)}
            {renderNavItem("extra-charges", "Extra charges", <FiDollarSign className="h-5 w-5" />)}
            {renderNavItem("seo", "SEO", <FiSearch className="h-5 w-5" />)}
            {renderNavItem("languages", "Languages", <FiLanguage className="h-5 w-5" />)}
            {renderNavItem("support-social", "Support & Social", <FiHelpCircle className="h-5 w-5" />)}
            {renderNavItem("policies", "Policies", <FiFileText className="h-5 w-5" />)}
            {renderNavItem("store-timings", "Store timings", <FiClock className="h-5 w-5" />)}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
            {activeSetting === "store-details" && renderStoreDetails()}
            {activeSetting !== "store-details" && renderDeveloperTools()}
          </div>
        </div>

        {/* Save Button (Fixed at the bottom) */}
        <div className="fixed bottom-0 right-0 p-4">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 flex items-center"
          >
            <FiSave className="mr-2" /> Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoreSettings;