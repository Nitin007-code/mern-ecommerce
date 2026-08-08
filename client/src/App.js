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
import EditProduct from "./components/EditProduct";
import AdminRoute from "./components/AdminRoute";
import Wishlist from "./components/Wishlist";
import Checkout from "./components/Checkout";
import AdminDashboard from "./components/AdminDashboard";
import DealsSection from "./components/DealsSection";
import CategorySection from "./components/CategorySection";
import FeaturesSection from "./components/FeaturesSection";

import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>

          <Navbar />

          <Routes>

            <Route
              path="/"
              element={
                <>
                  <Hero />
                  <CategorySection />
                  <DealsSection />
                  <ProductList />
                  <FeaturesSection />
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
              element={<AdminRoute><AddProduct /></AdminRoute>}
            />

            <Route
              path="/admin/dashboard"
              element={<AdminRoute><AdminDashboard /></AdminRoute>}
            />
            <Route path="/admin/products/:id/edit" element={<AdminRoute><EditProduct /></AdminRoute>} />

          </Routes>

        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
