// src/components/sections/Payments.js
import React, { useState } from 'react';
import { FiCreditCard } from 'react-icons/fi';
import BaseSection from '../ui/BaseSection';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ToggleSwitch } from '../ui/ToggleSwitch';
import Modal from '../ui/Modal';
import { FormField } from '../ui/FormField';
import useForm from '../../hooks/useForm';

const Payments = () => {
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [activePayment, setActivePayment] = useState('cod');
  const [setupProvider, setSetupProvider] = useState(null);

  const handleSetupProvider = (provider) => {
    setSetupProvider(provider);
    setShowSetupModal(true);
  };

  const togglePaymentMethod = (method) => {
    if (method === activePayment) {
      setActivePayment(null);
    } else {
      setActivePayment(method);
    }
  };

  // Payment provider setup form
  const PaymentSetupForm = () => {
    const { values, handleChange, handleSubmit } = useForm(
      { accountId: '', apiKey: '', secretKey: '' },
      null,
      (data) => {
        console.log('Setting up payment provider:', setupProvider, data);
        setShowSetupModal(false);
      }
    );

    return (
      <form onSubmit={handleSubmit}>
        <FormField label="Account ID" required={true}>
          <input
            type="text"
            name="accountId"
            value={values.accountId}
            onChange={handleChange}
            placeholder="Enter your account ID"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </FormField>

        <FormField label="API Key" required={true}>
          <input
            type="text"
            name="apiKey"
            value={values.apiKey}
            onChange={handleChange}
            placeholder="Enter your API key"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </FormField>

        <FormField label="Secret Key" required={true}>
          <input
            type="password"
            name="secretKey"
            value={values.secretKey}
            onChange={handleChange}
            placeholder="Enter your secret key"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </FormField>
      </form>
    );
  };

  return (
    <BaseSection>
      <div className="mb-8">
        <img src="/api/placeholder/120/40" alt="Razorpay" className="h-8" />
        <Card className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <PaymentFeatureItem 
              icon={<FiCreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
              text="Super-fast payments set-up"
            />
            <PaymentFeatureItem 
              icon={<FiCreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
              text="International & Domestic Payment modes like UPI, Cards, NetBanking, Wallets"
            />
            <PaymentFeatureItem 
              icon={<FiCreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
              text="Best-in-industry success rates"
            />
            <PaymentFeatureItem 
              icon={<FiCreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
              text="Prompt round-the-clock support"
            />
          </div>

          <div>
            <p className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">Receive payments via</p>
            <div className="flex space-x-4">
              <img src="/api/placeholder/50/30" alt="UPI" className="h-8" />
              <img src="/api/placeholder/50/30" alt="Google Pay" className="h-8" />
              <img src="/api/placeholder/50/30" alt="PayTM" className="h-8" />
              <img src="/api/placeholder/50/30" alt="NetBanking" className="h-8" />
              <img src="/api/placeholder/50/30" alt="Visa" className="h-8" />
              <img src="/api/placeholder/50/30" alt="Mastercard" className="h-8" />
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button onClick={() => handleSetupProvider('razorpay')}>Set up</Button>
          </div>
        </Card>
      </div>

      <section className="mb-8">
        <h2 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">Payment providers</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Manage payment providers to accept payments from your customers.</p>

        <PaymentProviderCard 
          name="Cashfree Payments"
          logo="/api/placeholder/40/40"
          description=""
          onSetup={() => handleSetupProvider('cashfree')}
        />

        <div className="mt-4">
          <PaymentProviderCard 
            name="Cash on delivery"
            logo={
              <div className="bg-orange-100 dark:bg-orange-900/30 h-10 w-10 flex items-center justify-center rounded-md mr-3">
                <span className="text-orange-600 dark:text-orange-400 font-bold">COD</span>
              </div>
            }
            description="Receive payments in cash upon delivery."
            toggle={
              <ToggleSwitch 
                checked={activePayment === 'cod'} 
                onChange={() => togglePaymentMethod('cod')}
                labelPosition="none"
              />
            }
          />
        </div>
      </section>

      {/* Payment Provider Setup Modal */}
      <Modal
        isOpen={showSetupModal}
        onClose={() => setShowSetupModal(false)}
        title={`Set up ${setupProvider?.charAt(0).toUpperCase() + setupProvider?.slice(1)}`}
        footer={
          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setShowSetupModal(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={() => setShowSetupModal(false)}>
              Connect
            </Button>
          </div>
        }
      >
        <PaymentSetupForm />
      </Modal>
    </BaseSection>
  );
};

// Helper component for payment features
const PaymentFeatureItem = ({ icon, text }) => (
  <div className="flex flex-col">
    <div className="flex items-center mb-2">
      <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-md">
        {icon}
      </div>
    </div>
    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{text}</p>
  </div>
);

// Helper component for payment provider cards
const PaymentProviderCard = ({ name, logo, description, onSetup, toggle }) => (
  <Card className="flex justify-between items-center p-4 mb-4">
    <div className="flex items-center">
      {typeof logo === 'string' ? (
        <img src={logo} alt={name} className="h-10 w-10 mr-3" />
      ) : (
        logo
      )}
      <div>
        <p className="font-medium text-gray-900 dark:text-white">{name}</p>
        {description && <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>}
      </div>
    </div>
    {toggle || (
      <Button onClick={onSetup}>
        Set up
      </Button>
    )}
  </Card>
);

export default Payments;