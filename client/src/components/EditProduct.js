import React, { useEffect, useState } from "react";
import api from "../api";
import { Link, useNavigate, useParams } from "react-router-dom";
import ProductForm from "./ProductForm";

export default function EditProduct() {
  const { id } = useParams(); const navigate = useNavigate(); const [product, setProduct] = useState(null); const [error, setError] = useState("");
  useEffect(() => { api.get(`/products/${id}`).then((response) => setProduct(response.data)).catch(() => setError("Product could not be found.")); }, [id]);
  const save = async (payload, token) => { await api.put(`/products/${id}`, payload, { headers: { Authorization: `Bearer ${token}` } }); navigate("/admin/dashboard"); };
  return <main className="product-form-page"><Link to="/admin/dashboard" className="back-link">← Back to dashboard</Link><div className="form-page-heading"><span className="eyebrow">Catalogue editor</span><h1>Edit product</h1><p>Update product details, availability, or imagery.</p></div>{error ? <p className="auth-error">{error}</p> : product ? <ProductForm initialProduct={product} onSave={save} submitLabel="Save changes" /> : <p className="page-loading">Loading product…</p>}</main>;
}
