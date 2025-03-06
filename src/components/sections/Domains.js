// src/components/sections/Domains.js
import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';
import BaseSection from '../ui/BaseSection';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import Modal from '../ui/Modal';
import { FormField } from '../ui/FormField';

const Domains = () => {
  const [showConnectDomainSidebar, setShowConnectDomainSidebar] = useState(false);

  // Sample domain data
  const domains = [
    {
      domain: 'mydukaan.io/harintiruchulu',
      status: 'LIVE',
      dateAdded: 'Oct 13, 2024',
      provider: 'Dukaan'
    }
  ];

  const DomainTable = () => (
    <Card className="mb-6 overflow-hidden">
      <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-700">
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Domain name</div>
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</div>
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Date added</div>
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Provider</div>
      </div>
      {domains.map((domain, index) => (
        <div key={index} className="grid grid-cols-4 gap-4 p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-blue-600 dark:text-blue-400">{domain.domain}</div>
          <div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300">
              {domain.status}
            </span>
          </div>
          <div className="text-gray-600 dark:text-gray-400">{domain.dateAdded}</div>
          <div className="text-gray-600 dark:text-gray-400">{domain.provider}</div>
        </div>
      ))}
    </Card>
  );

  const ConnectExternalDomainCard = () => (
    <Card>
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Connect external domain</h3>
          <p className="text-gray-600 dark:text-gray-400">You can connect your existing domain to Dukaan in a few minutes.</p>
        </div>
        <Button onClick={() => setShowConnectDomainSidebar(true)}>
          Connect
        </Button>
      </div>
    </Card>
  );

  const ConnectDomainModal = () => (
    <Modal
      isOpen={showConnectDomainSidebar}
      onClose={() => setShowConnectDomainSidebar(false)}
      title="Connect external domain"
      size="md"
      footer={
        <div className="flex justify-end space-x-3">
          <Button
            variant="secondary"
            onClick={() => setShowConnectDomainSidebar(false)}
          >
            Cancel
          </Button>
          <Button>
            Connect
          </Button>
        </div>
      }
    >
      <div className="flex items-center mb-4">
        <Button 
          variant="secondary" 
          className="flex items-center text-sm text-red-600 mr-4"
        >
          <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 12L12 16L16 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Watch video tutorial
        </Button>
      </div>

      <div className="space-y-6">
        <FormField label="Domain">
          <input
            type="text"
            placeholder="example.com"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </FormField>

        <div>
          <h3 className="text-md font-medium text-gray-900 dark:text-white mb-2">DNS instructions</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            To point an apex domain such as mystore.com or a subdomain such as www.mystore.com to your store on Dukaan, you must create a A record with your DNS provider.
          </p>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            To point a domain to your Dukaan store, create an A record with the IP address 103.181.194.5
          </p>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            You can have only one A record associated with your primary domain. If your domain is already associated with an A record, amend it to the Dukaan IP address.
          </p>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Remove IPV6 AAAA record if exists
          </p>
          
          <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md mb-4">
            <p className="text-sm text-gray-700 dark:text-gray-300">mystore.com A 103.181.194.5</p>
          </div>
        </div>
      </div>
    </Modal>
  );

  return (
    <BaseSection
      title="Domains"
      description="Set up and personalize your store's web address."
    >
      <DomainTable />
      <ConnectExternalDomainCard />
      <ConnectDomainModal />
    </BaseSection>
  );
};

export default Domains;