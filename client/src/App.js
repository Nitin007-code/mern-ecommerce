import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";

import ProductList from "./components/ProductList";
import ProductDetail from "./components/ProductDetail";
import Cart from "./components/Cart";
import Login from "./components/Login";
import Register from "./components/Register";
import Orders from "./components/Orders";
import AddProduct from "./components/AddProduct";
import Wishlist from "./components/Wishlist";
import Checkout from "./components/Checkout";
import AdminDashboard from "./components/AdminDashboard";

import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>

          <Navbar />

          {/* Hero only on Home Page */}
          <Routes>

            <Route
              path="/"
              element={
                <>
                  <Hero />
                  <ProductList />
                </>
              }
            />

            <Route
              path="/product/:id"
              element={<ProductDetail />}
            />

            <Route
              path="/cart"
              element={<Cart />}
            />

            <Route
              path="/checkout"
              element={<Checkout />}
            />

            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/register"
              element={<Register />}
            />

            <Route
              path="/orders"
              element={<Orders />}
            />

            <Route
              path="/wishlist"
              element={<Wishlist />}
            />

            <Route
              path="/admin/add-product"
              element={<AddProduct />}
            />

            <Route
              path="/admin/dashboard"
              element={<AdminDashboard />}
            />

          </Routes>

        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;