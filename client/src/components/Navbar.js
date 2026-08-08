import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingBag, Heart, User, LogOut, LayoutDashboard, PlusCircle, Store, Search, Menu, X } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { cartItems } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const closeMenu = () => setMenuOpen(false);
  const scrollTo = (id) => { closeMenu(); if (window.location.pathname !== "/") { navigate(`/#${id}`); return; } document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };
  const scrollToTop = () => {
    closeMenu();
    if (window.location.pathname !== "/") {
      navigate("/");
      return;
    }
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };
  const scrollToProducts = () => {
    closeMenu();
    navigate("/");
    requestAnimationFrame(() => {
      document.getElementById("products")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };
  const submitSearch = (event) => {
    event.preventDefault();
    const trimmedSearch = search.trim();
    if (!trimmedSearch) return;

    navigate(`/?search=${encodeURIComponent(trimmedSearch)}`);
    closeMenu();
    setSearch("");
    scrollToProducts();
  };
  const handleLogout = () => { logout(); navigate("/"); closeMenu(); };

  return <header className="site-header">
    <nav className="navbar" aria-label="Main navigation">
      <Link to="/" className="logo" onClick={closeMenu}><Store size={23} /><span>Shop<span>Max</span></span></Link>
      {/* Search changes the product listing query; it does not alter backend APIs. */}
      <form className="nav-search" onSubmit={submitSearch}><Search size={17} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products" aria-label="Search products" /><button type="submit" aria-label="Submit search">Search</button></form>
      <button className="mobile-menu-btn" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle navigation" aria-expanded={menuOpen}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
      <div className={`nav-content ${menuOpen ? "active" : ""}`}>
        <div className="nav-links"><button onClick={scrollToTop}>Home</button><button onClick={() => scrollTo("categories")}>Categories</button><button onClick={() => scrollTo("deals")}>Deals</button><button onClick={scrollToProducts}>Shop</button></div>
        <div className="nav-right">
          {user ? <><Link to="/wishlist" className="nav-icon" aria-label="Wishlist" onClick={closeMenu}><Heart size={19} /></Link>{user.role === "admin" && <><Link to="/admin/add-product" className="nav-icon" aria-label="Add product" onClick={closeMenu}><PlusCircle size={19} /></Link><Link to="/admin/dashboard" className="nav-icon" aria-label="Admin dashboard" onClick={closeMenu}><LayoutDashboard size={19} /></Link></>}<span className="user-avatar" title={user.name}>{user.name?.charAt(0).toUpperCase()}</span><button className="nav-icon" onClick={handleLogout} aria-label="Log out"><LogOut size={19} /></button></> : <Link to="/login" className="login-btn" onClick={closeMenu}><User size={17} /> Sign in</Link>}
          <Link to="/cart" className="cart-btn" onClick={closeMenu}><ShoppingBag size={19} /><span>Cart</span>{itemCount > 0 && <b className="cart-count">{itemCount}</b>}</Link>
        </div>
      </div>
    </nav>
  </header>;
}

export default Navbar;
