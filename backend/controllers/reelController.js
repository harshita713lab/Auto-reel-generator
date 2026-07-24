const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const videoService = require('../services/videoService');
const collageService = require('../services/collageService');
const imageService = require('../services/imageService');
const Reel = require('../models/Reel');

const generatedDir = process.env.GENERATED_DIR || './generated/reels';
const musicDir = process.env.MUSIC_DIR || './music';
const TEMPLATES_FILE = path.join(__dirname, '../templates.json');

if (!fs.existsSync(generatedDir)) fs.mkdirSync(generatedDir, { recursive: true });
if (!fs.existsSync(musicDir)) fs.mkdirSync(musicDir, { recursive: true });

// ✅ Template rotation tracker
let templateHistory = [];
let templateIndex = -1;
let allTemplates = [];

// ✅ Load templates from backend/templates.json
function loadTemplates() {
  try {
    const rawData = fs.readFileSync(TEMPLATES_FILE, 'utf8');
    const data = JSON.parse(rawData);
    if (Array.isArray(data)) {
      allTemplates = data;
    } else if (data.templates) {
      allTemplates = data.templates;
    } else {
      allTemplates = data;
    }
    console.log(`📋 Loaded ${allTemplates.length} templates from ${TEMPLATES_FILE}`);
    return allTemplates;
  } catch (error) {
    console.error('❌ Error loading templates:', error.message);
    allTemplates = [];
    return allTemplates;
  }
}

// ✅ Get template that matches EXACT photo count with rotation
function getTemplateByExactPhotoCount(imageCount) {
  if (allTemplates.length === 0) loadTemplates();
  
  let matchingTemplates = allTemplates.filter(t => 
    t.minPhotos === imageCount && t.maxPhotos === imageCount
  );
  
  if (matchingTemplates.length === 0) {
    matchingTemplates = allTemplates.filter(t => 
      (!t.minPhotos || imageCount >= t.minPhotos) && 
      (!t.maxPhotos || imageCount <= t.maxPhotos)
    );
    console.log(`⚠️ No exact match, using range filter (${matchingTemplates.length} templates)`);
  }
  
  if (matchingTemplates.length === 0) {
    matchingTemplates = allTemplates;
    console.log(`⚠️ No match found, using all templates`);
  }
  
  console.log(`📋 Found ${matchingTemplates.length} templates for ${imageCount} photos`);
  
  if (templateHistory.length === 0 || templateHistory.length >= matchingTemplates.length) {
    templateHistory = matchingTemplates.sort(() => Math.random() - 0.5);
    templateIndex = -1;
    console.log('🔄 Refreshed template queue');
  }
  
  templateIndex++;
  const selected = templateHistory[templateIndex % templateHistory.length];
  
  console.log(`🎯 Template ${templateIndex + 1}/${templateHistory.length}: ${selected.name}`);
  console.log(`📸 Fixed photos: ${selected.minPhotos}-${selected.maxPhotos}`);
  
  return selected;
}

// ✅ Reset rotation
function resetTemplateRotation() {
  templateHistory = [];
  templateIndex = -1;
  loadTemplates();
  console.log('🔄 Template rotation reset');
}

resetTemplateRotation();

// ============================================
// ✅ GENERATE REEL (With Remotion + FFmpeg)
// ============================================
exports.generateReel = async (req, res) => {
  try {
    console.log('\n╔═══════════════════════════════════════════════════╗');
    console.log('║         🎬  REEL GENERATION STARTED             ║');
    console.log('╚═══════════════════════════════════════════════════╝');

    const { images } = req.body;

    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ error: 'No images provided' });
    }

    const photoCount = images.length;
    console.log(`\n📸 INPUT DETAILS:`);
    console.log(`   ├── Total Images: ${photoCount}`);
    console.log(`   ├── Image Paths: ${images.length} files`);
    images.forEach((img, i) => {
      console.log(`   │   └── Image ${i+1}: ${path.basename(img)}`);
    });

    // ✅ Convert to absolute paths
    const absolutePaths = images.map(img => {
      if (path.isAbsolute(img)) return img;
      return path.join(process.cwd(), img);
    });

    // ✅ Get template that matches photo count (rotates for variety)
    const selectedTemplate = getTemplateByExactPhotoCount(photoCount);
    
    console.log(`\n📐 TEMPLATE DETAILS:`);
    console.log(`   ├── ID: ${selectedTemplate.id}`);
    console.log(`   ├── Name: ${selectedTemplate.name}`);
    console.log(`   ├── Photos: ${selectedTemplate.minPhotos}-${selectedTemplate.maxPhotos}`);
    console.log(`   ├── Transitions: ${(selectedTemplate.transitions || ['fade']).join(', ')}`);
    console.log(`   ├── Effects: ${(selectedTemplate.effects || ['none']).join(', ')}`);
    console.log(`   ├── Color Grades: ${(selectedTemplate.colorGrades || ['none']).join(', ')}`);
    console.log(`   ├── Vignette: ${selectedTemplate.vignette ? '✅ Yes' : '❌ No'}`);
    console.log(`   ├── Collage: ${selectedTemplate.collage ? '✅ Yes' : '❌ No'}`);
    console.log(`   └── Quality: ${selectedTemplate.quality || 'high'}`);

    // ✅ Get music from template or random
    let musicPath = '';
    let musicFileName = 'No Music';
    
    if (selectedTemplate.music) {
      const musicFile = path.join(musicDir, selectedTemplate.music);
      if (fs.existsSync(musicFile)) {
        musicPath = musicFile;
        musicFileName = selectedTemplate.music;
        console.log(`\n🎵 MUSIC DETAILS:`);
        console.log(`   ├── Source: Template (${selectedTemplate.music})`);
        console.log(`   ├── Path: ${musicPath}`);
        console.log(`   └── Status: ✅ Found`);
      } else {
        console.log(`\n🎵 MUSIC DETAILS:`);
        console.log(`   ├── Source: Template (${selectedTemplate.music})`);
        console.log(`   └── Status: ❌ Not found, trying fallback...`);
      }
    }
    
    if (!musicPath) {
      const files = fs.readdirSync(musicDir).filter(f => f.endsWith('.mp3'));
      if (files.length > 0) {
        const randomFile = files[Math.floor(Math.random() * files.length)];
        musicPath = path.join(musicDir, randomFile);
        musicFileName = randomFile;
        console.log(`\n🎵 MUSIC DETAILS:`);
        console.log(`   ├── Source: Random fallback`);
        console.log(`   ├── File: ${randomFile}`);
        console.log(`   ├── Path: ${musicPath}`);
        console.log(`   └── Status: ✅ Found (${files.length} MP3 files available)`);
      } else {
        console.log(`\n🎵 MUSIC DETAILS:`);
        console.log(`   ├── Source: None`);
        console.log(`   └── Status: ⚠️ No MP3 files found in music folder`);
      }
    }

    const outputFilename = `reel_${uuidv4()}.mp4`;
    const outputPath = path.join(generatedDir, outputFilename);
    const absoluteOutputPath = path.join(process.cwd(), outputPath);

    // ============================================================
    // 🔥 CALCULATE DURATION (Min 16s - Max 33s)
    // ============================================================
    const MIN_DURATION = 16.0;
    const MAX_DURATION = 33.0;
    let slideDuration = selectedTemplate.slideDuration || 4.0;
    let estimatedTotal = photoCount * slideDuration;
    
    console.log(`\n⏱️ DURATION CALCULATION:`);
    console.log(`   ├── Original Slide Duration: ${slideDuration}s`);
    console.log(`   ├── Images: ${photoCount}`);
    console.log(`   ├── Estimated Total: ${estimatedTotal.toFixed(2)}s`);
    console.log(`   ├── Minimum Required: ${MIN_DURATION}s`);
    console.log(`   └── Maximum Allowed: ${MAX_DURATION}s`);
    
    if (estimatedTotal < MIN_DURATION) {
      slideDuration = MIN_DURATION / photoCount;
      console.log(`\n📌 ADJUSTMENT: Increased to ${slideDuration.toFixed(2)}s (to meet ${MIN_DURATION}s minimum)`);
    } else if (estimatedTotal > MAX_DURATION) {
      slideDuration = MAX_DURATION / photoCount;
      console.log(`\n📌 ADJUSTMENT: Decreased to ${slideDuration.toFixed(2)}s (to stay under ${MAX_DURATION}s maximum)`);
    } else {
      console.log(`\n✅ No adjustment needed (within ${MIN_DURATION}s - ${MAX_DURATION}s range)`);
    }
    
    const totalDuration = photoCount * slideDuration;
    console.log(`\n⏱️ FINAL DURATION:`);
    console.log(`   ├── Slide Duration: ${slideDuration.toFixed(2)}s`);
    console.log(`   ├── Total Duration: ${totalDuration.toFixed(2)}s`);
    console.log(`   └── Status: ✅ Valid`);

    // ✅ Process images with updated slide duration
    const templateWithDuration = {
      ...selectedTemplate,
      slideDuration: slideDuration
    };
    
    console.log(`\n🖼️ IMAGE PROCESSING:`);
    console.log(`   ├── Starting image processing...`);
    console.log(`   └── Applying template: ${selectedTemplate.name}`);
    
    let processedImages = await imageService.processImages(absolutePaths, templateWithDuration);
    console.log(`   ✅ ${processedImages.length} images processed successfully`);
    
    // ✅ Create collage if template has collage
    if (selectedTemplate.collage) {
      console.log(`\n🧩 COLLAGE CREATION:`);
      console.log(`   ├── Type: ${selectedTemplate.collageType || 'grid'}`);
      console.log(`   └── Creating collage...`);
      processedImages = await collageService.createCollage(processedImages, selectedTemplate);
      console.log(`   ✅ ${processedImages.length} collage images created`);
    }

    // ============================================================
    // 🔥 GENERATE VIDEO WITH REMOTION + FFMPEG
    // ============================================================
    console.log(`\n╔═══════════════════════════════════════════════════╗`);
    console.log(`║         🎬  VIDEO GENERATION PIPELINE           ║`);
    console.log(`╚═══════════════════════════════════════════════════╝`);
    console.log(`\n📊 PIPELINE SUMMARY:`);
    console.log(`   ├── Images: ${processedImages.length}`);
    console.log(`   ├── Music: ${musicFileName}`);
    console.log(`   ├── Template: ${selectedTemplate.name}`);
    console.log(`   ├── Slide Duration: ${slideDuration.toFixed(2)}s`);
    console.log(`   ├── Total Duration: ${totalDuration.toFixed(2)}s`);
    console.log(`   ├── Transitions: ${(selectedTemplate.transitions || ['fade']).slice(0, 5).join(', ')}`);
    console.log(`   ├── Effects: ${(selectedTemplate.effects || ['none']).slice(0, 5).join(', ')}`);
    console.log(`   └── Output: ${outputFilename}`);

    console.log(`\n🚀 STARTING GENERATION:`);
    console.log(`   ├── Phase 1: 🎬 Remotion rendering (effects + transitions)`);
    console.log(`   └── Phase 2: 🎵 FFmpeg adding music`);

    // 🔥 Generate video with Remotion + FFmpeg
    await videoService.createReel(processedImages, musicPath, templateWithDuration, absoluteOutputPath);

    if (!fs.existsSync(absoluteOutputPath)) {
      throw new Error('Video file was not created!');
    }

    // ✅ Get file size
    const stats = fs.statSync(absoluteOutputPath);
    const fileSizeMB = (stats.size / 1024 / 1024).toFixed(2);

    console.log(`\n✅ VIDEO GENERATION COMPLETED:`);
    console.log(`   ├── File: ${outputFilename}`);
    console.log(`   ├── Size: ${fileSizeMB} MB`);
    console.log(`   ├── Duration: ${totalDuration.toFixed(2)}s`);
    console.log(`   └── Status: ✅ Success`);

    // ✅ Save to MongoDB
    const newReel = new Reel({
      imagePaths: images,
      usedMusic: musicFileName,
      usedTemplate: selectedTemplate.name,
      templateId: selectedTemplate.id,
      videoUrl: `/generated/${outputFilename}`,
      status: 'completed'
    });
    await newReel.save();

    const remaining = templateHistory.length - templateIndex - 1;

    console.log(`\n╔═══════════════════════════════════════════════════╗`);
    console.log(`║         ✅  REEL GENERATION COMPLETED           ║`);
    console.log(`╚═══════════════════════════════════════════════════╝`);
    console.log(`\n📋 FINAL DETAILS:`);
    console.log(`   ├── Reel ID: ${newReel._id}`);
    console.log(`   ├── URL: /generated/${outputFilename}`);
    console.log(`   ├── Template: ${selectedTemplate.name}`);
    console.log(`   ├── Music: ${musicFileName}`);
    console.log(`   ├── Duration: ${totalDuration.toFixed(2)}s`);
    console.log(`   ├── Images: ${photoCount}`);
    console.log(`   └── Template Progress: ${templateIndex + 1}/${templateHistory.length} (${remaining} remaining)`);
    console.log(`\n╔═══════════════════════════════════════════════════╗`);
    console.log(`║         🎬  READY FOR DOWNLOAD                  ║`);
    console.log(`╚═══════════════════════════════════════════════════╝\n`);

    res.status(200).json({
      success: true,
      message: '✅ Reel generated with Remotion + FFmpeg!',
      url: `/generated/${outputFilename}`,
      reelId: newReel._id,
      usedTemplate: selectedTemplate.name,
      templateId: selectedTemplate.id,
      usedMusic: musicFileName,
      photoCount: images.length,
      duration: totalDuration.toFixed(2),
      fileSizeMB: fileSizeMB,
      templateProgress: {
        current: templateIndex + 1,
        total: templateHistory.length,
        remaining: remaining
      },
      templateDetails: {
        id: selectedTemplate.id,
        name: selectedTemplate.name,
        fixedPhotos: `${selectedTemplate.minPhotos}-${selectedTemplate.maxPhotos}`,
        slideDuration: slideDuration.toFixed(2),
        transitions: selectedTemplate.transitions || ['fade'],
        effects: selectedTemplate.effects || ['none'],
        colorGrades: selectedTemplate.colorGrades || ['none'],
        collage: selectedTemplate.collage || false
      }
    });

  } catch (error) {
    console.error(`\n❌ ERROR IN REEL GENERATION:`);
    console.error(`   ├── Message: ${error.message}`);
    console.error(`   ├── Stack: ${error.stack}`);
    console.error(`   └── Time: ${new Date().toISOString()}`);
    res.status(500).json({ error: error.message });
  }
};

// ============================================
// ✅ GET ALL REELS
// ============================================
exports.getAllReels = async (req, res) => {
  try {
    const reels = await Reel.find().sort({ createdAt: -1 }).limit(50);
    res.status(200).json({ success: true, count: reels.length, reels });
  } catch (error) {
    console.error('❌ Error fetching reels:', error);
    res.status(500).json({ error: 'Failed to fetch reels' });
  }
};

// ============================================
// ✅ GET LATEST REEL
// ============================================
exports.getLatestReel = async (req, res) => {
  try {
    const latestReel = await Reel.findOne().sort({ createdAt: -1 });
    if (!latestReel) return res.status(404).json({ error: 'No reels found' });
    res.status(200).json({ success: true, reel: latestReel });
  } catch (error) {
    console.error('❌ Error fetching latest reel:', error);
    res.status(500).json({ error: 'Failed to fetch latest reel' });
  }
};

// ============================================
// ✅ DELETE REEL
// ============================================
exports.deleteReel = async (req, res) => {
  try {
    const { id } = req.params;
    const reel = await Reel.findById(id);
    if (!reel) return res.status(404).json({ error: 'Reel not found' });

    const videoPath = path.join(__dirname, '..', reel.videoUrl);
    if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);

    if (reel.imagePaths) {
      reel.imagePaths.forEach(imgPath => {
        const fullPath = path.join(__dirname, '..', imgPath);
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      });
    }

    await Reel.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Reel deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting reel:', error);
    res.status(500).json({ error: 'Failed to delete reel' });
  }
};

// ============================================
// ✅ GENERATE REEL (Shotstack - placeholder)
// ============================================
exports.generateReelWithShotstack = async (req, res) => {
  res.status(501).json({ error: 'Shotstack not implemented' });
};

// ✅ Export for testing
exports.getTemplateQueue = () => ({
  history: templateHistory,
  currentIndex: templateIndex,
  remaining: templateHistory.length - templateIndex - 1,
  total: templateHistory.length
});
exports.resetTemplateRotation = resetTemplateRotation;