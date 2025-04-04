import React, { useEffect, useState } from 'react';
import { FiShoppingBag, FiPackage, FiTruck, FiBox, FiBarChart2, FiDollarSign, FiShoppingCart } from 'react-icons/fi';
import styled, { keyframes } from 'styled-components';

// Enhanced animations with more modern effects
const truckMove = keyframes`
  0% {
    transform: translateX(-120%) translateY(-50%) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
    transform: translateX(-100%) translateY(-50%) rotate(0deg);
  }
  40% {
    transform: translateX(0) translateY(-50%) rotate(0deg);
  }
  60% {
    transform: translateX(0) translateY(-50%) rotate(0deg);
  }
  90% {
    opacity: 1;
    transform: translateX(100%) translateY(-50%) rotate(0deg);
  }
  100% {
    transform: translateX(120%) translateY(-50%) rotate(0deg);
    opacity: 0;
  }
`;

const productFill = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-20px) scale(0.8);
  }
  50% {
    opacity: 1;
    transform: translateY(0) scale(1.1);
  }
  70% {
    transform: translateY(0) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const bounce = keyframes`
  0% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-15px) scale(1.05);
  }
  100% {
    transform: translateY(0) scale(1);
  }
`;

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.4);
    transform: scale(1);
  }
  70% {
    box-shadow: 0 0 0 15px rgba(79, 70, 229, 0);
    transform: scale(1.05);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(79, 70, 229, 0);
    transform: scale(1);
  }
`;

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

// Enhanced data visualization animation with more professional easing
const dataVizAnimation = keyframes`
  0% {
    height: 10%;
    opacity: 0.3;
  }
  30% {
    height: 70%;
    opacity: 0.9;
  }
  70% {
    height: 90%;
    opacity: 1;
  }
  100% {
    height: 40%;
    opacity: 0.7;
  }
`;

// Add circular progress animation for analytics
const circleProgress = keyframes`
  0% {
    stroke-dashoffset: 283;
  }
  80% {
    stroke-dashoffset: 30;
  }
  100% {
    stroke-dashoffset: 50;
  }
`;

// Add subtle shimmer effect
const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

// Styled components with enhanced visual effects
const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 50;
`;

// Enhanced shop container with more premium feel
const ShopContainer = styled.div`
  position: relative;
  border-radius: 50%;
  background: linear-gradient(135deg, #f0f4ff 0%, #e2e8f0 100%);
  box-shadow: 
    0 10px 25px -5px rgba(0, 0, 0, 0.1), 
    0 8px 10px -6px rgba(0, 0, 0, 0.06),
    inset 0 -2px 5px rgba(0, 0, 0, 0.03);
  animation: ${pulse} 2s infinite;
  
  &::before {
    content: '';
    position: absolute;
    inset: -5px;
    border-radius: 50%;
    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
    opacity: 0.2;
    z-index: -1;
  }
  
  .dark & {
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
    
    &::before {
      opacity: 0.4;
    }
  }
`;

const ShopIcon = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
  }
`;

const TruckIcon = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: -2rem;
  animation: ${truckMove} 4s infinite;
  filter: drop-shadow(0 4px 3px rgba(0, 0, 0, 0.07)) drop-shadow(0 2px 2px rgba(0, 0, 0, 0.06));
  
  svg {
    transform-origin: center;
  }
`;

const ProductIcon = styled.div`
  position: absolute;
  animation: ${productFill} 0.5s forwards, ${bounce} 1.5s ease infinite;
  animation-delay: ${props => props.delay || '0s'}, ${props => `calc(${props.delay} + 0.5s)` || '0.5s'};
  filter: drop-shadow(0 4px 3px rgba(0, 0, 0, 0.07)) drop-shadow(0 2px 2px rgba(0, 0, 0, 0.06));
  opacity: 0;
`;

const LoadingText = styled.p`
  margin-top: 1.5rem;
  font-weight: 500;
  background: linear-gradient(90deg, #4f46e5, #7c3aed, #4f46e5);
  background-size: 200% auto;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient 3s linear infinite;
  
  @keyframes gradient {
    0% {
      background-position: 0% center;
    }
    100% {
      background-position: 200% center;
    }
  }
  
  .dark & {
    background: linear-gradient(90deg, #818cf8, #a78bfa, #818cf8);
    background-size: 200% auto;
    background-clip: text;
    -webkit-background-clip: text;
  }
`;

const FloatingParticle = styled.div`
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.color || 'rgba(79, 70, 229, 0.3)'};
  animation: float 3s infinite ease-in-out;
  animation-delay: ${props => props.delay || '0s'};
  opacity: 0.7;
  
  @keyframes float {
    0%, 100% {
      transform: translateY(0) translateX(0);
    }
    50% {
      transform: translateY(-20px) translateX(${props => props.direction || '10px'});
    }
  }
`;

// Add missing StatIndicator styled component
const StatIndicator = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 5;
  
  .dark & {
    background: #1e293b;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  }
  
  svg {
    width: 14px;
    height: 14px;
    color: #4f46e5;
    
    .dark & {
      color: #818cf8;
    }
  }
`;

// Also add missing ShimmerOverlay and CircleProgress components
const ShimmerOverlay = styled.div`
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.1) 25%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0.1) 75%,
    rgba(255, 255, 255, 0) 100%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 3s infinite linear;
`;

const CircleProgress = styled.svg`
  position: absolute;
  top: -25px;
  right: -25px;
  width: 40px;
  height: 40px;
  transform: rotate(-90deg);
  
  circle {
    stroke-dasharray: 283;
    stroke-dashoffset: 283;
    animation: ${circleProgress} 3s ease-out infinite;
  }
`;

/**
 * A modern, visually appealing loader component that animates products being filled into a shop
 * @param {Object} props - Component props
 * @param {string} props.size - Size of the loader: 'sm', 'md', 'lg'
 * @param {string} props.message - Optional message to display below the loader
 * @param {boolean} props.fullPage - Whether the loader should take up the full page
 */
const ShopLoader = ({ 
  size = 'md', 
  message = 'Loading dashboard...', 
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
    ? 'fixed inset-0 flex items-center justify-center bg-white/90 dark:bg-gray-900/90 z-50 backdrop-blur-sm' 
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
  
  // Generate product elements with different icons for variety
  const renderProducts = () => {
    const products = [];
    const productIcons = [FiPackage, FiBox];
    
    for (let i = 0; i < productCount; i++) {
      const delay = `${i * 0.2}s`;
      const position = getProductPosition(i);
      const ProductComponent = productIcons[i % productIcons.length];
      
      products.push(
        <ProductIcon 
          key={i}
          delay={delay}
          className={`${sizeClasses[size].product} text-primary-500 dark:text-primary-400`}
          style={{
            top: position.top,
            left: position.left,
          }}
        >
          <ProductComponent />
        </ProductIcon>
      );
    }
    return products;
  };
  
  // Generate decorative floating particles
  const renderParticles = () => {
    const particles = [];
    const colors = [
      'rgba(79, 70, 229, 0.3)', // Indigo
      'rgba(124, 58, 237, 0.3)', // Purple
      'rgba(236, 72, 153, 0.3)', // Pink
    ];
    
    for (let i = 0; i < 6; i++) {
      particles.push(
        <FloatingParticle 
          key={i}
          delay={`${i * 0.5}s`}
          color={colors[i % colors.length]}
          direction={i % 2 === 0 ? '10px' : '-10px'}
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 6 + 4}px`,
            height: `${Math.random() * 6 + 4}px`,
          }}
        />
      );
    }
    return particles;
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
  
  // Add new data visualization animation
  const dataVizAnimation = keyframes`
    0% {
      height: 10%;
      opacity: 0.3;
    }
    50% {
      height: 90%;
      opacity: 1;
    }
    100% {
      height: 40%;
      opacity: 0.7;
    }
  `;
  
  // Add new styled components for admin-specific elements
  const AdminDataBar = styled.div`
    position: absolute;
    bottom: 0;
    width: 4px;
    border-radius: 2px;
    background: linear-gradient(to top, #4f46e5, #818cf8);
    animation: ${dataVizAnimation} 1.5s ease-in-out infinite;
    animation-delay: ${props => props.delay || '0s'};
    opacity: 0.7;
  `;
  
  const AdminPanel = styled.div`
    position: absolute;
    width: 120%;
    height: 30%;
    bottom: -40px;
    left: -10%;
    background: linear-gradient(135deg, #f0f4ff 0%, #e2e8f0 100%);
    border-radius: 8px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    
    .dark & {
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
    }
  `;
  
  // Generate admin data visualization bars
  const renderDataBars = () => {
    const bars = [];
    const barCount = 7; // Increased for more data-rich appearance
    
    for (let i = 0; i < barCount; i++) {
      bars.push(
        <AdminDataBar 
          key={`data-bar-${i}`}
          delay={`${i * 0.15}s`}
          style={{
            left: `${8 + (i * 13)}%`, // More compact spacing
            height: `${20 + Math.random() * 60}%`,
            opacity: 0.7 + (Math.random() * 0.3) // Varied opacity for depth
          }}
        />
      );
    }
    return bars;
  };
  
  // Generate stat indicators
  const renderStatIndicators = () => {
    const indicators = [
      { icon: FiBarChart2, top: '-12px', left: '15%' },
      { icon: FiDollarSign, top: '-8px', right: '25%' },
      { icon: FiShoppingCart, bottom: '-12px', right: '15%' }
    ];
    
    return indicators.map((indicator, index) => (
      <StatIndicator 
        key={`stat-${index}`}
        style={{
          ...indicator,
          transform: `scale(${size === 'sm' ? 0.8 : size === 'lg' ? 1.2 : 1})`
        }}
      >
        <indicator.icon />
      </StatIndicator>
    ));
  };
  
  return (
    <div className={containerClasses}>
      <LoaderContainer>
        <div className="relative">
          {renderParticles()}
          {renderStatIndicators()}
          
          <ShopContainer className={`${sizeClasses[size].container} mb-4`}>
            {/* Shop icon */}
            <ShopIcon className={`${sizeClasses[size].shop} text-secondary-600 dark:text-secondary-400`}>
              <FiShoppingBag />
            </ShopIcon>
            
            {/* Delivery truck */}
            <TruckIcon className={`text-gray-600 dark:text-gray-400 ${sizeClasses[size].product}`}>
              <FiTruck />
            </TruckIcon>
            
            {/* Products being added */}
            {renderProducts()}
            
            {/* Shimmer effect */}
            <ShimmerOverlay />
            
            {/* Admin panel with data visualization */}
            <AdminPanel>
              {renderDataBars()}
              
              {/* Circular progress indicator */}
              <CircleProgress viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#4f46e5"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
              </CircleProgress>
            </AdminPanel>
          </ShopContainer>
        </div>
        
        {message && (
          <LoadingText className="text-center">
            {message}
          </LoadingText>
        )}
      </LoaderContainer>
    </div>
  );
};

export default ShopLoader;