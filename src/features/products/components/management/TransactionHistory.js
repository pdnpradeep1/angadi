import React from 'react';
import { 
  FiTrendingUp, 
  FiTrendingDown, 
  FiX, 
  FiPackage, 
  FiCalendar,
  FiUser,
  FiFileText
} from 'react-icons/fi';

const TransactionHistory = ({ productName, transactions, onClose }) => {
  // Format date
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get class based on transaction type
  const getTransactionTypeClass = (type) => {
    switch (type) {
      case 'PURCHASE':
      case 'RETURN':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'SALE':
      case 'DAMAGED':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'ADJUSTMENT':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'TRANSFER':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  return (
    <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      <div className="p-5 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
          <FiPackage className="mr-2 text-primary-500" />
          Transaction History: {productName}
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
        >
          <FiX size={20} />
        </button>
      </div>

      {transactions.length === 0 ? (
        <div className="p-5 text-center text-gray-500 dark:text-gray-400">
          No transactions found for this product.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Change
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Resulting Stock
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Performed By
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center">
                      <FiCalendar className="mr-2 text-gray-400" />
                      {formatDate(transaction.timestamp)}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTransactionTypeClass(transaction.type)}`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <span className={`flex items-center ${
                      transaction.quantityChange > 0 
                        ? 'text-green-600 dark:text-green-400' 
                        : transaction.quantityChange < 0 
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {transaction.quantityChange > 0 && <FiTrendingUp className="mr-1" />}
                      {transaction.quantityChange < 0 && <FiTrendingDown className="mr-1" />}
                      {transaction.quantityChange > 0 ? '+' : ''}{transaction.quantityChange}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {transaction.remainingQuantity === -1 ? 'Unlimited' : transaction.remainingQuantity}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center">
                      <FiFileText className="mr-2 text-gray-400" />
                      {transaction.reason || '-'}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center">
                      <FiUser className="mr-2 text-gray-400" />
                      {transaction.performedBy}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Add pagination if needed */}
      {transactions.length > 10 && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-center">
          <button className="px-3 py-1 bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300 rounded-md font-medium">
            View more transactions
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;