const express = require("express");
const validator = require("validator");
const { nanoid } = require("nanoid");
const Url = require("../models/Url");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

// CREATE SHORT URL (protected)
router.post("/shorten", verifyToken, async (req, res) => {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl) {
      return res.status(400).json({ message: "originalUrl is required" });
    }

    if (!validator.isURL(originalUrl)) {
      return res.status(400).json({ message: "Invalid URL format" });
    }

    const existing = await Url.findOne({
      originalUrl,
      owner: req.user.id,
    });

    if (existing) {
      return res.json({
        shortUrl: existing.shortUrl,
        shortCode: existing.shortCode,
        clicks: existing.clicks,
        createdAt: existing.createdAt,
        message: "Short URL already exists",
      });
    }

    const shortCode = nanoid(6);
    const shortUrl = `${BASE_URL}/${shortCode}`;

    const newUrl = await Url.create({
      originalUrl,
      shortCode,
      shortUrl,
      owner: req.user.id,
    });

    res.json({
      shortUrl,
      shortCode,
      createdAt: newUrl.createdAt,
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// REDIRECT
router.get("/:code", async (req, res) => {
  try {
    const urlData = await Url.findOne({ shortCode: req.params.code });

    if (!urlData) {
      return res.status(404).json({ message: "URL not found" });
    }

    urlData.clicks += 1;
    await urlData.save();

    res.redirect(urlData.originalUrl);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// ANALYTICS
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
      owner: urlData.owner,
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
