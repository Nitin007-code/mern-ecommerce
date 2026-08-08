import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get(
          "http://localhost:5000/api/orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOrders(response.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "processing":
        return "bg-blue-100 text-blue-700";

      case "shipped":
        return "bg-purple-100 text-purple-700";

      case "delivered":
        return "bg-green-100 text-green-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex justify-center items-center text-xl font-semibold">
        ⏳ Loading your orders...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-[70vh] flex justify-center items-center p-6">

        <div className="bg-white rounded-3xl shadow-xl p-10 text-center max-w-md">

          <div className="text-6xl mb-4">
            📦
          </div>

          <h2 className="text-3xl font-bold">
            No Orders Yet
          </h2>

          <p className="text-gray-500 mt-3">
            Looks like you haven't placed any order yet.
          </p>

          <Link
            to="/products"
            className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
          >
            Continue Shopping
          </Link>

        </div>

      </div>
    );
  }

  return (
    <div className="orders-page bg-gradient-to-b from-blue-50 via-white to-white min-h-screen">

      <div className="container mx-auto px-6 py-10">

        {/* Header */}

        <div className="orders-page-hero bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white mb-10">

          <h1 className="text-4xl font-bold">
            📦 My Orders
          </h1>

          <p className="mt-2 text-blue-100">
            Track all your purchases in one place.
          </p>

        </div>

        <div className="space-y-8">

          {orders.map((order, index) => (

            <motion.div
              key={order._id}
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: index * 0.1,
              }}
              className="bg-white rounded-3xl shadow-lg border border-blue-100 overflow-hidden"
            >

              {/* Order Header */}

              <div className="flex flex-col md:flex-row md:justify-between md:items-center bg-blue-50 px-6 py-5">

                <div>

                  <h3 className="text-xl font-bold">
                    Order #{order._id.slice(-6)}
                  </h3>

                  <p className="text-gray-500 mt-1">
                    Placed on{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>

                </div>

                <span
                  className={`mt-4 md:mt-0 px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>

              </div>

              {/* Products */}

              <div className="p-6 space-y-4">

                {order.items.map((item) => (

                  <div
                    key={item.productId}
                    className="bg-gray-50 rounded-2xl p-4 flex justify-between items-center"
                  >

                    <div>

                      <h4 className="font-semibold">
                        {item.name}
                      </h4>

                      <p className="text-gray-500 text-sm">
                        Qty: {item.quantity}
                      </p>

                    </div>

                    <div className="text-right">

                      <p className="font-bold text-blue-700">
                        ₹{item.price}
                      </p>

                      <p className="text-sm text-gray-500">
                        ₹
                        {item.price *
                          item.quantity}
                      </p>

                    </div>

                  </div>

                ))}

              </div>

              {/* Total */}

              <div className="bg-green-50 px-6 py-5 flex justify-between items-center">

                <span className="font-semibold">
                  Total Paid
                </span>

                <span className="text-2xl font-bold text-green-700">
                  ₹{order.totalAmount}
                </span>

              </div>

            </motion.div>

          ))}

        </div>

      </div>
    </div>
  );
}

export default Orders;
