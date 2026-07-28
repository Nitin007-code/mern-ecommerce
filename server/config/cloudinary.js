const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure the Cloudinary SDK using our .env credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Defines where/how uploaded files get stored on Cloudinary's side
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'mern-ecommerce', // organizes uploads into a folder on Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});

module.exports = { cloudinary, storage };