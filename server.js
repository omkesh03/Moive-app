let express = require("express");
let path = require("path");
let app = express();
const authController = require("./src/controllers/auth");
const movieRoutes = require("./src/routes/movie.routes");
const authApiRoutes = require("./src/routes/authroutes");
const Movie = require("./src/model/moviemodel");

// Set EJS as view engine
app.set("view engine", "ejs");
// Set views directory
app.set("views", path.join(__dirname, "views"));
// Serve static files
app.use("/src/public", express.static(path.join(__dirname, "src/public")));

// Parse form data
app.use(express.urlencoded({ extended: true }));

// Home page route - show all movies
app.get("/", (req, res) => {
    Movie.getAllMovies((err, movies) => {
        res.render("index", { movies: movies || [], error: null, alert: null });
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
app.post("/login", authController.login);

// Dashboard route
app.get("/dashboard", (req, res) => {
    res.render("dashboard", { userName: "User" });
});

// Logout route
app.get("/logout", (req, res) => {
    // Here you would destroy session if implemented
    res.render("logout");
});

// Forget password GET
app.get("/forgetpassword", authController.forgetPasswordPage);

// Forget password POST
app.post("/forgetpassword", authController.forgetPassword);

// Movie detail page (requires login)
app.get("/movie/:id", (req, res) => {
    // Only allow if user is logged in (JWT in localStorage, checked on client)
    Movie.getMovieById(req.params.id, (err, results) => {
        if (err || !results || results.length === 0) {
            return res.status(404).send("Movie not found");
        }
        res.render("moviedetail", { movie: results[0] });
    });
});

app.use(movieRoutes);
app.use(authApiRoutes);

app.listen(3000, () => {
    console.log("server started at http://localhost:3000");
});