const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // one wishlist per user
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product', // just references — no need to duplicate product data here
    },
  ],
}, { timestamps: true });

const Wishlist = mongoose.model('Wishlist', wishlistSchema);
module.exports = Wishlist;