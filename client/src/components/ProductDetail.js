import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Heart, ShoppingBag, Star, Truck, ShieldCheck, RotateCcw, Minus, Plus, ArrowLeft } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [related, setRelated] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [saved, setSaved] = useState(false);
  const [notice, setNotice] = useState("");
  const [review, setReview] = useState({ rating: 5, comment: "" });

  // Product, review, and related-product requests use the existing server contract.
  useEffect(() => {
    const loadProductPage = async () => {
      try {
        const [productResponse, reviewsResponse, relatedResponse] = await Promise.all([
          axios.get(`http://localhost:5000/api/products/${id}`), axios.get(`http://localhost:5000/api/reviews/${id}`), axios.get(`http://localhost:5000/api/products/${id}/related`),
        ]);
        setProduct(productResponse.data); setReviews(reviewsResponse.data || []); setRelated(relatedResponse.data || []);
        const token = localStorage.getItem("token");
        if (token) { const { data } = await axios.get("http://localhost:5000/api/wishlist", { headers: { Authorization: `Bearer ${token}` } }); setSaved((data.products || []).some((item) => item._id === id)); }
      } catch (error) { console.error("Could not load product page:", error); }
    };
    loadProductPage();
  }, [id]);

  const showNotice = (text) => { setNotice(text); window.setTimeout(() => setNotice(""), 2200); };
  // Cart context continues to own local state and backend cart synchronisation.
  const addSelectedToCart = () => { if (!product) return; addToCart({ ...product, quantity }); showNotice("Added to your cart"); };
  const toggleWishlist = async () => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }
    try { if (saved) await axios.delete(`http://localhost:5000/api/wishlist/${id}`, { headers: { Authorization: `Bearer ${token}` } }); else await axios.post(`http://localhost:5000/api/wishlist/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } }); setSaved((value) => !value); }
    catch (error) { console.error("Could not update wishlist:", error); }
  };
  const submitReview = async (event) => {
    event.preventDefault(); const token = localStorage.getItem("token"); if (!token) { navigate("/login"); return; }
    try { await axios.post(`http://localhost:5000/api/reviews/${id}`, { ...review, userName: user?.name }, { headers: { Authorization: `Bearer ${token}` } }); const { data } = await axios.get(`http://localhost:5000/api/reviews/${id}`); setReviews(data || []); setReview({ rating: 5, comment: "" }); showNotice("Thanks for your review"); }
    catch (error) { console.error("Could not submit review:", error); }
  };
  if (!product) return <main className="detail-page"><p className="page-loading">Loading product details…</p></main>;
  const average = reviews.length ? (reviews.reduce((total, item) => total + item.rating, 0) / reviews.length).toFixed(1) : "New";
  return <main className="detail-page"><Link to="/" className="back-link"><ArrowLeft size={16} /> Back to shop</Link><section className="detail-layout">
    <div className="detail-image"><img src={product.image} onError={(e) => { e.currentTarget.src = "https://placehold.co/600x600?text=Product"; }} alt={product.name} /></div>
    <div className="detail-info"><p className="product-category">{product.category || "ShopMax collection"}</p><h1>{product.name}</h1><div className="detail-rating"><Star size={17} fill="currentColor" /> <strong>{average}</strong><span>{reviews.length ? `${reviews.length} reviews` : "Be the first to review"}</span></div><div className="detail-price"><strong>₹{Number(product.price).toLocaleString("en-IN")}</strong><span>₹{Math.floor(product.price * 1.2).toLocaleString("en-IN")}</span><em>20% off</em></div><p className="detail-description">{product.description}</p><p className={`stock-status ${product.stock > 0 ? "in-stock" : "out-stock"}`}>{product.stock > 0 ? `${product.stock} available in stock` : "Currently out of stock"}</p>
      <div className="quantity-picker"><span>Quantity</span><div><button onClick={() => setQuantity((value) => Math.max(1, value - 1))}><Minus size={16} /></button><b>{quantity}</b><button onClick={() => setQuantity((value) => Math.min(product.stock || 1, value + 1))}><Plus size={16} /></button></div></div>
      <div className="detail-actions"><button disabled={!product.stock} className="primary-btn" onClick={addSelectedToCart}><ShoppingBag size={18} /> Add to cart</button><button disabled={!product.stock} className="buy-now" onClick={() => { addSelectedToCart(); navigate("/cart"); }}>Buy now</button><button className={`save-product ${saved ? "saved" : ""}`} onClick={toggleWishlist}><Heart size={18} fill={saved ? "currentColor" : "none"} /> {saved ? "Saved" : "Save for later"}</button></div>
      <div className="detail-perks"><span><Truck size={18} /> Free delivery over ₹499</span><span><RotateCcw size={18} /> 7-day returns</span><span><ShieldCheck size={18} /> Secure checkout</span></div>
    </div>
  </section><section className="detail-lower"><div className="review-column"><h2>Customer reviews</h2>{user && <form className="review-form" onSubmit={submitReview}><select value={review.rating} onChange={(event) => setReview({ ...review, rating: Number(event.target.value) })}>{[5,4,3,2,1].map((number) => <option key={number} value={number}>{number} star{number > 1 ? "s" : ""}</option>)}</select><textarea required value={review.comment} onChange={(event) => setReview({ ...review, comment: event.target.value })} placeholder="Share your experience" /><button className="primary-btn">Post review</button></form>}{reviews.length ? reviews.map((item) => <article className="review-item" key={item._id}><div><strong>{item.userName}</strong><span><Star size={14} fill="currentColor" /> {item.rating}/5</span></div><p>{item.comment}</p></article>) : <p className="muted-copy">No reviews yet. {user ? "Be the first to share your experience." : "Sign in to leave the first one."}</p>}</div><aside className="related-column"><h2>You may also like</h2>{related.slice(0, 3).map((item) => <Link to={`/product/${item._id}`} key={item._id} className="related-product"><img src={item.image} alt={item.name} /><div><strong>{item.name}</strong><span>₹{item.price}</span></div></Link>)}</aside></section>{notice && <div className="toast" role="status">{notice}</div>}</main>;
}

export default ProductDetail;
