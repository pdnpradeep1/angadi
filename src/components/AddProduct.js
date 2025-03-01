// AddProduct.js
import React, { useState } from 'react';
import '../styles/AddProduct.css';

const AddProduct = () => {
  const [activeSection, setActiveSection] = useState('product-info'); // Default section

  return (
    <div className="add-product-container">
      <div className="sidebar">
        {/* Quick Navigation */}
        <h4>Quick navigation</h4>
        <ul>
          <li
            className={activeSection === 'product-info' ? 'active' : ''}
            onClick={() => setActiveSection('product-info')}
          >
            Product Information
          </li>
          <li
            className={activeSection === 'product-media' ? 'active' : ''}
            onClick={() => setActiveSection('product-media')}
          >
            Product Media
          </li>
          <li
            className={activeSection === 'inventory' ? 'active' : ''}
            onClick={() => setActiveSection('inventory')}
          >
            Inventory
          </li>
          <li
            className={activeSection === 'shipping-tax' ? 'active' : ''}
            onClick={() => setActiveSection('shipping-tax')}
          >
            Shipping & Tax
          </li>
          <li
            className={activeSection === 'variants' ? 'active' : ''}
            onClick={() => setActiveSection('variants')}
          >
            Variants
          </li>
          <li
            className={activeSection === 'dukaan-seo' ? 'active' : ''}
            onClick={() => setActiveSection('dukaan-seo')}
          >
            Dukaan SEO
          </li>
          <li
            className={activeSection === 'countdown-timer' ? 'active' : ''}
            onClick={() => setActiveSection('countdown-timer')}
          >
            Countdown Timer
          </li>
        </ul>
      </div>

      <div className="form-content">
        {/* Form Sections based on active tab */}
        {activeSection === 'product-info' && (
          <div className="product-info">
            <h3>Product Information</h3>
            <label>Product Name *</label>
            <input type="text" placeholder="Enter product name" required />
            <label>Product Category *</label>
            <select required>
              <option>Select category</option>
              <option>Sweets</option>
              <option>Spicy</option>
              <option>Snacks</option>
            </select>
            <label>Price *</label>
            <input type="number" placeholder="Enter price" required />
            <label>Discounted Price</label>
            <input type="number" placeholder="Enter discounted price" />
            <label>Product Description</label>
            <textarea placeholder="Enter description"></textarea>
          </div>
        )}

        {activeSection === 'product-media' && (
          <div className="product-media">
            <h3>Product Media</h3>
            <button>Upload images</button>
            <button>Add video</button>
          </div>
        )}

        {activeSection === 'inventory' && (
          <div className="inventory">
            <h3>Inventory</h3>
            <label>Quantity</label>
            <input type="text" value="Unlimited" />
            <label>SKU ID</label>
            <input type="text" placeholder="Eg. 1000000001" />
          </div>
        )}

        {activeSection === 'shipping-tax' && (
          <div className="shipping-tax">
            <h3>Shipping & Tax</h3>
            <label>Shipment Weight</label>
            <input type="text" placeholder="Eg. 1.2 kg" />
            <label>HSN Code</label>
            <input type="text" placeholder="Enter the HSN code" />
            <label>GST</label>
            <input type="text" placeholder="Enter the GST percentage" />
          </div>
        )}

        {activeSection === 'variants' && (
          <div className="variants">
            <h3>Variants</h3>
            <button>Add variants</button>
          </div>
        )}

        {activeSection === 'dukaan-seo' && (
          <div className="dukaan-seo">
            <h3>Dukaan SEO</h3>
            <label>Title Tag</label>
            <input type="text" placeholder="Enter title tag" />
            <label>Meta Description Tag</label>
            <input type="text" placeholder="Enter description" />
            <button>Generate Meta Description</button>
          </div>
        )}

        {activeSection === 'countdown-timer' && (
          <div className="countdown-timer">
            <h3>Countdown Timer</h3>
            <label>Set Countdown Timer</label>
            <input type="date" />
            <input type="time" />
          </div>
        )}
      </div>
    </div>
  );
};

export default AddProduct;
