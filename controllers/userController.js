const bcrypt = require('bcryptjs');
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

  const userExists = await User.findOne({ user_id });

  if (userExists) {
    return res.status(400).json({ message: '이미 존재하는 사용자입니다.' });
  }

  // 비밀번호 해시
  const salt = await bcrypt.genSalt(10); // salt 생성
  const hashedPassword = await bcrypt.hash(password, salt); // 비밀번호 해시

  const user = await User.create({
    user_id, password: hashedPassword, name, email
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      message: '회원가입이 완료되었습니다.',
    });
  } else {
    res.status(400).json({ message: '회원가입에 실패했습니다.' });
  }
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

// @desc Login
// @route POST /users/login
const login = asyncHandler(async (req, res) => {
  const { user_id, password } = req.body;
  if (!user_id || !password) {
    return res.send("필수 값이 입력되지 않았습니다.");
  };

  const user = await User.findOne({ user_id });

  if (user && (await bcrypt.compare(password, user.password))) {
    // 패스워드 일치 시 성공 응답
    res.json({
      _id: user._id,
      user_id: user.user_id,
      // 추후에 JWT 토큰 등을 추가
    });
  } else {
    res.status(401).json({ message: '아이디 또는 비밀번호가 일치하지 않습니다.' });
  }
});

module.exports = {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  login
};