import React, { useState } from 'react';
import axios from 'axios';

const AddAuction = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false); // To track if the form is being submitted
  const [error, setError] = useState(null); // To capture any errors
  const [success, setSuccess] = useState(null); // To capture success message

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate inputs
    if (!title || !description || !price || isNaN(price) || price <= 0) {
      setError('Please fill all fields correctly.');
      setSuccess(null); // Clear success message
      return;
    }

    const newItem = {
      id: Date.now(), // Use timestamp as ID
      title,
      description,
      price: parseFloat(price),
    };

    setLoading(true); // Start loading state
    setError(null); // Clear any previous error
    setSuccess(null); // Clear previous success message

    // Make POST request to add auction item
    axios.post('http://localhost:5000/api/items', newItem)
      .then(response => {
        console.log('Added item:', response.data);
        // Clear form fields on success
        setTitle('');
        setDescription('');
        setPrice('');
        setLoading(false);
        setSuccess('Auction item added successfully!'); // Success message
      })
      .catch(error => {
        console.error('Error adding item:', error);
        setError('Error adding item. Please try again later.');
        setLoading(false); // Stop loading state
        setSuccess(null); // Clear success message
      });
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-semibold text-center mb-6">Add Auction Item</h2>

      {/* Success and Error Messages */}
      {error && <div className="text-red-600 text-center mb-4">{error}</div>}
      {success && <div className="text-green-600 text-center mb-4">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full h-12 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="mb-4">
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full h-24 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="mb-6">
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full h-12 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full h-12 rounded-md text-white font-semibold focus:outline-none focus:ring-2 ${
            loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {loading ? (
            <span>Submitting...</span> // You can replace this with a spinner if needed
          ) : (
            'Add Item'
          )}
        </button>
      </form>
    </div>
  );
};

export default AddAuction;
