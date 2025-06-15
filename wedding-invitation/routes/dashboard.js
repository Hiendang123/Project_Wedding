const express = require("express");
const dashboardController = require("../controllers/dashboardController");
const { isAdmin } = require("../middleware/auth");

const router = express.Router();

// Route lấy thống kê tổng quan
router.get("/stats", isAdmin, dashboardController.getDashboardStats);

module.exports = router; 