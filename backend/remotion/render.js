import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

const { compositionId = 'ReelComposition', inputProps = {} } = data;
const { images = [], config = {}, beatTimestamps = [] } = inputProps;

function fixRemotionFFmpeg() {
    try {
        const targetFFmpeg = path.join(
            __dirname,
            'node_modules',
            '@remotion',
            'compositor-win32-x64-msvc',
            'ffmpeg.exe'
        );

        if (!fs.existsSync(path.dirname(targetFFmpeg))) {
            return;
        }

        const targetStats = fs.existsSync(targetFFmpeg)
            ? fs.statSync(targetFFmpeg)
            : null;

        if (!targetStats || targetStats.size < 5 * 1024 * 1024) {
            const systemFFmpeg = execSync('where ffmpeg', { encoding: 'utf8' })
                .trim()
                .split(/[\r\n]+/)[0];

            if (systemFFmpeg && fs.existsSync(systemFFmpeg)) {
                console.log(
                    `🛠️ Replacing broken Remotion FFmpeg (${targetStats ? targetStats.size : 0} bytes)...`
                );
                fs.copyFileSync(systemFFmpeg, targetFFmpeg);
                console.log('✅ Remotion FFmpeg binary updated successfully!');
            }
        }
    } catch (err) {
        console.log(`⚠️ FFmpeg auto-fix skipped: ${err.message}`);
    }
}

fixRemotionFFmpeg();

console.log(`\n🎬 Starting Remotion Render for ${images.length} images...`);
console.log(`🎯 Requested Composition: ${compositionId}`);

const chromiumOptions = {
    enableGpu: false,
    args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
    ],
};

try {
    const bundleCacheDir = path.join(__dirname, 'dist-bundle');

    console.log('🧹 Removing old Remotion bundle...');

    try {
        if (fs.existsSync(bundleCacheDir)) {
            fs.rmSync(bundleCacheDir, { recursive: true, force: true });
        }
    } catch (rmErr) {
        console.warn('⚠️ Could not remove old bundle dir (continuing):', rmErr.message);
    }

    console.log('📦 Creating fresh Remotion bundle...');

    const bundleLocation = await bundle({
        entryPoint: path.join(__dirname, 'src', 'index.tsx'),
        outDir: bundleCacheDir,
        webpackOverride: (config) => config,
    });

    console.log('✅ Remotion bundle created successfully.');
    console.log(`📦 Bundle location: ${bundleLocation}`);

    const renderInputProps = {
        ...(inputProps || {}),
        images,
        config,
        beatTimestamps,
        music: null,
    };

    console.log(`🎬 Selecting composition: ${compositionId}`);

    const composition = await selectComposition({
        serveUrl: bundleLocation,
        id: compositionId,
        inputProps: renderInputProps,
        chromiumOptions,
    });

    console.log(`✅ Composition found: ${compositionId}`);
    console.log(`🎬 Duration: ${composition.durationInFrames} frames`);
    console.log(`🎬 FPS: ${composition.fps}`);

    const cpuCount = (os.cpus() || []).length;
    const systemConcurrency = Math.max(1, cpuCount - 1);

    console.log(`🎬 Rendering with ${systemConcurrency} worker threads...`);

    await renderMedia({
        composition,
        serveUrl: bundleLocation,
        codec: 'h264',
        outputLocation: outputPath,
        inputProps: renderInputProps,
        concurrency: systemConcurrency,
        chromiumOptions,
        muted: true,
    });

    if (!fs.existsSync(outputPath)) {
        console.error('❌ Render finished but output file was not created.');
        process.exit(1);
    }

    const stats = fs.statSync(outputPath);

    console.log('\n==========================================');
    console.log('✅ REMOTION RENDER COMPLETED SUCCESSFULLY');
    console.log(`📁 Output: ${outputPath}`);
    console.log(`📦 Size: ${stats.size} bytes`);
    console.log('==========================================');

    process.exit(0);
} catch (err) {
    console.error('\n==========================================');
    console.error('❌ REMOTION RENDER FAILED');
    console.error(err.message);
    console.error('==========================================');
    console.error(err.stack);
    process.exit(1);
}