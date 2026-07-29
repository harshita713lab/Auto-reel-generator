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

let data;
try {
    const dataContent = fs.readFileSync(dataFilePath, 'utf8');
    data = JSON.parse(dataContent);
} catch (err) {
    console.error('❌ Error reading data file:', err.message);
    process.exit(1);
}

const { images = [], template = {} } = data;

console.log(`\n🎬 Starting Remotion Render for ${images.length} images...`);

// ============================================================
// ✅ WINDOWS-SAFE CHROMIUM CONFIGURATION
// ============================================================
const chromiumOptions = {
    enableGpu: false,
    args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--single-process',
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
    const composition = await selectComposition({
        serveUrl: bundleLocation,
        id: 'ReelComposition',
        inputProps: {
            images: images,
            template: template,
            totalDuration: template.totalDuration || images.length * (template.slideDuration || 3),
            numImages: images.length,
        },
        chromiumOptions,
    });

    // Step 3: Render
    console.log(`🎬 Rendering video...`);
    await renderMedia({
        composition,
        serveUrl: bundleLocation,
        codec: 'h264',
        outputLocation: outputPath,
        inputProps: {
            images: images,
            template: template,
            totalDuration: template.totalDuration || images.length * (template.slideDuration || 3),
            numImages: images.length,
        },
        concurrency: 1,
        chromiumOptions,
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