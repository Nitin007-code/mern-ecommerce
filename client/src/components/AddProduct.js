import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddProduct() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
  });
  const [imageFile, setImageFile] = useState(null); // holds the selected file object
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]); // grabs the first (only) selected file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError('');

    const token = localStorage.getItem('token');

    try {
      // Step 1: upload the image file first, get back a hosted URL
      const imageData = new FormData(); // special object needed for file uploads
      imageData.append('image', imageFile);

      const uploadResponse = await axios.post('http://localhost:5000/api/upload', imageData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      // Step 2: create the product using the returned image URL
      await axios.post(
        'http://localhost:5000/api/products',
        {
          ...formData,
          price: Number(formData.price),
          stock: Number(formData.stock),
          image: uploadResponse.data.imageUrl,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add product');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="auth-page" style={{ maxWidth: '450px' }}>
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Product name" value={formData.name} onChange={handleChange} required />
        <input name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
        <input name="price" type="number" placeholder="Price" value={formData.price} onChange={handleChange} required />
        <input name="category" placeholder="Category" value={formData.category} onChange={handleChange} required />
        <input name="stock" type="number" placeholder="Stock quantity" value={formData.stock} onChange={handleChange} required />
        <input type="file" accept="image/*" onChange={handleFileChange} required />
        {error && <p className="auth-error">{error}</p>}
        <button type="submit" className="add-to-cart-btn" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
}

export default AddProduct;