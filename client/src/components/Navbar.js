import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  User,
  LogOut,
  LayoutDashboard,
  PlusCircle,
  Store,
  Search,
} from "lucide-react";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { cartItems } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const itemCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">

      {/* Logo */}

      <Link to="/" className="logo">

        <Store size={28} />

        <span>ShopMax</span>

      </Link>

      {/* Center Links */}

      <div className="nav-links">

        <Link to="/">Home</Link>

        <a href="#products">Products</a>

        <a href="/">Deals</a>

        <a href="/">About</a>

      </div>

      {/* Right Section */}

      <div className="nav-right">

        <div className="search-box">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search..."
          />

        </div>

        {user ? (
          <>

            <span className="welcome-text">

              Hi, {user.name}

            </span>

            {user.role === "admin" && (
              <>
                <Link
                  to="/admin/add-product"
                  className="icon-btn"
                  title="Add Product"
                >
                  <PlusCircle size={20} />
                </Link>

                <Link
                  to="/admin/dashboard"
                  className="icon-btn"
                  title="Dashboard"
                >
                  <LayoutDashboard size={20} />
                </Link>
              </>
            )}

            <Link
              to="/wishlist"
              className="icon-btn"
              title="Wishlist"
            >
              <Heart size={20} />
            </Link>

            <button
              className="icon-btn logout-btn"
              onClick={handleLogout}
            >
              <LogOut size={20} />
            </button>

          </>
        ) : (
          <Link
            to="/login"
            className="login-btn"
          >
            <User size={18} />
            Login
          </Link>
        )}

        <Link
          to="/cart"
          className="cart-btn"
        >
          <ShoppingCart size={20} />

          <span>{itemCount}</span>

        </Link>

      </div>

    </nav>
  );
}

export default Navbar;