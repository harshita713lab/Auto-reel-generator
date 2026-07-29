const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reels: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reel',
  }],
  settings: {
    width: {
      type: Number,
      default: 1080,
    },
    height: {
      type: Number,
      default: 1920,
    },
    fps: {
      type: Number,
      default: 30,
    },
    defaultTransition: {
      type: String,
      default: 'fade',
    },
    defaultAnimation: {
      type: String,
      default: 'kenBurns',
    },
    defaultDuration: {
      type: Number,
      default: 3,
    },
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'archived'],
    default: 'draft',
  },
  isTemplate: {
    type: Boolean,
    default: false,
  },
  templateCategory: {
    type: String,
    trim: true,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  coverImage: {
    type: String,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  lastAccessed: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes
ProjectSchema.index({ userId: 1, createdAt: -1 });
ProjectSchema.index({ userId: 1, name: 'text' });
ProjectSchema.index({ status: 1 });
ProjectSchema.index({ isTemplate: 1 });

// Update timestamps
// Replace this:
ProjectSchema.pre('save', function() {
  this.updatedAt = new Date();
});

// Virtual for reel count
ProjectSchema.virtual('reelCount').get(function() {
  return this.reels ? this.reels.length : 0;
});

// Method to add reel
ProjectSchema.methods.addReel = function(reelId) {
  if (!this.reels.includes(reelId)) {
    this.reels.push(reelId);
    this.updatedAt = new Date();
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to remove reel
ProjectSchema.methods.removeReel = function(reelId) {
  this.reels = this.reels.filter(id => id.toString() !== reelId.toString());
  this.updatedAt = new Date();
  return this.save();
};

// Static method to get user projects
ProjectSchema.statics.getUserProjects = function(userId, options = {}) {
  const { limit = 20, skip = 0, status = 'active' } = options;
  return this.find({ 
    userId, 
    status,
    isTemplate: false 
  })
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('reels', 'title status previewPath');
};

// Static method to get project templates
ProjectSchema.statics.getTemplates = function(options = {}) {
  const { limit = 20, skip = 0, category } = options;
  const query = { isTemplate: true, status: 'active' };
  if (category) query.templateCategory = category;
  
  return this.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

// Static method to search projects
ProjectSchema.statics.search = function(userId, searchTerm) {
  return this.find({
    userId,
    $text: { $search: searchTerm },
  }).sort({ score: { $meta: 'textScore' } });
};

module.exports = mongoose.model('Project', ProjectSchema);