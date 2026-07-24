const sharp = require('sharp');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

exports.processImages = async (imagePaths, template) => {
  const targetWidth = template.width || 1080;
  const targetHeight = template.height || 1920;
  const processedPaths = [];

  console.log(`🖼️ Processing ${imagePaths.length} images`);

  for (let i = 0; i < imagePaths.length; i++) {
    const imgPath = imagePaths[i];
    
    if (!fs.existsSync(imgPath)) {
      console.error(`❌ Image not found: ${imgPath}`);
      continue;
    }

    const ext = path.extname(imgPath);
    const dir = path.dirname(imgPath);
    const outputName = `processed_${uuidv4()}${ext}`;
    const outputPath = path.join(dir, outputName);

    try {
      const metadata = await sharp(imgPath).metadata();
      console.log(`📸 Image ${i + 1}: ${metadata.width}x${metadata.height}`);
      
      // ✅ Ensure dimensions are even
      let width = targetWidth;
      let height = targetHeight;
      
      // Make sure width and height are even
      if (width % 2 !== 0) width += 1;
      if (height % 2 !== 0) height += 1;
      
      await sharp(imgPath)
        .resize(width, height, {
          fit: 'cover',
          position: 'center'
        })
        .toFile(outputPath);
      
      processedPaths.push(outputPath);
      console.log(`✅ Processed ${i + 1}: ${outputPath} (${width}x${height})`);

    } catch (error) {
      console.error(`❌ Error processing ${imgPath}:`, error.message);
      processedPaths.push(imgPath);
    }
  }

  console.log(`✅ ${processedPaths.length} images processed successfully`);
  return processedPaths;
};