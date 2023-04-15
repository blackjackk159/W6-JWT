const Post = require("../models/posts");
const appError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const getOne = catchAsync(async (req, res) => {
  try {
    const posts = await Post.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: posts,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
    });
  }
});

const getAll = catchAsync(async (req, res) => {
  try {
    const posts = await Post.find({})
      .populate({ path: "user", select: "name photo" })
      .sort(req.query.sort);

    res.status(200).json({
      status: "success",
      data: posts,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
    });
  }
});

const createOne = catchAsync(async (req, res) => {
  if (req.body.content == undefined) {
    return next(new appError(400, "Please provide your content."));
  }

  try {
    const postData = await Post.create(req.body);
    res.status(200).json({
      status: "success",
      data: postData,
      message: "新增貼文成功",
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
    await Post.deleteMany({});
    res.status(204).json({});
  } catch (err) {
    res.status(500).json({
      status: "error",
    });
  }
});

module.exports = { getOne, getAll, createOne, deleteAll };
