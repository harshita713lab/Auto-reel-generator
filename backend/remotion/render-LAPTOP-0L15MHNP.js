import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import os from 'os';
import { spawnSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ============================================================
// 🔥 COMMAND LINE ARGUMENTS PARSING (TANISHA)
// ============================================================
const args = process.argv.slice(2);
const dataFilePath = args[0]?.replace(/^"|"$/g, '');
const outputPath = args[1]?.replace(/^"|"$/g, '');

// ✅ TANISHA: Parse GPU flags
const gpuFlags = args.slice(2);
const hardwareAcceleration = gpuFlags.includes('--hardware-acceleration=if-possible') 
  ? 'if-possible' 
  : 'disabled';
const glFlag = gpuFlags.find(flag => flag.startsWith('--gl='))?.replace('--gl=', '') || 'swiftshader';
const codec = gpuFlags.includes('--codec=h265') ? 'h265' : 'h264';
if (!dataFilePath || !outputPath) {
    console.error('❌ Usage: node render.js <dataFilePath> <outputPath> [flags]');
    console.error('   Flags: --hardware-acceleration=if-possible --gl=angle --codec=h264');
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
console.log(`🎨 Color Grades: ${template.colorGrades?.filter(Boolean).join(', ') || 'none'}`);
console.log(`🎬 Transitions: ${template.transitions?.join(', ') || 'none'}`);
console.log(`🚀 GPU Acceleration: ${hardwareAcceleration}`);
console.log(`🖥️ GL Renderer: ${glFlag}`);
console.log(`🎮 Codec: ${codec}`);

// ============================================================
// 🔥 CHECK GPU ENCODER (TANISHA)
// ============================================================
function checkGpuEncoder() {
    try {
        const result = spawnSync('ffmpeg', ['-encoders'], { encoding: 'utf8' });
        if (result.stdout && result.stdout.includes('h264_nvenc')) {
            console.log('🚀 GPU Acceleration Detected: Using h264_nvenc');
            return { codec: 'h264', encoder: 'h264_nvenc' };
        }
    } catch (e) {}
    console.log('💻 Using CPU Encoder (libx264)');
    return { codec: 'h264', encoder: undefined };
}

const gpuConfig = checkGpuEncoder();

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
    });
    console.log(`🎬 Composition selected: ${composition.id}`);

    // ============================================================
    // ✅ TUMHARA: Advanced GPU Chromium Options
    // ============================================================
    const chromiumOptions = {
        enableGpu: true,
        hardwareAcceleration: true,
        gl: glFlag, // ✅ TANISHA: Dynamic GL flag
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

    // ============================================================
    // ✅ TUMHARA + TANISHA: Render Options
    // ============================================================
    const renderOptions = {
        composition,
        serveUrl: serveUrl,
        codec: codec, // ✅ TANISHA: Dynamic codec
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
        concurrency: Math.min(4, os.cpus().length), // ✅ TUMHARA: Dynamic concurrency
        hardwareAcceleration: hardwareAcceleration, // ✅ TANISHA
        chromiumOptions: chromiumOptions,
        timeoutInMilliseconds: 300000, // ✅ TUMHARA: 5 min timeout
        framesPerLambda: 20, // ✅ TUMHARA: Better performance
    };

    // ✅ TANISHA: Add custom encoder if available
    if (gpuConfig.encoder) {
        renderOptions.customEncoder = gpuConfig.encoder;
        console.log(`🎬 Using custom encoder: ${gpuConfig.encoder}`);
    }

    // Step 3: Render the media
    await renderMedia(renderOptions);

    console.log(`✅ Remotion rendered successfully: ${outputPath}`);
    process.exit(0);
} catch (err) {
    console.error('❌ Remotion render failed:', err);
    process.exit(1);
}