import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  FiPlus, 
  FiSearch, 
  FiFilter, 
  FiChevronDown, 
  FiMoreVertical, 
  FiEdit2, 
  FiTrash2,
  FiUpload,
  FiDownload
} from "react-icons/fi";

const ProductList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [actionDropdown, setActionDropdown] = useState(null);

  // Sample product data
  const products = [
    {
      id: 1,
      name: "Karapu Boondi",
      price: 50,
      originalPrice: 60,
      inventory: "Unlimited",
      status: "Active",
      image: "/api/placeholder/40/40"
    },
    {
      id: 2,
      name: "Kaju Chikki",
      price: 150,
      originalPrice: 200,
      inventory: "Unlimited",
      status: "Active",
      image: "/api/placeholder/40/40"
    },
    {
      id: 3,
      name: "Sajja Buralu",
      price: 250,
      originalPrice: 300,
      inventory: "Unlimited",
      status: "Inactive",
      image: "/api/placeholder/40/40"
    },
    {
      id: 4,
      name: "Ghee Jaggery Blackgram Laddu",
      price: 200,
      originalPrice: 250,
      inventory: "Limited",
      status: "Active",
      image: "/api/placeholder/40/40"
    },
    {
      id: 5,
      name: "Dry Fruits Bar",
      price: 150,
      originalPrice: 200,
      inventory: "Unlimited",
      status: "Active",
      image: "/api/placeholder/40/40"
    },
    {
      id: 6,
      name: "Dryfruits Laddu",
      price: 100,
      originalPrice: 120,
      inventory: "Out of stock",
      status: "Inactive",
      image: "/api/placeholder/40/40"
    },
    {
      id: 7,
      name: "Maramrallu Laddu",
      price: 50,
      originalPrice: 60,
      inventory: "Limited",
      status: "Active",
      image: "/api/placeholder/40/40"
    },
  ];

  // Toggle dropdown for bulk actions
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  // Toggle product selection checkbox
  const handleCheckboxChange = (id) => {
    setSelectedProducts((prevState) => {
      if (prevState.includes(id)) {
        return prevState.filter((productId) => productId !== id);
      } else {
        return [...prevState, id];
      }
    });
  };

  // Toggle action dropdown for a specific product
  const toggleActionDropdown = (id) => {
    setActionDropdown(actionDropdown === id ? null : id);
  };

  // Filter products based on search term and status filter
  const filteredProducts = products.filter((product) => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterStatus === "all" || product.status.toLowerCase() === filterStatus.toLowerCase())
  );

  // Sort products based on sort criteria
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let comparison = 0;
    
    if (sortBy === "name") {
      comparison = a.name.localeCompare(b.name);
    } else if (sortBy === "price") {
      comparison = a.price - b.price;
    } else if (sortBy === "status") {
      comparison = a.status.localeCompare(b.status);
    }
    
    return sortOrder === "asc" ? comparison : -comparison;
  });

  return (
    <div className="container bg-white dark:bg-secondary-800 rounded-lg shadow-md">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white mb-6">Products</h1>
        
        {/* Search and Actions Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="relative w-full md:w-auto md:min-w-[320px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-secondary-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>
          
          {/* Sorting and filtering */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <div className="relative z-10">
              <button
                onClick={() => setFilterStatus(filterStatus === "all" ? "active" : filterStatus === "active" ? "inactive" : "all")}
                className="btn btn-secondary flex items-center"
              >
                <FiFilter className="mr-2" />
                {filterStatus === "all" ? "All Status" : 
                 filterStatus === "active" ? "Active Only" : "Inactive Only"}
              </button>
            </div>
            
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="btn btn-secondary flex items-center"
              >
                Bulk actions
                <FiChevronDown className={`ml-2 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-secondary-700 ring-1 ring-black ring-opacity-5 z-20">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <button
                      className="flex items-center px-4 py-2 text-sm text-secondary-700 dark:text-secondary-200 hover:bg-secondary-100 dark:hover:bg-secondary-600 w-full text-left"
                      onClick={() => {
                        console.log("Bulk upload selected");
                        setDropdownOpen(false);
                      }}
                    >
                      <FiUpload className="mr-2" /> Bulk upload products
                    </button>
                    <button
                      className="flex items-center px-4 py-2 text-sm text-secondary-700 dark:text-secondary-200 hover:bg-secondary-100 dark:hover:bg-secondary-600 w-full text-left"
                      onClick={() => {
                        console.log("Bulk update selected");
                        setDropdownOpen(false);
                      }}
                    >
                      <FiEdit2 className="mr-2" /> Bulk update products
                    </button>
                    {selectedProducts.length > 0 && (
                      <>
                        <hr className="border-secondary-200 dark:border-secondary-600 my-1" />
                        <button
                          className="flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left"
                          onClick={() => {
                            console.log("Delete selected products:", selectedProducts);
                            setDropdownOpen(false);
                            setSelectedProducts([]);
                          }}
                        >
                          <FiTrash2 className="mr-2" /> Delete selected ({selectedProducts.length})
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <Link
              to="/add-product"
              className="btn btn-primary flex items-center whitespace-nowrap"
            >
              <FiPlus className="mr-2" /> Add new product
            </Link>
          </div>
        </div>
        
        {/* Product Table */}
        <div className="overflow-x-auto mt-4 border border-secondary-200 dark:border-secondary-700 rounded-lg">
          <table className="min-w-full divide-y divide-secondary-200 dark:divide-secondary-700">
            <thead>
              <tr className="bg-secondary-50 dark:bg-secondary-800">
                <th className="px-6 py-3 text-left">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-primary-600 border-secondary-300 rounded"
                      checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                      onChange={() => {
                        if (selectedProducts.length === filteredProducts.length) {
                          setSelectedProducts([]);
                        } else {
                          setSelectedProducts(filteredProducts.map((product) => product.id));
                        }
                      }}
                    />
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => {
                    setSortBy("name");
                    setSortOrder(sortBy === "name" && sortOrder === "asc" ? "desc" : "asc");
                  }}
                >
                  <div className="flex items-center">
                    Product
                    {sortBy === "name" && (
                      <FiChevronDown className={`ml-1 ${sortOrder === "desc" ? "transform rotate-180" : ""}`} />
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => {
                    setSortBy("price");
                    setSortOrder(sortBy === "price" && sortOrder === "asc" ? "desc" : "asc");
                  }}
                >
                  <div className="flex items-center">
                    Price
                    {sortBy === "price" && (
                      <FiChevronDown className={`ml-1 ${sortOrder === "desc" ? "transform rotate-180" : ""}`} />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Inventory
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => {
                    setSortBy("status");
                    setSortOrder(sortBy === "status" && sortOrder === "asc" ? "desc" : "asc");
                  }}
                >
                  <div className="flex items-center">
                    Status
                    {sortBy === "status" && (
                      <FiChevronDown className={`ml-1 ${sortOrder === "desc" ? "transform rotate-180" : ""}`} />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-secondary-800 divide-y divide-secondary-200 dark:divide-secondary-700">
              {sortedProducts.map((product) => (
                <tr key={product.id} className="hover:bg-secondary-50 dark:hover:bg-secondary-700/30">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-primary-600 border-secondary-300 rounded"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => handleCheckboxChange(product.id)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-md object-cover" src={product.image} alt={product.name} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-secondary-900 dark:text-white">{product.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-secondary-900 dark:text-white">₹{product.price}</div>
                    <div className="text-sm text-secondary-500 dark:text-secondary-400 line-through">₹{product.originalPrice}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm ${
                      product.inventory === "Unlimited" 
                        ? "text-green-600 dark:text-green-400" 
                        : product.inventory === "Limited" 
                        ? "text-yellow-600 dark:text-yellow-400"
                        : "text-red-600 dark:text-red-400"
                    }`}>
                      {product.inventory}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.status === "Active"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                    <button
                      onClick={() => toggleActionDropdown(product.id)}
                      className="text-secondary-500 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-300"
                    >
                      <FiMoreVertical />
                    </button>
                    
                    {actionDropdown === product.id && (
                      <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-secondary-700 ring-1 ring-black ring-opacity-5 z-20">
                        <div className="py-1" role="menu" aria-orientation="vertical">
                          <Link
                            to={`/edit-product/${product.id}`}
                            className="flex items-center px-4 py-2 text-sm text-secondary-700 dark:text-secondary-200 hover:bg-secondary-100 dark:hover:bg-secondary-600"
                            role="menuitem"
                          >
                            <FiEdit2 className="mr-2" /> Edit
                          </Link>
                          <button
                            className="flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left"
                            role="menuitem"
                            onClick={() => {
                              console.log(`Delete product ${product.id}`);
                              setActionDropdown(null);
                            }}
                          >
                            <FiTrash2 className="mr-2" /> Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination (can be expanded in a real application) */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-secondary-500 dark:text-secondary-400">
            Showing <span className="font-medium">{sortedProducts.length}</span> of <span className="font-medium">{products.length}</span> products
          </div>
          <div className="flex justify-end">
            <button
              className="relative inline-flex items-center px-4 py-2 border border-secondary-300 dark:border-secondary-600 text-sm font-medium rounded-md text-secondary-700 dark:text-secondary-200 bg-white dark:bg-secondary-800 hover:bg-secondary-50 dark:hover:bg-secondary-700"
            >
              Previous
            </button>
            <button
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-secondary-300 dark:border-secondary-600 text-sm font-medium rounded-md text-secondary-700 dark:text-secondary-200 bg-white dark:bg-secondary-800 hover:bg-secondary-50 dark:hover:bg-secondary-700"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;