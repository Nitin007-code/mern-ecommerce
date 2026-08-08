import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Package, ShoppingBag, IndianRupee, Users, Trash2, Search, BarChart3, Boxes, Pencil, UserRound, Mail, CalendarDays } from "lucide-react";

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("products");
  const [searchTerm, setSearchTerm] = useState("");

  // Every admin-only request uses the existing JWT saved by the auth flow.
  const getAuthHeader = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });

  // Dashboard data is fetched once on entry; mutations refresh only the affected list.
  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/products?limit=100");
      setProducts(response.data.products || []);
    } catch (err) { console.error("Error fetching products:", err); }
  };
  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/orders/all", getAuthHeader());
      setOrders(response.data || []);
    } catch (err) { console.error("Error fetching orders:", err); }
  };
  // These loader functions are intentionally invoked once when the dashboard opens.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchProducts(); fetchOrders(); }, []);

  // These actions deliberately keep the original server endpoints and payloads.
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try { await axios.delete(`http://localhost:5000/api/products/${id}`, getAuthHeader()); fetchProducts(); }
    catch (err) { console.error("Error deleting product:", err); }
  };
  const handleStatusChange = async (orderId, status) => {
    try { await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, { status }, getAuthHeader()); fetchOrders(); }
    catch (err) { console.error("Error updating order status:", err); }
  };

  const revenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const customers = new Set(orders.map((order) => order.userId?._id).filter(Boolean)).size;
  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const stats = [
    { label: "Products", value: products.length, icon: Package, tone: "violet" },
    { label: "Orders", value: orders.length, icon: ShoppingBag, tone: "blue" },
    { label: "Revenue", value: `₹${revenue.toLocaleString("en-IN")}`, icon: IndianRupee, tone: "amber" },
    { label: "Customers", value: customers, icon: Users, tone: "green" },
  ];

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="admin-page">
      <div className="admin-shell">
        {/* High-level summary is calculated from the same live product/order arrays below. */}
        <header className="admin-hero">
          <div><span className="eyebrow">ShopMax control centre</span><h1>Store overview</h1><p>Keep inventory, fulfilment, and customer activity moving from one focused workspace.</p></div>
          <div className="admin-hero-icon"><BarChart3 size={42} /></div>
        </header>

        <section className="admin-stats" aria-label="Store statistics">
          {stats.map(({ label, value, icon: Icon, tone }) => <article className={`admin-stat ${tone}`} key={label}><span className="admin-stat-icon"><Icon size={21} /></span><p>{label}</p><strong>{value}</strong></article>)}
        </section>

        <section className="admin-workspace">
          <div className="admin-toolbar">
            <label className="admin-search"><Search size={18} /><input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search inventory" /></label>
            {/* Local tab state switches the view only; it never changes server data. */}
            <div className="admin-tabs" role="tablist">
              <button className={activeTab === "products" ? "tab-active" : ""} onClick={() => setActiveTab("products")}><Boxes size={17} /> Products <span>{products.length}</span></button>
              <button className={activeTab === "orders" ? "tab-active" : ""} onClick={() => setActiveTab("orders")}><ShoppingBag size={17} /> Orders <span>{orders.length}</span></button>
            </div>
          </div>

          {activeTab === "products" ? (
            <section className="admin-panel">
              <div className="panel-heading"><div><span className="eyebrow">Catalogue</span><h2>Product inventory</h2><p>Review stock and keep your collection current.</p></div><span className="panel-count">{filteredProducts.length} items</span></div>
              <div className="admin-list">
                {filteredProducts.map((product) => <article className="admin-product-row" key={product._id}>
                  <img src={product.image} onError={(e) => { e.currentTarget.src = "https://placehold.co/120x120?text=Product"; }} alt={product.name} />
                  <div className="admin-product-details"><h3>{product.name}</h3><p>₹{product.price?.toLocaleString("en-IN")}</p><div><span className="stock-chip">{product.stock || 0} in stock</span><span className="category-chip">{product.category || "General"}</span></div></div>
                  {/* Edit now routes to the shared form, which uses the existing PUT endpoint. */}
                  <div className="row-actions"><Link className="edit-action" to={`/admin/products/${product._id}/edit`}><Pencil size={16} /> Edit</Link><button className="delete-action" onClick={() => handleDeleteProduct(product._id)}><Trash2 size={16} /> Delete</button></div>
                </article>)}
                {!filteredProducts.length && <p className="admin-empty">No products match this search.</p>}
              </div>
            </section>
          ) : (
            <section className="admin-panel">
              <div className="panel-heading"><div><span className="eyebrow">Fulfilment</span><h2>Customer orders</h2><p>Update delivery progress as each order moves through your workflow.</p></div><span className="panel-count">{orders.length} orders</span></div>
              <div className="admin-list">
                {orders.map((order) => <article className="admin-order-row" key={order._id}>
                  <div className="order-ident"><span className="order-avatar"><UserRound size={19} /></span><div><h3>Order #{order._id.slice(-6).toUpperCase()}</h3><p><Mail size={14} /> {order.userId?.email || "No email available"}</p><p><CalendarDays size={14} /> {new Date(order.createdAt).toLocaleDateString()}</p></div></div>
                  <strong>₹{order.totalAmount?.toLocaleString("en-IN")}</strong>
                  {/* Status selection retains the original PUT request and refresh behavior. */}
                  <select value={order.status || "pending"} onChange={(e) => handleStatusChange(order._id, e.target.value)} aria-label={`Status for order ${order._id}`}><option value="pending">Pending</option><option value="shipped">Shipped</option><option value="delivered">Delivered</option></select>
                </article>)}
                {!orders.length && <p className="admin-empty">No orders have been placed yet.</p>}
              </div>
            </section>
          )}
        </section>
      </div>
    </motion.main>
  );
}

export default AdminDashboard;
