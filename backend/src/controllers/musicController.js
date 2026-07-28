const Music = require('../models/Music');
const musicService = require('../services/audio/musicService');
const beatService = require('../services/audio/beatService');
const bpmService = require('../services/audio/bpmService');
const fileService = require('../services/storage/fileService');
const logger = require('../utils/logger');
const { AUDIO_CONFIG } = require('../config/constants');

/**
 * Upload music file
 */
exports.uploadMusic = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No music file uploaded' });
    }

    // Validate file type
    const ext = req.file.originalname.split('.').pop().toLowerCase();
    if (!AUDIO_CONFIG.ALLOWED_EXTENSIONS.includes(ext)) {
      return res.status(400).json({
        error: 'Invalid file type',
        allowed: AUDIO_CONFIG.ALLOWED_EXTENSIONS,
      });
    }

    // Validate file size
    if (req.file.size > AUDIO_CONFIG.MAX_FILE_SIZE) {
      return res.status(400).json({
        error: 'File too large',
        maxSize: AUDIO_CONFIG.MAX_FILE_SIZE / (1024 * 1024) + 'MB',
      });
    }

    // Process music file
    const musicData = await musicService.processMusicFile(req.file);
    
    // Save to database
    const music = new Music(musicData);
    await music.save();

    logger.info(`Music uploaded: ${music.title} (${music._id})`);

    res.status(201).json({
      success: true,
      data: music,
      message: 'Music uploaded successfully',
    });
  } catch (error) {
    logger.error('Music upload failed:', error);
    res.status(500).json({
      error: 'Failed to upload music',
      message: error.message,
    });
  }
};

/**
 * Get all music
 */
exports.getAllMusic = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, genre } = req.query;
    
    const query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { artist: { $regex: search, $options: 'i' } },
      ];
    }
    if (genre) {
      query.genre = genre;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [music, total] = await Promise.all([
      Music.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Music.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: music,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    logger.error('Failed to get music:', error);
    res.status(500).json({
      error: 'Failed to get music',
      message: error.message,
    });
  }
};

/**
 * Get single music by ID (alias for routes)
 */
exports.getMusic = async (req, res) => {
  return exports.getMusicById(req, res);
};

/**
 * Get single music by ID
 */
exports.getMusicById = async (req, res) => {
  try {
    const music = await Music.findById(req.params.id);
    if (!music) {
      return res.status(404).json({ error: 'Music not found' });
    }
    res.json({ success: true, data: music });
  } catch (error) {
    logger.error('Failed to get music:', error);
    res.status(500).json({
      error: 'Failed to get music',
      message: error.message,
    });
  }
};

/**
 * Analyze music for beats and BPM
 */
exports.analyzeMusic = async (req, res) => {
  try {
    const music = await Music.findById(req.params.id);
    if (!music) {
      return res.status(404).json({ error: 'Music not found' });
    }

    // Check if already analyzed
    if (music.bpm && music.beats && music.beats.length > 0) {
      return res.json({
        success: true,
        data: {
          bpm: music.bpm,
          beats: music.beats,
          duration: music.duration,
        },
        message: 'Music already analyzed',
      });
    }

    // Analyze music
    const filePath = fileService.getMusicPath(music.filename);
    const [bpm, beats] = await Promise.all([
      bpmService.detectBPM(filePath),
      beatService.detectBeats(filePath),
    ]);

    // Update music
    music.bpm = bpm;
    music.beats = beats;
    await music.save();

    logger.info(`Music analyzed: ${music.title} (BPM: ${bpm}, Beats: ${beats.length})`);

    res.json({
      success: true,
      data: { bpm, beats, duration: music.duration },
      message: 'Music analyzed successfully',
    });
  } catch (error) {
    logger.error('Music analysis failed:', error);
    res.status(500).json({
      error: 'Failed to analyze music',
      message: error.message,
    });
  }
};

/**
 * Delete music
 */
exports.deleteMusic = async (req, res) => {
  try {
    const music = await Music.findById(req.params.id);
    if (!music) {
      return res.status(404).json({ error: 'Music not found' });
    }

    // Delete file
    await fileService.deleteFile(fileService.getMusicPath(music.filename));
    
    // Delete from database
    await music.deleteOne();

    logger.info(`Music deleted: ${music.title}`);

    res.json({
      success: true,
      message: 'Music deleted successfully',
    });
  } catch (error) {
    logger.error('Failed to delete music:', error);
    res.status(500).json({
      error: 'Failed to delete music',
      message: error.message,
    });
  }
};

/**
 * Recommend music
 */
exports.recommendMusic = async (req, res) => {
  try {
    const { mood, genre, tempo } = req.body;
    
    const query = {};
    if (genre) query.genre = genre;
    if (mood) query.mood = mood;
    
    // Get random music matching criteria
    const count = await Music.countDocuments(query);
    if (count === 0) {
      return res.status(404).json({ error: 'No music found matching criteria' });
    }
    
    const random = Math.floor(Math.random() * count);
    const music = await Music.findOne(query).skip(random);
    
    res.json({
      success: true,
      data: music,
      message: 'Music recommended based on your preferences',
    });
  } catch (error) {
    logger.error('Failed to recommend music:', error);
    res.status(500).json({
      error: 'Failed to recommend music',
      message: error.message,
    });
  }
};

/**
 * Sync music with reel
 */
exports.syncMusic = async (req, res) => {
  try {
    const { reelId, musicId, options = {} } = req.body;
    
    if (!reelId || !musicId) {
      return res.status(400).json({ error: 'reelId and musicId are required' });
    }

    const music = await Music.findById(musicId);
    if (!music) {
      return res.status(404).json({ error: 'Music not found' });
    }

    // Get beat data for syncing
    const beatData = {
      bpm: music.bpm || 120,
      beats: music.beats || [],
      duration: music.duration || 0,
    };

    res.json({
      success: true,
      data: {
        music,
        syncData: beatData,
        suggestedDuration: music.duration,
      },
      message: 'Music synced successfully',
    });
  } catch (error) {
    logger.error('Failed to sync music:', error);
    res.status(500).json({
      error: 'Failed to sync music',
      message: error.message,
    });
  }
};

/**
 * Get music waveform
 */
exports.getWaveform = async (req, res) => {
  try {
    const music = await Music.findById(req.params.id);
    if (!music) {
      return res.status(404).json({ error: 'Music not found' });
    }

    const waveform = await musicService.getWaveform(
      fileService.getMusicPath(music.filename)
    );

    res.json({
      success: true,
      data: waveform,
    });
  } catch (error) {
    logger.error('Failed to get waveform:', error);
    res.status(500).json({
      error: 'Failed to get waveform',
      message: error.message,
    });
  }
};