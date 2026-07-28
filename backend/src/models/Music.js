const mongoose = require('mongoose');

const MusicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  artist: {
    type: String,
    trim: true,
    default: 'Unknown Artist',
  },
  filename: {
    type: String,
    required: true,
    unique: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
    min: 0,
  },
  format: {
    type: String,
    required: true,
  },
  bitrate: {
    type: Number,
  },
  sampleRate: {
    type: Number,
  },
  channels: {
    type: Number,
    default: 2,
  },
  bpm: {
    type: Number,
    min: 0,
    max: 300,
  },
  beats: [{
    time: Number,
    confidence: Number,
    type: {
      type: String,
      enum: ['kick', 'snare', 'hat', 'other'],
      default: 'other',
    },
  }],
  waveform: {
    type: [Number],
  },
  genre: {
    type: String,
    trim: true,
  },
  mood: {
    type: String,
    enum: ['happy', 'sad', 'energetic', 'calm', 'romantic', 'dark', 'uplifting', 'mysterious'],
  },
  tags: [{
    type: String,
    trim: true,
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  analyzedAt: {
    type: Date,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  usageCount: {
    type: Number,
    default: 0,
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

// Indexes for better performance
MusicSchema.index({ title: 'text', artist: 'text' });
MusicSchema.index({ bpm: 1 });
MusicSchema.index({ genre: 1 });
MusicSchema.index({ mood: 1 });
MusicSchema.index({ duration: 1 });
MusicSchema.index({ createdAt: -1 });

// Update timestamps
MusicSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Virtual for formatted duration
MusicSchema.virtual('formattedDuration').get(function() {
  const minutes = Math.floor(this.duration / 60);
  const seconds = Math.floor(this.duration % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
});

// Virtual for file size in MB
MusicSchema.virtual('sizeInMB').get(function() {
  return (this.size / (1024 * 1024)).toFixed(2);
});

// Method to check if analyzed
MusicSchema.methods.isAnalyzed = function() {
  return this.bpm !== null && this.bpm !== undefined && 
         this.beats && this.beats.length > 0;
};

// Static method to get random music
MusicSchema.statics.getRandom = async function(count = 1) {
  const result = await this.aggregate([
    { $match: { isActive: true } },
    { $sample: { size: count } }
  ]);
  return result;
};

// Static method to find by mood
MusicSchema.statics.findByMood = function(mood, limit = 10) {
  return this.find({ 
    isActive: true, 
    mood: mood 
  }).limit(limit);
};

module.exports = mongoose.model('Music', MusicSchema);