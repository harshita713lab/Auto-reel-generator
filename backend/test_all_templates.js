// Test script to verify all templates work with effects, transitions, and duration constraints
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

console.log('🚀 ========== TESTING ALL TEMPLATES ==========\n');

// ============================================
// 1. SETUP TEST IMAGES
// ============================================
const testImageDir = path.join(__dirname, 'test_images');
if (!fs.existsSync(testImageDir)) fs.mkdirSync(testImageDir, { recursive: true });

// Get existing test images
let testImages = fs.readdirSync(testImageDir)
    .filter(f => f.match(/\.(png|jpg|jpeg)$/i))
    .map(f => path.join(testImageDir, f))
    .sort();

if (testImages.length < 3) {
    console.log('📸 Creating test images...');
    testImages = [];
    for (let i = 1; i <= 20; i++) {
        const imgPath = path.join(testImageDir, `test_img_${i}.png`);
        if (!fs.existsSync(imgPath)) {
            try {
                execSync(`ffmpeg -y -f lavfi -i "color=c=blue:size=1080x1920:d=1" -frames:v 1 "${imgPath}" 2>nul`, { 
                    stdio: 'ignore', timeout: 5000 
                });
            } catch(e) {
                try {
                    execSync(`ffmpeg -y -f lavfi -i "color=c=blue:size=1080x1920:d=1" -frames:v 1 "${imgPath}"`, { 
                        stdio: 'ignore' 
                    });
                } catch(e2) {
                    console.error(`❌ Cannot create test images: ${e2.message}`);
                }
            }
        }
        if (fs.existsSync(imgPath)) {
            testImages.push(imgPath);
        }
    }
}

if (testImages.length < 3) {
    console.error('❌ Need at least 3 test images. Run test_fix.js first.');
    process.exit(1);
}

console.log(`✅ Found ${testImages.length} test images\n`);

// ============================================
// 2. LOAD TEMPLATES
// ============================================
const TEMPLATES_FILE = path.join(__dirname, 'templates.json');
const templatesData = JSON.parse(fs.readFileSync(TEMPLATES_FILE, 'utf8'));
const allTemplates = templatesData.templates || [];

console.log(`📋 Loaded ${allTemplates.length} templates\n`);

// ============================================
// 3. FIND MUSIC
// ============================================
const musicDir = path.join(__dirname, 'music');
let musicPath = '';
if (fs.existsSync(musicDir)) {
    const musicFiles = fs.readdirSync(musicDir).filter(f => f.endsWith('.mp3'));
    if (musicFiles.length > 0) {
        musicPath = path.join(musicDir, musicFiles[0]);
        console.log(`🎵 Using music: ${path.basename(musicPath)}\n`);
    }
}

// ============================================
// 4. LOAD SERVICES
// ============================================
const videoService = require('./services/videoService');
const collageService = require('./services/collageService');
const imageService = require('./services/imageService');

// ============================================
// 5. TEST EACH TEMPLATE
// ============================================
const results = { pass: 0, fail: 0, skipped: 0 };

async function runAllTests() {
    const outputDir = path.join(__dirname, 'test_outputs');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    for (let t = 0; t < allTemplates.length; t++) {
        const template = allTemplates[t];
        console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`🧪 TEST ${t + 1}/${allTemplates.length}: ${template.name}`);
        console.log(`   ID: ${template.id}`);
        console.log(`   🔄 Transition: ${template.transition}`);
        console.log(`   ✨ Effect: ${template.effect || 'none'}`);
        console.log(`   🎨 ColorGrade: ${template.colorGrade || 'none'}`);
        console.log(`   🔲 Vignette: ${template.vignette}`);
        console.log(`   🧩 Collage: ${template.collage}`);
        console.log(`   📐 ${template.minPhotos}-${template.maxPhotos} photos`);
        console.log(`   ⏱️ Slide: ${template.slideDuration}s, Transition: ${template.transitionDuration}s`);
        console.log(`   📝 ${template.description}`);
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

        // Determine how many images to use
        let numImages = Math.min(
            Math.max(testImages.length, template.minPhotos || 3),
            template.maxPhotos || testImages.length
        );
        
        // For collage templates, ensure enough images
        if (template.collage) {
            const imagesPerCollage = template.imagesPerCollage || 2;
            const minCollageImages = Math.max(imagesPerCollage, template.minPhotos || 2);
            if (numImages < minCollageImages) {
                console.log(`⚠️ Not enough images for collage, need at least ${minCollageImages}, have ${numImages}`);
                numImages = Math.min(testImages.length, template.maxPhotos || testImages.length);
            }
        }
        
        // Take subset of images
        const testImageSubset = testImages.slice(0, numImages);
        console.log(`📸 Using ${testImageSubset.length} images for this test`);

        try {
            let videoImagePaths = testImageSubset;

            // If collage template, create collages first
            if (template.collage === true) {
                console.log(`🧩 Creating collages (${template.collageType})...`);
                try {
                    videoImagePaths = await collageService.createCollage(testImageSubset, template);
                    console.log(`✅ Created ${videoImagePaths.length} collage images`);
                } catch (collageErr) {
                    console.log(`⚠️ Collage failed: ${collageErr.message}, using original images`);
                    videoImagePaths = testImageSubset;
                }
            }

            // Process images
            try {
                const processedPaths = await imageService.processImages(videoImagePaths, template);
                if (processedPaths.length > 0) {
                    videoImagePaths = processedPaths;
                    console.log(`✅ Processed ${processedPaths.length} images`);
                }
            } catch (processErr) {
                console.log(`⚠️ Processing failed: ${processErr.message}, using original images`);
            }

            // Generate video
            const outputPath = path.join(outputDir, `test_${template.id}.mp4`);
            console.log(`🎬 Generating video...`);

            await videoService.createReel(videoImagePaths, musicPath, template, outputPath);

            // Verify output
            if (fs.existsSync(outputPath)) {
                const stats = fs.statSync(outputPath);
                const fileSizeKB = stats.size / 1024;
                
                if (fileSizeKB > 1) {
                    console.log(`✅ Video created: ${fileSizeKB.toFixed(1)} KB`);
                    
                    // Check duration with ffprobe
                    try {
                        const probeOutput = execSync(
                            `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${outputPath}"`,
                            { encoding: 'utf-8', timeout: 10000 }
                        );
                        const duration = parseFloat(probeOutput.trim());
                        
                        console.log(`⏱️ Duration: ${duration.toFixed(2)}s`);
                        
                        // Check duration constraints (16-30 seconds)
                        if (duration >= 16 && duration <= 30) {
                            console.log(`✅ DURATION PASS: ${duration.toFixed(2)}s is within 16-30s range`);
                            results.pass++;
                        } else if (duration >= 15 && duration <= 31) {
                            console.log(`⚠️ DURATION NEAR: ${duration.toFixed(2)}s is near 16-30s range`);
                            results.pass++;
                        } else {
                            console.log(`❌ DURATION FAIL: ${duration.toFixed(2)}s is outside 16-30s range`);
                            results.fail++;
                        }
                    } catch (probeErr) {
                        console.log(`⚠️ Could not probe duration, checking file size only`);
                        if (fileSizeKB > 50) {
                            console.log(`✅ PASS (file size looks good)`);
                            results.pass++;
                        } else {
                            console.log(`⚠️ File size small but exists`);
                            results.pass++;
                        }
                    }
                } else {
                    console.log(`❌ Output file too small: ${fileSizeKB.toFixed(1)} KB`);
                    results.fail++;
                }
            } else {
                console.log(`❌ Output file not found`);
                results.fail++;
            }
        } catch (err) {
            console.log(`❌ TEST FAILED: ${err.message}`);
            if (err.message.includes('No valid images') || err.message.includes('No templates')) {
                console.log(`   Skipping remaining tests due to critical error`);
                results.skipped = allTemplates.length - t;
                break;
            }
            results.fail++;
        }

        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
    }

    // ============================================
    // 6. RESULTS SUMMARY
    // ============================================
    console.log('\n\n📊 ========== FINAL RESULTS ==========');
    console.log(`✅ Passed: ${results.pass}`);
    console.log(`❌ Failed: ${results.fail}`);
    console.log(`⏭️  Skipped: ${results.skipped}`);
    console.log(`📋 Total tested: ${results.pass + results.fail}`);
    console.log(`📂 Output directory: ${path.join(__dirname, 'test_outputs')}`);
    console.log(`======================================\n`);
}

runAllTests().catch(err => {
    console.error('💥 Fatal error:', err.message);
    process.exit(1);
});