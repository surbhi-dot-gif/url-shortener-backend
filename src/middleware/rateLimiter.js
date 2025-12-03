const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // limit per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try later.' },
});

module.exports = apiLimiter;
