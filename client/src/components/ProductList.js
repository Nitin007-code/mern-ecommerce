import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Star, ArrowRight, Sparkles, Search, SlidersHorizontal } from "lucide-react";
import SkeletonLoader from "./SkeletonLoader";
import { useCart } from "../context/CartContext";

function ProductList() {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const params = new URLSearchParams(location.search);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(params.get("search") || "");
  const [category, setCategory] = useState(params.get("category") || "");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // The product API and its query params remain unchanged; this is only a cleaner display layer.
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try { const { data } = await axios.get("http://localhost:5000/api/products", { params: { search, category, page, limit: 8 } }); setProducts(data.products || []); setTotalPages(data.totalPages || 1); }
      catch (error) { console.error("Error fetching products:", error); setProducts([]); }
      finally { setLoading(false); }
    };
    const timer = setTimeout(loadProducts, 250);
    return () => clearTimeout(timer);
  }, [search, category, page]);
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const nextSearch = query.get("search") || "";
    const nextCategory = query.get("category") || "";

    setSearch(nextSearch);
    setCategory(nextCategory);
    setPage(1);

    if (nextSearch || nextCategory) {
      requestAnimationFrame(() => {
        document.getElementById("products")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, [location.search]);
  const updateUrlQuery = (nextSearch, nextCategory) => {
    const query = new URLSearchParams();
    if (nextSearch.trim()) query.set("search", nextSearch.trim());
    if (nextCategory) query.set("category", nextCategory);
    navigate({ pathname: "/", search: query.toString() ? `?${query.toString()}` : "" });
  };

  const changeSearch = (value) => {
    const nextSearch = value;
    setSearch(nextSearch);
    setCategory("");
    setPage(1);
    updateUrlQuery(nextSearch, "");
  };
  const changeCategory = (value) => {
    const nextCategory = value;
    setCategory(nextCategory);
    setSearch("");
    setPage(1);
    updateUrlQuery("", nextCategory);
  };
  const addProduct = (event, product) => { event.preventDefault(); event.stopPropagation(); addToCart(product); };

  return <section id="products" className="product-section"><div className="section-header"><span className="section-tag"><Sparkles size={15} /> Curated for you</span><h2>Explore the latest</h2><p>Useful, beautifully made products for every part of your day.</p></div>
    <div className="filter-bar" aria-label="Product filters"><label className="filter-search"><Search size={18} /><input value={search} onChange={(e) => changeSearch(e.target.value)} placeholder="Search the collection" /></label><label className="filter-select"><SlidersHorizontal size={17} /><select value={category} onChange={(e) => changeCategory(e.target.value)} aria-label="Filter products by category"><option value="">All categories</option><option value="Electronics">Electronics</option><option value="Clothing">Fashion</option><option value="Footwear">Footwear</option><option value="Accessories">Accessories</option><option value="Home & Living">Home & Living</option><option value="Gaming">Gaming</option></select></label></div>
    {loading ? <SkeletonLoader count={8} /> : <><div className="product-grid">{products.map((product, index) => <motion.article key={product._id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .04 }} className="product-card"><Link to={`/product/${product._id}`}><div className="product-image-wrapper"><span className="product-sale">New</span><img src={product.image} alt={product.name} loading="lazy" onError={(e) => { e.currentTarget.src = "https://placehold.co/400x400?text=Product"; }} /></div><div className="product-card-body"><p className="product-category">{product.category || "ShopMax pick"}</p><h3 className="product-title">{product.name}</h3><div className="rating"><span><Star size={14} fill="currentColor" /> 4.8</span><small>Popular pick</small></div><div className="price-row"><strong>₹{Number(product.price).toLocaleString("en-IN")}</strong><span>₹{Math.floor(product.price * 1.2).toLocaleString("en-IN")}</span></div></div></Link><div className="product-actions"><button className="wishlist-icon" aria-label={`Save ${product.name}`} title="Sign in to save products"><Heart size={18} /></button><button className="add-cart-btn" onClick={(event) => addProduct(event, product)}><ShoppingBag size={17} /> Add to cart <ArrowRight size={16} /></button></div></motion.article>)}</div>{!products.length && <div className="no-results"><Search size={26} /><h3>No matches found</h3><p>Try another search or choose a different category.</p></div>}<div className="pagination"><button disabled={page === 1} onClick={() => setPage((value) => value - 1)}>Previous</button><span>Page {page} of {totalPages}</span><button disabled={page === totalPages} onClick={() => setPage((value) => value + 1)}>Next</button></div></>}</section>;
}

export default ProductList;
