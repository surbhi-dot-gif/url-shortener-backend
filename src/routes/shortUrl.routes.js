const express = require('express');
const router = express.Router();
const { createShortUrl, redirectToFullUrl } = require('../controllers/shortUrl.controller');

// POST /shorten
router.post('/shorten', createShortUrl);

// GET /:shortId
router.get('/:shortId', redirectToFullUrl);

module.exports = router;