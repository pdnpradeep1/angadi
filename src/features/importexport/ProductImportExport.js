import React, { useState } from 'react';
import { apiService } from '../../api/config';
import { 
  FiUpload, 
  FiDownload, 
  FiFile, 
  FiX, 
  FiAlertCircle, 
  FiCheckCircle,
  FiInfo
} from 'react-icons/fi';
import ImportFormatInfo from '../../components/products/ImportFormatInfo';

const ProductImportExport = ({ storeId }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [exportFormat, setExportFormat] = useState('excel');
  const [showShopifyInfo, setShowShopifyInfo] = useState(false);
  const [showFormatInfo, setShowFormatInfo] = useState(false);
  
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
    formData.append('importType', 'shopify'); // Specify Shopify-compatible import
    
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
  
  const handleExport = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const endpoint = `/products/import-export/export/${exportFormat === 'excel' ? 'excel' : 'csv'}/${storeId}?format=shopify`;
      
      // For file download, we need to handle the response differently
      const response = await apiService.get(endpoint, { responseType: 'blob' });
      
      // Create a download link and trigger it
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `products-export-${new Date().toISOString().split('T')[0]}.${exportFormat === 'excel' ? 'xlsx' : 'csv'}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      setResult({ success: true, message: 'Products exported successfully' });
    } catch (err) {
      console.error('Error exporting products:', err);
      setError('Failed to export products');
    } finally {
      setLoading(false);
    }
  };

  // Shopify format information
  const shopifyFormatInfo = (
    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
      <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 flex items-center">
        <FiInfo className="mr-2" /> Shopify Compatible Format
      </h3>
      <p className="mt-2 text-xs text-blue-700 dark:text-blue-400">
        The export will include these columns:
      </p>
      <ul className="mt-1 text-xs text-blue-700 dark:text-blue-400 list-disc list-inside">
        <li>Handle (URL slug)</li>
        <li>Title (Product name)</li>
        <li>Body (HTML) (Description)</li>
        <li>Vendor (Brand)</li>
        <li>Product Type (Category)</li>
        <li>Tags</li>
        <li>Option names and values</li>
        <li>Variant details (SKU, price, inventory, etc.)</li>
        <li>Images</li>
      </ul>
      <p className="mt-2 text-xs text-blue-700 dark:text-blue-400">
        You can import this file directly into Shopify or edit it and import back into Angadi.
      </p>
    </div>
  );
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Product Import & Export</h2>
        <div className="flex space-x-4">
          <button 
            onClick={() => setShowFormatInfo(!showFormatInfo)}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center"
          >
            <FiInfo className="mr-1" /> 
            {showFormatInfo ? 'Hide Format Info' : 'Show Import Format'}
          </button>
          <button 
            onClick={() => setShowShopifyInfo(!showShopifyInfo)}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center"
          >
            <FiInfo className="mr-1" /> 
            {showShopifyInfo ? 'Hide Shopify Info' : 'Show Shopify Format'}
          </button>
        </div>
      </div>
      
      {showFormatInfo && <ImportFormatInfo />}
      {showShopifyInfo && shopifyFormatInfo}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Import Section */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h3 className="text-md font-medium text-gray-800 dark:text-white mb-4">Import Products</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select File (CSV or Excel)
            </label>
            <div className="flex items-center">
              <label className="flex-1 cursor-pointer bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600">
                <span className="flex items-center">
                  <FiFile className="mr-2" />
                  {selectedFile ? selectedFile.name : 'Choose file...'}
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileSelect}
                />
              </label>
              {selectedFile && (
                <button
                  className="ml-2 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  onClick={() => setSelectedFile(null)}
                >
                  <FiX />
                </button>
              )}
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Supported formats: CSV, Excel (.xlsx, .xls)
            </p>
          </div>
          
          <button
            className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            onClick={handleImport}
            disabled={!selectedFile || loading}
          >
            {loading ? (
              <>
                <span className="animate-spin mr-2">⟳</span> Importing...
              </>
            ) : (
              <>
                <FiUpload className="mr-2" /> Import Products
              </>
            )}
          </button>
        </div>
        
        {/* Export Section */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h3 className="text-md font-medium text-gray-800 dark:text-white mb-4">Export Products</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Export Format
            </label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-primary-600"
                  name="exportFormat"
                  value="excel"
                  checked={exportFormat === 'excel'}
                  onChange={() => setExportFormat('excel')}
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Excel (.xlsx)</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-primary-600"
                  name="exportFormat"
                  value="csv"
                  checked={exportFormat === 'csv'}
                  onChange={() => setExportFormat('csv')}
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">CSV</span>
              </label>
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Exports in Shopify-compatible format
            </p>
          </div>
          
          <button
            className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            onClick={handleExport}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="animate-spin mr-2">⟳</span> Exporting...
              </>
            ) : (
              <>
                <FiDownload className="mr-2" /> Export Products
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Results/Errors */}
      {(result || error) && (
        <div className={`mt-6 p-4 rounded-md ${error ? 'bg-red-50 dark:bg-red-900/20' : 'bg-green-50 dark:bg-green-900/20'}`}>
          {error ? (
            <div className="flex items-start">
              <FiAlertCircle className="text-red-500 mt-0.5 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-red-800 dark:text-red-300">Error</h3>
                <p className="mt-1 text-sm text-red-700 dark:text-red-400">{error}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-start">
              <FiCheckCircle className="text-green-500 mt-0.5 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-green-800 dark:text-green-300">Success</h3>
                <p className="mt-1 text-sm text-green-700 dark:text-green-400">{result.message}</p>
                {result.imported && (
                  <p className="mt-1 text-sm text-green-700 dark:text-green-400">
                    Imported {result.imported} products successfully.
                  </p>
                )}
                {result.errors && result.errors.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-red-800 dark:text-red-300">Some items had errors:</p>
                    <ul className="mt-1 text-sm text-red-700 dark:text-red-400 list-disc list-inside">
                      {result.errors.slice(0, 5).map((err, idx) => (
                        <li key={idx}>{err}</li>
                      ))}
                      {result.errors.length > 5 && <li>...and {result.errors.length - 5} more errors</li>}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductImportExport;