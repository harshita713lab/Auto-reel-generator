import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import os from 'os'; // ✅ ADD THIS - require ki jagah import

// 🔥 ES Module mein __dirname ka alternative
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 🔥 Command line arguments (Clean extra quotes if present)
const args = process.argv.slice(2);
const dataFilePath = args[0]?.replace(/^"|"$/g, '');
const outputPath = args[1]?.replace(/^"|"$/g, '');

// 🔥 Validate arguments
if (!dataFilePath || !outputPath) {
    console.error('❌ Usage: node render.js <dataFilePath> <outputPath>');
    process.exit(1);
}

// 🔥 Read data from file
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

// 🔥 Main render function
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
    });
    console.log(`🎬 Composition selected: ${composition.id}`);

    // ✅ GPU ACCELERATION - Chromium Options
    const chromiumOptions = {
        enableGpu: true,
        hardwareAcceleration: true,
        args: [
            '--enable-gpu',
            '--enable-hardware-overlays',
            '--enable-accelerated-2d-canvas',
            '--enable-accelerated-video-decode',
            '--enable-gpu-rasterization',
            '--enable-zero-copy',
            '--ignore-gpu-blocklist',
            '--disable-gpu-sandbox',
            '--disable-software-rasterizer',
            '--use-gl=egl',
            '--use-cmd-decoder=validating',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--memory-pressure-off',
            '--max_old_space_size=8192',
            '--disable-dev-shm-usage',
        ],
    };

    console.log(`🎮 GPU Acceleration: ENABLED`);

    // Step 3: Render the media with GPU
    await renderMedia({
        composition,
        serveUrl: serveUrl,
        codec: 'h264',
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
        concurrency: Math.min(4, os.cpus().length), // ✅ os import use karein
        chromiumOptions: chromiumOptions,
        timeoutInMilliseconds: 300000,
        framesPerLambda: 20,
    });

    console.log(`✅ Remotion rendered successfully with GPU acceleration: ${outputPath}`);
    process.exit(0);
} catch (err) {
    console.error('❌ Remotion render failed:', err);
    process.exit(1);
}