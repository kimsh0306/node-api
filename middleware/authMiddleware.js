const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

const protect = async (req, res, next) => {
  console.log("authMiddleware")
  const token = req.cookies ? req.cookies.moview_token : null;

  if (!token) {
    console.log("인증 실패: 토큰이 없습니다.")
    return res.status(401).json({ message: "인증 실패: 토큰이 없습니다." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    console.log("인증 실패: 유효하지 않은 토큰입니다.")
    return res.status(401).json({ message: "인증 실패: 유효하지 않은 토큰입니다." });
  }
};

module.exports = { protect };
