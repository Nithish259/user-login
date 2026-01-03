const express = require("express");
const User = require("./../models/userModel");
const { protect } = require("../middlewares/auth");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  console.log(req.body);
  const { userName, email, password } = req.body;
  try {
    if (!userName || !email || !password) {
      res.status(400).json({
        message: "Please enter all the details of user",
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({
        message: "User already exists",
      });
    }
    const user = await User.create({ userName, email, password });
    console.log(user, "USER");
    const token = generateToken(user._id);
    res.status(201).json({
      message: "User created successfully!!",
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Server error",
    });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        message: "Please enter all the details of user",
      });
    }

    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      id: user._id,
      name: user.userName,
      email: user.email,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
});

//Me
router.get("/me", protect, async (req, res) => {
  res.status(200).json({ user: req.user });
});

//Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

module.exports = router;
