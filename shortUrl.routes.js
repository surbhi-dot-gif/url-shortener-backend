const express = require('express');
const router = express.Router();
const { createShortUrl, redirectToFullUrl } = require('../controllers/shortUrl.controller');

// POST /api/shorten
router.post('/shorten', createShortUrl);

// GET /api/:shortId (not used since redirect is in server.js)
router.get('/:shortId', redirectToFullUrl);

module.exports = router;
