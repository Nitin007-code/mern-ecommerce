import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Heart,
  ShoppingCart,
  Star,
  ArrowRight,
  Sparkles
} from "lucide-react";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Re-fetch whenever search, category, or page changes
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/products', {
          params: { search, category, page, limit: 8 },
        });
        setProducts(response.data.products);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    // Debounce: wait 400ms after the user stops typing before firing the request
    const timer = setTimeout(fetchProducts, 400);
    return () => clearTimeout(timer);
  }, [search, category, page]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPage(1);
  };

 return (
  <div id="products" className="product-section">
    {/* ===== Product Section Heading ===== */}
<div className="section-header">

  <span className="section-tag">
    🔥 Trending Collection
  </span>

  <h2>
    Explore Our Premium Products
  </h2>

  <p>
    Carefully selected products with premium quality, secure checkout,
    and fast delivery.
  </p>

</div>
{/* ================= CATEGORY SECTION ================= */}

<div className="category-section">

  <div className="section-header">

    <h2>Shop by Category</h2>

    <button className="view-all-btn">
      View All
    </button>

  </div>

  <div className="category-grid">

    <div className="category-card">
      💻
      <span>Electronics</span>
    </div>

    <div className="category-card">
      👕
      <span>Fashion</span>
    </div>

    <div className="category-card">
      👟
      <span>Footwear</span>
    </div>

    <div className="category-card">
      ⌚
      <span>Watches</span>
    </div>

    <div className="category-card">
      🏠
      <span>Home</span>
    </div>

    <div className="category-card">
      🎧
      <span>Accessories</span>
    </div>

  </div>

</div>
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={handleSearchChange}
        />
        <select value={category} onChange={handleCategoryChange}>
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Footwear">Footwear</option>
        </select>
      </div>
      {loading ? (

  <div className="product-grid">

    {[...Array(8)].map((_, i) => (

      <div key={i} className="skeleton-card"></div>

    ))}

  </div>

) : (

  <>


    {/* Premium Product Grid */}

    <div className="product-grid">

      {products.map((product) => (

        <motion.div
          key={product._id}
          whileHover={{
            y: -10,
            scale: 1.03,
          }}
          transition={{
            duration: 0.3,
          }}
        >
          <Link
            to={`/product/${product._id}`}
            className="product-card"
          >

            {/* Discount Badge */}

            <div className="discount-badge">

              -20%

            </div>

            {/* Wishlist */}

            <button
              className="wishlist-icon"
              onClick={(e) => e.preventDefault()}
            >

              <Heart size={18} />

            </button>

            {/* Product Image */}

            <div className="product-image-wrapper">

              <img
                src={product.image}
                alt={product.name}
              />

            </div>

            {/* Product Info */}

            <div className="product-card-body">

              <p className="product-category">

                <Sparkles size={14} />

                Premium Collection

              </p>

              <h3>

                {product.name}

              </h3>

              {/* Rating */}

              <div className="rating">

                {[...Array(5)].map((_, index) => (

                  <Star
                    key={index}
                    fill="#f59e0b"
                    strokeWidth={0}
                    size={16}
                  />

                ))}

                <span>(4.9)</span>

              </div>

              {/* Price */}

              <div className="price-row">

                <span className="price-tag">

                  ₹{product.price}

                </span>

                <span className="old-price">

                  ₹{Math.floor(product.price * 1.25)}

                </span>

              </div>

              {/* CTA */}

              <button
                className="add-cart-btn"
                onClick={(e) => e.preventDefault()}
              >

                <ShoppingCart size={18} />

                View Product

                <ArrowRight size={18} />

              </button>

            </div>

          </Link>

        </motion.div>

      ))}

    </div>

    {products.length === 0 && (

      <p style={{ textAlign: "center" }}>

        No products found.

      </p>

    )}

    <div className="pagination">

      <button
        disabled={page === 1}
        onClick={() => setPage((p) => p - 1)}
      >
        Prev
      </button>

      <span>

        Page {page} of {totalPages || 1}

      </span>

      <button
        disabled={page === totalPages}
        onClick={() => setPage((p) => p + 1)}
      >
        Next
      </button>

    </div>

  </>
    )}
  </div>
);
}

export default ProductList;