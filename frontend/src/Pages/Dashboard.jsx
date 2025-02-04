// Pages/Dashboard.js
import React, { useState, useContext } from 'react';
import AuctionList from './AuctionList';  // Reusing AuctionList component
import AddAuction from './AddAuction';    // Reusing AddAuction for creating new auctions
import { AuctionContext } from '../context/AuctionContext'; // Import AuctionContext

const Dashboard = () => {
  const { auctions } = useContext(AuctionContext);  // Get auctions from context
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Filter auctions based on search term and price range
  const filteredAuctions = auctions.filter((auction) => {
    const matchesSearchTerm =
      auction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      auction.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPriceRange =
      (minPrice === '' || auction.startingBid >= minPrice) &&
      (maxPrice === '' || auction.startingBid <= maxPrice);

    return matchesSearchTerm && matchesPriceRange;
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);  // Update search term state
  };

  const handleMinPriceChange = (e) => {
    setMinPrice(e.target.value);  // Update min price state
  };

  const handleMaxPriceChange = (e) => {
    setMaxPrice(e.target.value);  // Update max price state
  };

  // Ensure minPrice is not greater than maxPrice
  const handleSubmitFilters = (e) => {
    e.preventDefault();
    if (minPrice && maxPrice && parseFloat(minPrice) > parseFloat(maxPrice)) {
      alert('Minimum price cannot be greater than maximum price.');
    }
  };

  return (
    <div className="dashboard">
      <h1>Your Dashboard</h1>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search Auctions by Title or Description"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {/* Price Range Filters */}
      <form className="price-filter" onSubmit={handleSubmitFilters}>
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={handleMinPriceChange}
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={handleMaxPriceChange}
        />
        <button type="submit">Apply Filters</button>
      </form>

      {/* Section for creating a new auction */}
      <section className="create-auction">
        <h2>Create a New Auction</h2>
        <AddAuction />  {/* Reuse AddAuction component here */}
      </section>

      {/* Section to display a list of auctions */}
      <section className="your-auctions">
        <h2>Your Auctions</h2>
        {filteredAuctions.length === 0 ? (
  <p>No auctions match your search criteria.</p>
) : (
  <AuctionList auctions={filteredAuctions} />
)}

      </section>
    </div>
  );
};

export default Dashboard;
