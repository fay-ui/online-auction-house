import React, { useContext, useState, useEffect } from 'react';
import { AuctionContext } from '../context/AuctionContext';
import { Link } from 'react-router-dom';

const AuctionList = () => {
  const { auctions, deleteAuction } = useContext(AuctionContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!auctions) {
      setLoading(true);
      setError('No auction data available.');
    } else {
      setLoading(false);
    }
  }, [auctions]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this auction item?")) {
      deleteAuction(id); // Delete auction item
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="auction-list-container">
      {error && <p className="error">{error}</p>}
      {auctions.length === 0 ? (
        <p>No auction items available</p>
      ) : (
        <div>
          <ul>
            {auctions.map((item) => (
              <li key={item.id} className="auction-item">
                <Link to={`/auction/${item.id}`} className="auction-link">
                  <h3>{item.title}</h3>
                  <p>Price: ${item.price}</p>
                </Link>
                <button onClick={() => handleDelete(item.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AuctionList;
