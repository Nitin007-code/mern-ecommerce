const { body } = require('express-validator');

// Validation rules for the registration route
const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email')
    .trim()
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(), // converts email to a consistent lowercase format
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

// Validation rules for the login route
const loginValidation = [
  body('email').trim().isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

module.exports = { registerValidation, loginValidation };