const mongoose = require('mongoose');

const reelSchema = new mongoose.Schema({
  imagePaths: { type: [String], required: true },
  usedMusic: { type: String, required: true },
  usedTemplate: { type: String, required: true },
  templateId: { type: String, required: true },
  videoUrl: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['processing', 'completed', 'failed'], 
    default: 'processing' 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reel', reelSchema);