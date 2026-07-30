const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto'); // built into Node.js — no install needed
const Cart = require('../models/Cart');
const { protect } = require('../middleware/authMiddleware');

let razorpay;

if (process.env.NODE_ENV !== "test") {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

// @route   POST /api/payment/create-order
// @desc    Creates a Razorpay order based on the user's cart total
router.post('/create-order', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.userId });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const totalAmount = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Razorpay order — amount must be in paise (smallest currency unit), and an integer
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100),
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });

    res.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      keyId: process.env.RAZORPAY_KEY_ID, // frontend needs this to open the checkout popup
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;