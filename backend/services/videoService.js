const { exec } = require("child_process");
const { spawnSync } = require("child_process");
const path = require("path");
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const crypto = require("crypto");

// ============================================================
// ✅ CACHE SYSTEM
// ============================================================
const CACHE_DIR = path.join(__dirname, '../cache');
if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });

function generateCacheKey(imagePaths, musicPath, template) {
    const hash = crypto.createHash('md5');
    // ✅ Sort images for consistent cache key
    const sortedImages = [...imagePaths].sort();
    hash.update(sortedImages.join('|'));
    hash.update(musicPath || '');
    hash.update(JSON.stringify(template));
    return hash.digest('hex');
}

// ============================================================
// FFmpeg Path Setup
// ============================================================
let ffmpegPath = null;
try {
  const { execSync } = require("child_process");
  execSync("ffmpeg -version", { stdio: "ignore" });
  ffmpegPath = "ffmpeg";
  console.log("✅ System FFmpeg found");
} catch (e) {
  console.log("⚠️ System FFmpeg not found, trying static...");
}

if (!ffmpegPath) {
  try {
    const ffmpegStatic = require("ffmpeg-static");
    if (ffmpegStatic && fs.existsSync(ffmpegStatic)) {
      ffmpegPath = ffmpegStatic;
      console.log(`✅ FFmpeg static found: ${ffmpegPath}`);
    }
  } catch (e) {}
}
ffmpeg.setFfmpegPath(ffmpegPath || "ffmpeg");

// ============================================================
// 🖥️ HARDWARE ENCODER DETECTION
// ============================================================
function detectHardwareEncoder() {
  console.log("\n🖥️ HARDWARE ENCODER DETECTION:");

  const encoderConfigs = [
    { gpuType: "NVIDIA", encoder: "h264_nvenc", testArgs: ["-encoders", "-f", "null", "-"], skip: false },
    { gpuType: "AMD", encoder: "h264_amf", testArgs: ["-encoders", "-f", "null", "-"], skip: false },
    { gpuType: "Intel", encoder: "h264_qsv", testArgs: ["-encoders", "-f", "null", "-"], skip: false },
  ];

  for (const config of encoderConfigs) {
    if (config.skip) continue;
    try {
      const result = spawnSync(ffmpegPath || "ffmpeg", config.testArgs, {
        timeout: 15000,
        stdio: ["pipe", "pipe", "pipe"],
      });
      if (result.status === 0) {
        console.log(`✅ [GPU SUCCESS] ${config.gpuType} acceleration enabled! Encoder: ${config.encoder}`);
        return { videoEncoder: config.encoder, isGpuEnabled: true, gpuType: config.gpuType };
      }
    } catch (e) {}
  }
  console.log("   ⚠️ No GPU encoder found, falling back to CPU");
  return { videoEncoder: "libx264", isGpuEnabled: false, gpuType: "CPU" };
}

const hardware = detectHardwareEncoder();
let videoEncoder = hardware.videoEncoder;
let isGpuEnabled = hardware.isGpuEnabled;

function getEncoderOptions(isGpu, encoder) {
  const common = ["-c:a", "aac", "-pix_fmt", "yuv420p", "-r", "30", "-movflags", "+faststart", "-y"];
  if (isGpu) {
    if (encoder === "h264_amf") {
      return ["-c:v", "h264_amf", "-usage", "lowlatency", "-quality", "speed", "-b:v", "4M", ...common];
    }
    if (encoder === "h264_nvenc") {
      return ["-c:v", "h264_nvenc", "-preset", "p2", "-b:v", "4M", ...common];
    }
  }
  return ["-c:v", "libx264", "-preset", "ultrafast", "-crf", "26", ...common];
}

// ============================================================
// ⏱️ DURATION CALCULATION
// ============================================================
function calculateDuration(numImages, template) {
  console.log(`\n⏱️ DURATION CALCULATION:`);
  console.log(`   ├── Images: ${numImages}`);
  console.log(`   ├── Template Slide Duration: ${template.slideDuration || 3.0}s`);

  const MIN_TOTAL_DURATION = 12.0;
  const MAX_TOTAL_DURATION = 30.0;

  let slideDuration = template.slideDuration || 3.0;
  let estimatedTotal = numImages * slideDuration;

  console.log(`   ├── Estimated Total: ${estimatedTotal.toFixed(2)}s`);
  console.log(`   ├── Target Range: ${MIN_TOTAL_DURATION}s - ${MAX_TOTAL_DURATION}s`);

  if (estimatedTotal < MIN_TOTAL_DURATION) {
    slideDuration = MIN_TOTAL_DURATION / numImages;
    console.log(`   📌 ADJUSTED: Increased slide duration to ${slideDuration.toFixed(2)}s`);
  } else if (estimatedTotal > MAX_TOTAL_DURATION) {
    slideDuration = MAX_TOTAL_DURATION / numImages;
    console.log(`   📌 ADJUSTED: Decreased slide duration to ${slideDuration.toFixed(2)}s`);
  } else {
    console.log(`   ✅ Perfect! Duration is within range.`);
  }

  const totalDuration = numImages * slideDuration;
  console.log(`   ✅ Final Slide Duration: ${slideDuration.toFixed(2)}s`);
  console.log(`   ✅ Final Total Duration: ${totalDuration.toFixed(2)}s`);

  return { slideDuration, totalDuration };
}

// ============================================================
// 🎬 EFFECTS FOR REMOTION
// ============================================================
const EFFECT_STYLES = {
  'zoom-in': (frame, duration) => ({
    transform: `scale(${1 + 0.25 * (frame / duration)})`,
  }),
  'zoom-out': (frame, duration) => ({
    transform: `scale(${1.25 - 0.25 * (frame / duration)})`,
  }),
  'zoomin': (frame, duration) => ({
    transform: `scale(${1 + 0.25 * (frame / duration)})`,
  }),
  'zoomout': (frame, duration) => ({
    transform: `scale(${1.25 - 0.25 * (frame / duration)})`,
  }),
  'zoom-slow': (frame, duration) => ({
    transform: `scale(${1 + 0.15 * (frame / duration)})`,
  }),
  'zoom-fast': (frame, duration) => ({
    transform: `scale(${1 + 0.4 * Math.sin((frame / duration) * Math.PI)})`,
  }),
  'zoom-pulse': (frame, duration) => ({
    transform: `scale(${1 + 0.08 * Math.sin((frame / duration) * Math.PI * 4)})`,
  }),
  'fast_slow': (frame, duration) => ({
    transform: `scale(${1 + 0.2 * Math.sin((frame / duration) * Math.PI * 2)})`,
  }),
  'slide-left': (frame, duration) => ({
    transform: `translateX(${-100 + 100 * (frame / Math.min(15, duration))}%)`,
  }),
  'slide-right': (frame, duration) => ({
    transform: `translateX(${100 - 100 * (frame / Math.min(15, duration))}%)`,
  }),
  'slide-up': (frame, duration) => ({
    transform: `translateY(${100 - 100 * (frame / Math.min(15, duration))}%)`,
  }),
  'slide-down': (frame, duration) => ({
    transform: `translateY(${-100 + 100 * (frame / Math.min(15, duration))}%)`,
  }),
  'smoothleft': (frame, duration) => ({
    transform: `translateX(${-100 + 100 * (frame / Math.min(20, duration))}%)`,
  }),
  'smoothright': (frame, duration) => ({
    transform: `translateX(${100 - 100 * (frame / Math.min(20, duration))}%)`,
  }),
  'slideleft': (frame, duration) => ({
    transform: `translateX(${-100 + 100 * (frame / Math.min(15, duration))}%)`,
  }),
  'slideright': (frame, duration) => ({
    transform: `translateX(${100 - 100 * (frame / Math.min(15, duration))}%)`,
  }),
  'slide': (frame, duration) => ({
    transform: `translateX(${-100 + 200 * (frame / duration)})`,
  }),
  'cube': (frame, duration) => ({
    transform: `perspective(1000px) rotateY(${90 - 90 * (frame / Math.min(15, duration))}deg) scale(0.9)`,
  }),
  'flip': (frame, duration) => ({
    transform: `perspective(1000px) rotateX(${180 - 180 * (frame / Math.min(15, duration))}deg) scale(0.9)`,
  }),
  'rotate-in': (frame, duration) => ({
    transform: `rotate(${-30 + 30 * (frame / duration)}deg) scale(${0.5 + 0.5 * (frame / duration)})`,
  }),
  '3d': (frame, duration) => ({
    transform: `perspective(800px) rotateY(${30 * Math.sin((frame / duration) * Math.PI * 2)})`,
  }),
  'vintage': () => ({ filter: 'sepia(0.6) contrast(1.1) brightness(1.05) saturate(0.8)' }),
  'sepia': () => ({ filter: 'sepia(0.8) contrast(1.05)' }),
  'bw': () => ({ filter: 'saturate(0)' }),
  'warm': () => ({ filter: 'sepia(0.3) brightness(1.1) saturate(1.2)' }),
  'cinematic': () => ({ filter: 'contrast(1.15) brightness(0.95) saturate(1.1)' }),
  'dreamy': () => ({ filter: 'brightness(1.05) contrast(0.95) blur(0.5px) saturate(0.8)' }),
  'vibrant': () => ({ filter: 'saturate(1.5) contrast(1.1) brightness(1.02)' }),
  'dramatic': () => ({ filter: 'contrast(1.3) brightness(0.95) saturate(1.1)' }),
  'golden': () => ({ filter: 'sepia(0.4) saturate(1.3) brightness(1.05) hue-rotate(-5deg)' }),
  'cool': () => ({ filter: 'saturate(0.8) hue-rotate(10deg) brightness(0.95)' }),
  'neon': () => ({ filter: 'saturate(1.6) contrast(1.2) brightness(1.05) hue-rotate(-20deg)' }),
  'neonglow': () => ({ filter: 'saturate(1.6) contrast(1.2) brightness(1.05) hue-rotate(-20deg)' }),
  'hdr': () => ({ filter: 'contrast(1.2) brightness(1.1) saturate(1.3)' }),
  'film-grain': (frame) => ({
    filter: `contrast(1.1) brightness(0.98) saturate(0.9)`,
    opacity: 0.95 + 0.05 * Math.sin(frame * 0.5),
  }),
  'pastel': () => ({ filter: 'saturate(0.7) brightness(1.1) contrast(0.9)' }),
  'rose': () => ({ filter: 'hue-rotate(-10deg) saturate(1.1) brightness(1.05)' }),
  'softfocus': () => ({ filter: 'blur(0.3px) brightness(1.02) saturate(0.9)' }),
  'pulse': (frame) => ({
    transform: `scale(${1 + 0.03 * Math.sin(frame * 0.2)})`,
  }),
  'glitch': (frame) => ({
    filter: frame % 15 < 3 ? 'hue-rotate(180deg) brightness(1.5) saturate(2)' : 'none',
    transform: frame % 15 < 3 ? `translate(${(Math.random() - 0.5) * 10}px, ${(Math.random() - 0.5) * 10}px)` : 'none',
  }),
  'flash': (frame) => ({
    filter: frame % 20 < 2 ? 'brightness(2) saturate(0)' : 'none',
  }),
  'pixelize': (frame) => ({
    filter: frame % 25 < 3 ? 'scale(0.5)' : 'none',
    transform: frame % 25 < 3 ? 'scale(2)' : 'scale(1)',
  }),
  'none': () => ({}),
};

// ============================================================
// 🔥 REMOTION RENDER
// ============================================================
function renderWithRemotion(imagePaths, template, slideDuration, tempOutputPath) {
  return new Promise((resolve, reject) => {
    const numImages = imagePaths.length;
    const effects = template.effects || ["zoomin"];
    const transitions = template.transitions || ["fade"];

    console.log(`\n🎬 REMOTION RENDER:`);
    console.log(`   ├── Images: ${numImages}`);
    console.log(`   ├── Effects: ${effects.slice(0, numImages).join(", ")}`);
    console.log(`   ├── Transitions: ${transitions.slice(0, numImages - 1).join(", ")}`);
    console.log(`   ├── Slide Duration: ${slideDuration.toFixed(2)}s`);
    console.log(`   ├── Output: ${path.basename(tempOutputPath)}`);
    console.log(`   └── Status: Rendering...`);

    const templateForRemotion = {
      name: template.name || "Reel",
      width: template.width || 1080,
      height: template.height || 1920,
      slideDuration: slideDuration,
      transitionDuration: template.transitionDuration || 0.6,
      transitions: transitions.slice(0, numImages - 1),
      effects: effects.slice(0, numImages),
      colorGrades: template.colorGrades || [],
      vignette: template.vignette || false,
      totalDuration: numImages * slideDuration,
      numImages: numImages,
    };

    const port = process.env.PORT || 5000;
    const serverBaseUrl = `http://localhost:${port}`;
    const imageUrls = imagePaths.map((imgPath) => {
      const relativePath = path.relative(process.cwd(), imgPath).replace(/\\/g, "/");
      return `${serverBaseUrl}/${relativePath}`;
    });

    const tempDataPath = path.join(__dirname, "../temp_data.json");
    const data = { images: imageUrls, template: templateForRemotion };
    fs.writeFileSync(tempDataPath, JSON.stringify(data, null, 2));

    const remotionDir = path.join(__dirname, "../remotion");
    const renderScript = path.join(remotionDir, "render.js");

    const gpuFlags = [
      '--enable-gpu',
      '--enable-hardware-overlays',
      '--enable-accelerated-2d-canvas',
      '--enable-accelerated-video-decode',
      '--enable-gpu-rasterization',
      '--ignore-gpu-blocklist',
      '--disable-gpu-sandbox',
      '--use-gl=egl',
      '--no-sandbox',
      '--disable-dev-shm-usage',
    ];

    const args = [`"${renderScript}"`, `"${tempDataPath}"`, `"${tempOutputPath}"`, ...gpuFlags];

    const { spawn } = require("child_process");
    const child = spawn("node", args, {
      cwd: remotionDir,
      stdio: "pipe",
      shell: true,
      windowsVerbatimArguments: true,
      env: { ...process.env, NODE_OPTIONS: '--max-old-space-size=8192', GPU_ENABLED: 'true' }
    });

    let stdoutData = "", stderrData = "";

    child.stdout.on("data", (data) => {
      const output = data.toString();
      stdoutData += output;
      console.log(output.trim());
    });

    child.stderr.on("data", (data) => {
      const output = data.toString();
      stderrData += output;
      console.error(output.trim());
    });

    child.on("close", (code) => {
      if (fs.existsSync(tempDataPath)) fs.unlinkSync(tempDataPath);
      if (code !== 0) {
        console.error(`   ❌ Remotion render exited with code ${code}`);
        console.error(`   ❌ Stderr: ${stderrData}`);
        return reject(new Error(`Remotion render failed with code ${code}: ${stderrData}`));
      }
      console.log(`   ✅ Remotion render completed!`);
      resolve();
    });

    child.on("error", (err) => {
      console.error(`   ❌ Remotion process error: ${err.message}`);
      reject(err);
    });
  });
}

// ============================================================
// 🎵 FFMPEG: Add Music & Finalize
// ============================================================
function addMusicWithFFmpeg(tempVideoPath, musicPath, outputPath) {
  return new Promise((resolve, reject) => {
    const hasMusic = musicPath && fs.existsSync(musicPath);

    if (!hasMusic) {
      console.log(`   ⚠️ No music found, renaming temp to final...`);
      if (fs.existsSync(tempVideoPath)) {
        fs.renameSync(tempVideoPath, outputPath);
        console.log(`   ✅ Final video ready (no music)!`);
      }
      return resolve();
    }

    console.log(`   🎬 Merging audio with video stream copy...`);

    ffmpeg()
      .input(tempVideoPath)
      .input(musicPath)
      .inputOptions(["-stream_loop -1"])
      .outputOptions([
        "-map 0:v:0",
        "-map 1:a:0",
        "-c:v copy",
        "-c:a aac",
        "-b:a 192k",
        "-shortest",
        "-y"
      ])
      .output(outputPath)
      .on("start", (cmd) => {
        console.log(`   🚀 FFmpeg started...`);
      })
      .on("end", () => {
        if (fs.existsSync(tempVideoPath)) {
          try { fs.unlinkSync(tempVideoPath); } catch (e) {}
        }
        console.log(`   ✅ Final video with music ready!`);
        resolve();
      })
      .on("error", (err) => {
        console.error(`   ❌ FFmpeg Error: ${err.message}`);
        reject(err);
      })
      .run();
  });
}

// ============================================================
// 🔥 MAIN FUNCTION - WITH CACHE
// ============================================================
exports.createReel = async (imagePaths, musicPath, template, outputPath) => {
  try {
    console.log(`\n╔═══════════════════════════════════════════════════╗`);
    console.log(`║        🎬  VIDEO SERVICE PIPELINE              ║`);
    console.log(`╚═══════════════════════════════════════════════════╝`);

    // ✅ CHECK CACHE FIRST
    const cacheKey = generateCacheKey(imagePaths, musicPath, template);
    const cachePath = path.join(CACHE_DIR, `${cacheKey}.mp4`);
    
    if (fs.existsSync(cachePath)) {
      console.log(`\n⚡⚡⚡ CACHE HIT! Using cached video`);
      console.log(`📁 Cache file: ${path.basename(cachePath)}`);
      fs.copyFileSync(cachePath, outputPath);
      console.log(`✅ Video copied from cache in < 1 second!`);
      return true;
    }
    
    console.log(`\n🔄 CACHE MISS - Rendering new video...`);

    const validImages = imagePaths.filter((img) => fs.existsSync(img));
    if (validImages.length === 0) {
      throw new Error("No valid images found!");
    }

    const numImages = validImages.length;
    const { slideDuration, totalDuration } = calculateDuration(numImages, template);

    const tempVideoPath = outputPath.replace(".mp4", "_temp.mp4");

    await renderWithRemotion(validImages, template, slideDuration, tempVideoPath);
    await addMusicWithFFmpeg(tempVideoPath, musicPath, outputPath);

    if (fs.existsSync(outputPath)) {
      const stats = fs.statSync(outputPath);
      const fileSizeMB = (stats.size / 1024 / 1024).toFixed(2);
      console.log(`\n📊 FINAL OUTPUT:`);
      console.log(`   ├── File: ${path.basename(outputPath)}`);
      console.log(`   ├── Size: ${fileSizeMB} MB`);
      console.log(`   ├── Duration: ${totalDuration.toFixed(2)}s`);
      console.log(`   └── Status: ✅ Success`);
      
      // ✅ SAVE TO CACHE
      fs.copyFileSync(outputPath, cachePath);
      console.log(`💾 Saved to cache: ${path.basename(cachePath)}`);
    }

    return true;
  } catch (error) {
    console.error(`\n❌ PIPELINE ERROR: ${error.message}`);
    throw error;
  }
};