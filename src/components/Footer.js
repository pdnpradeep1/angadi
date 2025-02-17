// src/pages/Login.js

import React from 'react';

function Login() {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold text-center my-8">Login to Your Account</h1>
            <form className="max-w-md mx-auto bg-white p-8 border border-gray-300 rounded-lg shadow">
                <label htmlFor="email" className="block text-lg mb-2">Email:</label>
                <input type="email" id="email" name="email" required className="w-full p-2 mb-4 border border-gray-300 rounded" />
                
                <label htmlFor="password" className="block text-lg mb-2">Password:</label>
                <input type="password" id="password" name="password" required className="w-full p-2 mb-4 border border-gray-300 rounded" />

                <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">Login</button>
            </form>
            <p className="text-center mt-4">
                Don't have an account? <a href="/register" className="text-blue-600 hover:underline">Register here</a>.
            </p>
        </div>
    );
}

export default Login;