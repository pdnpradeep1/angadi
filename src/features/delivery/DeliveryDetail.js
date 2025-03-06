import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FiArrowLeft, 
  FiPrinter, 
  FiDownload, 
  FiSend,
  FiAlertCircle
} from 'react-icons/fi';

// Utility Imports
import { formatDate } from '../../utils/date-utils';
import { formatCurrency } from '../../utils/currencyUtils';
import { getStatusBadge } from '../../utils/status-badge-utils';
import { generateMockDelivery, generateMockTrackingHistory } from '../../utils/mock-data-utils';

// UI Component Imports
import { Button } from '../../components/ui/Button';
import { LoadingState, ErrorState } from '../../utils/loading-error-states';
import Modal from '../../components/ui/Modal';

const DeliveryDetail = () => {
  const { storeId, deliveryId } = useParams();
  const navigate = useNavigate();

  // State Management
  const [delivery, setDelivery] = useState(null);
  const [trackingHistory, setTrackingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalType, setModalType] = useState(null);

  // Fetch Delivery Details
  useEffect(() => {
    fetchDeliveryDetails();
  }, [deliveryId]);

  const fetchDeliveryDetails = async () => {
    setLoading(true);
    try {
      // For development, use mock data
      const mockDelivery = generateMockDelivery(deliveryId);
      const mockTrackingHistory = generateMockTrackingHistory(deliveryId);
      
      setDelivery(mockDelivery);
      setTrackingHistory(mockTrackingHistory);
    } catch (err) {
      console.error('Error fetching delivery details:', err);
      setError('Failed to load delivery details');
    } finally {
      setLoading(false);
    }
  };

  // Action Handlers
  const handlePrintOrder = () => {
    window.print();
  };

  const handleDownloadInvoice = () => {
    // Implement download logic
    alert('Downloading invoice...');
  };

  const handleSendNotification = (type) => {
    // Implement notification sending logic
    alert(`Sending ${type} notification`);
    setModalType(null);
  };

  // Render Loading or Error States
  if (loading) return <LoadingState message="Loading delivery details..." />;
  if (error) return <ErrorState error={error} onRetry={fetchDeliveryDetails} />;
  if (!delivery) return null;

  // Notification Modal Content
  const renderNotificationModal = () => (
    <Modal
      isOpen={modalType === 'notifications'}
      onClose={() => setModalType(null)}
      title="Send Delivery Update"
      footer={
        <>
          <Button 
            variant="secondary" 
            onClick={() => setModalType(null)}
          >
            Cancel
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Button 
          variant="secondary" 
          className="w-full"
          onClick={() => handleSendNotification('email')}
        >
          Send Email Update
        </Button>
        <Button 
          variant="secondary" 
          className="w-full"
          onClick={() => handleSendNotification('sms')}
        >
          Send SMS Update
        </Button>
        <Button 
          variant="secondary" 
          className="w-full"
          onClick={() => handleSendNotification('whatsapp')}
        >
          Send WhatsApp Update
        </Button>
      </div>
    </Modal>
  );

  return (
    <div className="container mx-auto p-6 bg-gray-50 dark:bg-gray-900">
      {/* Previous code remains the same */}
      
      {/* Package Contents */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">Package Contents</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Product</th>
              <th className="text-right py-2">Quantity</th>
              <th className="text-right py-2">Weight</th>
            </tr>
          </thead>
          <tbody>
            {delivery.items.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="py-2 flex items-center">
                  <img 
                    src={item.image} 
                    alt={item.productName} 
                    className="h-10 w-10 mr-4 rounded"
                  />
                  {item.productName}
                </td>
                <td className="text-right py-2">{item.quantity}</td>
                <td className="text-right py-2">{item.weight}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 flex justify-between">
          <span>Total Items: {delivery.items.reduce((sum, item) => sum + item.quantity, 0)}</span>
          <span>Total Weight: {delivery.weight}</span>
        </div>
      </div>

      {/* Carrier Information */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">Carrier Information</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p><strong>Carrier:</strong> {delivery.carrierName}</p>
            <p><strong>Contact:</strong> {delivery.carrierPhone}</p>
            <p><strong>Website:</strong> {delivery.carrierWebsite}</p>
          </div>
          <div>
            <p><strong>Shipping Method:</strong> {delivery.shippingMethod}</p>
            <p><strong>Signature Required:</strong> {delivery.signature ? 'Yes' : 'No'}</p>
          </div>
        </div>
      </div>

      {/* Render Notification Modal */}
      {renderNotificationModal()}
    </div>
  );
};

export default DeliveryDetail;