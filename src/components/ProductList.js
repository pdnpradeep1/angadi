// ProductList.js
import React, { useState } from "react";

const ProductList = () => {
  const [searchTerm, setSearchTerm] = useState(""); // For filtering products
  const [dropdownOpen, setDropdownOpen] = useState(false); // State for dropdown menu
  const [selectedProducts, setSelectedProducts] = useState([]); // Selected product checkboxes

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen); // Toggle dropdown state

  // Toggle checkbox selection
  const handleCheckboxChange = (id) => {
    setSelectedProducts((prevState) => {
      if (prevState.includes(id)) {
        return prevState.filter((productId) => productId !== id);
      } else {
        return [...prevState, id];
      }
    });
  };

  const products = [
    {
      id: 1,
      name: "Karapu Boondi",
      price: 50,
      originalPrice: 60,
      inventory: "Unlimited",
      status: "Active",
    },
    {
      id: 2,
      name: "Kaju Chikki",
      price: 150,
      originalPrice: 200,
      inventory: "Unlimited",
      status: "Active",
    },
    {
      id: 3,
      name: "Sajja buralu",
      price: 250,
      originalPrice: 300,
      inventory: "Unlimited",
      status: "Inactive",
    },
    {
      id: 4,
      name: "Ghee Jaggery Blackgram Laddu",
      price: 200,
      originalPrice: 250,
      inventory: "Unlimited",
      status: "Active",
    },
    {
      id: 5,
      name: "Dry Fruits Bar",
      price: 150,
      originalPrice: 200,
      inventory: "Unlimited",
      status: "Active",
    },
    {
      id: 6,
      name: "Dryfruits Laddu",
      price: 100,
      originalPrice: 120,
      inventory: "Unlimited",
      status: "Inactive",
    },
    {
      id: 7,
      name: "Maramrallu Laddu",
      price: 50,
      originalPrice: 60,
      inventory: "Unlimited",
      status: "Active",
    },
  ];

  // Filter products based on search term
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="products-table">
      <h3>All Products</h3>

      {/* Search bar and Add New Product button with dropdown */}
      <div className="product-list-header">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="actions">
          <button className="add-product-btn">
            + Add new product
            <span className="dropdown-arrow">▼</span> {/* Dropdown Arrow */}
          </button>
          <div className="dropdown">
            <button onClick={toggleDropdown} className="dropdown-btn">
              Bulk actions
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <ul>
                  <li>Bulk upload products</li>
                  <li>Bulk update products</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table of Products */}
      <table>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selectedProducts.length === filteredProducts.length}
                onChange={() => {
                  if (selectedProducts.length === filteredProducts.length) {
                    setSelectedProducts([]);
                  } else {
                    setSelectedProducts(filteredProducts.map((product) => product.id));
                  }
                }}
              />
            </th>
            <th>Product</th>
            <th>Price</th>
            <th>Inventory</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedProducts.includes(product.id)}
                  onChange={() => handleCheckboxChange(product.id)}
                />
              </td>
              <td>{product.name}</td>
              <td>
                ₹{product.price} <span className="original-price">₹{product.originalPrice}</span>
              </td>
              <td>{product.inventory}</td>
              <td>
                <button className={product.status === "Active" ? "active-btn" : "inactive-btn"}>
                  {product.status}
                </button>
              </td>
              <td>
                <button>Edit</button>
                <button>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
