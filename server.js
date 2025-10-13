const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/bd");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("🚀 API is Running & MongoDB is Connected");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
