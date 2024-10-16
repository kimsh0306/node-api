const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  login,
  getAllMovies,
  createMovie,
  updateMovie,
  deleteMovie
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

  router.route("/:id/my_movies")
  .get(getAllMovies)
  .post(createMovie);

router.route("/:id/my_movies/:movie_id")
  .put(updateMovie)
  .delete(deleteMovie);

module.exports = router;