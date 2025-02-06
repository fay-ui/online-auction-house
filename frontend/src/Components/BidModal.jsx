import React, { useState } from 'react';

export default function BidModal({ showModal, onClose, onPlaceBid }) {
    const [bidAmount, setBidAmount] = useState('');

    const handleBidChange = (e) => {
        setBidAmount(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Check if the user is logged in
        const token = localStorage.getItem('token');
        if (!token) {
            alert('You must be logged in to place a bid');
            return;
        }

        if (bidAmount && !isNaN(bidAmount) && bidAmount > 0) {
            onPlaceBid(bidAmount);  // Pass the bidAmount to the parent
            setBidAmount('');
            onClose();  // Close the modal
        } else {
            alert('Please enter a valid bid amount');
        }
    };

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
