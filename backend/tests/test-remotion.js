// backend/tests/test-remotion.js
const remotionConfig = require('../src/config/remotion');
const path = require('path');

async function testRemotionRender() {
  console.log('\n--- 🧪 TEST 3: REMOTION RENDERER TEST ---');
  
  const testOptions = {
    inputProps: {
      images: [
        'https://picsum.photos/1080/1920?random=1',
        'https://picsum.photos/1080/1920?random=2',
      ],
      template: {
        name: 'Test Template',
        slideDuration: 3,
      },
    },
    outputPath: path.join(__dirname, '../output/renders/test_output.mp4'),
  };

  try {
    console.log('⏳ Rendering test video with Remotion...');
    const result = await remotionConfig.render('ReelComposition', testOptions);
    console.log('✅ Remotion Test Passed! Output saved to:', result.outputPath);
  } catch (error) {
    console.error('❌ Remotion Test Failed:', error.message);
  }
}

testRemotionRender();