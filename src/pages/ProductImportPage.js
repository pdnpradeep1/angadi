import React, { useState } from 'react';
import { FiUpload, FiInfo, FiAlertCircle } from 'react-icons/fi';
import ImportFormatInfo from '../components/products/ImportFormatInfo';

const ProductImportPage = () => {
  const [showFormatInfo, setShowFormatInfo] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setImportResult(null);
  };

  const handleImport = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      return;
    }
    
    setImporting(true);
    
    // In a real app, you would upload the file to your backend
    // For this demo, we'll simulate a successful import after a delay
    setTimeout(() => {
      setImportResult({
        success: true,
        total: 10,
        imported: 8,
        errors: [
          "Row 3: Price cannot be negative",
          "Row 7: Name is required"
        ]
      });
      setImporting(false);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Import Products</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <form onSubmit={handleImport}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select File to Import
            </label>
            
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FiUpload className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    CSV or Excel files (max. 10MB)
                  </p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".csv,.xlsx,.xls" 
                  onChange={handleFileChange}
                />
              </label>
            </div>
            
            {selectedFile && (
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Selected file: {selectedFile.name}
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowFormatInfo(!showFormatInfo)}
              className="inline-flex items-center text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
            >
              <FiInfo className="mr-1 h-4 w-4" />
              {showFormatInfo ? 'Hide Format Info' : 'Show Format Info'}
            </button>
            
            <button
              type="submit"
              disabled={!selectedFile || importing}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {importing ? 'Importing...' : 'Import Products'}
            </button>
          </div>
        </form>
      </div>
      
      {showFormatInfo && <ImportFormatInfo />}
      
      {importResult && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Import Results</h2>
          
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Total records:</span>
              <span className="font-medium">{importResult.total}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Successfully imported:</span>
              <span className="font-medium text-green-600 dark:text-green-400">{importResult.imported}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Failed:</span>
              <span className="font-medium text-red-600 dark:text-red-400">{importResult.total - importResult.imported}</span>
            </div>
          </div>
          
          {importResult.errors && importResult.errors.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Errors:</h3>
              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
                <ul className="text-sm text-red-700 dark:text-red-400 list-disc list-inside">
                  {importResult.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductImportPage;