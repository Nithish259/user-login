const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");

dotenv.config({ path: "./config.env" });

const app = express();

const port = process.env.PORT || 3000;
const DB = process.env.MONGO_URI;

app.use(express.json());

app.use("/api/users", authRoutes);

mongoose
  .connect(DB)
  .then(() => {
    console.log("DB connection successful!");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("DB connection failed:", err);
  });
