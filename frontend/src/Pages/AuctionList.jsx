import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AuctionList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track errors

  // Fetch auction items when the component mounts
  useEffect(() => {
    axios.get('http://localhost:5000/api/items')
      .then(response => {
        setItems(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError('Error fetching auction items');
        setLoading(false);
        console.error('Error fetching auction items:', error);
      });
  }, []);

  // Delete an item
  const deleteItem = (id) => {
    axios.delete(`http://localhost:5000/api/items/${id}`)
      .then(() => {
        setItems((prevItems) => prevItems.filter(item => item.id !== id)); // Update state after deletion
      })
      .catch(error => {
        setError('Error deleting the auction item');
        console.error('Error deleting item:', error);
      });
  };

  // Loading and error handling
  if (loading) {
    return (
      <div className="text-center p-4 text-gray-700">
        <div className="loader">Loading auction items...</div> {/* You can add a spinner or animation here */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Auction Items</h2>
      {items.length === 0 ? (
        <p>No auction items available. Please check back later.</p>
      ) : (
        <ul className="space-y-4">
          {items.map(item => (
            <li key={item.id} className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all">
              <h3 className="text-xl font-medium text-gray-800">{item.title}</h3>
              <p className="text-gray-600">Price: ${item.price}</p>
              <button 
                onClick={() => deleteItem(item.id)} 
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500">
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AuctionList;
