const express = require("express");
const dbConnect = require("./config/dbConnect");
const cors = require('cors');
const app = express();

dbConnect();

// CORS 설정
app.use(cors({
  origin: 'http://localhost:3000', // 허용할 도메인
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // 허용할 HTTP 메서드
  credentials: true, // 쿠키 전송 허용
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, Node!");
});

// 미들웨어
app.use(express.json()); // 바디파서
app.use(express.urlencoded({ extended: true })); // 바디파서
app.use("/users", require("./routes/userRoutes"));

app.listen(5000, () => {
  console.log("서버 실행 중");
});

module.exports = app;