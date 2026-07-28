import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('products'); // toggles between products/orders view

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    // Reuse the public products endpoint, just requesting a high limit to get "all" for admin view
    const response = await axios.get('http://localhost:5000/api/products?limit=100');
    setProducts(response.data.products);
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/orders/all', getAuthHeader());
      setOrders(response.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return; // simple browser confirmation dialog
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, getAuthHeader());
      fetchProducts(); // refresh list after deleting
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/orders/${orderId}/status`,
        { status: newStatus },
        getAuthHeader()
      );
      fetchOrders(); // refresh list after updating
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  return (
    <div className="detail-page" style={{ maxWidth: '900px' }}>
      <h2>Admin Dashboard</h2>

      <div className="admin-tabs">
        <button
          className={activeTab === 'products' ? 'tab-active' : ''}
          onClick={() => setActiveTab('products')}
        >
          Products ({products.length})
        </button>
        <button
          className={activeTab === 'orders' ? 'tab-active' : ''}
          onClick={() => setActiveTab('orders')}
        >
          Orders ({orders.length})
        </button>
      </div>

      {activeTab === 'products' && (
        <div className="admin-list">
          {products.map((p) => (
            <div key={p._id} className="admin-row">
              <img src={p.image} alt={p.name} className="admin-row-img" />
              <div className="admin-row-info">
                <strong>{p.name}</strong>
                <span>₹{p.price} — {p.stock} in stock</span>
              </div>
              <button className="remove-btn" onClick={() => handleDeleteProduct(p._id)}>Delete</button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="admin-list">
          {orders.map((order) => (
            <div key={order._id} className="admin-row" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <p><strong>#{order._id.slice(-6)}</strong> — {order.userId?.name} ({order.userId?.email})</p>
              <p>Total: ₹{order.totalAmount} — Placed {new Date(order.createdAt).toLocaleDateString()}</p>
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order._id, e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;