const mongoose = require("mongoose");

const templateSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Template name is required'],
    trim: true
  },
  category: { 
    type: String, 
    required: [true, 'Category is required'],
    enum: {
      values: ['elegant', 'romantic', 'minimalist', 'floral', 'vintage', 'modern'],
      message: '{VALUE} is not a valid category',
    },
  },
  price: { 
    type: String, 
    required: [true, 'Price is required'],
    enum: {
      values: ['free', 'paid'],
      message: '{VALUE} is not a valid price type',
    },
  },
  priceAmount: {
    type: Number,
    required: function() {
      return this.price === 'paid';
    },
    min: [0, 'Price cannot be negative'],
    default: 0
  },
  comparePrice: {
    type: Number,
    min: [0, 'Compare price cannot be negative'],
    default: 0
  },
  status: { 
    type: String, 
    required: [true, 'Status is required'],
    enum: {
      values: ['draft', 'review', 'published'],
      message: '{VALUE} is not a valid status',
    },
    default: 'draft'
  },
  thumbnail: {
    type: String,
    default: '/templates/thumbnails/default.jpg'
  },
  html: { 
    type: String, 
    required: [true, 'HTML content is required']
  },
  css: { 
    type: String, 
    required: [true, 'CSS content is required']
  },
  js: { 
    type: String, 
    required: [true, 'JavaScript content is required']
  },
  dynamicFields: [{
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['text', 'date', 'color', 'location', 'image'],
    },
    defaultValue: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Middleware để cập nhật updatedAt trước khi lưu
templateSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Add indexes for faster queries
templateSchema.index({ category: 1 });
templateSchema.index({ status: 1 });
templateSchema.index({ price: 1 });

module.exports = mongoose.model("templates", templateSchema); 