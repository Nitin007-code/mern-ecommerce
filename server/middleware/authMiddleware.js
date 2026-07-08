const jwt = require('jsonwebtoken');

// Runs before protected routes to verify the user is logged in
function protect(req, res, next) {
  // Frontend sends the token as: Authorization: Bearer <token>
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1]; // extract token after "Bearer "

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // attach the user's ID to the request for later use
    next(); // token valid — proceed to the actual route
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = protect;