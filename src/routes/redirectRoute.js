const express = require("express");
const Url = require("../models/Url");

const router = express.Router();

router.get("/:code", async (req, res) => {
  try {
    const urlData = await Url.findOne({ shortCode: req.params.code });

    if (!urlData) {
      return res.status(404).send("URL not found");
    }

    urlData.clicks += 1;
    await urlData.save();

    return res.redirect(urlData.originalUrl);
  } catch {
    res.status(500).send("Server error");
  }
});

module.exports = router;
