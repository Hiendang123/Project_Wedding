const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Đăng nhập
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email });

    // Kiểm tra email và password
    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({
        message: "Vui lòng nhập email và mật khẩu",
      });
    }

    // Tìm user theo email
    const user = await User.findOne({ email });
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      console.log('User not found');
      return res.status(401).json({
        message: "Email hoặc mật khẩu không đúng",
      });
    }

    // Kiểm tra mật khẩu
    console.log('Password:', password);
    console.log('User password:', user.password);
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch ? 'Yes' : 'No');
    
    if (!isMatch) {
      console.log('Password does not match');
      return res.status(401).json({
        message: "Email hoặc mật khẩu không đúng",
      });
    }

    // Tạo token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    console.log('Token generated successfully');

    // Trả về thông tin user và token
    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Lỗi khi đăng nhập",
      error: error.message,
    });
  }
};

// Đăng xuất
exports.logout = async (req, res) => {
  try {
    // Trong trường hợp này, client sẽ tự xóa token
    res.status(200).json({
      message: "Đăng xuất thành công",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      message: "Lỗi khi đăng xuất",
      error: error.message,
    });
  }
}; 