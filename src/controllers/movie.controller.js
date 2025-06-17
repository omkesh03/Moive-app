const Movie = require("../model/moviemodel");

exports.getAllMovies = (req, res) => {
    Movie.getAllMovies((err, results) => {
        if (err) {
            console.error("Error fetching movies:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
};
