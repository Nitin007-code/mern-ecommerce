const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');
const {protect} = require('../middleware/authMiddleware');

// @route   GET /api/wishlist
// @desc    Get the logged-in user's wishlist, with full product details populated
router.get('/', protect, async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ userId: req.userId }).populate('products');
    if (!wishlist) {
      return res.json({ products: [] });
    }
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/wishlist/:productId
// @desc    Add a product to the wishlist (or create the wishlist if it doesn't exist)
router.post('/:productId', protect, async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ userId: req.userId });

    if (!wishlist) {
      wishlist = new Wishlist({ userId: req.userId, products: [req.params.productId] });
    } else if (!wishlist.products.includes(req.params.productId)) {
      // Avoid adding the same product twice
      wishlist.products.push(req.params.productId);
    }

    await wishlist.save();
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   DELETE /api/wishlist/:productId
// @desc    Remove a product from the wishlist
router.delete('/:productId', protect, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.userId });
    if (wishlist) {
      wishlist.products = wishlist.products.filter(
        (id) => id.toString() !== req.params.productId
      );
      await wishlist.save();
    }
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;