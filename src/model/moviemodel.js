const db = require("../config/db");

exports.getAllMovies = (callback) => {
    db.query("SELECT * FROM movieinfo", callback);
};

exports.getMovieById = (id, callback) => {
    db.query("SELECT * FROM movieinfo WHERE m_id = ?", [id], callback);
};
