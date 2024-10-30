const requireHttps = (req, res, next) => {
  // 배포 환경에서만 HTTPS 강제
  if (process.env.NODE_ENV === "production" && !req.secure) {
    return res.status(403).json({ message: "HTTPS 요청만 허용됩니다." });
  }
  next();
};

module.exports = requireHttps;
