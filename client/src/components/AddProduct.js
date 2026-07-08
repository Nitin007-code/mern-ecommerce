import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddProduct() {
  // One state object for the whole form, instead of separate useState per field
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
    stock: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Generic handler — updates the correct field based on input's "name" attribute
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/products', {
        ...formData,
        price: Number(formData.price), // convert string input to number
        stock: Number(formData.stock),
      });
      navigate('/'); // back to homepage to see the new product
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add product');
    }
  };

  return (
    <div className="auth-page" style={{ maxWidth: '450px' }}>
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Product name" value={formData.name} onChange={handleChange} required />
        <input name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
        <input name="price" type="number" placeholder="Price" value={formData.price} onChange={handleChange} required />
        <input name="image" placeholder="Image URL" value={formData.image} onChange={handleChange} required />
        <input name="category" placeholder="Category" value={formData.category} onChange={handleChange} required />
        <input name="stock" type="number" placeholder="Stock quantity" value={formData.stock} onChange={handleChange} required />
        {error && <p className="auth-error">{error}</p>}
        <button type="submit" className="add-to-cart-btn">Add Product</button>
      </form>
    </div>
  );
}

export default AddProduct;