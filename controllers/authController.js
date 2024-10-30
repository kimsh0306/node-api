const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const asyncHandler = require("express-async-handler");
const User = require("../models/UserModel");

// 로그인 세션 유지 시간
const maxAge = 60 * 60 * 1000;

// JWT 토큰 생성 함수
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// @desc Join
// @route POST /auth/join
const join = asyncHandler(async (req, res) => {
  const { user_id, password, name, email } = req.body;

  if (!user_id || !password || !name || !email) {
    return res.status(400).json("필수 값이 입력되지 않았습니다.");
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

  const token = generateToken(user._id);

  res.cookie("moview_token", token, {
    httpOnly: true,  // XSS 공격 방지 (쿠키에 대한 JavaScript 접근을 제한)
    secure: process.env.NODE_ENV === "production" ? true : false,
    domain: process.env.NODE_ENV === "production" ? ".project-moview.vercel.app" : "localhost",
    sameSite: "Lax", // 또는 "None" (필요한 경우)
    path: '/',
    maxAge: maxAge
  });

  // 만료 시간 계산 (현재 시간 + maxAge)
  const expirationTime = Date.now() + maxAge;

  if (user) {
    res.status(201).json({
      user_id: user.user_id,
      name: user.name,
      exp: expirationTime,
    });
  } else {
    console.error(error);
    // 오류 발생 시 회원 정보 삭제
    await User.deleteOne({ user_id });
    res.status(400).json({ message: '회원가입에 실패했습니다.' });
  }
});

// @desc Login
// @route POST /auth/login
const login = asyncHandler(async (req, res) => {
  const { user_id, password } = req.body;

  if (!user_id || !password) {
    return res.status(400).json("필수 값이 입력되지 않았습니다.");
  };

  const user = await User.findOne({ user_id });
  if (user && (await bcrypt.compare(password, user.password))) {

    const token = generateToken(user._id);

    res.cookie("moview_token", token, {
      httpOnly: true,  // XSS 공격 방지
      secure: process.env.NODE_ENV === "production" ? true : false,
      // domain: process.env.NODE_ENV === "production" ? ".project-moview.vercel.app" : "localhost",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      path: '/',
      maxAge: maxAge,  // 쿠키 유효 시간 (1시간)
    });

    // 만료 시간 계산 (현재 시간 + maxAge)
    const expirationTime = Date.now() + maxAge;

    res.json({
      user_id: user.user_id,
      name: user.name,
      my_lists: user.my_lists,
      exp: expirationTime,
    });
  } else {
    res.status(401).json({ message: '아이디 또는 비밀번호가 일치하지 않습니다.' });
  }
});

// @desc Logout
// @route POST /auth/logout
const logout = asyncHandler(async (req, res) => {
  // 쿠키 제거
  res.clearCookie("moview_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
    domain: process.env.NODE_ENV === "production" ? ".project-moview.vercel.app" : "localhost",
    sameSite: "Lax",
    path: '/'
  });

  res.status(200).json({ message: "로그아웃되었습니다." });
});

// @desc Extend session
// @route POST /auth/extend_session
const extendSession = asyncHandler(async (req, res) => {
  // 보호된 라우트이므로 미들웨어에서 사용자 인증이 이미 처리됨
  const user = req.user;

  if (user) {
    // 새로운 JWT 토큰 생성
    const token = generateToken(user._id);

    // 쿠키에 새 토큰 설정
    res.cookie('moview_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      domain: process.env.NODE_ENV === "production" ? ".project-moview.vercel.app" : "localhost",
      sameSite: "Lax",
      path: '/',
      maxAge: maxAge
    });

    // 새로운 만료 시간 계산
    const expirationTime = Date.now() + maxAge;

    // 새로운 만료 시간 반환
    res.status(200).json({ exp: expirationTime });
  } else {
    res.status(401).json({ message: '세션 연장에 실패했습니다.' });
  }
});

module.exports = {
  join,
  login,
  logout,
  extendSession
};