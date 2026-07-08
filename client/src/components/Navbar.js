import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { cartItems } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" style={{ textDecoration: 'none' }}>
        <h1>MERN Store</h1>
      </Link>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      {user ? (
  <>
    <span style={{ color: 'var(--ivory)', fontSize: '14px' }}>Hi, {user.name}</span>
    <Link to="/admin/add-product" className="cart-link">+ Add Product</Link>
    <button onClick={handleLogout} className="cart-link" style={{ border: 'none', cursor: 'pointer' }}>
      Logout
    </button>
  </>
) : (
  <Link to="/login" className="cart-link">Login</Link>
)}
        )}
        <Link to="/cart" className="cart-link">Cart ({itemCount})</Link>
      </div>
    </nav>
  );
}

export default Navbar;