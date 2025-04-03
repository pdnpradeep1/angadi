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
import Papa from 'papaparse';

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
    
    setLoading(true);
    try {
      // Updated URL to match the backend controller endpoint
      const fileType = selectedFile.name.toLowerCase().endsWith('.csv') ? 'csv' : 'excel';
      const response = await apiService.post(`/products/import-export/import/${fileType}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Owner-Email': localStorage.getItem('userEmail') || '', // Make sure to include the Owner-Email header
        },
      });
      
      setResult({
        success: true,
        message: response.data.message || 'Products imported successfully',
        imported: response.data.importedCount || 0,
        failed: response.data.failedCount || 0,
        total: response.data.totalCount || 0,
      });
    } catch (err) {
      console.error('Import error:', err);
      setError(err.response?.data?.message || 'Failed to import products');
    } finally {
      setLoading(false);
    }
  };
  
  const handleExport = async () => {
    setLoading(true);
    try {
      // Create a direct fetch request to avoid any middleware issues
      const userEmail = localStorage.getItem('userEmail') || '';
      const url = `${apiService.API_BASE_URL}/products/import-export/export/${exportFormat}/${storeId}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Owner-Email': userEmail
        }
      });
      
      if (!response.ok) {
        throw new Error(`Export failed with status: ${response.status}`);
      }
      
      const blob = await response.blob();
      
      // Create a download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `products-export-${new Date().toISOString().split('T')[0]}.${exportFormat === 'excel' ? 'xlsx' : 'csv'}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      
      setResult({
        success: true,
        message: 'Products exported successfully',
      });
    } catch (err) {
      console.error('Export error:', err);
      setError(err.message || 'Failed to export products');
    } finally {
      setLoading(false);
    }
  };

  // Generate and download a template with variant support
  const downloadTemplate = () => {
    // Define headers including variant information
    const headers = [
      // Basic product information
      'name', 'description', 'price', 'stockQuantity', 'sku', 'category', 
      'status', 'imageUrl', 'featured', 'originalPrice', 'lowStockThreshold',
      
      // Variant related fields
      'hasVariants', 
      'variant1_sku', 'variant1_price', 'variant1_stock', 'variant1_option1_name', 'variant1_option1_value', 'variant1_option2_name', 'variant1_option2_value',
      'variant2_sku', 'variant2_price', 'variant2_stock', 'variant2_option1_name', 'variant2_option1_value', 'variant2_option2_name', 'variant2_option2_value',
      'variant3_sku', 'variant3_price', 'variant3_stock', 'variant3_option1_name', 'variant3_option1_value', 'variant3_option2_name', 'variant3_option2_value'
    ];
    
    // Sample data row
    const sampleData = [
      // Basic product data
      'Sample Product', 'This is a sample product description', '19.99', '100', 'PROD-123', 'Electronics', 
      'Active', 'https://example.com/image.jpg', 'TRUE', '24.99', '5',
      
      // Variant data
      'TRUE', 
      'VAR-1', '19.99', '50', 'Color', 'Red', 'Size', 'Small',
      'VAR-2', '21.99', '30', 'Color', 'Blue', 'Size', 'Medium',
      'VAR-3', '23.99', '20', 'Color', 'Green', 'Size', 'Large'
    ];
    
    // Create CSV content
    const csv = Papa.unparse({
      fields: headers,
      data: [sampleData]
    });
    
    // Create a blob and download it
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'product_import_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Import/Export Products</h2>
      
      {/* Import Section */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Import Products</h3>
        
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={downloadTemplate}
              className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-md flex items-center hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors"
            >
              <FiDownload className="mr-2" />
              Download Template
            </button>
            
            <button
              onClick={() => setShowFormatInfo(!showFormatInfo)}
              className="px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md flex items-center hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <FiInfo className="mr-2" />
              {showFormatInfo ? 'Hide Format Info' : 'View Format Info'}
            </button>
          </div>
          
          {showFormatInfo && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Import Format Information</h4>
              
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                <p>The CSV file should include the following columns:</p>
                
                <div>
                  <h5 className="font-medium mb-1">Required Fields:</h5>
                  <ul className="list-disc list-inside pl-2">
                    <li>name - Product name</li>
                    <li>price - Product price</li>
                    <li>sku - Stock keeping unit (unique identifier)</li>
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-medium mb-1">Optional Fields:</h5>
                  <ul className="list-disc list-inside pl-2">
                    <li>description - Product description</li>
                    <li>stockQuantity - Available stock</li>
                    <li>category - Product category</li>
                    <li>status - Product status (Active, Inactive)</li>
                    <li>imageUrl - URL to product image</li>
                    <li>featured - Set to TRUE if product should be featured</li>
                    <li>originalPrice - Original price before discount</li>
                    <li>lowStockThreshold - Threshold for low stock alerts</li>
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-medium mb-1">Variant Fields:</h5>
                  <p className="mb-1">To include variants, set <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded">hasVariants</code> to TRUE and fill in the variant details:</p>
                  <ul className="list-disc list-inside pl-2">
                    <li>variant1_sku, variant2_sku, variant3_sku - Unique SKU for each variant</li>
                    <li>variant1_price, variant2_price, variant3_price - Price for each variant</li>
                    <li>variant1_stock, variant2_stock, variant3_stock - Stock quantity for each variant</li>
                    <li>variant1_option1_name - Name of first option (e.g., "Color")</li>
                    <li>variant1_option1_value - Value of first option (e.g., "Red")</li>
                    <li>variant1_option2_name - Name of second option (e.g., "Size")</li>
                    <li>variant1_option2_value - Value of second option (e.g., "Small")</li>
                  </ul>
                  <p className="mt-1">You can define up to 3 variants per product, each with up to 2 option types.</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select CSV file to import
            </label>
            <div className="flex items-center">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/20 dark:file:text-blue-400 dark:hover:file:bg-blue-800/30"
              />
              <button
                onClick={handleImport}
                disabled={!selectedFile || loading}
                className="ml-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
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
                    <FiUpload className="mr-2" />
                    Import
                  </>
                )}
              </button>
            </div>
            {selectedFile && (
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Selected file: {selectedFile.name}
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Export Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Export Products</h3>
        
        <div className="flex flex-col space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Export Format
            </label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-primary-600 focus:ring-primary-500"
                  name="exportFormat"
                  value="excel"
                  checked={exportFormat === 'excel'}
                  onChange={() => setExportFormat('excel')}
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">Excel (.xlsx)</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-primary-600 focus:ring-primary-500"
                  name="exportFormat"
                  value="csv"
                  checked={exportFormat === 'csv'}
                  onChange={() => setExportFormat('csv')}
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">CSV (.csv)</span>
              </label>
            </div>
          </div>
          
          <div>
            <button
              onClick={handleExport}
              disabled={loading}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Exporting...
                </>
              ) : (
                <>
                  <FiDownload className="mr-2" />
                  Export Products
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Results */}
      {(result || error) && (
        <div className="mt-6 p-4 rounded-md border">
          {result && (
            <div className={`flex items-start ${result.success ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {result.success ? (
                <FiCheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              ) : (
                <FiAlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-medium">{result.message}</p>
                {result.imported !== undefined && (
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    <p>Total: {result.total}</p>
                    <p>Imported: {result.imported}</p>
                    <p>Failed: {result.failed}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {error && (
            <div className="flex items-start text-red-600 dark:text-red-400">
              <FiAlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Import failed</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductImportExport;