import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

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

// ============================================================
// ✅ READ DATA
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

console.log(`\n╔═══════════════════════════════════════════════════╗`);
console.log(`║         🎬  REMOTION RENDER STARTED             ║`);
console.log(`╚═══════════════════════════════════════════════════╝`);
console.log(`   ├── Images: ${images.length}`);
console.log(`   ├── Template: ${template.name || 'Unnamed'}`);
console.log(`   ├── Duration: ${template.totalDuration || images.length * template.slideDuration}s`);
console.log(`   ├── Effects: ${template.effects?.join(', ') || 'none'}`);
console.log(`   ├── Transitions: ${template.transitions?.join(', ') || 'none'}`);
console.log(`   └── Output: ${path.basename(outputPath)}`);

// ============================================================
// ✅ STABLE CHROMIUM OPTIONS (GPU DISABLED - Prevents EBADF)
// ============================================================
const chromiumOptions = {
    enableGpu: false,
    hardwareAcceleration: false,
    gl: 'swiftshader',
    args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-software-rasterizer',
        '--disable-accelerated-2d-canvas',
        '--disable-accelerated-video-decode',
        '--disable-gpu-sandbox',
        '--use-gl=swiftshader',
        '--single-process',
        '--max_old_space_size=8192',
    ],
};

// ============================================================
// ✅ MAIN RENDER FUNCTION
// ============================================================
try {
    // Step 1: Bundle
    console.log(`\n📦 Bundling Remotion project...`);
    const bundleLocation = await bundle({
        entryPoint: path.join(__dirname, 'src/index.tsx'),
        webpackOverride: (config) => config,
    });
    console.log(`   ✅ Bundle created`);

    // Step 2: Select composition
    console.log(`\n🎬 Selecting composition...`);
    const composition = await selectComposition({
        serveUrl: bundleLocation,
        id: 'ReelComposition',
        inputProps: {
            images: images,
            template: template,
            totalDuration: template.totalDuration || images.length * template.slideDuration,
            numImages: images.length,
        },
        chromiumOptions: chromiumOptions,
        offthreadVideoServer: false,
    });
    console.log(`   ✅ Composition selected: ${composition.id}`);

    // Step 3: Render
    console.log(`\n🎬 Rendering video...`);
    const renderOptions = {
        composition,
        serveUrl: bundleLocation,
        codec: 'h264',
        encoder: 'libx264',              // CPU encoding (stable)
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
        concurrency: 1,                  // Single process (stable)
        chromiumOptions: chromiumOptions,
        offthreadVideoServer: false,     // Prevents EBADF
        timeoutInMilliseconds: 300000,
        gpuAcceleration: false,          // GPU OFF
    };

    await renderMedia(renderOptions);

    // ✅ Verify output
    if (fs.existsSync(outputPath)) {
        const stats = fs.statSync(outputPath);
        const fileSizeMB = (stats.size / 1024 / 1024).toFixed(2);
        console.log(`\n╔═══════════════════════════════════════════════════╗`);
        console.log(`║         ✅  REMOTION RENDER COMPLETED           ║`);
        console.log(`╚═══════════════════════════════════════════════════╝`);
        console.log(`   ├── File: ${path.basename(outputPath)}`);
        console.log(`   ├── Size: ${fileSizeMB} MB`);
        console.log(`   └── Status: ✅ Success`);
    }

    process.exit(0);
} catch (err) {
    console.error(`\n❌ Remotion render failed:`);
    console.error(`   ├── Message: ${err.message}`);
    console.error(`   └── Stack: ${err.stack}`);
    process.exit(1);
}