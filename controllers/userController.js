// asyncHandler로 try catch 사용하지 않고 에러 체크
const asyncHandler = require("express-async-handler");
const User = require("../models/UserModel");

// @desc Get all users
// @route GET /users
const getAllUsers = asyncHandler(async (req, res) => {
  const userList = await User.find();
  res.send(userList);
});

// @desc Create user
// @route POST /users
const createUser = asyncHandler(async (req, res) => {
  const { user_id, password, name, email } = req.body;
  if (!user_id || !password || !name || !email) {
    return res.send("필수 값이 입력되지 않았습니다.");
  };

  const user = await User.create({
    user_id, password, name, email
  });
  res.send("Create user");
});

// @desc Get user
// @route GET /users/:id
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  res.send(user);
});

// @desc Update user
// @route PUT /users/:id
const updateUser = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { user_id, password, name, email } = req.body
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new Error("User not found.");
  }

  user.user_id = user_id;
  user.password = password;
  user.name = name;
  user.email = email;

  user.save();

  res.json(user);
});

// @desc Delete user
// @route DELETE /users/:id
const deleteUser = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const user = await User.findById(req.params.id);
  if (!user) {
    throw new Error("User not found.");
  }

  await User.deleteOne();
  res.send("Deleted");
});

module.exports = {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser
};