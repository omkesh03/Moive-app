const express = require("express");
const router = express.Router();
const adminController = require("./adminController");

router.get("/admin/login", adminController.adminLoginPage);
router.post("/admin/login", adminController.adminLogin);
router.get("/admin/logout", adminController.adminLogout);
router.get("/admin/users", adminController.viewAllUsers);
router.post("/admin/users/delete/:id", adminController.deleteUser);
router.get("/admin/movieinfo", adminController.viewAllMovies);
router.get("/admin/movieinfo/add", adminController.addMoviePage);
router.post("/admin/movieinfo/add", adminController.addMovie);
router.get("/admin/movieinfo/edit/:id", adminController.editMoviePage);
router.post("/admin/movieinfo/edit/:id", adminController.editMovie);
router.post("/admin/movieinfo/delete/:id", adminController.deleteMovie);

module.exports = router;
