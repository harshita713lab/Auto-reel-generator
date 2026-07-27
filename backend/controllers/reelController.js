const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const videoService = require("../services/videoService");
const collageService = require("../services/collageService");
const imageService = require("../services/imageService");
const Reel = require("../models/Reel");

const generatedDir = process.env.GENERATED_DIR || "./generated/reels";
const musicDir = path.resolve(__dirname, "..", "music");
const TEMPLATES_FILE = path.join(__dirname, "../templates.json");

if (!fs.existsSync(generatedDir))
  fs.mkdirSync(generatedDir, { recursive: true });
if (!fs.existsSync(musicDir)) fs.mkdirSync(musicDir, { recursive: true });

// ============================================================
// ✅ HELPER: Safe array conversion
// ============================================================
const makeArray = (val) => {
  if (Array.isArray(val)) return val;
  if (typeof val === "string" && val !== "") return [val];
  return ["none"];
};

// ============================================================
// ✅ TEMPLATE MANAGEMENT (SIMPLIFIED)
// ============================================================
let allTemplates = [];

function loadTemplates() {
  try {
    const rawData = fs.readFileSync(TEMPLATES_FILE, "utf8");
    const data = JSON.parse(rawData);
    if (Array.isArray(data)) {
      allTemplates = data;
    } else if (data.templates) {
      allTemplates = data.templates;
    } else {
      allTemplates = data;
    }
    console.log(`📋 Loaded ${allTemplates.length} templates`);
    return allTemplates;
  } catch (error) {
    console.error("❌ Error loading templates:", error.message);
    allTemplates = [];
    return allTemplates;
  }
}

// ✅ SIMPLIFIED: Get template by ID or matching photo count
function getTemplateForImages(imageCount, requestedId = null) {
  if (allTemplates.length === 0) loadTemplates();

  // If specific template requested, try to find it
  if (requestedId) {
    const template = allTemplates.find((t) => t.id === requestedId);
    if (template) {
      console.log(`🎯 Using requested template: ${template.name}`);
      return template;
    }
    console.log(`⚠️ Template ${requestedId} not found, using fallback`);
  }

  // Find matching templates by photo count
  let matchingTemplates = allTemplates.filter((t) => {
    const min = t.minPhotos || 1;
    const max = t.maxPhotos || 999;
    return imageCount >= min && imageCount <= max;
  });

  if (matchingTemplates.length === 0) {
    console.log(
      `⚠️ No template matches ${imageCount} photos, using all templates`,
    );
    matchingTemplates = allTemplates;
  }

  // ✅ Random selection (no rotation complexity)
  const selected =
    matchingTemplates[Math.floor(Math.random() * matchingTemplates.length)];
  console.log(
    `🎯 Selected: ${selected.name} (${selected.id}) for ${imageCount} photos`,
  );
  return selected;
}

// Load templates on startup
loadTemplates();

// ============================================================
// ✅ GET ALL TEMPLATES
// ============================================================
exports.getAllTemplates = async (req, res) => {
  try {
    const rawData = fs.readFileSync(TEMPLATES_FILE, "utf8");
    const data = JSON.parse(rawData);
    let templates = Array.isArray(data) ? data : data.templates || data;

    res.status(200).json({
      success: true,
      templates: templates,
      count: templates.length,
    });
  } catch (error) {
    console.error("❌ Error loading templates:", error.message);
    res.status(500).json({ error: "Failed to load templates" });
  }
};

// ============================================================
// ✅ GENERATE REEL
// ============================================================
exports.generateReel = async (req, res) => {
  try {
    console.log("\n╔═══════════════════════════════════════════════════╗");
    console.log("║         🎬  REEL GENERATION STARTED             ║");
    console.log("╚═══════════════════════════════════════════════════╝");

    const { images, templateId } = req.body;

    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ error: "No images provided" });
    }

    const photoCount = images.length;
    console.log(`\n📸 INPUT DETAILS:`);
    console.log(`   ├── Total Images: ${photoCount}`);
    console.log(`   ├── Template ID: ${templateId || "auto"}`);
    console.log(`   └── Images: ${images.length} files`);

    // ✅ Convert to absolute paths
    const absolutePaths = images.map((img) => {
      if (path.isAbsolute(img)) return img;
      return path.join(process.cwd(), img);
    });

    // ✅ Get template
    const selectedTemplate = getTemplateForImages(photoCount, templateId);

    console.log(`\n📐 TEMPLATE DETAILS:`);
    console.log(`   ├── ID: ${selectedTemplate.id}`);
    console.log(`   ├── Name: ${selectedTemplate.name}`);
    console.log(
      `   ├── Photos: ${selectedTemplate.minPhotos || 1}-${selectedTemplate.maxPhotos || 999}`,
    );
    console.log(
      `   ├── Transitions: ${makeArray(selectedTemplate.transitions).join(", ")}`,
    );
    console.log(
      `   ├── Effects: ${makeArray(selectedTemplate.effects).join(", ")}`,
    );
    console.log(
      `   ├── Color Grades: ${makeArray(selectedTemplate.colorGrades).join(", ")}`,
    );
    console.log(
      `   ├── Vignette: ${selectedTemplate.vignette ? "✅ Yes" : "❌ No"}`,
    );
    console.log(
      `   ├── Collage: ${selectedTemplate.collage ? "✅ Yes" : "❌ No"}`,
    );
    console.log(
      `   ├── Collage Type: ${selectedTemplate.collageType || "none"}`,
    );
    console.log(`   └── Quality: ${selectedTemplate.quality || "high"}`);

    // ✅ Get random music
    let musicPath = "";
    let musicFileName = "No Music";

    console.log(`\n🎵 Looking for MP3 files in: ${musicDir}`);
    const files = fs.readdirSync(musicDir).filter((f) => f.endsWith(".mp3"));
    console.log(`   🎵 MP3 files found: ${files.length}`);

    if (files.length > 0) {
      const randomFile = files[Math.floor(Math.random() * files.length)];
      musicPath = path.join(musicDir, randomFile);
      musicFileName = randomFile;
      console.log(`   ✅ Using: ${randomFile}`);
    } else {
      console.log(`   ⚠️ No MP3 files found`);
    }

    const outputFilename = `reel_${uuidv4()}.mp4`;
    const outputPath = path.join(generatedDir, outputFilename);
    const absoluteOutputPath = path.join(process.cwd(), outputPath);

    // ============================================================
    // 🔥 DURATION CALCULATION (16s - 33s)
    // ============================================================
    const MIN_DURATION = 16.0;
    const MAX_DURATION = 33.0;
    let slideDuration = selectedTemplate.slideDuration || 4.0;
    let estimatedTotal = photoCount * slideDuration;

    console.log(`\n⏱️ DURATION CALCULATION:`);
    console.log(`   ├── Slide Duration: ${slideDuration}s`);
    console.log(`   ├── Images: ${photoCount}`);
    console.log(`   ├── Estimated: ${estimatedTotal.toFixed(2)}s`);
    console.log(`   ├── Min: ${MIN_DURATION}s`);
    console.log(`   └── Max: ${MAX_DURATION}s`);

    if (estimatedTotal < MIN_DURATION) {
      slideDuration = MIN_DURATION / photoCount;
      console.log(`   📌 Adjusted to ${slideDuration.toFixed(2)}s (min)`);
    } else if (estimatedTotal > MAX_DURATION) {
      slideDuration = MAX_DURATION / photoCount;
      console.log(`   📌 Adjusted to ${slideDuration.toFixed(2)}s (max)`);
    } else {
      console.log(`   ✅ Within range`);
    }

    const totalDuration = photoCount * slideDuration;
    console.log(`   ✅ Final: ${totalDuration.toFixed(2)}s`);

    // ✅ Process images with duration
    const templateWithDuration = {
      ...selectedTemplate,
      slideDuration: slideDuration,
      transitions: makeArray(selectedTemplate.transitions),
      effects: makeArray(selectedTemplate.effects),
      colorGrades: makeArray(selectedTemplate.colorGrades),
    };

    console.log(`\n🖼️ IMAGE PROCESSING:`);
    let processedImages = await imageService.processImages(
      absolutePaths,
      templateWithDuration,
    );
    console.log(`   ✅ ${processedImages.length} images processed`);

    // ============================================================
    // 🔥 COLLAGE CREATION
    // ============================================================
    if (selectedTemplate.collage) {
      console.log(`\n🧩 COLLAGE CREATION:`);
      console.log(`   ├── Type: ${selectedTemplate.collageType || "vertical"}`);
      console.log(
        `   ├── Images per collage: ${selectedTemplate.imagesPerCollage || 3}`,
      );
      console.log(`   └── Creating collage...`);
      if (selectedTemplate.collage) {
        processedImages = await collageService.createCollage(
          processedImages,
          selectedTemplate,
        );
      } else {
        processedImages = await collageService.createCollage(
          processedImages,
          selectedTemplate,
        );
      }

      console.log(`   ✅ ${processedImages.length} collage images created`);
    }

    // ============================================================
    // 🔥 GENERATE VIDEO
    // ============================================================
    console.log(`\n🚀 GENERATING VIDEO:`);
    console.log(`   ├── Images: ${processedImages.length}`);
    console.log(`   ├── Music: ${musicFileName}`);
    console.log(`   ├── Template: ${selectedTemplate.name}`);
    console.log(`   ├── Duration: ${totalDuration.toFixed(2)}s`);
    console.log(
      `   ├── Transitions: ${makeArray(selectedTemplate.transitions).slice(0, 5).join(", ")}`,
    );
    console.log(
      `   ├── Effects: ${makeArray(selectedTemplate.effects).slice(0, 5).join(", ")}`,
    );
    console.log(`   └── Output: ${outputFilename}`);

    await videoService.createReel(
      processedImages,
      musicPath,
      templateWithDuration,
      absoluteOutputPath,
    );

    if (!fs.existsSync(absoluteOutputPath)) {
      throw new Error("Video file was not created!");
    }

    const stats = fs.statSync(absoluteOutputPath);
    const fileSizeMB = (stats.size / 1024 / 1024).toFixed(2);

    console.log(`\n✅ VIDEO GENERATED:`);
    console.log(`   ├── File: ${outputFilename}`);
    console.log(`   ├── Size: ${fileSizeMB} MB`);
    console.log(`   └── Status: ✅ Success`);

    // ✅ Save to MongoDB
    const newReel = new Reel({
      imagePaths: images,
      usedMusic: musicFileName,
      usedTemplate: selectedTemplate.name,
      templateId: selectedTemplate.id,
      videoUrl: `/generated/${outputFilename}`,
      status: "completed",
    });
    await newReel.save();

    console.log(`\n✅ REEL SAVED:`);
    console.log(`   ├── ID: ${newReel._id}`);
    console.log(`   ├── URL: /generated/${outputFilename}`);
    console.log(`   ├── Template: ${selectedTemplate.name}`);
    console.log(`   └── Music: ${musicFileName}`);

    res.status(200).json({
      success: true,
      message: "✅ Reel generated successfully!",
      url: `/generated/${outputFilename}`,
      reelId: newReel._id,
      usedTemplate: selectedTemplate.name,
      templateId: selectedTemplate.id,
      usedMusic: musicFileName,
      photoCount: images.length,
      duration: totalDuration.toFixed(2),
      fileSizeMB: fileSizeMB,
      templateDetails: {
        id: selectedTemplate.id,
        name: selectedTemplate.name,
        slideDuration: slideDuration.toFixed(2),
        transitions: makeArray(selectedTemplate.transitions),
        effects: makeArray(selectedTemplate.effects),
        colorGrades: makeArray(selectedTemplate.colorGrades),
        collage: selectedTemplate.collage || false,
        collageType: selectedTemplate.collageType || "none",
      },
    });
  } catch (error) {
    console.error(`\n❌ ERROR:`);
    console.error(`   ├── Message: ${error.message}`);
    console.error(`   └── Stack: ${error.stack}`);
    res.status(500).json({ error: error.message });
  }
};

// ============================================================
// ✅ GET ALL REELS
// ============================================================
exports.getAllReels = async (req, res) => {
  try {
    const reels = await Reel.find().sort({ createdAt: -1 }).limit(50);
    res.status(200).json({ success: true, count: reels.length, reels });
  } catch (error) {
    console.error("❌ Error fetching reels:", error);
    res.status(500).json({ error: "Failed to fetch reels" });
  }
};

// ============================================================
// ✅ GET LATEST REEL
// ============================================================
exports.getLatestReel = async (req, res) => {
  try {
    const latestReel = await Reel.findOne().sort({ createdAt: -1 });
    if (!latestReel) return res.status(404).json({ error: "No reels found" });
    res.status(200).json({ success: true, reel: latestReel });
  } catch (error) {
    console.error("❌ Error fetching latest reel:", error);
    res.status(500).json({ error: "Failed to fetch latest reel" });
  }
};

// ============================================================
// ✅ DELETE REEL
// ============================================================
exports.deleteReel = async (req, res) => {
  try {
    const { id } = req.params;
    const reel = await Reel.findById(id);
    if (!reel) return res.status(404).json({ error: "Reel not found" });

    // Delete video file
    const videoPath = path.join(__dirname, "..", reel.videoUrl);
    if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);

    // Delete image files
    if (reel.imagePaths) {
      reel.imagePaths.forEach((imgPath) => {
        const fullPath = path.join(__dirname, "..", imgPath);
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      });
    }

    await Reel.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "Reel deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting reel:", error);
    res.status(500).json({ error: "Failed to delete reel" });
  }
};
