import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ============================================================
// 🔥 COMMAND LINE ARGUMENTS PARSING
// ============================================================
const args = process.argv.slice(2);
const dataFilePath = args[0]?.replace(/^"|"$/g, '');
const outputPath = args[1]?.replace(/^"|"$/g, '');

if (!dataFilePath || !outputPath) {
    console.error('❌ Usage: node render.js <dataFilePath> <outputPath>');
    process.exit(1);
}

// ============================================================
// 🔥 READ DATA FROM FILE
// ============================================================
let data;
try {
    const dataContent = fs.readFileSync(dataFilePath, 'utf8');
    data = JSON.parse(dataContent);
} catch (err) {
    console.error('❌ Error reading data file:', err.message);
    process.exit(1);
}

const { images, template } = data;

console.log(`📸 Rendering ${images.length} images with Remotion...`);
console.log(`📐 Template: ${template.name || 'Unnamed'}`);
console.log(`⏱️ Duration: ${template.totalDuration || images.length * template.slideDuration}s`);
console.log(`🎨 Effects: ${template.effects?.join(', ') || 'none'}`);
console.log(`🎬 Transitions: ${template.transitions?.join(', ') || 'none'}`);

// ============================================================
// 🔥 DISABLE GPU - SOFTWARE ENCODING (FIX FOR EBADF)
// ============================================================
console.log(`💻 Using Software Encoding (libx264) - GPU Disabled`);

// Chromium options with GPU DISABLED
const chromiumOptions = {
    enableGpu: false,              // ✅ GPU OFF
    hardwareAcceleration: false,    // ✅ Hardware acceleration OFF
    gl: 'swiftshader',             // ✅ Software renderer
    args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',            // ✅ Disable GPU
        '--disable-software-rasterizer',
        '--disable-accelerated-2d-canvas',
        '--disable-accelerated-video-decode',
        '--disable-gpu-sandbox',
        '--use-gl=swiftshader',     // ✅ Software GL
        '--single-process',
        '--max_old_space_size=8192',
    ],
};

// ============================================================
// 🔥 MAIN RENDER FUNCTION
// ============================================================
try {
    // Step 1: Bundle the Remotion project
    const bundleLocation = await bundle({
        entryPoint: path.join(__dirname, 'src/index.tsx'),
        webpackOverride: (config) => config,
    });
    console.log(`📦 Bundle created at: ${bundleLocation}`);

    const serveUrl = bundleLocation;
    console.log(`🔗 Serve URL: ${serveUrl}`);

    // Step 2: Select the composition
    const composition = await selectComposition({
        serveUrl: serveUrl,
        id: 'ReelComposition',
        inputProps: {
            images: images,
            template: template,
            totalDuration: template.totalDuration || images.length * template.slideDuration,
            numImages: images.length,
        },
        chromiumOptions: chromiumOptions,  // ✅ Add this
        offthreadVideoServer: false,       // ✅ IMPORTANT: Prevent offthread process
    });
    console.log(`🎬 Composition selected: ${composition.id}`);

    // Step 3: Render the media - SOFTWARE ENCODING
    const renderOptions = {
        composition,
        serveUrl: serveUrl,
        codec: 'h264',
        encoder: 'libx264',              // ✅ Software encoder (FIX)
        outputLocation: outputPath,
        inputProps: {
            images: images,
            template: template,
            totalDuration: template.totalDuration || images.length * template.slideDuration,
            numImages: images.length,
        },
        pixelFormat: 'yuv420p',
        imageFormat: 'jpeg',
        jpegQuality: 80,
        concurrency: 1,                  // ✅ Single process (more stable)
        chromiumOptions: chromiumOptions,
        offthreadVideoServer: false,     // ✅ CRITICAL: Prevents EBADF error
        timeoutInMilliseconds: 300000,
        gpuAcceleration: false,          // ✅ GPU OFF
    };

    await renderMedia(renderOptions);

    console.log(`✅ Remotion rendered successfully: ${outputPath}`);
    process.exit(0);
} catch (err) {
    console.error('❌ Remotion render failed:', err);
    process.exit(1);
}