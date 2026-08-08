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
    const { items = [] } = req.body;

    // The client uses productId; the existing Cart schema stores the same value
    // in its `product` reference. Normalising here keeps the public API stable.
    const normalizedItems = items.map((item) => ({
      product: item.productId || item.product,
      name: item.name,
      image: item.image,
      price: Number(item.price),
      quantity: Number(item.quantity) || 1,
    }));

    // "upsert: true" means: update if it exists, create if it doesn't
    const cart = await Cart.findOneAndUpdate(
      { userId: req.userId },
      { items: normalizedItems },
      { new: true, upsert: true }
    );

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
