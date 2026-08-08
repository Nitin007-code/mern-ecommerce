const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
  },
}, {
  timestamps: true,
});
// Speeds up category filtering and text search on product names
productSchema.index({ category: 1 });
productSchema.index({ name: 'text' });
const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

module.exports = Product;