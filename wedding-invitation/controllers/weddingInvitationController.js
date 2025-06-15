const WeddingInvitation = require('../models/WeddingInvitation');
const Template = require('../models/Template');
const User = require('../models/User');

// Helper function to create slug from names
const createSlug = (groomName, brideName) => {
  const formatName = (name) => {
    return name
      .toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '');
  };
  
  return `${formatName(groomName)}-${formatName(brideName)}`;
};

// Get all wedding invitations
exports.getAllWeddingInvitations = async (req, res) => {
  try {
    console.log('Getting all wedding invitations');
    const weddingInvitations = await WeddingInvitation.find()
      .populate('template', 'name')
      .populate('user', 'email')
      .sort({ createdAt: -1 });

    res.json({
      message: 'Wedding invitations retrieved successfully',
      data: weddingInvitations,
    });
  } catch (error) {
    console.error('Error retrieving wedding invitations:', error);
    res.status(500).json({ 
      message: 'Error retrieving wedding invitations',
      error: error.message 
    });
  }
};

// Create new wedding invitation
exports.createWeddingInvitation = async (req, res) => {
  try {
    const { templateId, fields, userId } = req.body;

    // Validate template exists
    const templateDoc = await Template.findById(templateId);
    if (!templateDoc) {
      console.log('Template not found:', templateId);
      return res.status(404).json({ message: 'Template not found' });
    }

    // Validate user exists
    const userDoc = await User.findById(userId);
    if (!userDoc) {
      console.log('User not found:', userId);
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate required fields
    if (!fields || typeof fields !== 'object') {
      return res.status(400).json({ message: 'Fields must be an object' });
    }

    // Extract names from fields
    const groomName = fields['tên_chú_rể'];
    const brideName = fields['tên_cô_dâu'];

    if (!groomName || !brideName) {
      return res.status(400).json({ 
        message: 'Tên chú rể và tên cô dâu là bắt buộc',
        fields: {
          groomName: !groomName ? 'Tên chú rể là bắt buộc' : null,
          brideName: !brideName ? 'Tên cô dâu là bắt buộc' : null
        }
      });
    }

    // Create slug
    const slug = createSlug(groomName, brideName);
    console.log('Generated slug:', slug);

    // Check if slug already exists
    const existingInvitation = await WeddingInvitation.findOne({ slug });
    if (existingInvitation) {
      console.log('Wedding invitation already exists with slug:', slug);
      return res.status(400).json({ message: 'A wedding invitation with these names already exists' });
    }

    // Create new wedding invitation
    const weddingInvitation = new WeddingInvitation({
      template: templateDoc._id,
      user: userId,
      fields,
      groomName,
      brideName,
      slug,
      status: 'published'
    });

    console.log('Saving wedding invitation:', weddingInvitation);
    await weddingInvitation.save();

    res.status(201).json({
      message: 'Wedding invitation created successfully',
      data: weddingInvitation,
    });
  } catch (error) {
    console.error('Error creating wedding invitation:', error);
    res.status(500).json({ 
      message: 'Error creating wedding invitation',
      error: error.message 
    });
  }
};

// Get wedding invitation by slug
exports.getWeddingInvitation = async (req, res) => {
  try {
    console.log('Getting wedding invitation with slug:', req.params.slug);
    const { slug } = req.params;
    const { fields, template, slug: includeSlug } = req.query;

    // Build select object based on query params
    const select = {};
    if (fields === 'true') select.fields = 1;
    if (template === 'true') select.template = 1;
    if (includeSlug === 'true') select.slug = 1;

    const weddingInvitation = await WeddingInvitation.findOne({ slug })
      .select(select)
      .populate({
        path: 'template',
        model: 'templates',
        select: template === 'true' ? 'name html css js dynamicFields' : 'name'
      });

    if (!weddingInvitation) {
      console.log('Wedding invitation not found:', slug);
      return res.status(404).json({ message: 'Wedding invitation not found' });
    }

    console.log('Found wedding invitation:', weddingInvitation);
    res.json({
      message: 'Wedding invitation retrieved successfully',
      data: weddingInvitation,
    });
  } catch (error) {
    console.error('Error retrieving wedding invitation:', error);
    res.status(500).json({ 
      message: 'Error retrieving wedding invitation',
      error: error.message 
    });
  }
};

// Update wedding invitation
exports.updateWeddingInvitation = async (req, res) => {
  try {
    console.log('Updating wedding invitation with slug:', req.params.slug);
    const { slug } = req.params;
    const { customValues, status } = req.body;

    const weddingInvitation = await WeddingInvitation.findOne({ slug });

    if (!weddingInvitation) {
      console.log('Wedding invitation not found:', slug);
      return res.status(404).json({ message: 'Wedding invitation not found' });
    }

    if (customValues) {
      weddingInvitation.customValues = customValues;
    }

    if (status) {
      weddingInvitation.status = status;
    }

    console.log('Saving updated wedding invitation:', weddingInvitation);
    await weddingInvitation.save();

    res.json({
      message: 'Wedding invitation updated successfully',
      data: weddingInvitation,
    });
  } catch (error) {
    console.error('Error updating wedding invitation:', error);
    res.status(500).json({ 
      message: 'Error updating wedding invitation',
      error: error.message 
    });
  }
};

// Delete wedding invitation
exports.deleteWeddingInvitation = async (req, res) => {
  try {
    console.log('Deleting wedding invitation with slug:', req.params.slug);
    const { slug } = req.params;

    const weddingInvitation = await WeddingInvitation.findOneAndDelete({ slug });

    if (!weddingInvitation) {
      console.log('Wedding invitation not found:', slug);
      return res.status(404).json({ message: 'Wedding invitation not found' });
    }

    console.log('Deleted wedding invitation:', weddingInvitation);
    res.json({
      message: 'Wedding invitation deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting wedding invitation:', error);
    res.status(500).json({ 
      message: 'Error deleting wedding invitation',
      error: error.message 
    });
  }
}; 