import React, { createContext, useState, useEffect } from 'react';

// Create the AuctionContext
export const AuctionContext = createContext();

export const AuctionProvider = ({ children }) => {
  const [auctions, setAuctions] = useState([]);

  // Load auctions from localStorage when the component mounts
  const fetchAuctionItems = () => {
    try {
      const savedAuctions = localStorage.getItem('auctions');
      return savedAuctions ? JSON.parse(savedAuctions) : [];
    } catch (error) {
      console.error("Failed to load auctions from localStorage:", error);
      return [];
    }
  };

  useEffect(() => {
    setAuctions(fetchAuctionItems());
  }, []);

  // Function to add a new auction
  const addAuction = (auction) => {
    setAuctions((prev) => {
      const updatedAuctions = [...prev, auction];

      // Save updated auction list to localStorage
      try {
        localStorage.setItem('auctions', JSON.stringify(updatedAuctions));
      } catch (error) {
        console.error("Failed to save auctions to localStorage:", error);
      }
      return updatedAuctions;
    });
  };

  // Function to update an auction (for example, after a bid is placed)
  const updateAuction = (updatedAuction) => {
    setAuctions((prev) => {
      const updatedAuctions = prev.map(auction =>
        auction.id === updatedAuction.id ? updatedAuction : auction
      );

      // Save updated auction list to localStorage
      try {
        localStorage.setItem('auctions', JSON.stringify(updatedAuctions));
      } catch (error) {
        console.error("Failed to save auctions to localStorage:", error);
      }
      return updatedAuctions;
    });
  };

  // Function to delete an auction
  const deleteAuction = (auctionId) => {
    setAuctions((prev) => {
      const updatedAuctions = prev.filter(auction => auction.id !== auctionId);

      // Save updated auction list to localStorage
      try {
        localStorage.setItem('auctions', JSON.stringify(updatedAuctions));
      } catch (error) {
        console.error("Failed to save auctions to localStorage:", error);
      }
      return updatedAuctions;
    });
  };

  return (
    <AuctionContext.Provider value={{ auctions, fetchAuctionItems, addAuction, updateAuction, deleteAuction }}>
      {children}
    </AuctionContext.Provider>
  );
};
