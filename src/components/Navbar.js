// src/pages/Home.js

import React from 'react';

function Home() {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-4xl font-bold text-center my-8">Welcome to Our Store!</h1>
            <p className="text-lg text-center mb-8">Discover high-quality products at unbeatable prices.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <a href="#" className="block p-6 border border-gray-200 rounded-lg shadow hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-semibold mb-2">Product 1 &rarr;</h3>
                    <p>Get to know our first product.</p>
                </a>
                <a href="#" className="block p-6 border border-gray-200 rounded-lg shadow hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-semibold mb-2">Product 2 &rarr;</h3>
                    <p>Get to know our second product.</p>
                </a>
                <a href="#" className="block p-6 border border-gray-200 rounded-lg shadow hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-semibold mb-2">Product 3 &rarr;</h3>
                    <p>Get to know our third product.</p>
                </a>
                <a href="#" className="block p-6 border border-gray-200 rounded-lg shadow hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-semibold mb-2">Product 4 &rarr;</h3>
                    <p>Get to know our fourth product.</p>
                </a>
            </div>
        </div>
    );
}

export default Home;