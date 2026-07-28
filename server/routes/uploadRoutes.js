const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Tells multer to use Cloudinary storage instead of local disk storage
const upload = multer({ storage });

// @route   POST /api/upload
// @desc    Upload a single image file, returns the hosted Cloudinary URL — admin only
// upload.single('image') expects the file to be sent under the field name "image"
router.post('/', protect, adminOnly, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  // req.file.path is the final hosted URL Cloudinary generated
  res.json({ imageUrl: req.file.path });
});

module.exports = router;