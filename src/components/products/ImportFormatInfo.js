import React from 'react';
import { FiDownload, FiInfo } from 'react-icons/fi';
import Papa from 'papaparse';

const ImportFormatInfo = () => {
  // Generate sample CSV content with variant support
  const generateSampleCSV = () => {
    const headers = [
      // Basic product information
      'name', 'description', 'price', 'stockQuantity', 'sku', 'category', 
      'status', 'imageUrl', 'featured', 'originalPrice', 'lowStockThreshold',
      
      // Variant related fields
      'hasVariants', 
      'variant1_sku', 'variant1_price', 'variant1_stock', 'variant1_option1_name', 'variant1_option1_value', 'variant1_option2_name', 'variant1_option2_value',
      'variant2_sku', 'variant2_price', 'variant2_stock', 'variant2_option1_name', 'variant2_option1_value', 'variant2_option2_name', 'variant2_option2_value'
    ];
    
    const rows = [
      // Basic product with no variants
      ['Sample Product 1', 'This is a sample product description', '19.99', '100', 'PROD-001', 'Electronics', 'ACTIVE', 'https://example.com/image1.jpg', 'true', '24.99', '5', 'FALSE', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      
      // Product with variants
      ['Sample Product 2', 'Another sample product with variants', '29.99', '0', 'PROD-002', 'Clothing', 'ACTIVE', 'https://example.com/image2.jpg', 'false', '34.99', '10', 'TRUE', 'PROD-002-RED-S', '29.99', '10', 'Color', 'Red', 'Size', 'Small', 'PROD-002-BLUE-M', '32.99', '15', 'Color', 'Blue', 'Size', 'Medium']
    ];
    
    return Papa.unparse({
      fields: headers,
      data: rows
    });
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
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Import Format Information</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => downloadSampleFile('csv')}
            className="px-3 py-1 text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded flex items-center hover:bg-blue-100 dark:hover:bg-blue-800/30"
          >
            <FiDownload className="mr-1" />
            CSV Template
          </button>
          <button
            onClick={() => downloadSampleFile('excel')}
            className="px-3 py-1 text-xs bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded flex items-center hover:bg-green-100 dark:hover:bg-green-800/30"
          >
            <FiDownload className="mr-1" />
            Excel Template
          </button>
        </div>
      </div>
      
      <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Required Fields</h4>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>name</strong> - Product name</li>
            <li><strong>price</strong> - Product price (numeric value)</li>
            <li><strong>sku</strong> - Stock keeping unit (unique identifier)</li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Optional Fields</h4>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>description</strong> - Product description</li>
            <li><strong>stockQuantity</strong> - Available stock (numeric value)</li>
            <li><strong>category</strong> - Product category name</li>
            <li><strong>status</strong> - Product status (ACTIVE, INACTIVE, DRAFT)</li>
            <li><strong>imageUrl</strong> - URL to product image</li>
            <li><strong>featured</strong> - Set to "true" if product should be featured</li>
            <li><strong>originalPrice</strong> - Original price before discount (numeric value)</li>
            <li><strong>lowStockThreshold</strong> - Threshold for low stock alerts (numeric value)</li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Variant Fields</h4>
          <p className="mb-2">
            To include variants, set <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded">hasVariants</code> to "TRUE" and fill in the variant details:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>variant1_sku, variant2_sku, etc.</strong> - Unique SKU for each variant</li>
            <li><strong>variant1_price, variant2_price, etc.</strong> - Price for each variant (numeric value)</li>
            <li><strong>variant1_stock, variant2_stock, etc.</strong> - Stock quantity for each variant (numeric value)</li>
            <li><strong>variant1_option1_name</strong> - Name of first option (e.g., "Color")</li>
            <li><strong>variant1_option1_value</strong> - Value of first option (e.g., "Red")</li>
            <li><strong>variant1_option2_name</strong> - Name of second option (e.g., "Size")</li>
            <li><strong>variant1_option2_value</strong> - Value of second option (e.g., "Small")</li>
          </ul>
          <p className="mt-2">
            You can define up to 3 variants per product, each with up to 2 option types.
          </p>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
          <div className="flex">
            <FiInfo className="text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-700 dark:text-blue-400 mb-1">Tips</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>For products with variants, set the main product's stock to 0</li>
                <li>Each variant must have a unique SKU</li>
                <li>Make sure all required fields are filled for each product</li>
                <li>Use consistent option names across variants (e.g., always use "Color" not "Colour")</li>
                <li>Download the template for a properly formatted example</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportFormatInfo;