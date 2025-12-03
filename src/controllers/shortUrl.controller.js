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

  // basic URL validation
  try {
    new URL(fullUrl);
  } catch (err) {
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
    shortUrl: `${process.env.BASE_URL || ''}/${doc.shortUrl}`,
    id: doc._id,
  });
});

// Redirect & increment click count
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

// Get analytics for one shortId
exports.getAnalytics = asyncHandler(async (req, res) => {
  const { shortId } = req.params;
  const doc = await ShortUrl.findOne({ shortUrl: shortId }).lean();
  if (!doc) {
    res.status(404);
    throw new Error('Short URL not found');
  }
  res.json({
    fullUrl: doc.fullUrl,
    shortUrl: `${process.env.BASE_URL || ''}/${doc.shortUrl}`,
    clicks: doc.clicks,
    createdAt: doc.createdAt,
  });
});

// Global stats
exports.getStats = asyncHandler(async (req, res) => {
  const totalUrls = await ShortUrl.countDocuments();
  const result = await ShortUrl.aggregate([
    { $group: { _id: null, totalClicks: { $sum: '$clicks' } } },
  ]);
  const totalClicks = result[0] ? result[0].totalClicks : 0;
  res.json({ totalUrls, totalClicks });
});
