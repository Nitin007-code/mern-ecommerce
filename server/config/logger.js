const winston = require('winston');

// Defines how logs are formatted and where they go
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => `[${timestamp}] ${level.toUpperCase()}: ${message}`)
  ),
  transports: [
    new winston.transports.Console(), // always log to terminal
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }), // errors also saved to a file
  ],
});

module.exports = logger;