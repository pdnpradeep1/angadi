import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  FiHome, 
  FiPackage, 
  FiTruck, 
  FiBarChart2, 
  FiUsers, 
  FiSettings, 
  FiShoppingBag,
  FiCreditCard,
  FiGrid,
  FiList,
  FiChevronDown,
  FiChevronRight,
  FiLogOut
} from "react-icons/fi";

const StoreSidebar = ({ store }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProductsOpen, setIsProductsOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleProducts = () => {
    setIsProductsOpen(!isProductsOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    navigate('/login');
  };

  const getStoreId = () => {
    // Extract store ID from URL
    const pathParts = location.pathname.split('/');
    const storeIdIndex = pathParts.findIndex(part => part === 'store-dashboard') + 1;
    return pathParts[storeIdIndex] || '';
  };

  const storeId = getStoreId();

  const menuItems = [
    { name: "Dashboard", icon: <FiHome />, path: `/store-dashboard/${storeId}` },
    { name: "Orders", icon: <FiShoppingBag />, path: `/store-dashboard/${storeId}/orders` },
    { name: "Delivery", icon: <FiTruck />, path: `/store-dashboard/${storeId}/delivery` },
    { 
      name: "Products", 
      icon: <FiPackage />, 
      path: `/store-dashboard/${storeId}/products`,
      subItems: [
        { name: "All Products", path: `/store-dashboard/${storeId}/all-products`, count: "32" },
        { name: "Categories", path: `/store-dashboard/${storeId}/categories`, count: "8" },
        { name: "Inventory", path: `/store-dashboard/${storeId}/inventory` }
      ]
    },
    { name: "Analytics", icon: <FiBarChart2 />, path: `/store-dashboard/${storeId}/analytics` },
    { name: "Audience", icon: <FiUsers />, path: `/store-dashboard/${storeId}/audience` },
    { name: "Payments", icon: <FiCreditCard />, path: `/store-dashboard/${storeId}/payments` },
    { name: "Settings", icon: <FiSettings />, path: `/store-dashboard/${storeId}/settings` }
  ];

  const isActive = (path) => {
    return location.pathname === path || 
           (path !== `/store-dashboard/${storeId}` && location.pathname.startsWith(path));
  };

  return (
    <aside className="w-64 bg-secondary-800 text-white min-h-screen hidden md:block overflow-y-auto">
      <div className="p-5">
        {/* Store Info */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold">
            {store?.name?.charAt(0) || 'S'}
          </div>
          <div>
            <h2 className="text-lg font-semibold truncate max-w-[180px]">{store?.name || 'Store'}</h2>
            <Link 
              to="/stores" 
              className="text-xs text-secondary-400 hover:text-white transition duration-150"
            >
              Back to My Stores
            </Link>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-8">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                {item.subItems ? (
                  <div>
                    <button
                      onClick={toggleProducts}
                      className={`w-full flex items-center justify-between p-3 rounded-md transition-colors ${
                        isActive(item.path)
                          ? "bg-secondary-700 text-white"
                          : "text-secondary-400 hover:bg-secondary-700 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="mr-3">{item.icon}</span>
                        <span>{item.name}</span>
                      </div>
                      {isProductsOpen ? <FiChevronDown /> : <FiChevronRight />}
                    </button>

                    {isProductsOpen && (
                      <ul className="ml-9 mt-2 space-y-1">
                        {item.subItems.map((subItem) => (
                          <li key={subItem.name}>
                            <Link
                              to={subItem.path}
                              className={`flex items-center justify-between py-2 px-3 rounded-md text-sm ${
                                isActive(subItem.path)
                                  ? "bg-secondary-700 text-white"
                                  : "text-secondary-400 hover:bg-secondary-700 hover:text-white"
                              }`}
                            >
                              <span>{subItem.name}</span>
                              {subItem.count && (
                                <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none rounded-full bg-secondary-700 text-secondary-300">
                                  {subItem.count}
                                </span>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center p-3 rounded-md transition-colors ${
                      isActive(item.path)
                        ? "bg-secondary-700 text-white"
                        : "text-secondary-400 hover:bg-secondary-700 hover:text-white"
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Credits Section */}
        <div className="mt-8 bg-secondary-700 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Credits</span>
            <span className="text-sm font-bold">10</span>
          </div>
          <div className="w-full bg-secondary-600 rounded-full h-2.5">
            <div className="bg-primary-500 h-2.5 rounded-full" style={{ width: '25%' }}></div>
          </div>
          <p className="text-xs text-secondary-400 mt-2">Purchase more credits to unlock additional features</p>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="mt-8 flex items-center w-full p-3 rounded-md text-secondary-400 hover:bg-secondary-700 hover:text-white transition-colors"
        >
          <FiLogOut className="mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default StoreSidebar;