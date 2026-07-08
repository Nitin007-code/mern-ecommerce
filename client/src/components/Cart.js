import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Cart() {
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  // Calculate total price across all items (price × quantity, summed)
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cartItems.length === 0) {
    return (
      <div className="detail-page">
        <h2>Your cart is empty</h2>
        <Link to="/" className="cart-link" style={{ display: 'inline-block', marginTop: '16px' }}>
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="detail-page">
      <h2>Your Cart</h2>

      {cartItems.map((item) => (
        <div key={item._id} className="cart-item">
          <img src={item.image} alt={item.name} />
          <div className="cart-item-info">
            <h3>{item.name}</h3>
            <span className="price-tag">₹{item.price}</span>

            <div className="quantity-controls">
              {/* Decrease quantity, but never below 1 */}
              <button onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}>−</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
            </div>

            <button className="remove-btn" onClick={() => removeFromCart(item._id)}>
              Remove
            </button>
          </div>
        </div>
      ))}

      <div className="cart-total">
        <h3>Total: ₹{total}</h3>
        <button className="add-to-cart-btn">Proceed to Checkout</button>
      </div>
    </div>
  );
}

export default Cart;