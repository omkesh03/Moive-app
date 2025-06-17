const User = require("../model/usermodel");
const jwt = require("jsonwebtoken");
const SECRET = "your_jwt_secret"; // Use env in production

// Handle registration POST
exports.register = (req, res) => {
    const { name, email, mobile, password } = req.body;
    // Check if user already exists
    User.findByEmail(email, (err, results) => {
        if (err) {
            // Registration failed, show popup
            return res.render("register", { error: null, alert: "Database error. Please try again." });
        }
        if (results.length > 0) {
            // Email already registered, show popup
            return res.render("register", { error: null, alert: "Email already registered" });
        }
        // Create user
        User.createUser({ name, email, mobile, password }, (err2) => {
            if (err2) {
                // Registration failed, show popup
                return res.render("register", { error: null, alert: "Registration failed. Please try again." });
            }
            // Registration successful, redirect to login with popup
            res.render("index", { error: null, alert: "Registration successful! Please login." });
        });
    });
};

// Handle login POST
exports.login = (req, res) => {
    const { email, password } = req.body;
    User.findByEmail(email, (err, results) => {
        if (err || results.length === 0) {
            // User not registered, show popup
            return res.render("index", { error: null, alert: "User not registered. Please register first." });
        }
        const user = results[0];
        if (user.user_password !== password) {
            // Invalid password, show popup
            return res.render("index", { error: null, alert: "Invalid email or password." });
        }
        // On success, render dashboard with user name
        res.render("dashboard", { userName: user.user_name });
    });
};

// API login for JWT
exports.apiLogin = (req, res) => {
    const { email, password } = req.body;
    User.findByEmail(email, (err, results) => {
        if (err || results.length === 0) {
            return res.status(401).json({ error: "User not registered" });
        }
        const user = results[0];
        // In production, use bcrypt.compare
        if (user.user_password !== password) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        const token = jwt.sign({ userId: user.user_id, userName: user.user_name }, SECRET, { expiresIn: "1h" });
        res.json({ token });
    });
};

// Show forget password page
exports.forgetPasswordPage = (req, res) => {
    res.render("forgetpassword", { alert: null });
};

// Handle forget password POST
exports.forgetPassword = (req, res) => {
    const { email, newpassword } = req.body;
    User.findByEmail(email, (err, results) => {
        if (err) {
            return res.render("forgetpassword", { alert: "Database error. Please try again." });
        }
        if (results.length === 0) {
            return res.render("forgetpassword", { alert: "Email not registered." });
        }
        User.updatePassword(email, newpassword, (err2) => {
            if (err2) {
                return res.render("forgetpassword", { alert: "Failed to update password. Try again." });
            }
            // Password updated, redirect to login with popup
            res.render("index", { error: null, alert: "Password changed successfully! Please login." });
        });
    });
};
