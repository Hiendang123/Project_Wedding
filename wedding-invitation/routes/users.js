const express = require("express");
const usersController = require("../controllers/usersController");

const router = express.Router();

// Route to get all users
router.get("/", usersController.getAllUsers);

// Route to get user details
router.get("/:userId", usersController.getUserDetails);

// Route to add a new user
router.post("/", usersController.addUser);

// Route to login
router.post("/login", usersController.login);

// Route to update user status
router.patch("/:userId/status", usersController.updateUserStatus);

// Route to update user information
router.patch("/:userId", usersController.updateUser);

module.exports = router;