const logger = require('../config/logger');

function errorHandler(err, req, res, next) {
  logger.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ message: err.message || 'Server error' });
}

module.exports = errorHandler;