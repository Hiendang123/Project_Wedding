const express = require('express');
const router = express.Router();
const weddingInvitationController = require('../controllers/weddingInvitationController');

// Debug middleware
router.use((req, res, next) => {
  console.log('Wedding Invitation Route:', req.method, req.url);
  next();
});

// Get all wedding invitations
router.get('/', weddingInvitationController.getAllWeddingInvitations);

// Create new wedding invitation
router.post('/', weddingInvitationController.createWeddingInvitation);

// Get wedding invitation by slug
router.get('/:slug', weddingInvitationController.getWeddingInvitation);

// Update wedding invitation
router.put('/:slug', weddingInvitationController.updateWeddingInvitation);

// Delete wedding invitation
router.delete('/:slug', weddingInvitationController.deleteWeddingInvitation);

module.exports = router; 