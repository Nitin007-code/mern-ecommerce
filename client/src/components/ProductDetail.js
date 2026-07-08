import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false); // controls toast visibility
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Handles both adding to cart AND showing the confirmation toast
  const handleAddToCart = () => {
    addToCart(product);
    setShowToast(true);
    // Automatically hide the toast after 2 seconds
    setTimeout(() => setShowToast(false), 2000);
  };

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div className="detail-page">
      <img src={product.image} alt={product.name} />
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <span className="price-tag">₹{product.price}</span>
      <p>
        <span className="stock-badge">{product.stock} in stock</span>
      </p>
      <button className="add-to-cart-btn" onClick={handleAddToCart}>
        Add to Cart
      </button>

      {/* Toast only renders when showToast is true */}
      {showToast && (
        <div className="toast">
          ✓ {product.name} added to cart
        </div>
      )}
    </div>
  );
}

export default ProductDetail;