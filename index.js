const express = require("express");
const dbConnect = require("./config/dbConnect");

const app = express();

dbConnect();

app.get("/", (req, res) => {
  res.send("Hello, Node!");
});

// 미들웨어
app.use(express.json()); // 바디파서
app.use(express.urlencoded({ extended: true })); // 바디파서
app.use("/users", require("./routes/userRoutes"));

// app.listen(5000, () => {
//   console.log("서버 실행 중");
// });

module.exports = app;