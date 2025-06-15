const mongoose = require('mongoose');

const weddingInvitationSchema = new mongoose.Schema({
  template: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'templates',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  fields: {
    type: Map,
    of: String,
    required: true
  },
  groomName: {
    type: String,
    required: true
  },
  brideName: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  slug: {
    type: String,
    required: true,
    unique: true
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

// Middleware để cập nhật updatedAt
weddingInvitationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Tạo index cho slug
weddingInvitationSchema.index({ slug: 1 });

module.exports = mongoose.model('wedding_invitations', weddingInvitationSchema); 