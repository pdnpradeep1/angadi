import React from "react";
import { Link } from "react-router-dom";
import { FiShoppingBag, FiFacebook, FiTwitter, FiInstagram, FiGithub } from "react-icons/fi";

function Footer() {
  const footerLinks = [
    {
      title: "Shop",
      links: [
        { name: "All Products", path: "/products" },
        { name: "Featured", path: "/products/featured" },
        { name: "New Arrivals", path: "/products/new" },
        { name: "Sale", path: "/products/sale" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", path: "/about" },
        { name: "Careers", path: "/careers" },
        { name: "Blog", path: "/blog" },
        { name: "Press", path: "/press" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Contact Us", path: "/contact" },
        { name: "FAQ", path: "/faq" },
        { name: "Shipping", path: "/shipping" },
        { name: "Returns", path: "/returns" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Terms of Service", path: "/terms" },
        { name: "Privacy Policy", path: "/privacy" },
        { name: "Cookie Policy", path: "/cookies" },
      ],
    },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-secondary-800 border-t border-secondary-200 dark:border-secondary-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="col-span-1 lg:col-span-2">
            <Link to="/" className="flex items-center">
              <FiShoppingBag className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-secondary-800 dark:text-white">MyShop</span>
            </Link>
            <p className="mt-4 text-secondary-600 dark:text-secondary-400 max-w-md">
              Your one-stop destination for quality products. We offer a wide range of 
              items to help you find exactly what you need.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-secondary-500 hover:text-primary-600">
                <FiFacebook size={20} />
              </a>
              <a href="#" className="text-secondary-500 hover:text-primary-600">
                <FiTwitter size={20} />
              </a>
              <a href="#" className="text-secondary-500 hover:text-primary-600">
                <FiInstagram size={20} />
              </a>
              <a href="#" className="text-secondary-500 hover:text-primary-600">
                <FiGithub size={20} />
              </a>
            </div>
          </div>

          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-secondary-600 dark:text-secondary-300 uppercase tracking-wider">
                {section.title}
              </h3>
              <ul className="mt-4 space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-secondary-500 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-500"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mt-12 pt-8 border-t border-secondary-200 dark:border-secondary-700">
          <p className="text-center text-secondary-500 dark:text-secondary-400">
            &copy; {currentYear} MyShop. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;