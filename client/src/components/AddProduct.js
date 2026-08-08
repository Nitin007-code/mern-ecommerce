import React from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import ProductForm from "./ProductForm";

function AddProduct() {
  const navigate = useNavigate();

  const save = async (payload, token) => {
    await axios.post("http://localhost:5000/api/products", payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    navigate("/admin/dashboard");
  };

  return (
    <main className="product-form-page">
      <div className="admin-add-shell">
        <div className="admin-add-topbar">
          <Link to="/admin/dashboard" className="back-link">← Back to dashboard</Link>
          <button type="button" className="ghost-btn" onClick={() => navigate("/admin/dashboard")}>
            View catalog
          </button>
        </div>

        <section className="admin-form-hero">
          <div className="admin-form-copy">
            <span className="eyebrow">Catalogue editor</span>
            <h1>Add a product</h1>
            <p>
              Create a polished listing with strong visuals, clear pricing, and the right category so
              customers can discover it instantly.
            </p>
          </div>

          <div className="admin-form-summary">
            <div className="summary-pill">
              <span className="dot" />
              Ready to publish
            </div>
            <strong>ShopMax catalog</strong>
            <small>Better discovery · Faster conversions · Professional storefront</small>
          </div>
        </section>

        <ProductForm onSave={save} />
      </div>
    </main>
  );
}

export default AddProduct;
