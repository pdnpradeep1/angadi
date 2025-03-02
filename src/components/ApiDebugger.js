import React, { useState } from 'react';
import axios from 'axios';

const ApiDebugger = () => {
  const [endpoint, setEndpoint] = useState('http://localhost:8080/api/stores/1/visibility');
  const [method, setMethod] = useState('PATCH');
  const [requestBody, setRequestBody] = useState(JSON.stringify({ visible: true }, null, 2));
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSendRequest = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        throw new Error('Authentication required - JWT token not found');
      }

      let parsedBody;
      try {
        parsedBody = JSON.parse(requestBody);
      } catch (e) {
        throw new Error('Invalid JSON in request body');
      }

      const config = {
        method: method,
        url: endpoint,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: parsedBody
      };

      console.log('Sending request with config:', config);
      const result = await axios(config);
      
      setResponse({
        status: result.status,
        statusText: result.statusText,
        headers: result.headers,
        data: result.data
      });
    } catch (err) {
      console.error('API request failed:', err);
      setError({
        message: err.message,
        response: err.response ? {
          status: err.response.status,
          statusText: err.response.statusText,
          data: err.response.data
        } : null
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">API Request Debugger</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Endpoint URL
        </label>
        <input
          type="text"
          value={endpoint}
          onChange={(e) => setEndpoint(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          HTTP Method
        </label>
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="PATCH">PATCH</option>
          <option value="DELETE">DELETE</option>
        </select>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Request Body (JSON)
        </label>
        <textarea
          value={requestBody}
          onChange={(e) => setRequestBody(e.target.value)}
          rows={5}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm font-mono"
        />
      </div>
      
      <button
        onClick={handleSendRequest}
        disabled={loading}
        className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
      >
        {loading ? 'Sending Request...' : 'Send Request'}
      </button>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-md">
          <h3 className="text-lg font-medium text-red-700 dark:text-red-400">Error</h3>
          <p className="text-red-700 dark:text-red-400">{error.message}</p>
          {error.response && (
            <div className="mt-2">
              <p className="text-red-700 dark:text-red-400">Status: {error.response.status} {error.response.statusText}</p>
              <pre className="mt-2 p-2 bg-red-100 dark:bg-red-900/40 rounded overflow-auto text-xs">
                {JSON.stringify(error.response.data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
      
      {response && (
        <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded-md">
          <h3 className="text-lg font-medium text-green-700 dark:text-green-400">Response</h3>
          <p className="text-green-700 dark:text-green-400">Status: {response.status} {response.statusText}</p>
          <div className="mt-2">
            <h4 className="font-medium text-green-700 dark:text-green-400">Data:</h4>
            <pre className="mt-2 p-2 bg-green-100 dark:bg-green-900/40 rounded overflow-auto text-xs">
              {JSON.stringify(response.data, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiDebugger;