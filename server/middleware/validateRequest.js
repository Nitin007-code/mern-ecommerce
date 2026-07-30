const { validationResult } = require('express-validator');

// Runs after validation rules — checks if any failed, and responds with a clear error if so
function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Return just the first error message for simplicity
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  next(); // no errors — proceed to the actual route handler
}

module.exports = validateRequest;