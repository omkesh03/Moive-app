const db = require("../config/db");

exports.getAllMovies = (callback) => {
    db.query("SELECT * FROM movieinfo", callback);
};

exports.getMovieById = (id, callback) => {
    db.query("SELECT * FROM movieinfo WHERE m_id = ?", [id], callback);
};

exports.searchMovies = (query, callback) => {
    const sql = `
        SELECT * FROM movieinfo
        WHERE movie_title LIKE ? OR movie_category LIKE ? OR movie_language LIKE ? OR movie_actor_1 LIKE ? OR movie_actor_2 LIKE ? OR movie_actor_3 LIKE ? OR movie_type LIKE ? OR movie_country LIKE ?
    `;
    const likeQuery = `%${query}%`;
    db.query(sql, [likeQuery, likeQuery, likeQuery, likeQuery, likeQuery, likeQuery, likeQuery, likeQuery], callback);
};
