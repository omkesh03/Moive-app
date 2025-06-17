const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");

// Parse JSON for API login
router.post("/api/login", express.json(), authController.apiLogin);

module.exports = router;
