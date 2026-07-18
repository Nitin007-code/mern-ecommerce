import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [inWishlist, setInWishlist] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const { addToCart } = useCart();
  const { user } = useAuth();

  // Fetches product, reviews, wishlist status, and related products whenever id changes
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

    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/reviews/${id}`);
        setReviews(response.data);
      } catch (err) {
        console.error('Error fetching reviews:', err);
      }
    };

    const checkWishlist = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const response = await axios.get('http://localhost:5000/api/wishlist', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const productIds = (response.data.products || []).map((p) => p._id);
        setInWishlist(productIds.includes(id));
      } catch (err) {
        console.error('Error checking wishlist:', err);
      }
    };

    const fetchRelated = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}/related`);
        setRelatedProducts(response.data);
      } catch (err) {
        console.error('Error fetching related products:', err);
      }
    };

    fetchProduct();
    fetchReviews();
    checkWishlist();
    fetchRelated();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleWishlistToggle = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      if (inWishlist) {
        await axios.delete(`http://localhost:5000/api/wishlist/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(
          `http://localhost:5000/api/wishlist/${id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setInWishlist(!inWishlist);
    } catch (err) {
      console.error('Error updating wishlist:', err);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post(
        `http://localhost:5000/api/reviews/${id}`,
        { rating, comment, userName: user.name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComment('');
      setRating(5);

      const response = await axios.get(`http://localhost:5000/api/reviews/${id}`);
      setReviews(response.data);
    } catch (err) {
      console.error('Error submitting review:', err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found.</p>;

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="detail-page">
      <img src={product.image} alt={product.name} />
      <h2>{product.name}</h2>
      {avgRating && (
        <p className="rating-summary">★ {avgRating} ({reviews.length} review{reviews.length !== 1 ? 's' : ''})</p>
      )}
      <p>{product.description}</p>
      <span className="price-tag">₹{product.price}</span>
      <p><span className="stock-badge">{product.stock} in stock</span></p>

      <div>
        <button className="add-to-cart-btn" onClick={handleAddToCart}>Add to Cart</button>
        {user && (
          <button className="wishlist-btn" onClick={handleWishlistToggle}>
            {inWishlist ? '♥ Saved' : '♡ Save for later'}
          </button>
        )}
      </div>

      {showToast && <div className="toast">✓ {product.name} added to cart</div>}

      <div className="reviews-section">
        <h3>Reviews</h3>

        {user && (
          <form onSubmit={handleReviewSubmit} className="review-form">
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>{n} Star{n !== 1 ? 's' : ''}</option>
              ))}
            </select>
            <textarea
              placeholder="Write your review..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
            <button type="submit" className="add-to-cart-btn">Submit Review</button>
          </form>
        )}

        {reviews.length === 0 ? (
          <p>No reviews yet. Be the first!</p>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="review-item">
              <p><strong>{review.userName}</strong> — ★ {review.rating}</p>
              <p>{review.comment}</p>
            </div>
          ))
        )}
      </div>

      {relatedProducts.length > 0 && (
        <div className="related-section">
          <h3>You may also like</h3>
          <div className="product-grid">
            {relatedProducts.map((p) => (
              <Link key={p._id} to={`/product/${p._id}`} className="product-card">
                <img src={p.image} alt={p.name} />
                <div className="product-card-body">
                  <h3>{p.name}</h3>
                  <span className="price-tag">₹{p.price}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;