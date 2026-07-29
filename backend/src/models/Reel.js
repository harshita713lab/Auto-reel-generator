const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: false, // 👈 Strict error se bachne ke liye false kiya
  },
  path: {
    type: String,
    required: [true, 'Image path is required'],
  },
  thumbnail: {
    type: String,
  },
  thumbnailPath: {
    type: String,
  },
  width: {
    type: Number,
  },
  height: {
    type: Number,
  },
  duration: {
    type: Number,
    default: 3,
    min: 0.5,
    max: 10,
  },
  order: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  animation: {
    type: String,
    default: 'kenBurns',
  },
  animationConfig: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  transition: {
    type: String,
    default: 'fade',
  },
  transitionConfig: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  effects: [{
    type: String,
  }],
  effectConfig: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  overlay: {
    type: mongoose.Schema.Types.Mixed,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
});

const ReelSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  template: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Template',
    required: false, // 👈 CastError avoid karne ke liye false
  },
  templateId: {
    type: String, // Backup identifier for string-based templates like "simple_1"
    default: 'simple_1',
  },
  images: [ImageSchema],
  music: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Music',
  },
  musicPath: {
    type: String,
  },
  musicStartTime: {
    type: Number,
    default: 0,
  },
  musicVolume: {
    type: Number,
    default: 1,
    min: 0,
    max: 1,
  },
  duration: {
    type: Number,
    required: true,
    min: 1, // 👈 Updated: Min duration 1 second, agar choti clip hui
    max: 300,
  },
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
  config: {
    transitionDuration: {
      type: Number,
      default: 0.5,
    },
    defaultAnimation: {
      type: String,
      default: 'kenBurns',
    },
    defaultTransition: {
      type: String,
      default: 'fade',
    },
    effects: {
      type: [String],
      default: [],
    },
    background: {
      type: String,
      default: '#000000',
    },
    enableAudioFade: {
      type: Boolean,
      default: true,
    },
    audioFadeDuration: {
      type: Number,
      default: 1,
    },
  },
  status: {
    type: String,
    enum: ['draft', 'queued', 'rendering', 'rendered', 'failed', 'cancelled'],
    default: 'draft',
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  outputPath: {
    type: String,
  },
  previewPath: {
    type: String,
  },
  thumbnailPath: {
    type: String,
  },
  error: {
    type: String,
  },
  renderingTime: {
    type: Number,
  },
  renderedAt: {
    type: Date,
  },
  renderOptions: {
    quality: {
      type: String,
      enum: ['low', 'medium', 'high', 'ultra'],
      default: 'high',
    },
    format: {
      type: String,
      default: 'mp4',
    },
    bitrate: {
      type: String,
    },
    codec: {
      type: String,
      default: 'h264',
    },
  },
  downloadCount: {
    type: Number,
    default: 0,
  },
  viewCount: {
    type: Number,
    default: 0,
  },
  shareCount: {
    type: Number,
    default: 0,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
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

// Indexes (Added sparse: true for null templates)
ReelSchema.index({ template: 1, createdAt: -1 }, { sparse: true });
ReelSchema.index({ status: 1 });
ReelSchema.index({ duration: 1 });
ReelSchema.index({ createdAt: -1 });
ReelSchema.index({ 'images.filename': 1 });

// Update timestamps
ReelSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Virtual for image count
ReelSchema.virtual('imageCount').get(function() {
  return this.images ? this.images.length : 0;
});

// Virtual for formatted duration
ReelSchema.virtual('formattedDuration').get(function() {
  const minutes = Math.floor(this.duration / 60);
  const seconds = Math.floor(this.duration % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
});

// Virtual for is complete
ReelSchema.virtual('isComplete').get(function() {
  return this.images && this.images.length >= 2 && this.duration > 0;
});

// Method to add image
ReelSchema.methods.addImage = function(imageData) {
  const order = this.images.length;
  this.images.push({
    ...imageData,
    order,
  });
  this.updatedAt = new Date();
  return this.save();
};

// Method to remove image
ReelSchema.methods.removeImage = function(imageId) {
  const index = this.images.findIndex(img => img._id.toString() === imageId);
  if (index !== -1) {
    this.images.splice(index, 1);
    this.images.forEach((img, idx) => {
      img.order = idx;
    });
    this.updatedAt = new Date();
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to reorder images
ReelSchema.methods.reorderImages = function(imageOrder) {
  const newOrder = [];
  for (const id of imageOrder) {
    const image = this.images.find(img => img._id.toString() === id);
    if (image) {
      newOrder.push(image);
    }
  }
  for (const img of this.images) {
    if (!newOrder.includes(img)) {
      newOrder.push(img);
    }
  }
  newOrder.forEach((img, idx) => {
    img.order = idx;
  });
  this.images = newOrder;
  this.updatedAt = new Date();
  return this.save();
};

// Method to update status
ReelSchema.methods.updateStatus = function(status, progress = null) {
  this.status = status;
  if (progress !== null) {
    this.progress = progress;
  }
  if (status === 'rendered') {
    this.renderedAt = new Date();
  }
  this.updatedAt = new Date();
  return this.save();
};

// Static method to get popular reels
ReelSchema.statics.getPopular = function(limit = 10) {
  return this.find({ status: 'rendered' })
    .sort({ downloadCount: -1, viewCount: -1 })
    .limit(limit)
    .populate('template', 'name category');
};

// Static method to get recent reels
ReelSchema.statics.getRecent = function(limit = 10) {
  return this.find({ status: 'rendered' })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('template', 'name category');
};

// Static method to get reels by template
ReelSchema.statics.getByTemplate = function(templateId, limit = 20) {
  return this.find({ template: templateId, status: 'rendered' })
    .sort({ createdAt: -1 })
    .limit(limit);
};

module.exports = mongoose.model('Reel', ReelSchema);