// Test RoyalWeddingStory template individually
const renderService = require('../src/services/video/renderService');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

// Suppress noisy logging
const originalLog = console.log;
console.log = (...args) => {
  const msg = args.join(' ');
  if (msg.includes('data:image') || msg.includes('base64') ||
      msg.includes('"path"') || msg.includes('"duration"') ||
      msg.includes('"animation"') || msg.includes('"transition"') ||
      msg.includes('"music"') || msg.includes('"beatTimestamps"') ||
      msg.includes('"config"') || msg.includes('"width"') ||
      msg.includes('"height"') || msg.includes('"fps"') ||
      msg.includes('"backgroundColor"') || msg.includes('"transitionDuration"') ||
      msg.includes('"effects"') || msg.includes('"vignette"') ||
      msg.includes('"lightLeak"') || msg.includes('{') || msg.includes('}') ||
      msg.includes('[') || msg.includes(']') || msg.includes(',') ||
      msg.includes('"') || msg.includes(':')) {
    return;
  }
  originalLog(...args);
};

async function testRoyalWedding() {
  console.log('========================================================');
  console.log('🚀 TESTING RoyalWeddingStory TEMPLATE');
  console.log('========================================================\n');

  const testImgDir = path.join(__dirname, 'uploads/images');
  if (!fs.existsSync(testImgDir)) fs.mkdirSync(testImgDir, { recursive: true });
  const testImgPath = path.join(testImgDir, 'test_11_image.png');
  
  if (!fs.existsSync(testImgPath)) {
    await sharp({
      create: { width: 1080, height: 1920, channels: 4, background: { r: 240, g: 100, b: 50, alpha: 1 } }
    }).png().toFile(testImgPath);
  }

  const testImages = Array.from({ length: 11 }, (_, idx) => ({
    path: testImgPath,
    duration: 3,
    animation: 'kenBurns',
    transition: 'fade'
  }));

  const testReel = {
    id: 'test_royal_wedding',
    images: testImages,
    compositionId: 'RoyalWeddingStory',
    music: null,
    beatTimestamps: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    config: {
      width: 1080,
      height: 1920,
      fps: 30,
      backgroundColor: '#000000'
    }
  };

  const startTime = Date.now();
  try {
    const renderRes = await renderService.renderReel(testReel);
    const renderTime = ((Date.now() - startTime) / 1000).toFixed(1);
    const stats = fs.statSync(renderRes.filePath);
    console.log(`  ✅ SUCCESS (${renderTime}s, ${(stats.size/1024/1024).toFixed(1)}MB) -> ${renderRes.filePath}`);
  } catch (err) {
    const renderTime = ((Date.now() - startTime) / 1000).toFixed(1);
    console.error(`  ❌ FAILED (${renderTime}s)`);
    console.error(`  Error: ${err.message}`);
    console.error(`  Stack: ${err.stack}`);
  }
}

testRoyalWedding();