const renderService = require('../src/services/video/renderService');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

async function testAll12Templates() {
  console.log('========================================================');
  console.log('🚀 TESTING ALL 12 TEMPLATES WITH 11 IMAGES');
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
    console.log(`[${i + 1}/${allCompositions.length}] Testing Composition: ${compId}...`);
    
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
      console.log(`  ✅ SUCCESS (${renderTime}s, ${stats.size} bytes) -> ${renderRes.filePath}\n`);
      results.push({ compId, status: 'PASSED', time: renderTime, size: stats.size });
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
}

testAll12Templates();
