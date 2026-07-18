const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/orders
// @desc    Create an order from the user's current cart, then clear the cart
router.post('/', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.userId });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Calculate total from cart items
    const totalAmount = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = new Order({
      userId: req.userId,
      items: cart.items,
      totalAmount,
    });

    await order.save();

    // Clear the cart now that the order is placed
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   GET /api/orders
// @desc    Get all orders for the logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;