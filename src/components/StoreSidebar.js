// StoreSidebar.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaTruck, FaBox, FaChartLine, FaUser, FaCog } from "react-icons/fa"; // Icons for navigation
import "../styles/StoreSidebar.css"; // Import custom CSS

const StoreSidebar = () => {
  const [isProductsOpen, setIsProductsOpen] = useState(false);  // State to toggle Products menu

  const toggleProducts = () => {
    setIsProductsOpen(!isProductsOpen);  // Toggle the Products menu visibility
  };

  return (
    <div className="sidebar">
      <div className="store-info">
        <div className="store-logo">Logo</div>
        <div className="store-name">Hari Inti Ruchulu</div>
      </div>

      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link to="/dashboard">
              <FaHome /> Dashboard
            </Link>
          </li>
          <li>
            <Link to="/orders">
              <FaBox /> Orders
            </Link>
          </li>
          <li>
            <Link to="/delivery">
              <FaTruck /> Delivery
            </Link>
          </li>

          {/* Collapsible Products Section */}
          <li className="menu-item">
            <a onClick={toggleProducts} style={{ cursor: "pointer" }}>
              <FaBox /> Products
            </a>
            {isProductsOpen && (
              <ul className="sub-menu">
                <li>
                  <Link to="all-products">
                    <span>All products</span>
                    <span className="badge">8</span> {/* Example count */}
                  </Link>
                </li>
                <li>
                  <Link to="/categories">
                    <span>Categories</span>
                    <span className="badge">3</span> {/* Example count */}
                  </Link>
                </li>
                <li>
                  <Link to="/inventory">
                    <span>Inventory</span>
                  </Link>
                </li>
              </ul>
            )}
          </li>

          <li>
            <Link to="/analytics">
              <FaChartLine /> Analytics
            </Link>
          </li>
          <li>
            <Link to="/audience">
              <FaUser /> Audience
            </Link>
          </li>
          <li>
            <Link to="/settings">
              <FaCog /> Settings
            </Link>
          </li>
        </ul>
      </nav>

      <div className="credits">
        <div>Dukaan Credits</div>
        <div>10</div>
      </div>
    </div>
  );
};

export default StoreSidebar;
