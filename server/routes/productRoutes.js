const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// @route   GET /api/products
// @desc    Fetch products with optional search, category filter, and pagination
// Example: /api/products?search=shoe&category=Footwear&page=1&limit=8
router.get('/', async (req, res) => {
  try {
    const { search, category, page = 1, limit = 8 } = req.query;

    // Build a MongoDB filter object dynamically based on what's provided
    const filter = {};

    if (search) {
      // $regex + 'i' = case-insensitive partial text match on product name
      filter.name = { $regex: search, $options: 'i' };
    }

    if (category) {
      filter.category = category;
    }

    // Calculate how many documents to skip based on current page
    const skip = (Number(page) - 1) * Number(limit);

    const products = await Product.find(filter)
      .skip(skip)
      .limit(Number(limit))
      .lean(); // returns plain JS objects instead of full Mongoose documents — faster for read-only data

    // Total count (matching filter) so frontend knows how many pages exist
    const total = await Product.countDocuments(filter);

    res.json({
      products,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   GET /api/products/:id/rating
// @desc    Get average rating and review count for a product
router.get('/:id/rating', async (req, res) => {
  try {
    const Review = require('../models/Review');
    const reviews = await Review.find({ productId: req.params.id });

    if (reviews.length === 0) {
      return res.json({ average: 0, count: 0 });
    }

    const average = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    res.json({ average: average.toFixed(1), count: reviews.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   GET /api/products/:id/related
// @desc    Get up to 4 other products from the same category, excluding the current one
router.get('/:id/related', async (req, res) => {
  try {
    const currentProduct = await Product.findById(req.params.id);
    if (!currentProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

   const relatedProducts = await Product.find({
      category: currentProduct.category,
      _id: { $ne: currentProduct._id },
    }).limit(4).lean();

    res.json(relatedProducts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   GET /api/products/:id
// @desc    Fetch a single product by its ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/products
// @desc    Create a new product — admin only
router.post('/', protect, adminOnly, async (req, res) => {
  const product = new Product({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    image: req.body.image,
    category: req.body.category,
    stock: req.body.stock,
  });

  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// @route   PUT /api/products/:id
// @desc    Update an existing product — admin only
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // return the updated doc, and re-run schema validation
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product — admin only
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;