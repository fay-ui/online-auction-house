import React, { useState, useContext } from 'react';
import { AuctionContext } from '../context/AuctionContext';

const AddAuction = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startingPrice, setStartingPrice] = useState('');
  const [image, setImage] = useState(null);
  const { addAuction } = useContext(AuctionContext);

  // Validation for starting price
  const isValidNumber = (value) => {
    return !isNaN(value) && value > 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate inputs
    if (!title || !description || !startingPrice || !isValidNumber(startingPrice)) {
      alert('Please fill in all fields with valid data');
      return;
    }

    // Prepare auction data to be sent
    const auctionData = {
      title,
      description,
      startingPrice: parseFloat(startingPrice), // Ensure it is a number
    };

    // Pass auction data and image to the addAuction function
    addAuction(auctionData, image);

    // Clear the form after submission
    setTitle('');
    setDescription('');
    setStartingPrice('');
    setImage(null);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div>
        <input
          type="number"
          placeholder="Starting Price"
          value={startingPrice}
          onChange={(e) => setStartingPrice(e.target.value)}
          required
        />
      </div>
      <div>
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
        />
      </div>
      <div>
        <button type="submit">Add Auction</button>
      </div>
    </form>
  );
};

export default AddAuction;
