const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  login
} = require("../controllers/userController");

router.route("/")
  .get(getAllUsers)
  .post(createUser);

router.route("/:id")
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

router.route("/login")
  .post(login);

module.exports = router;