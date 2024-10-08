const mongoose = require("mongoose");
//.env 파일에 있는 내용을 가져오기 위해 실행해야 함
require("dotenv").config();

// db 접속
// procss.env ==> .env 파일에 있는 내용을 가져오는 객체
const dbConnect = async () => {
  try {
    // db에 연결하는 부분이 시간이 걸리기 때문에, db 연결 후에 다음 문장을 실행하도록 비동기 처리
    const connect = await mongoose.connect(process.env.DB_CONNECT);
    console.log("DB Connected");
  } catch (err) {
    console.log("DB Connected error: ", err);
  }
}

module.exports = dbConnect;