const mongoose = require("mongoose");
const { date } = require("zod");

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required'],
    trim: true
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  role: { 
    type: String, 
    enum: ["admin", "user"], 
    default: "user" 
  },
  gender: { 
    type: String, 
    enum: ["male", "female", "other"], 
    default: "other" 
  },
  phone: { 
    type: String, 
    required: [true, 'Phone number is required'],
    unique: true,
    trim: true
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  address: { 
    type: String, 
    required: [true, 'Address is required'],
    trim: true
  },
  country: { 
    type: String, 
    required: [true, 'Country is required'],
    trim: true
  },
  dateOfBirth: { 
    type: Date, 
    required: [true, 'Date of birth is required']
  },
  profilePicture: { 
    type: String, 
    default: "default.jpg" 
  },
  status: { 
    type: String, 
    enum: ["active", "inactive", "suspended"], 
    default: "active" 
  },
  registeredAt: { 
    type: Date, 
    default: Date.now 
  },
});

// Add pre-save middleware to handle errors
userSchema.pre('save', function(next) {
  if (this.isModified('email')) {
    this.email = this.email.toLowerCase();
  }
  next();
});

module.exports = mongoose.model("users", userSchema);