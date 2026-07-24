// Test script to directly test videoService fixes
const path = require('path');
const fs = require('fs');

// Create temp test images if needed
const testImageDir = path.join(__dirname, 'test_images');
if (!fs.existsSync(testImageDir)) fs.mkdirSync(testImageDir, { recursive: true });

// Generate simple test images if they don't exist
const { execSync } = require('child_process');
let testImages = [];

// Try to find existing test images or create them
const existingPngs = fs.readdirSync(__dirname).filter(f => f.startsWith('test_') && f.endsWith('.png'));
if (existingPngs.length > 0) {
    testImages = existingPngs.map(f => path.join(__dirname, f));
    console.log(`✅ Found ${testImages.length} existing test images`);
} else {
    // Create test images using ffmpeg
    console.log('🎨 Creating test images...');
    for (let i = 1; i <= 3; i++) {
        const imgPath = path.join(testImageDir, `test_img_${i}.png`);
        try {
            execSync(`ffmpeg -y -f lavfi -i color=c=blue:size=1080x1920:d=1 -vf "drawtext=text='Image ${i}':fontsize=80:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2" -frames:v 1 "${imgPath}"`, { 
                stdio: 'ignore' 
            });
            testImages.push(imgPath);
            console.log(`  ✅ Created test image ${i}`);
        } catch(e) {
            // Simpler approach without drawtext
            try {
                execSync(`ffmpeg -y -f lavfi -i "color=c=blue:size=1080x1920:d=1" -frames:v 1 "${imgPath}"`, { 
                    stdio: 'ignore' 
                });
                testImages.push(imgPath);
                console.log(`  ✅ Created test image ${i} (simple)`);
            } catch(e2) {
                console.error(`  ❌ Failed to create image: ${e2.message}`);
            }
        }
    }
}

if (testImages.length === 0) {
    console.error('❌ No test images available');
    process.exit(1);
}

console.log(`\n📸 Using ${testImages.length} test images:`);
testImages.forEach((img, i) => console.log(`  ${i+1}. ${path.basename(img)}`));

// Import videoService
const videoService = require('./services/videoService');

// Template
const template = {
    id: 'simple_1',
    name: 'Test Template',
    width: 1080,
    height: 1920,
    slideDuration: 3,
    transitionDuration: 0.5,
    transition: 'fade',
    effect: 'none',
    quality: 'high'
};

// Music
const musicDir = path.join(__dirname, 'music');
let musicPath = '';
const musicFiles = fs.readdirSync(musicDir).filter(f => f.endsWith('.mp3'));
if (musicFiles.length > 0) {
    musicPath = path.join(musicDir, musicFiles[0]);
    console.log(`\n🎵 Using music: ${path.basename(musicPath)}`);
} else {
    console.log('\n⚠️ No music found, proceeding without music');
}

// Output
const outputPath = path.join(__dirname, 'test_output.mp4');
console.log(`\n📁 Output: ${outputPath}`);

// Run
console.log('\n========== TESTING VIDEO SERVICE ==========');
console.log(`🧪 Images: ${testImages.length} each with loop duration`);
console.log('⏳ Generating...\n');

videoService.createReel(testImages, musicPath, template, outputPath)
    .then(() => {
        console.log('\n✅ Video generated successfully!');
        
        // Check output
        const stats = fs.statSync(outputPath);
        console.log(`📁 File size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
        
        // Check actual duration using ffprobe
        try {
            const { execSync } = require('child_process');
            const probeOutput = execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${outputPath}"`, { encoding: 'utf-8' });
            const duration = parseFloat(probeOutput.trim());
            console.log(`⏱️ Actual video duration: ${duration.toFixed(2)} seconds`);
            
            if (duration >= 15) {
                console.log('✅ ✅ ✅ PASS: Video is 15+ seconds!');
            } else {
                console.log(`❌ FAIL: Video is only ${duration.toFixed(2)} seconds (expected >= 15)`);
            }
            
            if (duration <= 30.5) {
                console.log('✅ ✅ ✅ PASS: Video is <= 30 seconds!');
            } else {
                console.log(`❌ FAIL: Video is ${duration.toFixed(2)} seconds (expected <= 30)`);
            }
        } catch(e) {
            console.log('⚠️ Could not probe duration (ffprobe not available)');
            console.log('   Check file manually.');
        }
        
        console.log('\n📂 Output saved at:', outputPath);
    })
    .catch(err => {
        console.error('\n❌ FAILED:', err.message);
        console.error(err.stack);
    });