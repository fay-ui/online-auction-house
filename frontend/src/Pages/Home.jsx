import React, { useContext, useEffect, useState } from 'react';
import { AuctionContext } from '../context/AuctionContext';
import { UserContext } from '../context/UserContext';
import { Link } from 'react-router-dom';
import { CircleLoader } from 'react-spinners'; // Optional: For a loading spinner

export default function Home() {
  const { auctions, fetchAuctionItems, deleteAuction } = useContext(AuctionContext);
  const { current_user } = useContext(UserContext);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadItems = async () => {
      try {
        setLoading(true);
        fetchAuctionItems(); // Fetch auction items from the context
        setLoading(false);
      } catch (err) {
        setError(`Failed to load auction items: ${err.message || 'Unknown error'}`);
        setLoading(false);
      }
    };

    loadItems();
  }, [fetchAuctionItems]); // We only want to call this once when the component mounts

  // Ensure auctions is an array to prevent issues with .length
  const items = Array.isArray(auctions) ? auctions : [];

  if (loading) {
    return (
      <div className="text-center mt-6">
        <CircleLoader color="#0000ff" loading={loading} size={50} />
        <p>Loading auction items...</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="my-3 text-xl font-bold">
        Your Auction Items - {items.length}
      </h1>

      {error && (
        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">
          {error}
        </div>
      )}

      {current_user ? (
        <div>
          {items.length === 0 ? (
            <div>
              <p>You currently don't have any auction items.</p>
              <Link to="/addauction" className="text-blue-600 font-semibold underline hover:text-blue-800">
                Start your first auction now!
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="auction-item border border-blue-700 p-4 rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <button
                      onClick={() => deleteAuction(item.id)} // Handle delete
                      className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-400"
                      aria-label="Delete Auction Item"
                    >
                      Delete
                    </button>
                    <p className="text-right text-xs">
                      {new Date(item.deadline).toLocaleDateString()}
                    </p>
                  </div>

                  <Link to={`/auction/${item.id}`} className="font-semibold text-lg block">
                    {item.title}
                  </Link>

                  <div className="flex justify-between items-center mt-3">
                    <p className="px-2 py-1 bg-blue-600 text-white rounded">{item.category}</p>
                    <p
                      className={`px-2 py-1 text-white rounded ${
                        item.is_complete ? 'bg-green-700' : 'bg-yellow-400'
                      }`}
                    >
                      {item.is_complete ? 'Completed' : 'Not Completed'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center mt-6">
          <div
            className="p-4 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-50"
            role="alert"
          >
            <Link to="/login" className="font-medium text-blue-600">
              Login
            </Link>{' '}
            to access your auction items.
          </div>
        </div>
      )}
    </div>
  );
}
