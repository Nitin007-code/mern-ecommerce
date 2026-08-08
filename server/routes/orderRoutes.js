const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const sendEmail = require('../utils/sendEmail');

// @route   POST /api/orders/confirm
// @desc    Verifies Razorpay's payment signature, creates the order, and emails confirmation
router.post('/confirm', protect, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, shippingAddress } = req.body;

    if (!shippingAddress) {
      return res.status(400).json({ message: 'Shipping address is required' });
    }

    // Recreate the expected signature using our secret key, and compare it
    // to what Razorpay sent — proves the payment data wasn't tampered with
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

    // Cart references are named `product`, while Order snapshots use `productId`.
    // Create an explicit purchase snapshot so product references survive checkout.
    const orderItems = cart.items.map((item) => ({
      productId: item.product,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));

    const order = new Order({
      userId: req.userId,
      items: orderItems,
      totalAmount,
      shippingAddress,
      status: 'pending',
    });

    await order.save();

    // Fetch user's email to send confirmation
    const user = await User.findById(req.userId);

    // Build a simple HTML email listing the order items
    const itemsHtml = cart.items
      .map((item) => `<li>${item.name} × ${item.quantity} — ₹${item.price * item.quantity}</li>`)
      .join('');

    const emailHtml = `
      <h2>Thanks for your order, ${user.name}!</h2>
      <p>Order ID: ${order._id}</p>
      <h3>Delivery Address:</h3>
      <p>
        ${shippingAddress.name}<br/>
        ${shippingAddress.address}<br/>
        ${shippingAddress.city} - ${shippingAddress.zip}<br/>
        Phone: ${shippingAddress.phone}
      </p>
      <h3>Items Purchased:</h3>
      <ul>${itemsHtml}</ul>
      <p><strong>Total Paid: ₹${totalAmount}</strong></p>
      <p>We will notify you once your order ships.</p>
    `;

    // Fire-and-forget: don't make the user wait for the email before getting their response
    sendEmail(user.email, 'Order Confirmation - ShopMax', emailHtml);

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

module.exports = router;
