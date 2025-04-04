import React, { useEffect, useState } from 'react';
import { FiShoppingBag, FiPackage, FiTruck } from 'react-icons/fi';

/**
 * A custom loader component that animates products being filled into a shop
 * @param {Object} props - Component props
 * @param {string} props.size - Size of the loader: 'sm', 'md', 'lg'
 * @param {string} props.message - Optional message to display below the loader
 * @param {boolean} props.fullPage - Whether the loader should take up the full page
 */
const ShopLoader = ({ 
  size = 'md', 
  message = 'Loading your store...', 
  fullPage = false 
}) => {
  const [productCount, setProductCount] = useState(0);
  const maxProducts = 5;
  
  // Size classes mapping
  const sizeClasses = {
    sm: { container: 'h-24 w-24', shop: 'text-3xl', product: 'text-xl' },
    md: { container: 'h-32 w-32', shop: 'text-4xl', product: 'text-2xl' },
    lg: { container: 'h-48 w-48', shop: 'text-5xl', product: 'text-3xl' }
  };
  
  // Container classes based on fullPage prop
  const containerClasses = fullPage 
    ? 'fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 z-50' 
    : 'flex flex-col items-center justify-center py-8';
  
  // Animation to add products to the shop
  useEffect(() => {
    const interval = setInterval(() => {
      setProductCount(prev => {
        if (prev >= maxProducts) return 0;
        return prev + 1;
      });
    }, 800);
    
    return () => clearInterval(interval);
  }, []);
  
  // Generate product elements
  const renderProducts = () => {
    const products = [];
    for (let i = 0; i < productCount; i++) {
      const delay = i * 0.2;
      const position = getProductPosition(i);
      
      products.push(
        <div 
          key={i}
          className={`absolute ${sizeClasses[size].product} text-primary-500 dark:text-primary-400 animate-bounce`}
          style={{
            top: position.top,
            left: position.left,
            animationDelay: `${delay}s`,
            animationDuration: '0.5s'
          }}
        >
          <FiPackage />
        </div>
      );
    }
    return products;
  };
  
  // Calculate position for each product
  const getProductPosition = (index) => {
    const positions = [
      { top: '10%', left: '20%' },
      { top: '30%', left: '70%' },
      { top: '50%', left: '30%' },
      { top: '70%', left: '60%' },
      { top: '80%', left: '40%' }
    ];
    return positions[index % positions.length];
  };
  
  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center">
        <div className={`relative ${sizeClasses[size].container} mb-4`}>
          {/* Shop icon */}
          <div className={`absolute inset-0 flex items-center justify-center ${sizeClasses[size].shop} text-secondary-600 dark:text-secondary-400`}>
            <FiShoppingBag />
          </div>
          
          {/* Delivery truck */}
          <div 
            className={`absolute -left-8 text-gray-600 dark:text-gray-400 ${sizeClasses[size].product} animate-truck`}
            style={{ top: '50%', transform: 'translateY(-50%)' }}
          >
            <FiTruck />
          </div>
          
          {/* Products being added */}
          {renderProducts()}
        </div>
        
        {message && (
          <p className="text-gray-600 dark:text-gray-300 text-center">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ShopLoader;