import React, { useState } from 'react';

export default function BidModal({ showModal, onClose, onPlaceBid }) {
  const [bidAmount, setBidAmount] = useState('');

  // Handle input changes
  const handleBidChange = (e) => {
    setBidAmount(e.target.value);
  };

  // Submit the bid
  const handleSubmit = (e) => {
    e.preventDefault();
    if (bidAmount && !isNaN(bidAmount) && bidAmount > 0) {
      onPlaceBid(bidAmount);
      setBidAmount('');
      onClose();
    } else {
      alert('Please enter a valid bid amount');
    }
  };

  // Close the modal by clicking the backdrop
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {showModal && (
        <div
          className="backdrop"
          onClick={handleBackdropClick}
        >
          <div className="modal-content">
            <h2>Place Your Bid</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Bid Amount ($)
                <input
                  type="number"
                  value={bidAmount}
                  onChange={handleBidChange}
                  min="1"
                  placeholder="Enter bid amount"
                />
              </label>
              <button type="submit">Place Bid</button>
            </form>
            <button onClick={onClose} className="close-btn">✕</button>
          </div>
        </div>
      )}
    </>
  );
}
