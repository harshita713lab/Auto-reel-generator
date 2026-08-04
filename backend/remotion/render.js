import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ============================================================
// ✅ COMMAND LINE ARGUMENTS
// ============================================================
const args = process.argv.slice(2);
const dataFilePath = args[0]?.replace(/^"|"$/g, '');
const outputPath = args[1]?.replace(/^"|"$/g, '');

if (!dataFilePath || !outputPath) {
    console.error('❌ Usage: node render.js <dataFilePath> <outputPath>');
    process.exit(1);
}

let data;
try {
    const dataContent = fs.readFileSync(dataFilePath, 'utf8');
    data = JSON.parse(dataContent);
} catch (err) {
    console.error('❌ Error reading data file:', err.message);
    process.exit(1);
}
const {compositionId = "ReelComposition",
  inputProps = {},
} = data;

const {
  images = [],
  music = null,
  config = {},
  beatTimestamps = [],
} = inputProps;

// ============================================================
// ✅ AUTO-FIX BUGGY REMOTION FFMPEG BINARY (325KB MSVC crash fix)
// ============================================================
function fixRemotionFFmpeg() {
    try {
        const targetFFmpeg = path.join(__dirname, 'node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe');
        if (fs.existsSync(path.dirname(targetFFmpeg))) {
            const targetStats = fs.existsSync(targetFFmpeg) ? fs.statSync(targetFFmpeg) : null;
            if (!targetStats || targetStats.size < 5 * 1024 * 1024) {
                const systemFFmpeg = execSync('where ffmpeg', { encoding: 'utf8' }).trim().split(/[\r\n]+/)[0];
                if (systemFFmpeg && fs.existsSync(systemFFmpeg)) {
                    console.log(`🛠️ Replacing broken Remotion ffmpeg.exe (${targetStats ? targetStats.size : 0} B) with working system FFmpeg (${systemFFmpeg})...`);
                    fs.copyFileSync(systemFFmpeg, targetFFmpeg);
                    console.log(`✅ Successfully replaced Remotion FFmpeg binary!`);
                }
            }
        }
    } catch (err) {
        console.log(`⚠️ Note on FFmpeg auto-replace:`, err.message);
    }
}
try { fixRemotionFFmpeg(); } catch(e) {}

console.log(`\n🎬 Starting Remotion Render for ${images.length} images...`);

// ============================================================
// ✅ WINDOWS-SAFE CHROMIUM CONFIGURATION
// ============================================================
const chromiumOptions = {
  enableGpu: false,
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
    "--disable-gpu",
  ],
};

try {
    // Step 1: Bundle
    console.log(`📦 Bundling Remotion project...`);
    const bundleLocation = await bundle({
        entryPoint: path.join(__dirname, 'src/index.tsx'),
        webpackOverride: (config) => config,
    });

    // Step 2: Select Composition
    console.log(`🎬 Selecting composition...`);
   const renderInputProps = {
    ...(inputProps || {}),
    images,
    config,
    beatTimestamps,
    music: null, // Bypass Remotion audio compositor (prevents Windows Defender blocks & code 3236495362)
   };

   const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: compositionId,
    inputProps: renderInputProps,
    chromiumOptions,
});
    // Step 3: Render
    console.log(`🎬 Rendering video...`);
  await renderMedia({
    composition,
    serveUrl: bundleLocation,
    codec: "h264",
    outputLocation: outputPath,
    inputProps: renderInputProps,
    concurrency: 1,
    chromiumOptions,
    muted: true,
});

    if (fs.existsSync(outputPath)) {
        console.log(`✅ REMOTION RENDER COMPLETED SUCCESSFULLY: ${outputPath}`);
    }

    process.exit(0);
} catch (err) {
    console.error(`❌ Remotion render failed:`, err.message);
    console.error(err.stack);
    process.exit(1);
}