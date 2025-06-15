const User = require("../models/User");
const Template = require("../models/Template");
const WeddingInvitation = require("../models/WeddingInvitation");
const mongoose = require("mongoose");

// Lấy thống kê tổng quan
exports.getDashboardStats = async (req, res) => {
  try {
    // Tổng doanh thu - tính từ các thiệp cưới đã thanh toán và template có phí
    const totalRevenue = await WeddingInvitation.aggregate([
      {
        $match: {
          status: "published" // Chỉ tính các thiệp đã xuất bản
        }
      },
      {
        $lookup: {
          from: "templates",
          localField: "template",
          foreignField: "_id",
          as: "templateInfo"
        }
      },
      {
        $unwind: "$templateInfo"
      },
      {
        $match: {
          "templateInfo.price": "paid" // Chỉ tính các template có phí
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$templateInfo.priceAmount" }
        }
      }
    ]);

    // Tổng số người dùng
    const totalUsers = await User.countDocuments();

    // Tổng số template
    const totalTemplates = await Template.countDocuments();

    // Tổng số thiệp cưới
    const totalInvitations = await WeddingInvitation.countDocuments();

    // Thống kê doanh thu theo tháng
    const monthlyRevenue = await WeddingInvitation.aggregate([
      {
        $match: {
          status: "published",
          createdAt: {
            $gte: new Date(new Date().getFullYear(), 0, 1) // Từ đầu năm
          }
        }
      },
      {
        $lookup: {
          from: "templates",
          localField: "template",
          foreignField: "_id",
          as: "templateInfo"
        }
      },
      {
        $unwind: "$templateInfo"
      },
      {
        $match: {
          "templateInfo.price": "paid"
        }
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: "$templateInfo.priceAmount" }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Thống kê doanh thu theo ngày (7 ngày gần nhất)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailyRevenue = await WeddingInvitation.aggregate([
      {
        $match: {
          status: "published",
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $lookup: {
          from: "templates",
          localField: "template",
          foreignField: "_id",
          as: "templateInfo"
        }
      },
      {
        $unwind: "$templateInfo"
      },
      {
        $match: {
          "templateInfo.price": "paid"
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$templateInfo.priceAmount" }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.status(200).json({
      totalRevenue: totalRevenue[0]?.total || 0,
      totalUsers,
      totalTemplates,
      totalInvitations,
      monthlyRevenue: monthlyRevenue.map(item => ({
        month: item._id,
        revenue: item.revenue
      })),
      dailyRevenue: dailyRevenue.map(item => ({
        date: item._id,
        revenue: item.revenue
      }))
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({
      message: "Lỗi khi lấy thống kê",
      error: error.message
    });
  }
}; 