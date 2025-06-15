const express = require("express");
const authController = require("../controllers/authController");
const usersController = require("../controllers/usersController");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { isAuthenticated } = require("../middleware/auth");

const router = express.Router();

// Đăng nhập
router.post("/login", authController.login);

// Đăng xuất
router.post("/logout", authController.logout);

// Lấy thông tin user hiện tại
router.get("/me", isAuthenticated, async (req, res) => {
  try {
    res.status(200).json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({ message: "Lỗi khi lấy thông tin người dùng" });
  }
});

// Đăng ký tài khoản
router.post("/register", usersController.addUser);

module.exports = router; 