// Clean test script - suppresses noisy base64 logging
const renderService = require('./src/services/video/renderService');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

// Suppress console.log from renderService (base64 image data flooding)
const originalLog = console.log;
console.log = (...args) => {
  // Only show important messages, filter out base64 data
  const msg = args.join(' ');
  if (msg.includes('REEL IMAGES') || msg.includes('INPUT PROPS') || 
      msg.includes('data:image') || msg.includes('base64') ||
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
    return; // suppress
  }
  originalLog(...args);
};

async function testAll12Templates() {
  console.log('========================================================');
  console.log('🚀 TESTING ALL 12 TEMPLATES');
  console.log('========================================================\n');

  const testImgDir = path.join(__dirname, 'uploads/images');
  if (!fs.existsSync(testImgDir)) fs.mkdirSync(testImgDir, { recursive: true });
  const testImgPath = path.join(testImgDir, 'test_11_image.png');
  
  if (!fs.existsSync(testImgPath)) {
    await sharp({
      create: { width: 1080, height: 1920, channels: 4, background: { r: 240, g: 100, b: 50, alpha: 1 } }
    }).png().toFile(testImgPath);
  }

  const allCompositions = [
    'ReelComposition',
    'MemoryBlendReel',
    'WhiteCardGrid3x3',
    'WhiteCardCarousel',
    'WhiteCardPolaroidStack',
    'WhiteCardMasonry',
    'PremiumGrid',
    'WeddingSequenceComposition',
    'WeddingSplitSlider',
    'CinematicWeddingReel',
    'MemoryJourneyWeddingReel',
    'RoyalWeddingStory'
  ];

  const results = [];

  for (let i = 0; i < allCompositions.length; i++) {
    const compId = allCompositions[i];
    console.log(`[${i + 1}/${allCompositions.length}] Testing: ${compId}...`);
    
    const testImages = Array.from({ length: 11 }, (_, idx) => ({
      path: testImgPath,
      duration: 3,
      animation: 'kenBurns',
      transition: 'fade'
    }));

    const testReel = {
      id: `test_all_${compId}`,
      images: testImages,
      compositionId: compId,
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
      console.log(`  ✅ SUCCESS (${renderTime}s, ${(stats.size/1024/1024).toFixed(1)}MB) -> ${renderRes.filePath}\n`);
      results.push({ compId, status: 'PASSED', time: renderTime, sizeMB: (stats.size/1024/1024).toFixed(1) });
    } catch (err) {
      const renderTime = ((Date.now() - startTime) / 1000).toFixed(1);
      console.error(`  ❌ FAILED (${renderTime}s): ${err.message}\n`);
      results.push({ compId, status: 'FAILED', time: renderTime, error: err.message });
    }
  }

  console.log('\n========================================================');
  console.log('📊 FINAL TEST SUMMARY (ALL 12 TEMPLATES)');
  console.log('========================================================');
  console.table(results);
  
  // Write results to file
  fs.writeFileSync(path.join(__dirname, 'template_test_results.json'), JSON.stringify(results, null, 2));
  console.log('\nResults saved to template_test_results.json');
}

testAll12Templates();