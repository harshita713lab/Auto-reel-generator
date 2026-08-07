const renderService = require('./src/services/video/renderService');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

async function test11ImagesCompositions() {
  console.log('Creating test image...');
  const testImgDir = path.join(__dirname, 'uploads/images');
  if (!fs.existsSync(testImgDir)) fs.mkdirSync(testImgDir, { recursive: true });
  const testImgPath = path.join(testImgDir, 'test_11_image.png');
  
  await sharp({
    create: { width: 1080, height: 1920, channels: 4, background: { r: 255, g: 100, b: 50, alpha: 1 } }
  }).png().toFile(testImgPath);

  const compositionsToTest = [
    'MemoryJourneyWeddingReel',
    'RoyalWeddingStory',
    'CinematicWeddingReel',
    'ReelComposition',
    'WhiteCardCarousel',
    'WhiteCardPolaroidStack',
    'WeddingSplitSlider'
  ];

  for (const compId of compositionsToTest) {
    console.log(`\n----------------------------------------`);
    console.log(`Testing 11 images with Composition: ${compId}`);
    console.log(`----------------------------------------`);
    const testImages = Array.from({ length: 11 }, (_, i) => ({
      path: testImgPath,
      duration: 3,
      animation: 'kenBurns',
      transition: 'fade'
    }));

    const testReel = {
      id: `test_11_${compId}`,
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

    try {
      const result = await renderService.renderReel(testReel);
      console.log(`✅ ${compId} PASSED WITH 11 IMAGES!`);
    } catch (err) {
      console.error(`❌ ${compId} FAILED WITH 11 IMAGES:`, err.message);
    }
  }
}

test11ImagesCompositions();
