const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movie.controller");
const authMiddleware = require("../middleware/authmiddleware");

router.get("/api/movies", authMiddleware, movieController.getAllMovies);

module.exports = router;
