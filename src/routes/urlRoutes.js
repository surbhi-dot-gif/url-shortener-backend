const validator = require("validator");

const express = require("express");
const { nanoid } = require("nanoid");
const Url = require("../models/Url");

const router = express.Router();

// Create short URL
router.post("/shorten", async (req, res) => {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl) {
      return res.status(400).json({ message: "Original URL required" });
    }

    // Validate URL format
    if (!validator.isURL(originalUrl)) {
      return res.status(400).json({ message: "Invalid URL format" });
    }

    // Check if URL already shortened
    const existing = await Url.findOne({ originalUrl });
    if (existing) {
      return res.json({
        shortUrl: existing.shortUrl,
        message: "Short URL already exists (cached)",
      });
    }

    // Generate new short URL
    const shortCode = nanoid(6);
    const shortUrl = `http://localhost:5000/${shortCode}`;

    const newUrl = new Url({
      originalUrl,
      shortCode,
      shortUrl,
    });

    await newUrl.save();

    res.json({
      shortUrl,
      message: "URL shortened successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Redirect
router.get("/:code", async (req, res) => {
  try {
    const urlData = await Url.findOne({ shortCode: req.params.code });

    if (!urlData) return res.status(404).json({ message: "URL not found" });

    urlData.clicks += 1;
await urlData.save();

return res.redirect(urlData.originalUrl);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Analytics route
router.get("/stats/:code", async (req, res) => {
  try {
    const urlData = await Url.findOne({ shortCode: req.params.code });

    if (!urlData) {
      return res.status(404).json({ message: "URL not found" });
    }

    res.json({
      originalUrl: urlData.originalUrl,
      shortUrl: urlData.shortUrl,
      clicks: urlData.clicks,
      createdAt: urlData.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
