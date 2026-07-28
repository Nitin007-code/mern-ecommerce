import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:5000/api/orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <p>Loading orders...</p>;
  if (orders.length === 0) return <div className="detail-page"><h2>No orders yet</h2></div>;

  return (
    <div className="detail-page">
      <h2>Your Orders</h2>
      {orders.map((order) => (
        <div key={order._id} className="cart-item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <p>
  <strong>Order #{order._id.slice(-6)}</strong>{' '}
  <span className={`status-badge status-${order.status}`}>{order.status}</span>
</p>
          <p>Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
          {order.items.map((item) => (
            <p key={item.productId}>{item.name} × {item.quantity} — ₹{item.price * item.quantity}</p>
          ))}
          <p><strong>Total: ₹{order.totalAmount}</strong></p>
        </div>
      ))}
    </div>
  );
}

export default Orders;