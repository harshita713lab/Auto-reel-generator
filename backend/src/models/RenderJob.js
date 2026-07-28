const mongoose = require('mongoose');

const RenderJobSchema = new mongoose.Schema({
  reelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reel',
    required: true,
    index: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  status: {
    type: String,
    enum: ['queued', 'processing', 'completed', 'failed', 'cancelled'],
    default: 'queued',
    index: true,
  },
  priority: {
    type: Number,
    default: 0,
    min: 0,
    max: 10,
  },
  quality: {
    type: String,
    enum: ['low', 'medium', 'high', 'ultra'],
    default: 'high',
  },
  format: {
    type: String,
    default: 'mp4',
  },
  config: {
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
    codec: {
      type: String,
      default: 'h264',
    },
    pixelFormat: {
      type: String,
      default: 'yuv420p',
    },
    bitrate: {
      type: String,
    },
    crf: {
      type: Number,
      min: 0,
      max: 51,
    },
    preset: {
      type: String,
      enum: ['ultrafast', 'superfast', 'veryfast', 'faster', 'fast', 'medium', 'slow', 'slower', 'veryslow'],
      default: 'medium',
    },
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
  size: {
    type: Number,
  },
  duration: {
    type: Number,
  },
  error: {
    type: String,
  },
  errorStack: {
    type: String,
  },
  retryCount: {
    type: Number,
    default: 0,
  },
  maxRetries: {
    type: Number,
    default: 3,
  },
  logs: [{
    timestamp: {
      type: Date,
      default: Date.now,
    },
    level: {
      type: String,
      enum: ['info', 'warn', 'error', 'debug'],
      default: 'info',
    },
    message: {
      type: String,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
    },
  }],
  startedAt: {
    type: Date,
  },
  completedAt: {
    type: Date,
  },
  failedAt: {
    type: Date,
  },
  estimatedTime: {
    type: Number,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound indexes
RenderJobSchema.index({ status: 1, priority: -1, createdAt: 1 });
RenderJobSchema.index({ reelId: 1, status: 1 });
RenderJobSchema.index({ userId: 1, createdAt: -1 });

// Update timestamps
RenderJobSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Virtual for elapsed time
RenderJobSchema.virtual('elapsedTime').get(function() {
  if (!this.startedAt) return 0;
  const end = this.completedAt || this.failedAt || new Date();
  return (end - this.startedAt) / 1000; // in seconds
});

// Virtual for status color
RenderJobSchema.virtual('statusColor').get(function() {
  const colors = {
    queued: '#FFA500',
    processing: '#007BFF',
    completed: '#28A745',
    failed: '#DC3545',
    cancelled: '#6C757D',
  };
  return colors[this.status] || '#6C757D';
});

// Method to add log
RenderJobSchema.methods.addLog = function(level, message, data = null) {
  this.logs.push({
    timestamp: new Date(),
    level,
    message,
    data,
  });
  this.updatedAt = new Date();
  return this.save();
};

// Method to update progress
RenderJobSchema.methods.updateProgress = function(progress, message = null) {
  this.progress = Math.min(100, Math.max(0, progress));
  if (message) {
    this.addLog('info', message);
  }
  this.updatedAt = new Date();
  return this.save();
};

// Method to start job
RenderJobSchema.methods.startJob = function() {
  this.status = 'processing';
  this.startedAt = new Date();
  this.progress = 0;
  this.updatedAt = new Date();
  return this.save();
};

// Method to complete job
RenderJobSchema.methods.completeJob = function(outputInfo) {
  this.status = 'completed';
  this.progress = 100;
  this.completedAt = new Date();
  if (outputInfo) {
    this.outputPath = outputInfo.outputPath || this.outputPath;
    this.previewPath = outputInfo.previewPath || this.previewPath;
    this.thumbnailPath = outputInfo.thumbnailPath || this.thumbnailPath;
    this.size = outputInfo.size || this.size;
    this.duration = outputInfo.duration || this.duration;
  }
  this.updatedAt = new Date();
  return this.save();
};

// Method to fail job
RenderJobSchema.methods.failJob = function(error) {
  this.status = 'failed';
  this.failedAt = new Date();
  this.error = error.message || String(error);
  this.errorStack = error.stack;
  this.progress = this.progress || 0;
  this.updatedAt = new Date();
  return this.save();
};

// Method to retry job
RenderJobSchema.methods.retryJob = function() {
  if (this.retryCount >= this.maxRetries) {
    return this.failJob(new Error('Max retries exceeded'));
  }
  this.retryCount += 1;
  this.status = 'queued';
  this.error = null;
  this.errorStack = null;
  this.progress = 0;
  this.updatedAt = new Date();
  return this.save();
};

// Static method to get queue stats
RenderJobSchema.statics.getQueueStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);
};

// Static method to get pending jobs
RenderJobSchema.statics.getPendingJobs = function(limit = 10) {
  return this.find({ 
    status: { $in: ['queued', 'processing'] } 
  })
    .sort({ priority: -1, createdAt: 1 })
    .limit(limit)
    .populate('reelId', 'title template');
};

// Static method to cleanup old jobs
RenderJobSchema.statics.cleanupOldJobs = async function(days = 7) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  
  const result = await this.deleteMany({
    status: { $in: ['completed', 'failed', 'cancelled'] },
    createdAt: { $lt: cutoff },
  });
  
  return result.deletedCount;
};

module.exports = mongoose.model('RenderJob', RenderJobSchema);