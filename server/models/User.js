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
    unique: true, // no two users can share the same email
  },
  password: {
    type: String,
    required: true, // this will store the HASHED password, never plain text
  },
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);
module.exports = User;