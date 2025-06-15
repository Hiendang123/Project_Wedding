const User = require("../models/User");
const bcrypt = require("bcryptjs");
const WeddingInvitation = require("../models/WeddingInvitation");

// Controller to get all users
exports.getAllUsers = async (req, res) => {
  try {
    console.log("Fetching all users...");
    const users = await User.find()
      .select('-password')
      .sort({ registeredAt: -1 });

    // Get wedding invitation counts for each user
    const usersWithInvitationCount = await Promise.all(
      users.map(async (user) => {
        const invitationCount = await WeddingInvitation.countDocuments({ user: user._id });
        const userObj = user.toObject();
        return {
          ...userObj,
          weddingInvitationCount: invitationCount
        };
      })
    );

    console.log(`Found ${users.length} users`);
    res.status(200).json(usersWithInvitationCount);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ 
      message: "Error fetching users",
      error: error.message 
    });
  }
};

// Controller to authenticate user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      message: "Login successful",
      user: userResponse
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      message: "Error during login",
      error: error.message
    });
  }
};

// Controller to add a new user
exports.addUser = async (req, res) => {
  try {
    console.log("Adding new user with data:", JSON.stringify(req.body, null, 2));

    const { name, email, role, gender, phone, password, address, country, dateOfBirth, profilePicture, status } = req.body;

    // Validate required fields
    const requiredFields = ['name', 'email', 'phone', 'password', 'address', 'country', 'dateOfBirth'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      console.log("Missing required fields:", missingFields);
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(', ')}`,
        missingFields
      });
    }

    // Check if phone number already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({
        message: `Phone number ${phone} is already registered. Please use a different phone number.`,
        field: 'phone'
      });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        message: `Email ${email} is already registered. Please use a different email.`,
        field: 'email'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      name,
      email,
      role,
      gender,
      phone,
      password: hashedPassword, // Save hashed password
      address,
      country,
      dateOfBirth,
      profilePicture,
      status,
    });

    // Save to database
    console.log("Saving user to database...");
    await newUser.save();
    console.log("User saved successfully");

    // Remove password from response
    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json({ message: "User added successfully", user: userResponse });
  } catch (error) {
    console.error("Error adding user:", error);
    
    if (error.code === 11000) {
      // Handle duplicate key error
      const field = Object.keys(error.keyPattern)[0];
      const value = error.keyValue[field];
      return res.status(400).json({
        message: `${field === 'phone' ? 'Phone number' : 'Email'} ${value} is already registered. Please use a different ${field === 'phone' ? 'phone number' : 'email'}.`,
        field
      });
    }

    if (error.name === 'ValidationError') {
      // Handle validation errors
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: "Validation error",
        errors
      });
    }

    res.status(500).json({ 
      message: "Error adding user", 
      error: error.message 
    });
  }
};

// Controller to update user status
exports.updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.status = status;
    await user.save();

    res.status(200).json({
      message: "User status updated successfully",
      user: {
        ...user.toObject(),
        password: undefined
      }
    });
  } catch (error) {
    console.error("Error updating user status:", error);
    res.status(500).json({ 
      message: "Error updating user status",
      error: error.message 
    });
  }
};

// Controller to update user
exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;

    // Remove sensitive fields from update data
    delete updateData.password;
    delete updateData._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    // Update user
    Object.assign(user, updateData);
    await user.save();

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      message: "Cập nhật thông tin người dùng thành công",
      user: userResponse
    });
  } catch (error) {
    console.error("Error updating user:", error);
    
    if (error.code === 11000) {
      // Handle duplicate key error
      const field = Object.keys(error.keyPattern)[0];
      const value = error.keyValue[field];
      return res.status(400).json({
        message: `${field === 'phone' ? 'Số điện thoại' : 'Email'} ${value} đã được sử dụng. Vui lòng sử dụng ${field === 'phone' ? 'số điện thoại' : 'email'} khác.`,
        field
      });
    }

    if (error.name === 'ValidationError') {
      // Handle validation errors
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: "Lỗi dữ liệu",
        errors
      });
    }

    res.status(500).json({ 
      message: "Không thể cập nhật thông tin người dùng",
      error: error.message 
    });
  }
};

// Controller to get user details and wedding invitations
exports.getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    // Get user details
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    // Get user's wedding invitations with populated template information
    const weddingInvitations = await WeddingInvitation.find({ user: userId })
      .populate('template', 'name thumbnail') // Populate template name and thumbnail
      .sort({ createdAt: -1 });

    res.status(200).json({
      user,
      weddingInvitations
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ 
      message: "Không thể tải thông tin người dùng",
      error: error.message 
    });
  }
};