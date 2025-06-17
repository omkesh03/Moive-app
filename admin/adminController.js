const db = require("../src/config/db");

exports.adminLoginPage = (req, res) => {
    res.render("admin/adminlogin", { alert: null });
};

exports.adminLogin = (req, res) => {
    const { adminname, adminpassword } = req.body;
    db.query(
        "SELECT * FROM admininfo WHERE adminname = ? AND adminpassword = ?",
        [adminname, adminpassword],
        (err, results) => {
            if (err || results.length === 0) {
                return res.render("admin/adminlogin", { alert: "Invalid admin credentials." });
            }
            const admin = results[0];
            if (admin.superadmin && admin.superadmin.toLowerCase() === "yes") {
                req.session.isAdmin = true;
                req.session.adminName = admin.adminname;
                res.redirect("/admin/users");
            } else {
                res.redirect("/home");
            }
        }
    );
};

exports.adminLogout = (req, res) => {
    req.session.destroy(() => {
        res.redirect("/admin/login");
    });
};

exports.viewAllUsers = (req, res) => {
    if (!req.session || !req.session.isAdmin) {
        return res.redirect("/admin/login");
    }
    db.query("SELECT user_id, user_name, user_email, user_contact, user_city FROM userinfo", (err, users) => {
        const deleteAlert = req.session.deleteAlert;
        req.session.deleteAlert = null;
        if (err) {
            return res.render("admin/users", { users: [], adminName: req.session.adminName, alert: "Database error.", deleteAlert });
        }
        res.render("admin/users", { users, adminName: req.session.adminName, alert: null, deleteAlert });
    });
};

exports.deleteUser = (req, res) => {
    if (!req.session || !req.session.isAdmin) {
        return res.redirect("/admin/login");
    }
    const userId = req.params.id;
    const db = require("../src/config/db");
    db.query("DELETE FROM userinfo WHERE user_id = ?", [userId], (err) => {
        if (err) {
            req.session.deleteAlert = "Failed to delete user.";
        } else {
            req.session.deleteAlert = "User deleted successfully.";
        }
        res.redirect("/admin/users");
    });
};

exports.viewAllMovies = (req, res) => {
    if (!req.session || !req.session.isAdmin) {
        return res.redirect("/admin/login");
    }
    const db = require("../src/config/db");
    db.query("SELECT * FROM movieinfo", (err, movies) => {
        const movieAlert = req.session.movieAlert;
        req.session.movieAlert = null;
        res.render("admin/movieinfo", { movies: movies || [], adminName: req.session.adminName, movieAlert });
    });
};

exports.addMoviePage = (req, res) => {
    if (!req.session || !req.session.isAdmin) {
        return res.redirect("/admin/login");
    }
    res.render("admin/addmovie", { adminName: req.session.adminName, alert: null });
};

exports.addMovie = (req, res) => {
    if (!req.session || !req.session.isAdmin) {
        return res.redirect("/admin/login");
    }
    const db = require("../src/config/db");
    const {
        movie_title, movie_mapping_name, movie_desc, movie_category, movie_director_name,
        movie_actor_1, movie_actor_2, movie_actor_3, movie_language, movie_type,
        movie_trailer_link, movie_watch_link, movie_budget, movie_release_date,
        movie_country, movie_image
    } = req.body;
    db.query(
        `INSERT INTO movieinfo (
            movie_title, movie_mapping_name, movie_desc, movie_category, movie_director_name,
            movie_actor_1, movie_actor_2, movie_actor_3, movie_language, movie_type,
            movie_trailer_link, movie_watch_link, movie_budget, movie_release_date,
            movie_country, movie_image
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            movie_title, movie_mapping_name, movie_desc, movie_category, movie_director_name,
            movie_actor_1, movie_actor_2, movie_actor_3, movie_language, movie_type,
            movie_trailer_link, movie_watch_link, movie_budget, movie_release_date,
            movie_country, movie_image
        ],
        (err) => {
            req.session.movieAlert = err ? "Failed to add movie." : "Movie added successfully.";
            res.redirect("/admin/movieinfo");
        }
    );
};

exports.editMoviePage = (req, res) => {
    if (!req.session || !req.session.isAdmin) {
        return res.redirect("/admin/login");
    }
    const db = require("../src/config/db");
    db.query("SELECT * FROM movieinfo WHERE m_id = ?", [req.params.id], (err, results) => {
        if (err || !results || results.length === 0) {
            return res.redirect("/admin/movieinfo");
        }
        res.render("admin/editmovie", { movie: results[0], adminName: req.session.adminName, alert: null });
    });
};

exports.editMovie = (req, res) => {
    if (!req.session || !req.session.isAdmin) {
        return res.redirect("/admin/login");
    }
    const db = require("../src/config/db");
    const {
        movie_title, movie_mapping_name, movie_desc, movie_category, movie_director_name,
        movie_actor_1, movie_actor_2, movie_actor_3, movie_language, movie_type,
        movie_trailer_link, movie_watch_link, movie_budget, movie_release_date,
        movie_country, movie_image
    } = req.body;
    db.query(
        `UPDATE movieinfo SET
            movie_title=?, movie_mapping_name=?, movie_desc=?, movie_category=?, movie_director_name=?,
            movie_actor_1=?, movie_actor_2=?, movie_actor_3=?, movie_language=?, movie_type=?,
            movie_trailer_link=?, movie_watch_link=?, movie_budget=?, movie_release_date=?,
            movie_country=?, movie_image=?
        WHERE m_id=?`,
        [
            movie_title, movie_mapping_name, movie_desc, movie_category, movie_director_name,
            movie_actor_1, movie_actor_2, movie_actor_3, movie_language, movie_type,
            movie_trailer_link, movie_watch_link, movie_budget, movie_release_date,
            movie_country, movie_image, req.params.id
        ],
        (err) => {
            req.session.movieAlert = err ? "Failed to update movie." : "Movie updated successfully.";
            res.redirect("/admin/movieinfo");
        }
    );
};

exports.deleteMovie = (req, res) => {
    if (!req.session || !req.session.isAdmin) {
        return res.redirect("/admin/login");
    }
    const db = require("../src/config/db");
    db.query("DELETE FROM movieinfo WHERE m_id = ?", [req.params.id], (err) => {
        req.session.movieAlert = err ? "Failed to delete movie." : "Movie deleted successfully.";
        res.redirect("/admin/movieinfo");
    });
};
