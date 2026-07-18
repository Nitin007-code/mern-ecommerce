import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Wishlist() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:5000/api/wishlist', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(response.data.products || []);
      } catch (err) {
        console.error('Error fetching wishlist:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  if (loading) return <p>Loading wishlist...</p>;
  if (products.length === 0) return <div className="detail-page"><h2>Your wishlist is empty</h2></div>;

  return (
    <div className="product-grid">
      {products.map((product) => (
        <Link key={product._id} to={`/product/${product._id}`} className="product-card">
          <img src={product.image} alt={product.name} />
          <div className="product-card-body">
            <h3>{product.name}</h3>
            <span className="price-tag">₹{product.price}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default Wishlist;
