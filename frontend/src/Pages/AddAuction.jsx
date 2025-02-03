import React, { useState } from 'react';
import axios from 'axios';

const AddAuction = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !description || !price || price <= 0) {
      setError('Please fill all fields correctly.');
      return;
    }

    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    if (image) formData.append('image', image);

    axios.post('your-api-url', formData)
      .then(response => {
        setLoading(false);
        setSuccess('Auction item added successfully!');
        setTitle('');
        setDescription('');
        setPrice('');
        setImage(null);
      })
      .catch(() => {
        setLoading(false);
        setError('Error adding item, please try again.');
      });
  };

  return (
    <form onSubmit={handleSubmit} className="auction-form">
      {success && <p>{success}</p>}
      {error && <p>{error}</p>}
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <input
        type="file"
        onChange={handleFileChange}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Auction'}
      </button>
    </form>
  );
};

export default AddAuction;
