const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");

// ============================================================
// ✅ FFmpeg Path Setup
// ============================================================
let ffmpegPath = null;
try {
  const { execSync } = require("child_process");
  execSync("ffmpeg -version", { stdio: "ignore" });
  ffmpegPath = "ffmpeg";
  console.log("✅ System FFmpeg found");
} catch (e) {
  console.error("❌ FFmpeg not found! Please install FFmpeg.");
  process.exit(1);
}
ffmpeg.setFfmpegPath(ffmpegPath);

console.log("💻 Using CPU encoding (libx264)");

// ============================================================
// ✅ DURATION CALCULATION
// ============================================================
function calculateDuration(numImages, template) {
  console.log(`\n⏱️ DURATION CALCULATION:`);
  console.log(`   ├── Images: ${numImages}`);
  console.log(`   ├── Template Slide Duration: ${template.slideDuration || 3.0}s`);

  const MIN_TOTAL_DURATION = 16.0;
  const MAX_TOTAL_DURATION = 30.0;

  let slideDuration = template.slideDuration || 3.0;
  let estimatedTotal = numImages * slideDuration;

  console.log(`   ├── Estimated Total: ${estimatedTotal.toFixed(2)}s`);
  console.log(`   ├── Target Range: ${MIN_TOTAL_DURATION}s - ${MAX_TOTAL_DURATION}s`);

  if (estimatedTotal < MIN_TOTAL_DURATION) {
    slideDuration = MIN_TOTAL_DURATION / numImages;
    console.log(`   📌 Adjusted to ${slideDuration.toFixed(2)}s (minimum)`);
  } else if (estimatedTotal > MAX_TOTAL_DURATION) {
    slideDuration = MAX_TOTAL_DURATION / numImages;
    console.log(`   📌 Adjusted to ${slideDuration.toFixed(2)}s (maximum)`);
  } else {
    console.log(`   ✅ Within range`);
  }

  const totalDuration = numImages * slideDuration;
  console.log(`   ✅ Final: ${slideDuration.toFixed(2)}s per slide, ${totalDuration.toFixed(2)}s total`);

  return { slideDuration, totalDuration };
}

// ============================================================
// ✅ REMOTION RENDER
// ============================================================
function renderWithRemotion(
  imagePaths,
  template,
  slideDuration,
  tempOutputPath,
) {
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
      blurBackground: template.blurBackground || false,
      collage: template.collage || false,
      collageType: template.collageType || '',
      gap: template.gap || 10,
      totalDuration: numImages * slideDuration,
      numImages: numImages,
    };

    const port = process.env.PORT || 5000;
    const serverBaseUrl = `http://localhost:${port}`;
    
    const imageUrls = imagePaths.map((imgPath) => {
      const relativePath = path.relative(process.cwd(), imgPath).replace(/\\/g, "/");
      
      if (relativePath.includes('uploads/temp')) {
        const fileName = path.basename(imgPath);
        return `${serverBaseUrl}/uploads/temp/${fileName}`;
      }
      
      if (relativePath.includes('uploads/')) {
        return `${serverBaseUrl}/${relativePath}`;
      }
      
      return `${serverBaseUrl}/${relativePath}`;
    });

    console.log(`   🔗 Serving ${imageUrls.length} images via: ${serverBaseUrl}`);

    const tempDataPath = path.join(__dirname, "../temp_data.json");
    const data = {
      images: imageUrls,
      template: templateForRemotion,
    };
    fs.writeFileSync(tempDataPath, JSON.stringify(data, null, 2));

    const remotionDir = path.join(__dirname, "../remotion");
    const renderScript = path.join(remotionDir, "render.js");

    const command = `node "${renderScript}" "${tempDataPath}" "${tempOutputPath}"`;

    console.log(`   🚀 Command: ${command}`);

    exec(command, { 
      cwd: remotionDir, 
      maxBuffer: 1024 * 1024 * 10,
    }, (error, stdout, stderr) => {
      if (fs.existsSync(tempDataPath)) {
        fs.unlinkSync(tempDataPath);
        console.log(`   🗑️ Temp data file cleaned up`);
      }

      if (error) {
        console.error(`   ❌ Remotion render failed:`, error);
        console.error(`   ❌ Stderr:`, stderr);
        return reject(new Error(`Remotion render failed: ${error.message}`));
      }

      console.log(`   ✅ Remotion render completed!`);
      resolve();
    });
  });
}

// ============================================================
// ✅ FFMPEG: Add Music
// ============================================================
function addMusicWithFFmpeg(tempVideoPath, musicPath, outputPath) {
  return new Promise((resolve, reject) => {
    const hasMusic = musicPath && fs.existsSync(musicPath);

    console.log(`\n🎵 FFMPEG MUSIC ADD:`);
    console.log(`   ├── Music: ${hasMusic ? path.basename(musicPath) : "No Music"}`);
    console.log(`   ├── Temp: ${path.basename(tempVideoPath)}`);
    console.log(`   └── Output: ${path.basename(outputPath)}`);

    if (!hasMusic) {
      console.log(`   ⚠️ No music, renaming temp to final...`);
      if (fs.existsSync(tempVideoPath)) {
        fs.renameSync(tempVideoPath, outputPath);
        console.log(`   ✅ Final video ready (no music)`);
      }
      return resolve();
    }

    const tempPath = tempVideoPath.replace(/\\/g, "/");
    const musicPathEscaped = musicPath.replace(/\\/g, "/");
    const outPath = outputPath.replace(/\\/g, "/");

    const cmd = `ffmpeg -i "${tempPath}" -stream_loop -1 -i "${musicPathEscaped}" -y -map 0:v:0 -map 1:a? -c:v libx264 -preset fast -crf 23 -c:a aac -b:a 192k -shortest "${outPath}"`;

    console.log(`   📝 Running FFmpeg...`);

    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(`   ❌ FFmpeg Error: ${error.message}`);
        console.error(`   📝 Stderr: ${stderr}`);
        return reject(error);
      }

      if (fs.existsSync(tempVideoPath)) {
        try {
          fs.unlinkSync(tempVideoPath);
        } catch (e) {}
        console.log(`   🗑️ Temp file cleaned up`);
      }

      console.log(`   ✅ Final video with music ready!`);
      resolve();
    });
  });
}

// ============================================================
// 🔥 MAIN FUNCTION
// ============================================================
exports.createReel = async (imagePaths, musicPath, template, outputPath) => {
  try {
    console.log(`\n╔═══════════════════════════════════════════════════╗`);
    console.log(`║         🎬  VIDEO SERVICE PIPELINE              ║`);
    console.log(`╚═══════════════════════════════════════════════════╝`);

    console.log(`\n📥 INPUT SUMMARY:`);
    console.log(`   ├── Images: ${imagePaths.length}`);
    console.log(`   ├── Music: ${musicPath ? path.basename(musicPath) : "None"}`);
    console.log(`   ├── Template: ${template.name || "Unnamed"}`);
    console.log(`   └── Output: ${path.basename(outputPath)}`);

    const validImages = imagePaths.filter((img) => fs.existsSync(img));
    console.log(`   ✅ Valid Images: ${validImages.length}/${imagePaths.length}`);

    if (validImages.length === 0) {
      throw new Error("No valid images found!");
    }

    const numImages = validImages.length;

    console.log(`\n📐 TEMPLATE DETAILS:`);
    console.log(`   ├── Name: ${template.name || "Unnamed"}`);
    console.log(`   ├── ID: ${template.id || "N/A"}`);
    console.log(`   ├── Width: ${template.width || 1080}`);
    console.log(`   ├── Height: ${template.height || 1920}`);
    console.log(`   ├── Transitions: ${(template.transitions || ["fade"]).join(", ")}`);
    console.log(`   ├── Effects: ${(template.effects || ["none"]).join(", ")}`);
    console.log(`   ├── Color Grades: ${(template.colorGrades || ["none"]).join(", ")}`);
    console.log(`   ├── Collage: ${template.collage ? "Yes" : "No"}`);
    console.log(`   └── Vignette: ${template.vignette ? "Yes" : "No"}`);

    const { slideDuration, totalDuration } = calculateDuration(numImages, template);

    const tempVideoPath = outputPath.replace(".mp4", "_temp.mp4");
    console.log(`\n📁 OUTPUT PATHS:`);
    console.log(`   ├── Temp: ${path.basename(tempVideoPath)}`);
    console.log(`   └── Final: ${path.basename(outputPath)}`);

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
    }

    console.log(`\n╔═══════════════════════════════════════════════════╗`);
    console.log(`║         ✅  VIDEO SERVICE COMPLETED            ║`);
    console.log(`╚═══════════════════════════════════════════════════╝\n`);

    return true;
  } catch (error) {
    console.error(`\n❌ PIPELINE ERROR:`);
    console.error(`   ├── Message: ${error.message}`);
    console.error(`   └── Stack: ${error.stack}`);
    throw error;
  }
};