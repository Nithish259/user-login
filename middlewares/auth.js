const User = require("./../models/userModel");
const jwt = require("jsonwebtoken");

module.exports.protect = async (req, res, next) => {
  let token;

  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");
      next();
    }
  } catch (err) {
    console.error("Token not valid .Error", err.message);
    res.status(404).json({
      message: "Not Authorized, Token failed",
    });
  }
  return res.status(404).json({
    message: "Not Authorized, Token failed",
  });
};
