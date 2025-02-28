// CreateStore.js
import React, { useState } from 'react';
import api from '../utils/apiConfig';

const CreateStore = ({ onStoreCreated }) => {
  const [storeName, setStoreName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStoreNameChange = (e) => {
    setStoreName(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!storeName || !description || !address) {
      alert('Please provide Store Name, Description, and Address.');
      return;
    }

    setLoading(true);

    // Simulate store creation
    const newStore = {
      name: storeName,
      description,
      address,
    };

    try {
        // Send a POST request to the server to save the store in the database
        const response = await api.post('/api/stores', newStore);
  
        // Call the onStoreCreated function to update the store list in App.js
        onStoreCreated(response.data); // Assuming response.data contains the newly created store
  
        // Reset form fields
        setStoreName('');
        setDescription('');
        setAddress('');
  
        alert('Store created successfully!');
      } catch (error) {
        console.error('Error creating store:', error);
        alert('There was an error creating the store.');
      } finally {
        setLoading(false);
      }
  };

  return (
    <div className="create-store-container">
      <h3>Create a New Store</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Store Name</label>
          <input
            type="text"
            value={storeName}
            onChange={handleStoreNameChange}
            placeholder="Enter store name"
            required
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Enter store description"
            required
            rows="4"
          />
        </div>
        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            value={address}
            onChange={handleAddressChange}
            placeholder="Enter store address"
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Store'}
        </button>
      </form>
    </div>
  );
};

export default CreateStore;
