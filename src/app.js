const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("URL Shortener API Running");
});

// API routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api", require("./routes/urlRoutes"));

// Redirect route at root
app.use("/", require("./routes/redirectRoute"));

module.exports = app;




