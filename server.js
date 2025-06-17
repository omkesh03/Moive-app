let express = require("express");
let path = require("path");
let session = require("express-session");
let app = express();
const authController = require("./src/controllers/auth");
const movieRoutes = require("./src/routes/movie.routes");
const authApiRoutes = require("./src/routes/authroutes");
const Movie = require("./src/model/moviemodel");
const db = require("./src/config/db");
const adminRoutes = require("./admin/adminRoutes");

// Set EJS as view engine
app.set("view engine", "ejs");
// Set views directory
app.set("views", path.join(__dirname, "views"));
// Serve static files
app.use("/src/public", express.static(path.join(__dirname, "src/public")));

// Parse form data
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: "movieappsecret",
    resave: false,
    saveUninitialized: true
}));

// Home page route - public, non-logged-in users
app.get("/", (req, res) => {
    if (req.session && req.session.userName) {
        return res.redirect("/home");
    }
    Movie.getAllMovies((err, movies) => {
        res.render("index", { movies: movies || [] });
    });
});

// Home page for logged-in users
app.get("/home", (req, res) => {
    if (!req.session || !req.session.userName) {
        return res.redirect("/");
    }
    Movie.getAllMovies((err, movies) => {
        res.render("home", { userName: req.session.userName, movies: movies || [] });
    });
});

// Register page route
app.get("/register", (req, res) => {
    res.render("register", { error: null });
});

// Register POST
app.post("/register", authController.register);

// Login page route
app.get("/login", (req, res) => {
    res.render("login");
});

// Login POST
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    const User = require("./src/model/usermodel");
    User.findByEmail(email, (err, results) => {
        if (err || results.length === 0) {
            return res.render("login", { alert: "User not registered or error occurred." });
        }
        const user = results[0];
        if (user.user_password !== password) {
            return res.render("login", { alert: "Invalid email or password." });
        }
        // Set session and redirect to /home
        req.session.userName = user.user_name;
        res.redirect("/home");
    });
});

// Dashboard route (optional, can be removed if using /home)
app.get("/dashboard", (req, res) => {
    if (!req.session || !req.session.userName) {
        return res.redirect("/");
    }
    Movie.getAllMovies((err, movies) => {
        res.render("dashboard", { userName: req.session.userName, movies: movies || [] });
    });
});

// Logout route
app.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.render("logout");
    });
});

// Forget password GET
app.get("/forgetpassword", authController.forgetPasswordPage);

// Forget password POST
app.post("/forgetpassword", authController.forgetPassword);

// Movie detail page (requires login)
app.get("/movie/:id", (req, res) => {
    if (!req.session || !req.session.userName) {
        return res.status(403).send("<script>alert('Please login to view movie details.');window.location='/login';</script>");
    }
    Movie.getMovieById(req.params.id, (err, results) => {
        if (err || !results || results.length === 0) {
            return res.status(404).send("Movie not found");
        }
        res.render("moviedetail", { movie: results[0] });
    });
});

// Show rate page
app.get("/movie/:id/rate", (req, res) => {
    if (!req.session || !req.session.userName) {
        return res.status(403).send("<script>alert('Please login to rate movies.');window.location='/login';</script>");
    }
    Movie.getMovieById(req.params.id, (err, results) => {
        if (err || !results || results.length === 0) {
            return res.status(404).send("Movie not found");
        }
        res.render("rate", { movie: results[0], alert: null });
    });
});

// Handle rate POST
app.post("/movie/:id/rate", (req, res) => {
    if (!req.session || !req.session.userName) {
        return res.status(403).send("<script>alert('Please login to rate movies.');window.location='/login';</script>");
    }
    const { rating, review } = req.body;
    const movieId = req.params.id;
    // Find user_id by userName
    db.query("SELECT user_id FROM userinfo WHERE user_name = ?", [req.session.userName], (err, userRows) => {
        if (err || !userRows || userRows.length === 0) {
            return res.render("rate", { movie: { m_id: movieId }, alert: "User not found." });
        }
        const userId = userRows[0].user_id;
        // Insert or update rating
        db.query(
            "INSERT INTO rating_table (user_id, m_id, rating, review) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE rating=?, review=?",
            [userId, movieId, rating, review, rating, review],
            (err2) => {
                if (err2) {
                    return res.render("rate", { movie: { m_id: movieId }, alert: "Failed to submit rating. Try again." });
                }
                // Success: redirect to movie detail with alert
                Movie.getMovieById(movieId, (err3, results) => {
                    if (err3 || !results || results.length === 0) {
                        return res.status(404).send("Movie not found");
                    }
                    res.render("moviedetail", { movie: results[0], alert: "Rating submitted successfully!" });
                });
            }
        );
    });
});

// Add to watchlist POST
app.post("/movie/:id/watchlist", (req, res) => {
    if (!req.session || !req.session.userName) {
        return res.status(403).send("<script>alert('Please login to add to watchlist.');window.location='/login';</script>");
    }
    const movieId = req.params.id;
    // Find user_id by userName
    db.query("SELECT user_id FROM userinfo WHERE user_name = ?", [req.session.userName], (err, userRows) => {
        if (err || !userRows || userRows.length === 0) {
            return res.render("moviedetail", { movie: { m_id: movieId }, alert: "User not found." });
        }
        const userId = userRows[0].user_id;
        // Check if already in watchlist
        db.query(
            "SELECT * FROM watchlist_table WHERE user_id = ? AND m_id = ?",
            [userId, movieId],
            (err2, rows) => {
                if (err2) {
                    return res.render("moviedetail", { movie: { m_id: movieId }, alert: "Database error. Try again." });
                }
                if (rows && rows.length > 0) {
                    // Already in watchlist
                    Movie.getMovieById(movieId, (err3, results) => {
                        if (err3 || !results || results.length === 0) {
                            return res.status(404).send("Movie not found");
                        }
                        res.render("moviedetail", { movie: results[0], alert: "Movie already in your watchlist." });
                    });
                } else {
                    // Insert into watchlist
                    db.query(
                        "INSERT INTO watchlist_table (user_id, m_id) VALUES (?, ?)",
                        [userId, movieId],
                        (err4) => {
                            if (err4) {
                                return res.render("moviedetail", { movie: { m_id: movieId }, alert: "Failed to add to watchlist. Try again." });
                            }
                            Movie.getMovieById(movieId, (err5, results) => {
                                if (err5 || !results || results.length === 0) {
                                    return res.status(404).send("Movie not found");
                                }
                                res.render("moviedetail", { movie: results[0], alert: "Movie added to your watchlist!" });
                            });
                        }
                    );
                }
            }
        );
    });
});

// Watchlist page (shows movies in user's watchlist)
app.get("/watchlist", (req, res) => {
    if (!req.session || !req.session.userName) {
        return res.status(403).send("<script>alert('Please login to view your watchlist.');window.location='/login';</script>");
    }
    // Get user_id
    db.query("SELECT user_id FROM userinfo WHERE user_name = ?", [req.session.userName], (err, userRows) => {
        if (err || !userRows || userRows.length === 0) {
            return res.render("watchlist", { userName: req.session.userName, movies: [], alert: "User not found." });
        }
        const userId = userRows[0].user_id;
        // Get movies in watchlist, include movie_image
        db.query(
            `SELECT m.movie_title, m.m_id, m.movie_image
             FROM watchlist_table w
             JOIN movieinfo m ON w.m_id = m.m_id
             WHERE w.user_id = ?`,
            [userId],
            (err2, movies) => {
                if (err2) {
                    return res.render("watchlist", { userName: req.session.userName, movies: [], alert: "Database error." });
                }
                res.render("watchlist", { userName: req.session.userName, movies: movies || [], alert: null });
            }
        );
    });
});

// Search movies (shared for both logged-in and non-logged-in users)
app.get("/search", (req, res) => {
    const query = req.query.q ? req.query.q.trim() : "";
    if (!query) {
        // If no query, redirect to appropriate page
        if (req.session && req.session.userName) {
            return res.redirect("/home");
        } else {
            return res.redirect("/");
        }
    }
    Movie.searchMovies(query, (err, movies) => {
        if (req.session && req.session.userName) {
            res.render("home", { userName: req.session.userName, movies: movies || [], search: query });
        } else {
            res.render("index", { movies: movies || [], search: query });
        }
    });
});

app.use(movieRoutes);
app.use(authApiRoutes);
app.use(adminRoutes);

app.listen(3000, () => {
    console.log("server started at http://localhost:3000");
});