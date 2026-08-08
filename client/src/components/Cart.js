import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import EmptyState from "./EmptyState";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  BadgeCheck,
} from "lucide-react";

import { useCart } from "../context/CartContext";

function Cart() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCartLocally,
  } = useCart();

  const [placing, setPlacing] = useState(false);

  const navigate = useNavigate();

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const shipping = 0;
  const discount = 0;
  const total = subtotal + shipping - discount;

  const handleCheckout = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    setPlacing(true);

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/payment/create-order",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: "INR",
        name: "ShopMax",
        description: "Order Payment",
        order_id: data.orderId,

        handler: async (response) => {
          try {
            await axios.post(
              "http://localhost:5000/api/orders/confirm",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            clearCartLocally();

            navigate("/orders");
          } catch (err) {
            console.error(err);

            alert(
              "Payment successful but order confirmation failed."
            );
          }
        },

        modal: {
          ondismiss: () => setPlacing(false),
        },

        theme: {
          color: "#2563eb",
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.open();
    } catch (err) {
      console.error(err);

      alert("Checkout failed.");

      setPlacing(false);
    }
  };

 if (cartItems.length === 0) {
  return (
    <EmptyState
      icon="🛒"
      title="Your Cart is Empty"
      message="Looks like you haven't added any products yet."
      buttonText="Continue Shopping"
      buttonLink="/"
    />
  );
}
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-100 py-10"
    >
      <div className="max-w-7xl mx-auto px-5">

        {/* Header */}

        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white shadow-xl mb-10">

          <div className="flex items-center gap-4">

            <ShoppingCart size={42} />

            <div>

              <h1 className="text-4xl font-bold">

                Shopping Cart

              </h1>

              <p className="text-blue-100 mt-2">

                Review your items before secure checkout.

              </p>

            </div>

          </div>

        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT */}

          <div className="lg:col-span-2 space-y-6">

            {cartItems.map((item, index) => (

              <motion.div
                key={item._id}
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.08,
                }}
                className="app-card p-6" >

                <div className="flex flex-col md:flex-row gap-6">

                  <div className="w-full md:w-40 flex justify-center">

                    <img
                      
    src={item.image}
    onError={(e) => {
      e.target.src =
        "https://placehold.co/200x200?text=No+Image";
    }}
                      alt={item.name}
                      className="h-36 w-36 object-contain"
                    />

                  </div>

                  <div className="flex-1">

                    <h2 className="text-2xl font-bold text-gray-800">

                      {item.name}

                    </h2>

                    <p className="text-gray-500 mt-2">

                      Premium Product

                    </p>

                    <h3 className="text-blue-700 text-2xl font-bold mt-5">

                      ₹{item.price}

                    </h3>

                    <div className="flex items-center gap-4 mt-6">

                      <button
                        onClick={() =>
                          updateQuantity(
                            item._id,
                            Math.max(1, item.quantity - 1)
                          )
                        }
                        className="w-11 h-11 rounded-full bg-blue-100 hover:bg-blue-600 hover:text-white flex justify-center items-center transition"
                      >

                        <Minus size={18} />

                      </button>

                      <span className="font-bold text-xl">

                        {item.quantity}

                      </span>

                      <button
                        onClick={() =>
                          updateQuantity(
                            item._id,
                            item.quantity + 1
                          )
                        }
                        className="w-11 h-11 rounded-full bg-blue-100 hover:bg-blue-600 hover:text-white flex justify-center items-center transition"
                      >

                        <Plus size={18} />

                      </button>

                    </div>

                  </div>

                  <div className="flex flex-col justify-between items-end">

                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-500 hover:text-red-700"
                    >

                      <Trash2 size={22} />

                    </button>

                    <div className="text-right">

                      <p className="text-gray-500">

                        Subtotal

                      </p>

                      <h2 className="text-3xl font-bold text-green-600">

                        ₹{item.price * item.quantity}

                      </h2>

                    </div>

                  </div>

                </div>

              </motion.div>

            ))}

          </div>

          {/* RIGHT SIDE STARTS HERE IN PART 2 */}
                    {/* ===============================
              ORDER SUMMARY
          =============================== */}

          <div className="lg:col-span-1">

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="sticky top-28 app-card overflow-hidden"
            >

              {/* Header */}

              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">

                <h2 className="text-2xl font-bold">

                  Order Summary

                </h2>

                <p className="text-blue-100 mt-2">

                  Secure payment powered by Razorpay

                </p>

              </div>

              {/* Price Details */}

              <div className="p-6 space-y-5">

                <div className="flex justify-between">

                  <span className="text-gray-600">

                    Items

                  </span>

                  <span className="font-semibold">

                    {cartItems.length}

                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-gray-600">

                    Subtotal

                  </span>

                  <span className="font-semibold">

                    ₹{subtotal}

                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-gray-600">

                    Shipping

                  </span>

                  <span className="font-semibold text-green-600">

                    FREE

                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-gray-600">

                    Discount

                  </span>

                  <span className="font-semibold">

                    ₹{discount}

                  </span>

                </div>

                <hr />

                <div className="flex justify-between items-center">

                  <span className="text-2xl font-bold">

                    Grand Total

                  </span>

                  <span className="text-3xl font-bold text-blue-700">

                    ₹{total}

                  </span>

                </div>

              </div>

              {/* Trust Section */}

              <div className="border-t border-gray-100 p-6 space-y-4">

                <div className="flex items-center gap-3">

                  <ShieldCheck
                    size={20}
                    className="text-green-600"
                  />

                  <span className="text-gray-700">

                    100% Secure Payment

                  </span>

                </div>

                <div className="flex items-center gap-3">

                  <Truck
                    size={20}
                    className="text-blue-600"
                  />

                  <span className="text-gray-700">

                    Free Fast Delivery

                  </span>

                </div>

                <div className="flex items-center gap-3">

                  <RotateCcw
                    size={20}
                    className="text-purple-600"
                  />

                  <span className="text-gray-700">

                    Easy Returns

                  </span>

                </div>

                <div className="flex items-center gap-3">

                  <BadgeCheck
                    size={20}
                    className="text-green-600"
                  />

                  <span className="text-gray-700">

                    Genuine Products

                  </span>

                </div>

              </div>

              {/* Checkout Button */}

              <div className="p-6">

                <button
                  onClick={handleCheckout}
                  disabled={placing}
                  className="primary-btn w-full"
                >
                  {placing ? (
                    "Processing Payment..."
                  ) : (
                    <span className="flex justify-center items-center gap-2">
                      Proceed to Secure Checkout
                      <ArrowRight size={20} />
                    </span>
                  )}
                </button>

                <Link
                  to="/"
                  className="mt-5 flex justify-center text-blue-600 font-semibold hover:text-blue-800 transition"
                >

                  ← Continue Shopping

                </Link>

              </div>

            </motion.div>

          </div>

        </div>

      </div>

    </motion.div>

  );
}

export default Cart;