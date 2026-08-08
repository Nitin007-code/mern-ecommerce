import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Heart,
  ShoppingCart,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
} from "lucide-react";

import { useCart } from "../context/CartContext";

function Wishlist() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  const { addToCart } = useCart();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:5000/api/wishlist",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProducts(response.data.products || []);
      } catch (error) {
        console.error("Wishlist error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [token]);

  const removeFromWishlist = async (productId) => {
    try {
      setRemovingId(productId);

      await axios.delete(
        `http://localhost:5000/api/wishlist/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProducts((current) =>
        current.filter((product) => product._id !== productId)
      );
    } catch (error) {
      console.error("Remove wishlist error:", error);
    } finally {
      setRemovingId(null);
    }
  };

 const handleAddToCart = (product) => {
  addToCart({
    ...product,
    quantity: 1,
  });
};

 const handleMoveAllToCart = () => {
  products.forEach((product) => {
    addToCart({
      ...product,
      quantity: 1,
    });
  });
};

  

  /* ============================
     Not Logged In
  ============================ */

  if (!token) {
    return (
      <div className="wishlist-page">
        <motion.div
          className="wishlist-empty-card"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="wishlist-empty-icon">
            <Heart size={42} />
          </div>

          <h1>Save your favourites</h1>

          <p>
            Login to create your wishlist and keep your
            favourite products in one place.
          </p>

          <Link to="/login" className="wishlist-primary-btn">
            Login to continue
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    );
  }

  /* ============================
     Loading
  ============================ */

  if (loading) {
    return (
      <div className="wishlist-page">
        <div className="wishlist-loading">
          {[1, 2, 3].map((item) => (
            <div className="wishlist-skeleton" key={item}>
              <div className="wishlist-skeleton-image"></div>

              <div className="wishlist-skeleton-content">
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ============================
     Empty Wishlist
  ============================ */

  if (products.length === 0) {
    return (
      <div className="wishlist-page">

        <div className="wishlist-empty-card">

          <div className="wishlist-empty-icon">
            <Heart size={42} />
          </div>

          <span className="wishlist-eyebrow">
            Your collection
          </span>

          <h1>Your wishlist is empty</h1>

          <p>
            Save products you love and come back to them
            whenever you're ready.
          </p>

          <Link
            to="/"
            className="wishlist-primary-btn"
          >
            Explore Products
            <ArrowRight size={18} />
          </Link>

        </div>

      </div>
    );
  }

  return (
    <div className="wishlist-page">

      {/* ============================
          Header
      ============================ */}

      <motion.div
        className="wishlist-header"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
      >

        <div className="wishlist-heading">

          <div className="wishlist-title-icon">
            <Heart size={30} fill="currentColor" />
          </div>

          <div>
            <span className="wishlist-eyebrow">
              Your collection
            </span>

            <h1>
              My Wishlist

              <span className="wishlist-count">
                {products.length}
              </span>
            </h1>

            <p>
              Items you love, saved for later.
            </p>
          </div>

        </div>

        <div className="wishlist-header-actions">

          <Link
            to="/"
            className="wishlist-secondary-btn"
          >
            Continue Shopping
          </Link>

          <button
            className="wishlist-primary-btn"
            onClick={handleMoveAllToCart}
          >
            <ShoppingCart size={18} />
            Move All to Cart
          </button>

        </div>

      </motion.div>

      {/* ============================
          Wishlist Stats
      ============================ */}

      <div className="wishlist-stats">

        <div className="wishlist-stat-card">

          <div className="wishlist-stat-icon">
            <Heart size={20} />
          </div>

          <div>
            <strong>{products.length}</strong>
            <span>Saved Items</span>
          </div>

        </div>

        <div className="wishlist-stat-card">

          <div className="wishlist-stat-icon green">
            <ShoppingCart size={20} />
          </div>

          <div>
            <strong>
              ₹
              {products
                .reduce(
                  (sum, product) =>
                    sum + Number(product.price || 0),
                  0
                )
                .toLocaleString("en-IN")}
            </strong>

            <span>Collection Value</span>
          </div>

        </div>

        <div className="wishlist-stat-card">

          <div className="wishlist-stat-icon orange">
            <Sparkles size={20} />
          </div>

          <div>
            <strong>Ready</strong>
            <span>For your next purchase</span>
          </div>

        </div>

      </div>

      {/* ============================
          Product List
      ============================ */}

      <div className="wishlist-content">

        <div className="wishlist-list-header">

          <div>
            <h2>Saved Products</h2>
            <p>
              {products.length}{" "}
              {products.length === 1
                ? "product"
                : "products"}{" "}
              in your collection
            </p>
          </div>

          <span className="wishlist-sort">
            Recently Added
          </span>

        </div>

        <div className="wishlist-products">

          {products.map((product, index) => (

            <motion.div
              className="wishlist-product-card"
              key={product._id}
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: index * 0.08,
              }}
            >

              {/* Product Image */}

              <Link
                to={`/product/${product._id}`}
                className="wishlist-product-image"
              >

                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                />

                <span className="wishlist-saved-badge">
                  <Heart
                    size={14}
                    fill="currentColor"
                  />
                  Saved
                </span>

              </Link>

              {/* Product Info */}

              <div className="wishlist-product-info">

                <span className="wishlist-product-category">
                  {product.category || "Premium Collection"}
                </span>

                <Link
                  to={`/product/${product._id}`}
                  className="wishlist-product-name"
                >
                  {product.name}
                </Link>

                <p className="wishlist-product-description">
                  Premium quality product selected
                  for your collection.
                </p>

                <div className="wishlist-price-row">

                  <strong>
                    ₹{Number(product.price).toLocaleString("en-IN")}
                  </strong>

                  <span>
                    ₹
                    {Math.floor(
                      Number(product.price) * 1.25
                    ).toLocaleString("en-IN")}
                  </span>

                  <small>20% OFF</small>

                </div>

                <div className="wishlist-stock">
                  <span></span>
                  In stock
                </div>

              </div>

              {/* Actions */}

              <div className="wishlist-product-actions">

                <button
                  className="wishlist-cart-btn"
                  onClick={() =>
                    handleAddToCart(product)
                  }
                >
                  <ShoppingCart size={17} />
                  Add to Cart
                </button>

                <Link
                  to={`/product/${product._id}`}
                  className="wishlist-view-btn"
                >
                  View
                </Link>

                <button
                  className="wishlist-delete-btn"
                  disabled={
                    removingId === product._id
                  }
                  onClick={() =>
                    removeFromWishlist(product._id)
                  }
                  title="Remove from wishlist"
                >
                  <Trash2 size={18} />
                </button>

              </div>

            </motion.div>

          ))}

        </div>

      </div>

      {/* ============================
          Benefits
      ============================ */}

      <div className="wishlist-benefits">

        <div>
          <ShieldCheck size={25} />
          <div>
            <strong>Secure Shopping</strong>
            <span>100% protected checkout</span>
          </div>
        </div>

        <div>
          <Truck size={25} />
          <div>
            <strong>Fast Delivery</strong>
            <span>Quick delivery across India</span>
          </div>
        </div>

        <div>
          <RotateCcw size={25} />
          <div>
            <strong>Easy Returns</strong>
            <span>Hassle-free returns</span>
          </div>
        </div>

      </div>

    </div>
  );
}

export default Wishlist;