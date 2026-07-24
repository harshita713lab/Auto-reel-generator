import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

// 🔥 ES Module mein __dirname ka alternative
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 🔥 Command line arguments
const args = process.argv.slice(2);
const dataFilePath = args[0];
const outputPath = args[1];

// 🔥 Validate arguments
if (!dataFilePath || !outputPath) {
    console.error('❌ Usage: node render.js <dataFilePath> <outputPath>');
    console.error('📌 Example: node render.js data.json output.mp4');
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

    // Step 2: Select the composition
    const composition = await selectComposition({
        serveUrl: bundleLocation,
        id: 'ReelComposition',
        inputProps: {
            images: images,
            template: template,
            totalDuration: template.totalDuration || images.length * template.slideDuration,
            numImages: images.length,
        },
    });
    console.log(`🎬 Composition selected: ${composition.id}`);

    // Step 3: Render the media
    await renderMedia({
        composition,
        serveUrl: bundleLocation,
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
        jpegQuality: 80,  // 🔥 CHANGE: quality -> jpegQuality
        concurrency: 1,
    });

    console.log(`✅ Remotion rendered successfully: ${outputPath}`);
} catch (err) {
    console.error('❌ Remotion render failed:', err);
    process.exit(1);
}