const asyncHandler = require('express-async-handler');
const { nanoid } = require('nanoid');
const ShortUrl = require('../models/shortUrl.model');

// Create short url
exports.createShortUrl = asyncHandler(async (req, res) => {
  const { fullUrl } = req.body;

  if (!fullUrl) {
    res.status(400);
    throw new Error('fullUrl is required');
  }

  // URL validation
  try {
    new URL(fullUrl);
  } catch {
    res.status(400);
    throw new Error('Invalid URL');
  }

  // generate unique short id
  let shortId;
  let exists;

  do {
    shortId = nanoid(7);
    exists = await ShortUrl.findOne({ shortUrl: shortId }).lean();
  } while (exists);

  const doc = await ShortUrl.create({
    fullUrl,
    shortUrl: shortId,
  });

  res.status(201).json({
    message: 'Short URL created',
    shortUrl: `${process.env.BASE_URL || 'http://localhost:5000'}/${doc.shortUrl}`,
    id: doc._id,
  });
});

// Redirect
exports.redirectToFullUrl = asyncHandler(async (req, res) => {
  const { shortId } = req.params;

  const doc = await ShortUrl.findOneAndUpdate(
    { shortUrl: shortId },
    { $inc: { clicks: 1 } },
    { new: true }
  ).lean();

  if (!doc) {
    res.status(404);
    throw new Error('Short URL not found');
  }

  return res.redirect(doc.fullUrl);
});
