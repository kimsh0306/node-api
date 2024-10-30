// asyncHandler로 try catch 사용하지 않고 에러 체크
const asyncHandler = require("express-async-handler");
const User = require("../models/UserModel");

// @desc Get all my movies
// @route GET /my_lists
const getAllMovies = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
  }

  // 사용자의 my_lists.movies 배열을 반환
  res.json(user.my_lists.movies);
});

// @desc Create my movie
// @route POST /my_lists/movies
const createMovie = asyncHandler(async (req, res) => {
  const { id, title, poster_path, adult, vote_average, genre_ids } = req.body;
  const user = req.user;

  if (!user) {
    return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
  }

  const movieExists = user.my_lists.movies.find(movie => movie.id === id);

  if (movieExists) {
    return res.status(400).json({ message: '이미 즐겨찾기에 등록된 영화입니다.' });
  }

  // 새로운 영화 추가
  const newMovie = { id, title, poster_path, adult, vote_average, genre_ids };
  user.my_lists.movies.push(newMovie);
  await user.save();

  res.status(201).json({ message: '영화가 성공적으로 추가되었습니다.', movie: newMovie });
});

// @desc Update my movie
// @route PUT /my_lists/movies/:movie_id
const updateMovie = asyncHandler(async (req, res) => {
  const { movie_id } = req.params;
  const { title, poster_path, adult, vote_average, genre_ids } = req.body;
  const user = req.user;

  if (!user) {
    return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
  }

  const movie = user.my_lists.movies.find(movie => movie.id === parseInt(movie_id));

  if (!movie) {
    return res.status(404).json({ message: '해당 영화를 찾을 수 없습니다.' });
  }

  // 영화 정보 업데이트
  movie.title = title || movie.title;
  movie.poster_path = poster_path || movie.poster_path;
  movie.adult = adult !== undefined ? adult : movie.adult;
  movie.vote_average = vote_average || movie.vote_average;
  movie.genre_ids = genre_ids || movie.genre_ids;

  await user.save();

  res.json({ message: '영화 정보가 성공적으로 업데이트되었습니다.', movie });
});

// @desc Delete my movie
// @route DELETE /my_lists/movies/:movie_id
const deleteMovie = asyncHandler(async (req, res) => {
  const user = req.user;
  const { movie_id } = req.params;

  if (!user) {
    return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
  }

  const movieIndex = user.my_lists.movies.findIndex(movie => movie.id === parseInt(movie_id));

  if (movieIndex === -1) {
    return res.status(404).json({ message: '해당 영화를 찾을 수 없습니다.' });
  }

  // 해당 영화 삭제
  user.my_lists.movies.splice(movieIndex, 1);
  await user.save();

  res.json({ message: '영화가 성공적으로 삭제되었습니다.' });
});

module.exports = {
  getAllMovies,
  createMovie,
  updateMovie,
  deleteMovie,
};