const express = require("express");
const dbConnect = require("./config/dbConnect");
const cors = require('cors');
const cookieParser = require('cookie-parser');
const requireHttps = require('./middleware/requireHttps');
const app = express();

dbConnect();

// 공통 바디 파서 미들웨어 설정
app.use(express.json()); // 바디파서
app.use(express.urlencoded({ extended: true })); // 바디파서
app.use(cookieParser()); // 쿠키 파싱

// 기본 CORS 설정
app.use(cors({
  origin: ['http://localhost:3000', 'https://project-moview.vercel.app'], // 허용할 도메인
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // 허용할 HTTP 메서드
  credentials: true, // 쿠키 전송 허용
}));

// HTTPS 필수 미들웨어 (배포 환경에서만 적용)
if (process.env.NODE_ENV === "production") {
  app.use(requireHttps);
}

app.get("/", (req, res) => {
  res.send("Hello, Node!");
});

app.use("/auth", require("./routes/authRoutes.js"));
app.use("/users", require("./routes/userRoutes"));
app.use("/my_lists", require("./routes/movieRoutes"));

app.listen(5000, () => {
  console.log("서버 실행 중");
});

module.exports = app;