const mongoose = require('mongoose');

const TemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,  // ✅ This automatically creates an index
    trim: true,
  },
    compositionId: {
    type: String,
    required: true,
    trim: true,
    default: function() {
      // अगर पुराना डेटा है और compositionId नहीं है, तो name से ही ID बना लें
      return this.name;
    }
  },
  priority: {
    type: Number,
    default: 0,  // 0 = सबसे कम प्रायोरिटी, 1 = सबसे ज्यादा (आप चाहें तो 1,2,3... रखें)
    index: true,
  },

  displayName: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['wedding', 'birthday', 'travel', 'fashion', 'loveStory', 'baby', 'festival', 'memories', 'corporate', 'productShowcase'],
  },
  thumbnail: {
    type: String,
  },
  previewVideo: {
    type: String,
  },
  defaultAnimation: {
    type: String,
    default: 'kenBurns',
  },
  defaultTransition: {
    type: String,
    default: 'fade',
  },
  defaultEffects: [{
    type: String,
  }],
  defaultDuration: {
    type: Number,
    default: 3,
    min: 1,
    max: 10,
  },
  config: {
    minImages: {
      type: Number,
      default: 2,
      min: 2,
      max: 50,
    },
    maxImages: {
      type: Number,
      default: 30,
      min: 2,
      max: 50,
    },
    allowedAspectRatios: [{
      type: String,
      enum: ['1:1', '4:5', '9:16', '16:9'],
      default: '9:16',
    }],
    defaultWidth: {
      type: Number,
      default: 1080,
    },
    defaultHeight: {
      type: Number,
      default: 1920,
    },
    backgroundColor: {
      type: String,
      default: '#000000',
    },
    textOverlay: {
      enabled: {
        type: Boolean,
        default: false,
      },
      font: {
        type: String,
        default: 'Arial',
      },
      fontSize: {
        type: Number,
        default: 48,
      },
      color: {
        type: String,
        default: '#FFFFFF',
      },
      position: {
        type: String,
        enum: ['top', 'center', 'bottom'],
        default: 'center',
      },
    },
    transitions: {
      enabled: {
        type: Boolean,
        default: true,
      },
      duration: {
        type: Number,
        default: 0.5,
        min: 0.1,
        max: 2,
      },
    },
  },
  effects: [{
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['lightLeak', 'lensFlare', 'glow', 'bloom', 'filmGrain', 'dustParticles', 'bokeh', 'vignette', 'motionBlur', 'floatingParticles', 'softShadows', 'colorOverlay', 'gradientOverlay', 'noiseTexture'],
    },
    config: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    enabled: {
      type: Boolean,
      default: true,
    },
  }],
  animations: [{
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['zoomIn', 'zoomOut', 'kenBurns', 'panLeft', 'panRight', 'panUp', 'panDown', 'cameraPush', 'cameraPull', 'slowFloat', 'parallax', 'rotate', 'tilt', 'bounce', 'shake', 'reveal', 'fade', 'scale', 'blurIn', 'blurOut'],
    },
    config: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    enabled: {
      type: Boolean,
      default: true,
    },
  }],
  transitions: [{
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['fade', 'crossFade', 'slideLeft', 'slideRight', 'slideUp', 'slideDown', 'zoom', 'blur', 'flash', 'whipPan', 'cameraMove', 'filmBurn', 'lightLeak', 'dissolve', 'morph'],
    },
    config: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    enabled: {
      type: Boolean,
      default: true,
    },
  }],
  music: {
    defaultMusic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Music',
    },
    allowCustomMusic: {
      type: Boolean,
      default: true,
    },
    recommendedBPM: {
      type: Number,
      min: 60,
      max: 200,
    },
  },
  popularity: {
    type: Number,
    default: 0,
  },
  usageCount: {
    type: Number,
    default: 0,
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isPremium: {
    type: Boolean,
    default: false,
  },
  price: {
    type: Number,
    default: 0,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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

// ============================================================
// ✅ INDEXES - DUPLICATE REMOVED!
// ============================================================
// ❌ REMOVED: TemplateSchema.index({ name: 1 }); 
// ✅ Because 'unique: true' on 'name' field already creates index
// ============================================================
TemplateSchema.index({ category: 1 });
TemplateSchema.index({ popularity: -1 });
TemplateSchema.index({ isActive: 1 });
TemplateSchema.index({ isPremium: 1 });
TemplateSchema.index({ tags: 1 });
TemplateSchema.index({ 'rating.average': -1 });

// Update timestamps
// Replace this:
TemplateSchema.pre('save', function() {
  this.updatedAt = new Date();
});

// Virtual for effect count
TemplateSchema.virtual('effectCount').get(function() {
  return this.effects ? this.effects.filter(e => e.enabled).length : 0;
});

// Virtual for animation count
TemplateSchema.virtual('animationCount').get(function() {
  return this.animations ? this.animations.filter(a => a.enabled).length : 0;
});

// Virtual for transition count
TemplateSchema.virtual('transitionCount').get(function() {
  return this.transitions ? this.transitions.filter(t => t.enabled).length : 0;
});

// Method to get enabled effects
TemplateSchema.methods.getEnabledEffects = function() {
  return this.effects ? this.effects.filter(e => e.enabled) : [];
};

// Method to get enabled animations
TemplateSchema.methods.getEnabledAnimations = function() {
  return this.animations ? this.animations.filter(a => a.enabled) : [];
};

// Method to get enabled transitions
TemplateSchema.methods.getEnabledTransitions = function() {
  return this.transitions ? this.transitions.filter(t => t.enabled) : [];
};

// Method to increment usage
TemplateSchema.methods.incrementUsage = function() {
  this.usageCount += 1;
  this.updatedAt = new Date();
  return this.save();
};

// Method to update rating
TemplateSchema.methods.updateRating = function(rating) {
  const total = this.rating.average * this.rating.count + rating;
  this.rating.count += 1;
  this.rating.average = total / this.rating.count;
  this.updatedAt = new Date();
  return this.save();
};

// Static method to get popular templates
TemplateSchema.statics.getPopular = function(limit = 10, category = null) {
  const query = { isActive: true };
  if (category) query.category = category;
  
  return this.find(query)
    .sort({ popularity: -1, usageCount: -1 })
    .limit(limit);
};

// Static method to get recommended templates
TemplateSchema.statics.getRecommended = function(userId, limit = 6) {
  // Simple recommendation based on popularity for now
  // This can be enhanced with ML later
  return this.find({ isActive: true })
    .sort({ rating: -1, usageCount: -1 })
    .limit(limit);
};

// Static method to search templates
TemplateSchema.statics.search = function(searchTerm, options = {}) {
  const { category, limit = 20, skip = 0 } = options;
  const query = {
    isActive: true,
    $or: [
      { name: { $regex: searchTerm, $options: 'i' } },
      { displayName: { $regex: searchTerm, $options: 'i' } },
      { description: { $regex: searchTerm, $options: 'i' } },
      { tags: { $regex: searchTerm, $options: 'i' } },
    ],
  };
  if (category) query.category = category;
  
  return this.find(query)
    .sort({ popularity: -1 })
    .skip(skip)
    .limit(limit);
};

// Static method to get templates by category
TemplateSchema.statics.getByCategory = function(category, limit = 20) {
  return this.find({ 
    category, 
    isActive: true 
  })
    .sort({ popularity: -1 })
    .limit(limit);
};

module.exports = mongoose.model('Template', TemplateSchema);