const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware kiểm tra xác thực
exports.isAuthenticated = async (req, res, next) => {
  try {
    // Lấy token từ header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Không tìm thấy token xác thực' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Tìm user trong database
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Người dùng không tồn tại' });
    }

    // Thêm user vào request
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ message: 'Token không hợp lệ' });
  }
};

// Middleware kiểm tra quyền admin
exports.isAdmin = async (req, res, next) => {
  try {
    // Lấy token từ header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Không tìm thấy token xác thực' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Tìm user trong database
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Người dùng không tồn tại' });
    }

    // Kiểm tra quyền admin
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Bạn không có quyền truy cập' });
    }

    // Thêm user vào request
    req.user = user;
    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    return res.status(401).json({ message: 'Token không hợp lệ' });
  }
}; 