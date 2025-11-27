const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();

app.use(express.json());

const urlRoutes = require("./routes/urlRoutes");
app.use("/", urlRoutes);

app.get("/", (req, res) => {
    res.send("URL Shortener API Running");
});

connectDB(); // Connect MongoDB

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
