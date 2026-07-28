const Reel = require('../models/Reel');
const RenderJob = require('../models/RenderJob');
const renderService = require('../services/video/renderService');
const exportService = require('../services/video/exportService');
const logger = require('../utils/logger');
const { RENDER_CONFIG } = require('../config/constants');

// In-memory queue (will be replaced with Redis in production)
const renderQueue = [];
let isProcessing = false;

/**
 * Start render for a reel
 */
exports.startRender = async (req, res) => {
  try {
    const { id } = req.params;
    const { quality = 'high', format = 'mp4' } = req.body;

    const reel = await Reel.findById(id);
    if (!reel) {
      return res.status(404).json({ error: 'Reel not found' });
    }

    // Check if already rendering or rendered
    if (reel.status === 'rendering') {
      return res.status(400).json({ error: 'Reel is already rendering' });
    }

    if (reel.status === 'rendered') {
      return res.status(400).json({ error: 'Reel is already rendered' });
    }

    // Create render job
    const renderJob = new RenderJob({
      reelId: reel._id,
      status: 'queued',
      quality,
      format,
      config: {
        width: reel.config.width || 1080,
        height: reel.config.height || 1920,
        fps: reel.config.fps || 30,
        codec: reel.config.codec || 'h264',
      },
      createdAt: new Date(),
    });

    await renderJob.save();

    // Update reel status
    reel.status = 'queued';
    reel.progress = 0;
    await reel.save();

    // Add to queue
    renderQueue.push({
      jobId: renderJob._id,
      reelId: reel._id,
      quality,
      format,
    });

    // Process queue
    processQueue();

    logger.info(`Render job queued: ${renderJob._id} for reel: ${reel._id}`);

    res.status(202).json({
      success: true,
      data: {
        jobId: renderJob._id,
        reelId: reel._id,
        status: 'queued',
        message: 'Render job queued successfully',
      },
    });
  } catch (error) {
    logger.error('Failed to start render:', error);
    res.status(500).json({
      error: 'Failed to start render',
      message: error.message,
    });
  }
};

/**
 * Process render queue
 */
async function processQueue() {
  if (isProcessing || renderQueue.length === 0) return;
  
  isProcessing = true;

  try {
    while (renderQueue.length > 0) {
      const job = renderQueue.shift();
      await processRenderJob(job);
    }
  } catch (error) {
    logger.error('Queue processing error:', error);
  } finally {
    isProcessing = false;
  }
}

/**
 * Process a single render job
 */
async function processRenderJob(job) {
  const { jobId, reelId, quality, format } = job;

  try {
    // Update job status
    await RenderJob.findByIdAndUpdate(jobId, { status: 'processing' });
    
    // Get reel
    const reel = await Reel.findById(reelId);
    if (!reel) {
      throw new Error('Reel not found');
    }

    // Update reel status
    reel.status = 'rendering';
    reel.progress = 0;
    await reel.save();

    // Render the reel
    const result = await renderService.renderReel(reel, {
      quality,
      format,
      onProgress: async (progress) => {
        await Reel.findByIdAndUpdate(reelId, { progress });
      },
    });

    // Update job and reel with success
    await RenderJob.findByIdAndUpdate(jobId, {
      status: 'completed',
      completedAt: new Date(),
      outputPath: result.outputPath,
      size: result.size,
      duration: result.duration,
    });

    await Reel.findByIdAndUpdate(reelId, {
      status: 'rendered',
      progress: 100,
      outputPath: result.outputPath,
      previewPath: result.previewPath,
      thumbnailPath: result.thumbnailPath,
      renderedAt: new Date(),
    });

    logger.info(`Render completed: ${jobId} for reel: ${reelId}`);

  } catch (error) {
    logger.error(`Render failed for job ${jobId}:`, error);

    // Update job with error
    await RenderJob.findByIdAndUpdate(jobId, {
      status: 'failed',
      error: error.message,
      failedAt: new Date(),
    });

    // Update reel
    await Reel.findByIdAndUpdate(reelId, {
      status: 'failed',
      error: error.message,
    });

    // Retry logic
    const jobData = await RenderJob.findById(jobId);
    if (jobData && jobData.retryCount < (RENDER_CONFIG.MAX_CONCURRENT_RENDERS || 3)) {
      await RenderJob.findByIdAndUpdate(jobId, {
        $inc: { retryCount: 1 },
        status: 'queued',
      });
      
      // Add back to queue
      renderQueue.push({
        jobId,
        reelId,
        quality,
        format,
      });
      
      logger.info(`Job ${jobId} retry ${jobData.retryCount + 1} queued`);
    }
  }
}

/**
 * Get render status
 */
exports.getRenderStatus = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await RenderJob.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Render job not found' });
    }

    res.json({
      success: true,
      data: {
        jobId: job._id,
        reelId: job.reelId,
        status: job.status,
        progress: job.progress || 0,
        outputPath: job.outputPath,
        error: job.error,
        retryCount: job.retryCount,
        createdAt: job.createdAt,
        completedAt: job.completedAt,
      },
    });
  } catch (error) {
    logger.error('Failed to get render status:', error);
    res.status(500).json({
      error: 'Failed to get render status',
      message: error.message,
    });
  }
};

/**
 * Get all renders
 */
exports.getAllRenders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const query = {};
    if (status) query.status = status;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [jobs, total] = await Promise.all([
      RenderJob.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      RenderJob.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: jobs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    logger.error('Failed to get renders:', error);
    res.status(500).json({
      error: 'Failed to get renders',
      message: error.message,
    });
  }
};

/**
 * Delete render
 */
exports.deleteRender = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await RenderJob.findById(id);
    if (!job) {
      return res.status(404).json({ error: 'Render job not found' });
    }
    
    await job.deleteOne();
    
    res.json({
      success: true,
      message: 'Render job deleted successfully',
    });
  } catch (error) {
    logger.error('Failed to delete render:', error);
    res.status(500).json({
      error: 'Failed to delete render',
      message: error.message,
    });
  }
};

/**
 * Get queue status
 */
exports.getQueueStatus = async (req, res) => {
  res.json({
    success: true,
    data: {
      queueLength: renderQueue.length,
      isProcessing,
      pendingJobs: renderQueue.map(j => ({
        jobId: j.jobId,
        reelId: j.reelId,
        status: 'queued',
      })),
    },
  });
};

/**
 * Retry render
 */
exports.retryRender = async (req, res) => {
  try {
    const { id } = req.params;
    
    const job = await RenderJob.findById(id);
    if (!job) {
      return res.status(404).json({ error: 'Render job not found' });
    }

    if (job.status !== 'failed') {
      return res.status(400).json({ error: 'Only failed jobs can be retried' });
    }

    // Reset job status
    job.status = 'queued';
    job.error = undefined;
    job.failedAt = undefined;
    await job.save();

    // Add back to queue
    renderQueue.push({
      jobId: job._id,
      reelId: job.reelId,
      quality: job.quality || 'high',
      format: job.format || 'mp4',
    });

    processQueue();

    res.json({
      success: true,
      message: 'Render job requeued for retry',
    });
  } catch (error) {
    logger.error('Failed to retry render:', error);
    res.status(500).json({
      error: 'Failed to retry render',
      message: error.message,
    });
  }
};

/**
 * Cancel render
 */
exports.cancelRender = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await RenderJob.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Render job not found' });
    }

    if (job.status === 'completed') {
      return res.status(400).json({ error: 'Render already completed' });
    }

    // Remove from queue if queued
    if (job.status === 'queued') {
      const index = renderQueue.findIndex(j => j.jobId.toString() === jobId);
      if (index !== -1) {
        renderQueue.splice(index, 1);
      }
    }

    // Update job status
    job.status = 'cancelled';
    await job.save();

    // Update reel
    await Reel.findByIdAndUpdate(job.reelId, {
      status: 'draft',
    });

    logger.info(`Render cancelled: ${jobId}`);

    res.json({
      success: true,
      message: 'Render cancelled successfully',
    });
  } catch (error) {
    logger.error('Failed to cancel render:', error);
    res.status(500).json({
      error: 'Failed to cancel render',
      message: error.message,
    });
  }
};