const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/cart
// @desc    Get the logged-in user's cart
router.get('/', protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      cart = { items: [] }; // no cart yet — return empty
    }
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/cart
// @desc    Replace the logged-in user's entire cart with the given items
router.post('/', protect, async (req, res) => {
  try {
    const { items } = req.body;

    // "upsert: true" means: update if it exists, create if it doesn't
    const cart = await Cart.findOneAndUpdate(
      { userId: req.userId },
      { items },
      { new: true, upsert: true }
    );

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;