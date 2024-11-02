const express = require("express");
const router = express.Router();
const {
  join,
  login,
  logout,
  extendSession,
  deleteAccount
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

router.route("/delete_account")
  .delete(protect, deleteAccount);

module.exports = router;