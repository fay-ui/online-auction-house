import React from 'react';

// Helper function to format time remaining
const formatTimeLeft = (endDate) => {
  const now = new Date();
  const end = new Date(endDate);
  const timeDiff = end - now;

  if (timeDiff <= 0) return 'Auction Ended';

  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${days}d ${hours}h ${minutes}m left`;
};

export default function SingleAuctionItem({ auctionItem }) {
  const { title, description, startingBid, imageUrl, auctionEnd } = auctionItem;

  // Format auction end date
  const formattedDate = new Date(auctionEnd).toLocaleString();
  const timeLeft = formatTimeLeft(auctionEnd);

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <img
        src={imageUrl || 'https://via.placeholder.com/300'}
        alt={title}
        className="w-full h-64 object-cover rounded-md"
        onError={(e) => e.target.src = 'https://via.placeholder.com/300'} // Set a fallback image on error
      />
      <h2 className="text-3xl font-semibold text-gray-800 mt-4">{title}</h2>
      <p className="text-gray-600 mt-2">{description}</p>
      <div className="flex justify-between items-center mt-4">
        <span className="text-xl font-medium text-gray-900">Starting Bid: ${startingBid.toFixed(2)}</span>
        <span className="text-sm text-gray-500">Auction Ends: {formattedDate}</span>
      </div>
      <div className="mt-2 text-sm text-gray-600">
        <strong>Time Left: </strong>{timeLeft}
      </div>
      <button className="mt-6 w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 focus:outline-none">
        Place Bid
      </button>
    </div>
  );
}
