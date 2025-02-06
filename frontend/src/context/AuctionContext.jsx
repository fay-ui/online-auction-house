import { createContext, useContext, useState, useEffect } from 'react';

// Create the AuctionContext
export const AuctionContext = createContext({
  auctions: [],
  loading: false,
  error: null,
  fetchAuctionItems: () => {},
  addAuction: () => {},
  deleteAuction: () => {},
  updateAuction: () => {},
});

// Define the AuctionProvider component to manage auctions
export const AuctionProvider = ({ children }) => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper function to get token and handle missing token scenario
  const getAuthToken = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('You must be logged in to perform this action.');
      return null;
    }
    return token; // Return token directly; no need for JSON.parse here
  };

  // Fetch all auction items
  const fetchAuctionItems = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/auctionitems');
      if (!response.ok) throw new Error('Failed to fetch auctions.');
      const data = await response.json();

      // Check if data is valid
      if (Array.isArray(data) && data.length > 0) {
        setAuctions(data); // Set auctions only if valid
      } else {
        setError('No auctions found.');
      }
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Add a new auction item
  const addAuction = async (auctionData, imageFile) => {
    const formData = new FormData();
    formData.append('title', auctionData.title);
    formData.append('description', auctionData.description);
    formData.append('starting_price', auctionData.startingPrice);
    if (imageFile) formData.append('image', imageFile);

    const token = getAuthToken();
    if (!token) return; // If token is missing, exit early

    try {
      const response = await fetch('http://localhost:5000/auctionitems', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to add auction');
      const newAuction = await response.json();
      setAuctions([...auctions, newAuction.auction_item]); // Add new auction to state
    } catch (err) {
      setError(`Error: ${err.message}`);
    }
  };

  // Delete an auction item
  const deleteAuction = async (id) => {
    const token = getAuthToken();
    if (!token) return; // If token is missing, exit early

    try {
      const response = await fetch(`http://localhost:5000/auctionitems/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete auction');
      setAuctions(auctions.filter(item => item.id !== id)); // Remove deleted auction from state
    } catch (err) {
      setError(`Error: ${err.message}`);
    }
  };

  // Update an auction item
  const updateAuction = async (id, updatedData) => {
    const token = getAuthToken();
    if (!token) return; // If token is missing, exit early

    try {
      const response = await fetch(`http://localhost:5000/auctionitems/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) throw new Error('Failed to update auction');
      const updatedItem = await response.json();
      setAuctions(auctions.map(item =>
        item.id === id ? updatedItem.auction_item : item // Update auction in state
      ));
    } catch (err) {
      setError(`Error: ${err.message}`);
    }
  };

  // Effect hook to fetch auctions when the component mounts
  useEffect(() => {
    fetchAuctionItems();
  }, []);

  return (
    <AuctionContext.Provider
      value={{
        auctions,
        loading,
        error,
        fetchAuctionItems,
        addAuction,
        deleteAuction,
        updateAuction,
      }}
    >
      {children}
    </AuctionContext.Provider>
  );
};

// Custom hook for consuming the AuctionContext
export const useAuction = () => useContext(AuctionContext);
