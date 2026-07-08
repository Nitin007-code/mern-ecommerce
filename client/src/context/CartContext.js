import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // Helper: builds the Authorization header using the saved token
  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  // On first load, if a user is logged in, fetch their saved cart from backend
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return; // not logged in — skip, cart stays local/empty

    const fetchCart = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/cart', getAuthHeader());
        // Convert backend's "items" format back into our frontend cart shape
        const items = response.data.items.map((item) => ({
          _id: item.productId,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: item.quantity,
        }));
        setCartItems(items);
      } catch (err) {
        console.error('Error fetching cart:', err);
      }
    };
    fetchCart();
  }, []);

  // Whenever cartItems changes AND user is logged in, save the cart to backend
  const syncCart = async (updatedItems) => {
    const token = localStorage.getItem('token');
    if (!token) return; // guest users: cart only lives in memory for now

    const items = updatedItems.map((item) => ({
      productId: item._id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: item.quantity,
    }));

    try {
      await axios.post('http://localhost:5000/api/cart', { items }, getAuthHeader());
    } catch (err) {
      console.error('Error syncing cart:', err);
    }
  };

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item._id === product._id);
      let updated;

      if (existingItem) {
        updated = prevItems.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        updated = [...prevItems, { ...product, quantity: 1 }];
      }

      syncCart(updated); // push the new cart state to backend
      return updated;
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => {
      const updated = prevItems.filter((item) => item._id !== productId);
      syncCart(updated);
      return updated;
    });
  };

  const updateQuantity = (productId, quantity) => {
    setCartItems((prevItems) => {
      const updated = prevItems.map((item) =>
        item._id === productId ? { ...item, quantity } : item
      );
      syncCart(updated);
      return updated;
    });
  };

  // Empties the cart in local state only — used right after checkout,
  // since the backend cart is already cleared server-side by the order route
  const clearCartLocally = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCartLocally }}
    >
      {children}
    </CartContext.Provider>
  );
}