import React from 'react';
import { FiDownload, FiInfo } from 'react-icons/fi';

const ImportFormatInfo = () => {
  // Generate sample CSV content
  const generateSampleCSV = () => {
    const headers = ['Name', 'Description', 'Price', 'Original Price', 'SKU', 'Stock Quantity', 'Category', 'Featured', 'Status'];
    const rows = [
      ['Sample Product 1', 'This is a sample product description', '19.99', '24.99', 'PROD-001', '100', 'Electronics', 'true', 'ACTIVE'],
      ['Sample Product 2', 'Another sample product with details', '29.99', '34.99', 'PROD-002', '50', 'Home & Kitchen', 'false', 'ACTIVE']
    ];
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    return csvContent;
  };

  // Handle download of sample files
  const downloadSampleFile = (fileType) => {
    let content, fileName, mimeType;
    
    if (fileType === 'csv') {
      content = generateSampleCSV();
      fileName = 'product_import_template.csv';
      mimeType = 'text/csv';
    } else {
      content = generateSampleCSV(); // Same content for Excel template
      fileName = 'product_import_template.xlsx';
      mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    }
    
    // Create a blob and download link
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center mb-4">
        <FiInfo className="text-primary-500 mr-2 h-5 w-5" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Import Format Information</h3>
      </div>
      
      <div className="prose dark:prose-invert max-w-none mb-6">
        <p>
          To import products, please use one of the following file formats:
        </p>
        
        <h4>Required Columns:</h4>
        <ul>
          <li><strong>Name</strong> - Product name (required)</li>
          <li><strong>Price</strong> - Product price (required)</li>
        </ul>
        
        <h4>Optional Columns:</h4>
        <ul>
          <li><strong>Description</strong> - Product description</li>
          <li><strong>Original Price</strong> - Original price before discount</li>
          <li><strong>SKU</strong> - Stock keeping unit (unique identifier)</li>
          <li><strong>Stock Quantity</strong> - Available inventory (defaults to 0)</li>
          <li><strong>Category</strong> - Product category name</li>
          <li><strong>Featured</strong> - Set to "true" to feature product (defaults to false)</li>
          <li><strong>Status</strong> - Product status: ACTIVE, DRAFT, etc. (defaults to ACTIVE)</li>
        </ul>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => downloadSampleFile('csv')}
          className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <FiDownload className="mr-2 h-4 w-4" />
          Download CSV Template
        </button>
        
        <button
          onClick={() => downloadSampleFile('excel')}
          className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <FiDownload className="mr-2 h-4 w-4" />
          Download Excel Template
        </button>
      </div>
    </div>
  );
};

export default ImportFormatInfo;