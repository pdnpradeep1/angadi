// src/components/Navbar.js

import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-white text-2xl font-bold">MyShop</Link>
                <div className="space-x-4">
                    <Link to="/" className="text-gray-300 hover:text-white">Home</Link>
                    <Link to="/login" className="text-gray-300 hover:text-white">Login</Link>
                    <Link to="/register" className="text-gray-300 hover:text-white">Register</Link>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;