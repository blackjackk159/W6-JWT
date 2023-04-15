const User = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const appError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const generateToken = (uid) =>
  jwt.sign({ id: uid }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });

const getOne = catchAsync(async (req, res) => {
  try {
    const users = await User.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: users,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
    });
  }
});

const getAll = catchAsync(async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      status: "success",
      data: users,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
    });
  }
});

const createOne = catchAsync(async (req, res) => {
  try {
    const userData = await User.create(req.body);
    res.status(200).json({
      status: "success",
      data: userData,
      message: "新增使用者成功",
    });
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: err.errors ? err : "欄位填寫錯誤或查無此id",
    });
  }
});

const deleteAll = catchAsync(async (req, res) => {
  try {
    await User.deleteMany({});
    res.status(204).json({});
  } catch (err) {
    res.status(500).json({
      status: "error",
    });
  }
});

const sign_up = catchAsync(async (req, res, next) => {
  let { email, password, confirmPassword, name } = req.body;

  if (!(email && password && confirmPassword && name)) {
    throw new appError("欄位未填寫正確", 400);
  }

  if (password !== confirmPassword) {
    throw new appError("密碼不一致", 400);
  }

  if (!validator.isLength(password, { min: 8 })) {
    throw new appError("密碼低於8碼", 400);
  }

  if (!validator.isEmail(email)) {
    throw new appError("Email 格式不正確", 400);
  }

  password = await bcrypt.hash(req.body.password, 12);
  const newUser = await User.create({
    email,
    password,
    name,
  });

  const token = generateToken(newUser.id);

  res.status(201).json({
    status: "success",
    user: {
      name: newUser.name,
      token,
    },
  });
});

const sign_in = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new appError("帳號密碼不可為空", 400);
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new appError("帳號或密碼錯誤，請重新輸入！", 400);
  }
  const auth = await bcrypt.compare(password, user.password);
  if (!auth) {
    throw new appError(400, "帳號或密碼錯誤，請重新輸入！", next);
  }
  const token = generateToken(user.id);

  res.status(200).json({
    status: "success",
    user: {
      name: user.name,
      token,
    },
  });
});

const updatePassword = catchAsync(async (req, res, next) => {
  const { password, confirmPassword } = req.body;

  if (!validator.isLength(password, { min: 8 })) {
    throw new appError("新密碼低於8碼", 400);
  }
  if (password !== confirmPassword) {
    throw new appError("新密碼不一致！", 400);
  }

  const newPassword = await bcrypt.hash(password, 12);
  await User.findByIdAndUpdate(req.user.id, {
    password: newPassword,
  });

  res.status(200).json({
    status: "success",
  });
});

const getProfile = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: "success",
    user: req.user,
  });
});

const updateProfile = catchAsync(async (req, res, next) => {
  const { name } = req.body;
  if (!name) {
    throw new appError("欄位資料填寫不全", 400);
  }

  const user = await User.findByIdAndUpdate(req.user.id, {
    name,
  });
  if (!user) {
    throw new appError("編輯失敗", 400);
  }
  const editUser = await User.findById(req.user.id);
  res.status(200).json({
    status: "success",
    user: editUser.name,
  });
});

module.exports = {
  getOne,
  getAll,
  createOne,
  deleteAll,
  sign_up,
  sign_in,
  updatePassword,
  getProfile,
  updateProfile,
};
