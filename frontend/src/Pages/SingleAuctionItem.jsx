import React, { useState } from 'react';
import BidModal from '../Components/BidModal';

const SingleAuctionItem = ({ auctionItem }) => {
  const [showModal, setShowModal] = useState(false);

  const { title, description, startingBid, imageUrl, auctionEnd } = auctionItem;

  const handleBidClick = () => {
    setShowModal(true);
  };

  const handlePlaceBid = (bidAmount) => {
    console.log(`Placing bid of $${bidAmount} for auction ${title}`);
    // Place the bid via API or update auction state here
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const formattedDate = new Date(auctionEnd).toLocaleString();

  return (
    <div className="auction-item-detail">
      <img src={imageUrl || 'default-image-url'} alt={title} />
      <h2>{title}</h2>
      <p>{description}</p>
      <div>
        <p>Starting Bid: ${startingBid}</p>
        <p>Auction Ends: {formattedDate}</p>
      </div>
      <button onClick={handleBidClick}>Place Bid</button>

      <BidModal
        showModal={showModal}
        onClose={handleCloseModal}
        onPlaceBid={handlePlaceBid}
      />
    </div>
  );
};

export default SingleAuctionItem;
