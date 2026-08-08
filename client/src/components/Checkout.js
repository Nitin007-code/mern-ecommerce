import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, CreditCard, LockKeyhole, MapPin, Truck } from "lucide-react";

function Checkout() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Presentation is new, but this continues to use the existing order endpoint and JWT header.
  const handleCheckout = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/orders", {}, { headers: { Authorization: `Bearer ${token}` } });
      setMessage("Order placed successfully!");
      setTimeout(() => navigate("/orders"), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Checkout failed");
    } finally { setLoading(false); }
  };

  return <main className="checkout-screen"><section className="checkout-card">
    <div className="checkout-main"><span className="eyebrow">Secure checkout</span><h1>One step away from your order.</h1><p className="checkout-intro">Your order details are protected and your confirmation will appear in My Orders.</p>
      <div className="checkout-steps"><span className="step-done">1</span><i></i><span className="step-current">2</span><i></i><span>3</span><small>Cart</small><small>Payment</small><small>Confirmed</small></div>
      <div className="checkout-method"><div className="checkout-method-icon"><CreditCard size={22} /></div><div><h2>Ready for payment</h2><p>Continue to securely create your order.</p></div></div>
      {message && <p className={`checkout-message ${message.includes("success") ? "success" : "error"}`}>{message.includes("success") && <CheckCircle2 size={18} />}{message}</p>}
    </div>
    {/* The CTA calls the same API function above; no server workflow has changed. */}
    <aside className="checkout-summary"><span className="eyebrow">Order protection</span><h2>Shop with confidence.</h2><div><LockKeyhole size={19} /><p><strong>Secure checkout</strong><br />Your payment details stay protected.</p></div><div><Truck size={19} /><p><strong>Fast delivery</strong><br />Track your order from dispatch.</p></div><div><MapPin size={19} /><p><strong>Easy order tracking</strong><br />All updates live in your account.</p></div><button onClick={handleCheckout} disabled={loading} className="checkout-button">{loading ? "Processing order…" : "Place secure order"}</button></aside>
  </section></main>;
}

export default Checkout;
