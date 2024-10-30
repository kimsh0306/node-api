const express = require("express");
const router = express.Router();
const {
  join,
  login,
  logout,
  extendSession
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.route("/join")
  .post(join);

router.route("/login")
  .post(login);

router.route("/logout")
  .post(logout);

router.route("/extend_session")
  .post(protect, extendSession);

module.exports = router;