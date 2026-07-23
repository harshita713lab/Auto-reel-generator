const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');

// FFmpeg Path Setup
let ffmpegPath = null;
try {
    const { execSync } = require('child_process');
    execSync('ffmpeg -version', { stdio: 'ignore' });
    ffmpegPath = 'ffmpeg';
    console.log('✅ System FFmpeg found');
} catch (e) {
    console.log('⚠️ System FFmpeg not found, trying static...');
}

if (!ffmpegPath) {
    try {
        const ffmpegStatic = require('ffmpeg-static');
        if (ffmpegStatic && fs.existsSync(ffmpegStatic)) {
            ffmpegPath = ffmpegStatic;
            console.log(`✅ FFmpeg static found: ${ffmpegPath}`);
        }
    } catch (e) {}
}
ffmpeg.setFfmpegPath(ffmpegPath || 'ffmpeg');

// ============================================================
// ⏱️ DURATION CALCULATION LOGIC (Min 16s - Max 33s)
// 
// ============================================================
// ⏱️ DURATION CALCULATION LOGIC (Min 15s - Max 20s)
// ============================================================
// 
// 
// // ============================================================
// ⏱️ DURATION CALCULATION LOGIC (Min 16s - Max 30s Range)
// ============================================================
function calculateDuration(numImages, template) {
    console.log(`\n⏱️ DURATION CALCULATION:`);
    console.log(`   ├── Images: ${numImages}`);
    console.log(`   ├── Template Slide Duration: ${template.slideDuration || 3.0}s`);
    
    // 🔥 Strict Limits: Minimum 16 seconds aur Maximum 30 seconds
    const MIN_TOTAL_DURATION = 16.0;
    const MAX_TOTAL_DURATION = 30.0;

    // Template ka slide duration lein, ya images ke hisab se ideal duration set karein
    let slideDuration = template.slideDuration || 3.0;
    let estimatedTotal = numImages * slideDuration;

    console.log(`   ├── Estimated Total: ${estimatedTotal.toFixed(2)}s`);
    console.log(`   ├── Target Range: ${MIN_TOTAL_DURATION}s - ${MAX_TOTAL_DURATION}s`);

    // Agar calculated duration 16 seconds se kam hai, toh slide duration badhao taaki kam se kam 16s bane
    if (estimatedTotal < MIN_TOTAL_DURATION) {
        slideDuration = MIN_TOTAL_DURATION / numImages;
        console.log(`   📌 ADJUSTED: Increased slide duration to ${slideDuration.toFixed(2)}s to meet minimum 16s limit.`);
    } 
    // Agar calculated duration 30 seconds se zyada hai, toh slide duration ghatao taaki max 30s ke andar rahe
    else if (estimatedTotal > MAX_TOTAL_DURATION) {
        slideDuration = MAX_TOTAL_DURATION / numImages;
        console.log(`   📌 ADJUSTED: Decreased slide duration to ${slideDuration.toFixed(2)}s to stay under 30s max limit.`);
    } 
    else {
        console.log(`   ✅ Perfect! Duration is already within the 16s - 30s range.`);
    }

    const totalDuration = numImages * slideDuration;
    console.log(`   ✅ Final Slide Duration: ${slideDuration.toFixed(2)}s`);
    console.log(`   ✅ Final Total Duration: ${totalDuration.toFixed(2)}s`);

    return {
        slideDuration: slideDuration,
        totalDuration: totalDuration
    };
}

// 🎬 REMOTION RENDER (Video with effects)
// ============================================================

function renderWithRemotion(imagePaths, template, slideDuration, tempOutputPath) {

    for (const config of encoderConfigs) {
        if (config.skip) continue;
        try {
            const result = spawnSync(ffmpegPath || 'ffmpeg', config.testArgs, { timeout: 15000, stdio: ['pipe','pipe','pipe'] });
            if (result.status === 0) {
                console.log(`✅ [GPU SUCCESS] ${config.gpuType} acceleration enabled! Encoder: ${config.encoder}`);
                return { videoEncoder: config.encoder, isGpuEnabled: true, gpuType: config.gpuType };
            }
        } catch (e) {}
    }
    return { videoEncoder: 'libx264', isGpuEnabled: false, gpuType: 'CPU' };
}


const hardware = detectHardwareEncoder();
let videoEncoder = hardware.videoEncoder;
let isGpuEnabled = hardware.isGpuEnabled;

// ✅ CUBE & ROTATING TRANSITIONS MAPPING
const TRANSITION_MAP = {
    'cube': 'squeezeh',
    'circle': 'circlecrop',
    'circleopen': 'circleopen',
    'radial': 'radial',
    'smoothleft': 'slideleft',
    'smoothright': 'slideright',
    'wipeleft': 'wipeleft',
    'wiperight': 'wiperight',
    'dissolve': 'fade'
};

const COLOR_GRADES = {
    'cinematic': 'colorbalance=rs=0.1:gs=0.05:bs=0.1,eq=contrast=1.1',
    'warm': 'colorbalance=rs=0.2:gs=0.05:bs=-0.1,eq=saturation=1.2',
    'golden': 'colorbalance=rs=0.25:gs=0.1:bs=-0.15',
    'cool': 'colorbalance=rs=-0.1:gs=0.05:bs=0.25',
    'vintage': 'colorbalance=rs=0.15:gs=0.1:bs=-0.05,hue=s=0.8',
    'neon': 'colorbalance=rs=0.3:gs=-0.1:bs=0.3,eq=contrast=1.2:saturation=1.3',
    'vibrant': 'eq=saturation=1.4:contrast=1.1',
    'dramatic': 'eq=contrast=1.3:brightness=-0.05'
};

function getEncoderOptions(isGpu, encoder) {
    const common = ['-c:a', 'aac', '-pix_fmt', 'yuv420p', '-r', '30', '-movflags', '+faststart', '-y'];
    if (isGpu) {
        if (encoder === 'h264_amf') {
            return ['-c:v', 'h264_amf', '-usage', 'lowlatency', '-quality', 'speed', '-b:v', '4M', ...common];
        }
        if (encoder === 'h264_nvenc') {
            return ['-c:v', 'h264_nvenc', '-preset', 'p2', '-b:v', '4M', ...common];
        }
    }
    return ['-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '26', ...common];
}

exports.createReel = (imagePaths, musicPath, template, outputPath) => {
    return new Promise((resolve, reject) => {
        const numImages = imagePaths.length;
        const effects = template.effects || ['zoomin'];
        const transitions = template.transitions || ['fade'];

        console.log(`\n🎬 REMOTION RENDER:`);
        console.log(`   ├── Images: ${numImages}`);
        console.log(`   ├── Effects: ${effects.slice(0, numImages).join(', ')}`);
        console.log(`   ├── Transitions: ${transitions.slice(0, numImages - 1).join(', ')}`);
        console.log(`   ├── Slide Duration: ${slideDuration.toFixed(2)}s`);
        console.log(`   ├── Output: ${path.basename(tempOutputPath)}`);
        console.log(`   └── Status: Rendering...`);

        // Build template for Remotion
        const templateForRemotion = {
            name: template.name || 'Reel',
            width: template.width || 1080,
            height: template.height || 1920,
            slideDuration: slideDuration,
            transitionDuration: template.transitionDuration || 0.6,
            transitions: transitions.slice(0, numImages - 1),
            effects: effects.slice(0, numImages),
            colorGrades: template.colorGrades || [],
            vignette: template.vignette || false,
            totalDuration: numImages * slideDuration,
            numImages: numImages
        };

        // 🔥 FIX: Convert file paths to URLs for Remotion
        const serverBaseUrl = process.env.BASE_URL || 'http://localhost:3000';
        const imageUrls = imagePaths.map(imgPath => {
            // Convert local path to URL
            // Example: C:\...\uploads\temp\abc.jpg -> http://localhost:3000/uploads/temp/abc.jpg
            const relativePath = path.relative(process.cwd(), imgPath).replace(/\\/g, '/');
            return `${serverBaseUrl}/${relativePath}`;
        });

        console.log(`   🔗 Serving images via: ${serverBaseUrl}`);

        // 🔥 Write JSON to temp file with URLs
        const tempDataPath = path.join(__dirname, '../temp_data.json');
        const data = {
            images: imageUrls,
            template: templateForRemotion
        };
        fs.writeFileSync(tempDataPath, JSON.stringify(data, null, 2));

        const remotionDir = path.join(__dirname, '../remotion');
        const renderScript = path.join(remotionDir, 'render.js');

        const args = [renderScript, tempDataPath, tempOutputPath];
        
        console.log(`   🚀 Command: node ${path.basename(renderScript)} [data.json] [output]`);

        const { spawn } = require('child_process');
        const child = spawn('node', args, {
            cwd: remotionDir,
            stdio: 'pipe',
            shell: true,
            windowsVerbatimArguments: true
        });

        let stdoutData = '';
        let stderrData = '';

        child.stdout.on('data', (data) => {
            const output = data.toString();
            stdoutData += output;
            console.log(output.trim());
        });

        child.stderr.on('data', (data) => {
            const output = data.toString();
            stderrData += output;
            console.error(output.trim());
        });

        child.on('close', (code) => {
            if (fs.existsSync(tempDataPath)) {
                fs.unlinkSync(tempDataPath);
                console.log(`   🗑️ Temp data file cleaned up`);
            }

            if (code !== 0) {
                console.error(`   ❌ Remotion render exited with code ${code}`);
                console.error(`   ❌ Stderr: ${stderrData}`);
                return reject(new Error(`Remotion render failed with code ${code}: ${stderrData}`));
            }
            console.log(`   ✅ Remotion render completed!`);
            resolve();
        });

        child.on('error', (err) => {
            console.error(`   ❌ Remotion process error: ${err.message}`);
            reject(err);
        });
    });
}
// ============================================================


// 🎵 FFMPEG: Add Music & Finalize (Corrected Input Order for Loop)
// ============================================================
function addMusicWithFFmpeg(tempVideoPath, musicPath, outputPath) {
    return new Promise((resolve, reject) => {
        const hasMusic = musicPath && fs.existsSync(musicPath);
        
        console.log(`\n🎵 FFMPEG MUSIC ADD:`);
        console.log(`   ├── Music Path: ${musicPath || 'None'}`);
        console.log(`   ├── Music File: ${hasMusic ? path.basename(musicPath) : 'No Music'}`);
        console.log(`   ├── Temp Video: ${path.basename(tempVideoPath)}`);
        console.log(`   └── Output: ${path.basename(outputPath)}`);
        
        if (!hasMusic) {
            console.log(`   ⚠️ No music found, renaming temp to final...`);
            if (fs.existsSync(tempVideoPath)) {
                fs.renameSync(tempVideoPath, outputPath);
                console.log(`   ✅ Final video ready (no music)!`);
            }
            return resolve();
        }

        console.log(`   🎬 Adding music with loop & FFmpeg streams mapping...`);
        
        ffmpeg()
            .input(tempVideoPath)
            // 🔥 CRITICAL FIX: -stream_loop ko music input se theek pehle lagana zaroori hai
            .input(musicPath)
            .inputOptions([
                '-stream_loop -1' 
            ])
            .outputOptions([
                '-map 0:v',        // Video temp video se
                '-map 1:a',        // Audio looped music se
                '-c:v copy',       // Video re-encode nahi hogi (Fast)
                '-c:a aac',        // Audio codec
                '-b:a 192k',       // Bitrate
                '-shortest',       // Temp video ki exact length par stop kar dega
                '-y'
            ])
            .output(outputPath)
            .on('start', (cmd) => {
                console.log(`   🚀 FFmpeg started... Command: ${cmd}`);
            })
            .on('end', () => {
                if (fs.existsSync(tempVideoPath)) {
                    fs.unlinkSync(tempVideoPath);
                    console.log(`   🗑️ Temp file cleaned up: ${path.basename(tempVideoPath)}`);
                }
                console.log(`   ✅ Final video with music ready!`);
                resolve();
            })
            .on('error', (err) => {
                console.error(`   ❌ FFmpeg Error: ${err.message}`);
                reject(err);
            })
            .run();
    });
}
// 🔥 MAIN FUNCTION: Remotion + FFmpeg Pipeline
// ============================================================
exports.createReel = async (imagePaths, musicPath, template, outputPath) => {
    try {
        console.log(`\n╔═══════════════════════════════════════════════════╗`);
        console.log(`║         🎬  VIDEO SERVICE PIPELINE              ║`);
        console.log(`╚═══════════════════════════════════════════════════╝`);

        console.log(`\n📥 INPUT SUMMARY:`);
        console.log(`   ├── Images: ${imagePaths.length}`);
        console.log(`   ├── Music: ${musicPath ? path.basename(musicPath) : 'None'}`);
        console.log(`   ├── Template: ${template.name || 'Unnamed'}`);
        console.log(`   ├── Output: ${path.basename(outputPath)}`);
        console.log(`   └── Valid Images: Checking...`);

        const validImages = imagePaths.filter(img => fs.existsSync(img));
        console.log(`   ✅ Valid Images: ${validImages.length}/${imagePaths.length}`);
        
        if (validImages.length === 0) {
            console.log(`   ❌ No valid images found!`);
            throw new Error('No valid images found!');
        }

        const numImages = validImages.length;
        
        // Step 1: Calculate Duration
        console.log(`\n📐 TEMPLATE DETAILS:`);
        console.log(`   ├── Name: ${template.name || 'Unnamed'}`);
        console.log(`   ├── ID: ${template.id || 'N/A'}`);
        console.log(`   ├── Width: ${template.width || 1080}`);
        console.log(`   ├── Height: ${template.height || 1920}`);
        console.log(`   ├── Transitions: ${(template.transitions || ['fade']).join(', ')}`);
        console.log(`   ├── Effects: ${(template.effects || ['none']).join(', ')}`);
        console.log(`   ├── Color Grades: ${(template.colorGrades || ['none']).join(', ')}`);
        console.log(`   └── Vignette: ${template.vignette ? 'Yes' : 'No'}`);

        const { slideDuration, totalDuration } = calculateDuration(numImages, template);
        console.log(`\n⏱️ FINAL TIMING:`);
        console.log(`   ├── Slide Duration: ${slideDuration.toFixed(2)}s`);
        console.log(`   ├── Total Duration: ${totalDuration.toFixed(2)}s`);
        console.log(`   └── Status: ✅ Valid`);

        // Step 2: Temp video path (without audio)
        const tempVideoPath = outputPath.replace('.mp4', '_temp.mp4');
        console.log(`\n📁 OUTPUT PATHS:`);
        console.log(`   ├── Temp: ${path.basename(tempVideoPath)}`);
        console.log(`   └── Final: ${path.basename(outputPath)}`);

        // Step 3: Render with Remotion
        await renderWithRemotion(validImages, template, slideDuration, tempVideoPath);

        // Step 4: Add music with FFmpeg
        await addMusicWithFFmpeg(tempVideoPath, musicPath, outputPath);

        // Step 5: Verify final output
        if (fs.existsSync(outputPath)) {
            const stats = fs.statSync(outputPath);
            const fileSizeMB = (stats.size / 1024 / 1024).toFixed(2);
            console.log(`\n📊 FINAL OUTPUT:`);
            console.log(`   ├── File: ${path.basename(outputPath)}`);
            console.log(`   ├── Size: ${fileSizeMB} MB`);
            console.log(`   ├── Duration: ${totalDuration.toFixed(2)}s`);
            console.log(`   └── Status: ✅ Success`);
        }

        console.log(`\n╔═══════════════════════════════════════════════════╗`);
        console.log(`║         ✅  VIDEO SERVICE COMPLETED            ║`);
        console.log(`╚═══════════════════════════════════════════════════╝\n`);
         function selectTemplate(photoCount) {
  const templates = allTemplates.filter(t => 
    photoCount >= t.minPhotos && photoCount <= t.maxPhotos
  );
  return templates[Math.floor(Math.random() * templates.length)];
} 
        return true;
    } catch (error) {
        console.error(`\n❌ PIPELINE ERROR:`);
        console.error(`   ├── Message: ${error.message}`);
        console.error(`   └── Stack: ${error.stack}`);
        throw error;
    }
};