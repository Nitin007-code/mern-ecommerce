const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const {protect} = require('../middleware/authMiddleware');

// @route   GET /api/reviews/:productId
// @desc    Get all reviews for a specific product
router.get('/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/reviews/:productId
// @desc    Add a review for a product (must be logged in)
router.post('/:productId', protect, async (req, res) => {
  try {
    const { rating, comment, userName } = req.body;

    const review = new Review({
      productId: req.params.productId,
      userId: req.userId,
      userName,
      rating,
      comment,
    });

    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;