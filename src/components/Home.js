// import React from 'react';
// import { HomeContainer, WelcomeMessage } from '../styles/HomeStyle';

// function Home() {
//   return (
//     <HomeContainer>
//       <WelcomeMessage>Welcome to Our Store!</WelcomeMessage>
//       {/* Additional components and content for the Home page can go here */}
//     </HomeContainer>
//   );
// }

// export default Home;

// src/components/Home.js

import React from "react";
import { Link } from "react-router-dom";
import { HomeContainer, WelcomeMessage } from "../styles/HomeStyle";

const Home = () => {
  return (
    <HomeContainer>
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold text-center my-8">
          <WelcomeMessage> Welcome to Our Store!</WelcomeMessage>
        </h1>
        <p className="text-lg text-center mb-8">
          Discover high-quality products at unbeatable prices.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            to="/login"
            className="block p-6 border border-gray-200 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-2">Login</h3>
            <p>Login to your existing account</p>
          </Link>
          <Link
            to="/signup"
            className="block p-6 border border-gray-200 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-2">Sign Up</h3>
            <p>Create a new account</p>
          </Link>
          <Link
            to="/product/1"
            className="block p-6 border border-gray-200 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-2">Product 1</h3>
            <p>Learn more about our first product</p>
          </Link>
          <Link
            to="/product/2"
            className="block p-6 border border-gray-200 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-2">Product 2</h3>
            <p>Explore our second product offering</p>
          </Link>
        </div>
      </div>
    </HomeContainer>
  );
};

export default Home;
