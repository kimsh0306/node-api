const express = require("express");
const router = express.Router();
const {
  getAllMovies,
  createMovie,
  updateMovie,
  deleteMovie
} = require("../controllers/movieController");
const { protect } = require("../middleware/authMiddleware");

router.route("/movies")
.get(protect, getAllMovies)
.post(protect, createMovie);

router.route("/movies/:movie_id")
.put(protect, updateMovie)
.delete(protect, deleteMovie);

module.exports = router;