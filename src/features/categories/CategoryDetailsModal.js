import React from 'react';
import Modal from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { FiCalendar, FiTag, FiShoppingBag, FiEdit2 } from 'react-icons/fi';

const CategoryDetailsModal = ({ isOpen, onClose, category, onEdit }) => {
  if (!category) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Category Details: ${category.name}`}
      size="md"
      footer={
        <>
          <Button 
            variant="secondary" 
            onClick={onClose} 
            className="mr-2"
          >
            Close
          </Button>
          <Button 
            onClick={() => {
              onEdit(category);
              onClose();
            }}
          >
            <FiEdit2 className="mr-2" /> Edit Category
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        {/* Category Image */}
        <div className="flex justify-center">
          <img 
            src={category.image} 
            alt={category.name} 
            className="w-32 h-32 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
          />
        </div>
        
        {/* Category Details */}
        <div className="grid grid-cols-1 gap-4 mt-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</h3>
            <p className="mt-1 text-sm text-gray-900 dark:text-white">{category.name}</p>
          </div>
          
          {category.description && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</h3>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">{category.description}</p>
            </div>
          )}
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</h3>
            <div className="mt-1 flex items-center">
              <span className={`relative inline-block h-3 w-3 rounded-full mr-2 ${
                category.status === 'Active' ? 'bg-green-400' : 'bg-red-400'
              }`}></span>
              <span className="text-sm text-gray-900 dark:text-white">{category.status}</span>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Products</h3>
            <div className="mt-1 flex items-center">
              <FiShoppingBag className="mr-2 text-gray-400" />
              <span className="text-sm text-gray-900 dark:text-white">{category.productCount} products</span>
            </div>
          </div>
          
          {/* If you track creation date, you could include it here */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Created</h3>
            <div className="mt-1 flex items-center">
              <FiCalendar className="mr-2 text-gray-400" />
              <span className="text-sm text-gray-900 dark:text-white">
                {new Date().toLocaleDateString()} {/* Mock date - would come from category.createdAt */}
              </span>
            </div>
          </div>
        </div>
        
        {/* Related Information */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={() => console.log('View products')}
              className="w-full"
            >
              <FiShoppingBag className="mr-2" /> View Products
            </Button>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => window.open(`/store-dashboard/${category.id}/all-products?category=${category.id}`, '_blank')}
              className="w-full"
            >
              <FiTag className="mr-2" /> Manage SEO
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CategoryDetailsModal;