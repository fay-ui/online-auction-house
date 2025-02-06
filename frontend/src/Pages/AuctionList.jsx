import React, { useState, useContext, useEffect } from 'react';
import { AuctionContext } from '../context/AuctionContext';
import BidModal from '../Components/BidModal'; // Import the BidModal component

const AuctionList = () => {
    const { auctions, loading, errorMessage, deleteAuction, updateAuction } = useContext(AuctionContext);
    const [editingAuction, setEditingAuction] = useState(null); // Track which auction is being edited
    const [updatedTitle, setUpdatedTitle] = useState('');
    const [updatedDescription, setUpdatedDescription] = useState('');
    const [updatedStartingPrice, setUpdatedStartingPrice] = useState('');
    const [showBidModal, setShowBidModal] = useState(false); // State to control BidModal visibility
    const [selectedAuctionId, setSelectedAuctionId] = useState(null); // Track which auction is being bid on
    const [searchTerm, setSearchTerm] = useState(''); // State for search term

    // Handle updating an auction
    const handleUpdateAuction = (auctionId) => {
        const auctionToUpdate = auctions.find((auction) => auction.id === auctionId);
        if (auctionToUpdate) {
            setEditingAuction(auctionToUpdate);
            setUpdatedTitle(auctionToUpdate.title);
            setUpdatedDescription(auctionToUpdate.description);
            setUpdatedStartingPrice(auctionToUpdate.starting_price);
        }
    };

    // Handle submitting an update
    const handleSubmitUpdate = (e) => {
        e.preventDefault();
        if (editingAuction) {
            const updatedData = {
                title: updatedTitle,
                description: updatedDescription,
                startingPrice: updatedStartingPrice,
            };
            updateAuction(editingAuction.id, updatedData);
            setEditingAuction(null); // Reset editing state
        }
    };

    // Handle placing a bid
    const handlePlaceBid = (auctionId) => {
        setSelectedAuctionId(auctionId);
        setShowBidModal(true);
    };

    // Handle bid submission
    const handleBidSubmit = async (bidAmount) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('You need to be logged in to place a bid.');
                return;
            }

            const response = await fetch('http://localhost:5000/place_bid', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    auction_item_id: selectedAuctionId,
                    amount: bidAmount,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to place bid');
            }

            alert('Bid placed successfully!');
            setShowBidModal(false); // Close the modal after placing the bid
        } catch (error) {
            console.error('Error placing bid:', error);
            alert('Failed to place bid. Please try again.');
        }
    };

    // Filter auctions based on search term
    const filteredAuctions = auctions.filter((auction) =>
        auction.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <h2>Auction List</h2>

            {/* Search Bar */}
            <div>
                <input
                    type="text"
                    placeholder="Search auctions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={() => setSearchTerm('')}>Clear</button>
            </div>

            {/* List of Auctions */}
            <ul>
                {filteredAuctions.map((auction) => (
                    <li key={auction.id}>
                        <h3>{auction.title}</h3>
                        <p>{auction.description}</p>
                        <p>Starting Price: ${auction.starting_price}</p>
                        {auction.image_url && (
                            <img src={auction.image_url} alt={auction.title} style={{ width: '100px' }} />
                        )}
                        <button onClick={() => deleteAuction(auction.id)}>Delete</button>
                        <button onClick={() => handleUpdateAuction(auction.id)}>Update</button>
                        <button onClick={() => handlePlaceBid(auction.id)}>Place Bid</button>
                    </li>
                ))}
            </ul>

            {/* Update Form */}
            {editingAuction && (
                <form onSubmit={handleSubmitUpdate}>
                    <h3>Update Auction</h3>
                    <input
                        type="text"
                        placeholder="Title"
                        value={updatedTitle}
                        onChange={(e) => setUpdatedTitle(e.target.value)}
                        required
                    />
                    <textarea
                        placeholder="Description"
                        value={updatedDescription}
                        onChange={(e) => setUpdatedDescription(e.target.value)}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Starting Price"
                        value={updatedStartingPrice}
                        onChange={(e) => setUpdatedStartingPrice(e.target.value)}
                        required
                    />
                    <button type="submit">Save Changes</button>
                    <button type="button" onClick={() => setEditingAuction(null)}>Cancel</button>
                </form>
            )}

            {/* Bid Modal */}
            <BidModal
                showModal={showBidModal}
                onClose={() => setShowBidModal(false)}
                onPlaceBid={handleBidSubmit}
            />
        </div>
    );
};

export default AuctionList;