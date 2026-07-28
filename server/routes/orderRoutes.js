const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
// const { protect } = require('../middleware/authMiddleware');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const crypto = require('crypto');

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
// @route   GET /api/orders/all
// @desc    Get every order across all users — admin only
router.get('/all', protect, adminOnly, async (req, res) => {
  try {
    // .populate('userId', 'name email') replaces the userId reference with
    // just the user's name and email, instead of the full user document
    const orders = await Order.find().populate('userId', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update an order's status — admin only
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// @route   POST /api/orders/confirm
// @desc    Verifies Razorpay's payment signature, then creates the order
router.post('/confirm', protect, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Recreate the expected signature using our secret key, and compare it
    // to what Razorpay sent — this proves the payment data wasn't tampered with
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    const cart = await Cart.findOne({ userId: req.userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const totalAmount = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = new Order({
      userId: req.userId,
      items: cart.items,
      totalAmount,
      status: 'pending',
    });

    await order.save();

    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;