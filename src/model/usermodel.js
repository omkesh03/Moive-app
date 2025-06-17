const db = require("../config/db");

// Register a new user
exports.createUser = (user, callback) => {
    const sql = "INSERT INTO userinfo (user_name, user_password, user_email, user_contact, user_city) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [user.name, user.password, user.email, user.mobile, user.city], callback);
};

// Find user by email (for login)
exports.findByEmail = (email, callback) => {
    const sql = "SELECT * FROM userinfo WHERE user_email = ?";
    db.query(sql, [email], callback);
};

// Update user password
exports.updatePassword = (email, newpassword, callback) => {
    const sql = "UPDATE userinfo SET user_password = ? WHERE user_email = ?";
    db.query(sql, [newpassword, email], callback);
};
