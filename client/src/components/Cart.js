import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, clearCartLocally } = useCart();
  const [placing, setPlacing] = useState(false);
  const navigate = useNavigate();

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    setPlacing(true);
    try {
      // Step 1: ask our backend to create a Razorpay order
      const { data } = await axios.post(
        'http://localhost:5000/api/payment/create-order',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Step 2: configure and open Razorpay's checkout popup
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: 'INR',
        name: 'MERN Store',
        description: 'Order Payment',
        order_id: data.orderId,
        handler: async (response) => {
          // Runs after successful payment — response contains the signed confirmation
          try {
            await axios.post(
              'http://localhost:5000/api/orders/confirm',
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            clearCartLocally();
            navigate('/orders');
          } catch (err) {
            console.error('Order confirmation failed:', err);
            alert('Payment succeeded but order confirmation failed. Contact support.');
          }
        },
        modal: {
          ondismiss: () => setPlacing(false), // re-enable button if user closes popup without paying
        },
        theme: { color: '#14213D' },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (err) {
      console.error('Checkout failed:', err);
      alert('Checkout failed. Please try again.');
      setPlacing(false);
    }
  };

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
              <button onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}>−</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
            </div>
            <button className="remove-btn" onClick={() => removeFromCart(item._id)}>Remove</button>
          </div>
        </div>
      ))}

      <div className="cart-total">
        <h3>Total: ₹{total}</h3>
        <button className="add-to-cart-btn" onClick={handleCheckout} disabled={placing}>
          {placing ? 'Processing...' : 'Proceed to Checkout'}
        </button>
      </div>
    </div>
  );
}

export default Cart;