import React from "react";
import { Link } from "react-router-dom";
import { FiShoppingBag, FiUsers, FiTag, FiTruck } from "react-icons/fi";

const Home = () => {
  // Featured products (mock data)
  const featuredProducts = [
    {
      id: 1,
      name: "Premium Headphones",
      price: "$129.99",
      image: "/api/placeholder/400/300",
      category: "Electronics",
    },
    {
      id: 2,
      name: "Casual T-Shirt",
      price: "$24.99",
      image: "/api/placeholder/400/300",
      category: "Clothing",
    },
    {
      id: 3,
      name: "Wireless Keyboard",
      price: "$59.99",
      image: "/api/placeholder/400/300",
      category: "Electronics",
    },
    {
      id: 4,
      name: "Desk Lamp",
      price: "$34.99",
      image: "/api/placeholder/400/300",
      category: "Home",
    },
  ];

  // Features section content
  const features = [
    {
      icon: <FiShoppingBag className="h-6 w-6 text-primary-600" />,
      title: "Easy Shopping",
      description: "Browse through thousands of products with our intuitive interface.",
    },
    {
      icon: <FiUsers className="h-6 w-6 text-primary-600" />,
      title: "User Accounts",
      description: "Create an account to track orders and save your favorites.",
    },
    {
      icon: <FiTag className="h-6 w-6 text-primary-600" />,
      title: "Special Offers",
      description: "Get access to exclusive deals and discounts.",
    },
    {
      icon: <FiTruck className="h-6 w-6 text-primary-600" />,
      title: "Fast Delivery",
      description: "Enjoy quick and reliable shipping on all orders.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Welcome to MyShop
          </h1>
          <p className="text-xl max-w-3xl mb-8">
            Discover quality products with fantastic deals. Shop now and transform your 
            experience with our carefully curated collection.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/products"
              className="btn px-8 py-3 text-lg font-medium bg-white text-primary-700 hover:bg-secondary-100"
            >
              Shop Now
            </Link>
            <Link
              to="/signup"
              className="btn px-8 py-3 text-lg font-medium bg-primary-700 text-white hover:bg-primary-800 border border-white"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-white dark:bg-secondary-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-800 dark:text-white">
              Featured Products
            </h2>
            <p className="mt-4 text-xl text-secondary-600 dark:text-secondary-400">
              Check out our most popular items
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white dark:bg-secondary-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="aspect-w-4 aspect-h-3 bg-secondary-200 dark:bg-secondary-700">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover object-center"
                  />
                </div>
                <div className="p-6">
                  <p className="text-sm text-primary-600 dark:text-primary-400 mb-1">
                    {product.category}
                  </p>
                  <h3 className="text-lg font-medium text-secondary-800 dark:text-white mb-2">
                    {product.name}
                  </h3>
                  <p className="text-secondary-600 dark:text-secondary-400 font-bold">
                    {product.price}
                  </p>
                  <div className="mt-4">
                    <Link
                      to={`/product/${product.id}`}
                      className="btn btn-secondary w-full text-center"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/products"
              className="btn btn-primary px-8 py-3 text-lg font-medium"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-secondary-100 dark:bg-secondary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-800 dark:text-white">
              Why Choose Us
            </h2>
            <p className="mt-4 text-xl text-secondary-600 dark:text-secondary-400">
              We make shopping easy and enjoyable
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-secondary-900 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="inline-flex items-center justify-center p-3 bg-primary-100 dark:bg-primary-900 rounded-md mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-medium text-secondary-800 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-secondary-600 dark:text-secondary-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Shopping?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of satisfied customers and discover why MyShop is the 
            preferred choice for online shopping.
          </p>
          <Link
            to="/signup"
            className="btn px-8 py-3 text-lg font-medium bg-white text-primary-700 hover:bg-secondary-100"
          >
            Create Your Account
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;