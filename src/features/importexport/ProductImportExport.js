import React, { useState } from 'react';
import { apiService } from '../../api/config';
import { 
  FiUpload, 
  FiDownload, 
  FiFile, 
  FiX, 
  FiAlertCircle, 
  FiCheckCircle 
} from 'react-icons/fi';

const ProductImportExport = ({ storeId }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setResult(null);
    setError(null);
  };
  
  const handleImport = async () => {
    if (!selectedFile) {
      setError('Please select a file to import');
      return;
    }
    
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('storeId', storeId);
    
    setLoading(true);
    try {
      const isExcel = selectedFile.name.toLowerCase().endsWith('.xlsx') || 
      selectedFile.name.toLowerCase().endsWith('.xls');

      const endpoint = isExcel ? '/products/import-export/import/excel' : '/products/import-export/import/csv';

      const response = await apiService.uploadFile(endpoint, formData);

      setResult(response.data);
    } catch (err) {
      console.error('Error importing products:', err);
      setError(err.response?.data?.message || 'Failed to import products');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDownloadTemplate = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      
      const response = await axios.get(
        '/products/import-export/template',
        {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          responseType: 'blob'
        }
      );
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'product_import_template.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Error downloading template:', err);
      setError('Failed to download template');
    }
  };
  
  const handleExport = async (format) => {
    try {
      const token = localStorage.getItem('jwtToken');
      
      const response = await axios.get(
        `/products/import-export/export/${format}/${storeId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Owner-Email': JSON.parse(atob(token.split('.')[1])).sub
          },
          responseType: 'blob'
        }
      );
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      link.setAttribute('download', `products_${storeId}_${date}.${format}`);
      
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(`Error exporting products as ${format}:`, err);
      setError(`Failed to export products as ${format}`);
    }
  };
  
  return (
    <div className="import-export-container p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Import & Export Products</h2>
      
      {/* Import Section */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Import Products</h3>
        
        <div className="flex items-center mb-4">
          <button
            onClick={handleDownloadTemplate}
            className="flex items-center px-4 py-2 text-sm bg-secondary-100 text-secondary-700 hover:bg-secondary-200 rounded-md mr-2"
          >
            <FiDownload className="mr-2" /> Download Template
          </button>
          
          <p className="text-sm text-secondary-500">
            Download a template file to see the required format for importing products.
          </p>
        </div>
        
        <div className="border-2 border-dashed border-secondary-300 dark:border-secondary-700 rounded-lg p-6 mb-4">
          {selectedFile ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FiFile className="text-secondary-500 mr-2" size={20} />
                <span className="text-secondary-700 dark:text-secondary-300">{selectedFile.name}</span>
                <span className="ml-2 text-xs text-secondary-500">
                  ({Math.round(selectedFile.size / 1024)} KB)
                </span>
              </div>
              
              <button
                onClick={() => setSelectedFile(null)}
                className="text-secondary-500 hover:text-secondary-700"
              >
                <FiX size={18} />
              </button>
            </div>
          ) : (
            <div className="text-center">
              <FiUpload className="mx-auto h-10 w-10 text-secondary-400" />
              <p className="mt-2 text-sm text-secondary-600 dark:text-secondary-400">
                Drag and drop a file here, or click to select a file
              </p>
              <p className="text-xs text-secondary-500 dark:text-secondary-500 mt-1">
                Supported formats: .csv, .xlsx, .xls
              </p>
              
              <input
                type="file"
                id="fileUpload"
                className="hidden"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileSelect}
              />
              
              <button
                type="button"
                onClick={() => document.getElementById('fileUpload').click()}
                className="mt-4 px-4 py-2 border border-secondary-300 dark:border-secondary-600 rounded-md text-sm font-medium text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700"
              >
                Select File
              </button>
            </div>
          )}
        </div>
        
        {selectedFile && (
          <button
            onClick={handleImport}
            disabled={loading}
            className="btn btn-primary w-full flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Importing...
              </>
            ) : (
              <>
                <FiUpload className="mr-2" /> Import Products
              </>
            )}
          </button>
        )}
        
        {/* Import Results */}
        {result && (
          <div className={`mt-4 p-4 rounded-md ${
            result.failureCount === 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'
          }`}>
            <div className="flex">
              <div className="flex-shrink-0">
                {result.failureCount === 0 ? (
                  <FiCheckCircle className="h-5 w-5 text-green-400" />
                ) : (
                  <FiAlertCircle className="h-5 w-5 text-yellow-400" />
                )}
              </div>
              <div className="ml-3">
                <h3 className={`text-sm font-medium ${
                  result.failureCount === 0 ? 'text-green-800 dark:text-green-300' : 'text-yellow-800 dark:text-yellow-300'
                }`}>
                  Import Results
                </h3>
                <div className="mt-2 text-sm">
                  <p className="text-sm">
                    Total rows: {result.totalRows}<br />
                    Successfully imported: {result.successCount}<br />
                    Failed rows: {result.failureCount}
                  </p>
                  
                  {result.failureCount > 0 && (
                    <div className="mt-3">
                      <details>
                        <summary className="text-sm font-medium cursor-pointer">View Errors</summary>
                        <ul className="mt-2 pl-5 list-disc">
                          {result.errors.map((error, index) => (
                            <li key={index} className="text-xs text-yellow-700 dark:text-yellow-400">
                              Row {error.rowNumber}: {error.errorMessage}
                            </li>
                          ))}
                        </ul>
                      </details>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Export Section */}
      <div>
        <h3 className="text-lg font-medium mb-2">Export Products</h3>
        <p className="text-sm text-secondary-500 mb-4">
          Export your products to CSV or Excel format for backup or editing.
        </p>
        
        <div className="flex space-x-4">
          <button
            onClick={() => handleExport('csv')}
            className="btn btn-secondary flex items-center"
          >
            <FiDownload className="mr-2" /> Export as CSV
          </button>
          
            <button
            onClick={() => handleExport('excel')}
            className="btn btn-primary flex items-center"
          >
            <FiDownload className="mr-2" /> Export as Excel
          </button>
        </div>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-md">
          <div className="flex">
            <FiAlertCircle className="h-5 w-5 text-red-500" />
            <span className="ml-2 text-red-700 dark:text-red-400">{error}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImportExport;