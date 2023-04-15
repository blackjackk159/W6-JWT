const User = require("../models/users");
const jwt = require("jsonwebtoken");
const appError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const isAuth = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new appError("你尚未登入！", 401);
  }

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decodedToken.id);
  req.user = currentUser;
  next();
});

module.exports = { isAuth };
