const mongoose = require('mongoose');

// Blueprint for a registered user
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['customer', 'admin'], // only these two values allowed
    default: 'customer', // everyone starts as a regular customer
  },
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);
module.exports = User;