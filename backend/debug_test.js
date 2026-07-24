const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 DEBUG: Testing FFmpeg with simple commands\n');

// Test 1: Check FFmpeg version
try {
    const version = execSync('ffmpeg -version', { encoding: 'utf-8' });
    console.log('✅ FFmpeg version:', version.split('\n')[0]);
} catch (e) {
    console.error('❌ FFmpeg not found!');
    process.exit(1);
}

// Test 2: Create simple video from collage images
const testImageDir = path.join(__dirname, 'uploads/temp');
const files = fs.readdirSync(testImageDir);
const images = files.filter(f => f.endsWith('.jpg') || f.endsWith('.png') || f.endsWith('.webp')).slice(0, 3);

if (images.length < 2) {
    console.error('❌ Not enough images!');
    process.exit(1);
}

console.log(`📸 Found ${images.length} images`);

// Test simple concat without complex filters
const imgPaths = images.map(f => path.join(testImageDir, f));
const outputPath = path.join(__dirname, 'test_simple.mp4');

try {
    console.log('🎬 Testing simple concatenation...');
    // Simple approach: use filter_complex with scale only
    const cmd = `ffmpeg -y -i "${imgPaths[0]}" -i "${imgPaths[1]}" -filter_complex "[0:v]scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2,format=yuv420p[v0];[1:v]scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2,format=yuv420p[v1];[v0][v1]concat=n=2:v=1:a=0" -c:v libx264 -preset fast -pix_fmt yuv420p -movflags +faststart -y "${outputPath}"`;
    
    console.log('📝 Command:', cmd);
    execSync(cmd, { stdio: 'inherit', encoding: 'utf-8' });
    
    if (fs.existsSync(outputPath)) {
        const stats = fs.statSync(outputPath);
        console.log(`✅ Simple video created! Size: ${(stats.size / 1024).toFixed(2)} KB`);
    }
} catch (e) {
    console.error('❌ Simple concat failed:', e.message);
}

// Test with xfade
const outputPath2 = path.join(__dirname, 'test_xfade.mp4');
try {
    console.log('\n🎬 Testing xfade transition...');
    const cmd = `ffmpeg -y -i "${imgPaths[0]}" -i "${imgPaths[1]}" -filter_complex "[0:v]scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2,format=yuv420p[v0];[1:v]scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2,format=yuv420p[v1];[v0][v1]xfade=transition=fade:duration=0.5:offset=3" -c:v libx264 -preset fast -pix_fmt yuv420p -movflags +faststart -y "${outputPath2}"`;
    
    execSync(cmd, { stdio: 'inherit', encoding: 'utf-8' });
    
    if (fs.existsSync(outputPath2)) {
        const stats = fs.statSync(outputPath2);
        console.log(`✅ Xfade video created! Size: ${(stats.size / 1024).toFixed(2)} KB`);
    }
} catch (e) {
    console.error('❌ Xfade failed:', e.message);
}

console.log('\n🔍 Debug complete!');